import { create } from 'zustand';
import { devtools, /* persist */ } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer'
import { StoreStates } from '@shared/types/storeStates'
// import _ from 'lodash'
import { ILink } from '@shared/types/links';
import { getLinks } from '@shared/api/Links/Models/getLinks/getLinks';
import { createBaseStore } from '../utils/createBaseStore';
import { TBaseStore } from '../types/types';
import { useRelationsStore } from '../relations';

export interface ILinksStore {
    store: {
        data: ILink[]
        state: StoreStates
        error: string
    }
    index: {
        id: Record<ILink['id'], number>
    }
    params: {
        loadLoopTime: number,
        updateLoop: any,
        isLoadAtStart: boolean,
        loadOrder: number
    },
    localeName: string
    setIndexByMnemo: ( 
        indexMnemo: keyof ILinksStore['index'], 
        value: ILinksStore['index'][keyof ILinksStore['index']] 
    ) => void,
    getByIndex: (indexMnemo: keyof ILinksStore['index'], key: number) => ILink
    forceUpdate: () => void,
    fetchData: () => void,
    setData: (value: ILinksStore['store']['data']) => void
    setState: (value: ILinksStore['store']['state']) => void
    setError: (error?: string) => void
    setStartApiUpdateLoop: (time?: number) => void
    setStopApiUpdateLoop: () => void
    setInitialStoreState: () => void
    getLinkById: (id: number) => ILink
}
export const useLinksStore = create<ILinksStore>()(
    devtools(
        immer(
            (set, get) => ({
                store: {
                    data: [],
                    state: StoreStates.NONE,
                    error: ''
                },
                index: {
                    id: {}
                },
                params: {
                    loadLoopTime: 60000,
                    updateLoop: null,
                    isLoadAtStart: true,
                    loadOrder: 2
                },
                localeName: 'Линки',
                setIndexByMnemo: (indexMnemo, value) => {
                    set((state) => {
                        state.index[indexMnemo] = value
                    })
                },
                getByIndex: (indexMnemo, key) => {
                    const idx = get().index[indexMnemo][key]

                    return get().store.data[idx]
                },
                setState: (value) => {
                    set((state) => {
                        state.store.state = value

                    })
                },
                setData: (value) => {
                    set((state) => {
                        state.store.data = value

                    })
                },
                forceUpdate: () => {
                    get().fetchData()
                },
                fetchData: async () => {
                    if ( get().store.state == StoreStates.LOADING) { return false }
                    get().setState(StoreStates.LOADING)
                    const relByIndex = useRelationsStore.getState().getByIndex

                    try {
                        const response = await getLinks({ all: true })

                        if (response?.success) {
                            // const isEqual = _.isEqual(get().store.data, response.data)

                            // if (!isEqual) {
                            if (response.data !== null || undefined || [] || {}) {
                                const newData = response.data.reduce((acc, item) => {
                                    const newItem = {
                                        ...item,
                                        relation: relByIndex('id', item.relation_id),

                                    }

                                    // console.log('link', item.id, newItem)
                                    acc.rawData.push(newItem)


                                    return acc
                                }, {
                                    rawData: [] as ILink[],
                                    index: {
                                        id: {}
                                    } 
                                })

                                get().setIndexByMnemo('id', newData['id'])
                                get().setData(newData['rawData'])

                                // get().setData(response.data)

                                get().setError(null)
                            }
                            get().setState(StoreStates.FINISH)
                            // }
                        } else {
                            //@ts-ignore
                            get().getState().setError(response?.error)
                        }
                    } catch {
                        ((error) => {
                            get().setError(error)
                        })
                    } finally {
                        // console.log('')
                    }

                },
                setError: (error) => {
                    set((state) => {
                        state.store.error = error
                    })
                },
                setStartApiUpdateLoop: (time = get().params.loadLoopTime) => {
                    const updateLoop = get().params.updateLoop

                    if (updateLoop !== null) {
                        set((state) => {
                            state.params.updateLoop = null
                        })
                    }

                    set((state) => {
                        state.params.updateLoop = setInterval(() => {
                            get().fetchData()
                        }, time)
                    })
                },
                setStopApiUpdateLoop: () => {
                    const updateLoop = get().params.updateLoop

                    if (updateLoop !== null) {
                        clearInterval(updateLoop)
                    }

                    set((state) => {
                        state.params.updateLoop = null
                    })
                },
                setInitialStoreState: () => {
                    set((state) => {
                        state.store = {
                            data: [],
                            state: StoreStates.NONE,
                            error: ''
                        }
                    })
                },
                getLinkById: (id) => {
                    return get().store.data.find((item) => item.id === id)
                }
            }),
            // { name: 'linksStore' }
        )
    )
)

export const selectLinks = (state: ILinksStore) => state.store.data
export const selectLink = (state: ILinksStore) => state.getLinkById
export const selectLinksUpdateParams = (state: ILinksStore) => {
    return {
        store: state.store,
        name: state.localeName,
        params: state.params,
        fetchData: state.fetchData,
        setStartApiUpdateLoop: state.setStartApiUpdateLoop,
        setStopApiUpdateLoop: state.setStopApiUpdateLoop,
        setInitialStoreState: state.setInitialStoreState
    }
}

type TLinksStore = TBaseStore<ILink[]>

export const useLinks = create(immer<TLinksStore>((set, get) => ({
    ...createBaseStore<ILink[]>(set, get),
    data: [],
    timer: 60_000,
    localeName: 'Линки',
    request: () => getLinks({ all: true }),
})))
import { create } from 'zustand'
import { devtools /* persist */ } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { StoreStates } from '@shared/types/storeStates'
import _ from 'lodash'
import { IAttribute } from '@shared/types/attributes'
import { getAttributes } from '@shared/api/Attribute/Models/getAttributes/getAttributes'
import { TBaseStore } from '../types/types'
import { createBaseStore } from '../utils/createBaseStore'
import { ATTR_STEREOTYPE } from '@shared/config/attr_stereotypes'
import { interceptorErrorsStore } from '../utils/interceptorErrorsStore'

export interface IAttributesStore {
    store: {
        data: IAttribute[]
        state: StoreStates
        error: string
    }
    index: {
        id: Record<IAttribute['id'], number>
    }
    params: {
        loadLoopTime: number
        updateLoop: any
        isLoadAtStart: boolean
        loadOrder: number
    }
    localeName: string
    setIndexByMnemo: (
        indexMnemo: keyof IAttributesStore['index'],
        value: IAttributesStore['index'][keyof IAttributesStore['index']]
    ) => void
    getByIndex: (indexMnemo: keyof IAttributesStore['index'], key: number) => IAttribute
    forceUpdate: () => void
    fetchData: () => void
    setData: (value: IAttributesStore['store']['data']) => void
    setState: (value: IAttributesStore['store']['state']) => void
    setError: (error?: string) => void
    setStartApiUpdateLoop: (time?: number) => void
    setStopApiUpdateLoop: () => void
    setInitialStoreState: () => void
    getAttributeById: (id: number) => IAttribute
    filterByMnemo: (mnemo: keyof typeof ATTR_STEREOTYPE) => IAttribute[]
}
export const useAttributesStore = create<IAttributesStore>()(
    devtools(
        immer(
            (set, get) => ({
                store: {
                    data: [],
                    state: StoreStates.NONE,
                    error: '',
                },
                index: {
                    id: {},
                },
                params: {
                    loadLoopTime: 60000,
                    updateLoop: null,
                    isLoadAtStart: true,
                    loadOrder: 1,
                },
                localeName: 'Атрибуты',
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
                setIndexByMnemo: (indexMnemo, value) => {
                    set((state) => {
                        state.index[indexMnemo] = value
                    })
                },
                getByIndex: (indexMnemo, key) => {
                    const idx = get().index[indexMnemo][key]

                    return get().store.data[idx]
                },
                forceUpdate: () => {
                    get().fetchData()
                },
                fetchData: async () => {
                    get().setState(StoreStates.LOADING)

                    try {
                        const response = await getAttributes({ all: true })

                        if (response?.success) {
                            const isEqual = _.isEqual(get().store.data, response.data)

                            if (!isEqual) {
                                if (response.data !== null || undefined || [] || {}) {
                                    const indexedData = response.data.reduce(
                                        (acc, item: IAttribute, idx: number) => {
                                            acc['id'][item.id] = idx

                                            return acc
                                        },
                                        {
                                            id: {},
                                        } as IAttributesStore['index']
                                    )

                                    get().setIndexByMnemo('id', indexedData['id'])
                                    get().setData(response.data)

                                    get().setError(null)
                                }
                            }

                            get().setState(StoreStates.FINISH)
                        } else {
                            //@ts-ignore
                            set((state) => {
                                state.store.error = response?.error ?? 'Ошибка'
                                state.store.state = StoreStates.ERROR
                            })

                            // if (response?.status === 403) {
                            //     get().setState(StoreStates.ERROR)
                            // }
                            interceptorErrorsStore({
                                errorCode: response?.status,
                                callBack: () => get().setState(StoreStates.FINISH),
                            })
                        }
                    } catch (error) {
                        set((state) => {
                            state.store.error = error ?? 'Ошибка'
                            state.store.state = StoreStates.ERROR
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
                            error: '',
                        }
                    })
                },
                getAttributeById: (id) => {
                    return get().store.data.find((item) => item.id === id)
                },
                filterByMnemo: (mnemo: keyof typeof ATTR_STEREOTYPE) =>
                    get().store.data.filter((attr) => {
                        return attr?.attribute_stereotype?.mnemo === mnemo
                    }),
            })
            // { name: 'attributesStore' }
        )
    )
)

export const selectAttributes = (state: IAttributesStore) => state.store.data
export const selectAttribute = (state: IAttributesStore) => state.getAttributeById
export const selectAllAttributesByIndex = (state: IAttributesStore) => state.index.id
export const selectAttributeByIndex = (state: IAttributesStore) => state.getByIndex
export const selectAttributesUpdateParams = (state: IAttributesStore) => {
    return {
        store: state.store,
        name: state.localeName,
        params: state.params,
        fetchData: state.fetchData,
        setStartApiUpdateLoop: state.setStartApiUpdateLoop,
        setStopApiUpdateLoop: state.setStopApiUpdateLoop,
        setInitialStoreState: state.setInitialStoreState,
    }
}

type TAttributesStore = TBaseStore<IAttribute[]>

export const useAttributes = create(
    immer<TAttributesStore>((set, get) => ({
        ...createBaseStore<IAttribute[]>(set, get),
        data: [],
        timer: 60_000,
        localeName: 'Атрибуты',
        request: () => getAttributes({ all: true }),
    }))
)
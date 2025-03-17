import { create } from 'zustand'
import { devtools /* persist */ } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { StoreStates } from '@shared/types/storeStates'
import _ from 'lodash'
import { getRelations } from '@shared/api/Relations/Models/getRelations/getRelations'
import { IRelation } from '@shared/types/relations'
import { TBaseStore } from '../types/types'
import { createBaseStore } from '../utils/createBaseStore'
import { IClass } from '@shared/types/classes'
import { getIndexedData } from '@shared/utils/common'
import { interceptorErrorsStore } from '../utils/interceptorErrorsStore'

export interface IRelationsStore {
    store: {
        data: IRelation[]
        state: StoreStates
        error: string
    }
    index: {
        id: Record<IRelation['id'], number>
        left_class_id: Record<IClass['id'], number[]>
        right_class_id: Record<IClass['id'], number[]>
    }
    params: {
        loadLoopTime: number
        updateLoop: any
        isLoadAtStart: boolean
        loadOrder: number
    }
    localeName: string
    setIndexByMnemo: (
        indexMnemo: keyof IRelationsStore['index'],
        value: IRelationsStore['index'][keyof IRelationsStore['index']]
    ) => void
    getByIndex: (indexMnemo: keyof IRelationsStore['index'], key: number) => IRelation
    forceUpdate: () => void
    fetchData: () => void
    setData: (value: IRelationsStore['store']['data']) => void
    setState: (value: IRelationsStore['store']['state']) => void
    setError: (error?: string) => void
    setStartApiUpdateLoop: (time?: number) => void
    setStopApiUpdateLoop: () => void
    setInitialStoreState: () => void
    getRelationById: (id: number) => IRelation
}
export const useRelationsStore = create<IRelationsStore>()(
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
                    left_class_id: {},
                    right_class_id: {},
                },
                params: {
                    loadLoopTime: 60000,
                    updateLoop: null,
                    isLoadAtStart: true,
                    loadOrder: 1,
                },
                localeName: 'Релейшены',
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
                    switch (indexMnemo) {
                        case 'right_class_id':
                        case 'left_class_id': {
                            // console.log('ARDEV classed', get().index[indexMnemo][key])
                            const indexedData = get().index[indexMnemo][key] as number[]

                            const fullIndexedData = Array.isArray(indexedData)
                                ? indexedData.map((idx) => get().store.data[idx])
                                : []

                            return fullIndexedData as IRelation[]
                        }
                        case 'id': {
                            const index = get().index[indexMnemo][key] as number

                            return get().store.data[index] as IRelation
                        }
                        default: {
                            return undefined
                        }
                    }
                    //const idx = get().index[indexMnemo][key]

                    //return get().store.data[idx]
                },
                forceUpdate: () => {
                    get().fetchData()
                },
                fetchData: async () => {
                    get().setState(StoreStates.LOADING)

                    try {
                        const response = await getRelations({ all: true })

                        if (response?.success) {
                            const isEqual = _.isEqual(get().store.data, response.data)

                            if (!isEqual) {
                                if (response.data !== null || undefined || [] || {}) {
                                    const indexed = getIndexedData<IRelationsStore['index']>({
                                        sourceData: response.data,
                                        indexKeysRules: {
                                            id: 'value',
                                            left_class_id: 'array',
                                            right_class_id: 'array',
                                        },
                                    })

                                    //TODO: вывести в функцию установки индексов по объекту с вложенными объектами
                                    indexed.keys.forEach((key) => {
                                        get().setIndexByMnemo(key, { ...indexed.data[key] })
                                    })

                                    get().setData(response.data)

                                    get().setError(null)
                                }
                            }

                            get().setState(StoreStates.FINISH)
                        } else {
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
                        state.store.state = StoreStates.ERROR
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
                getRelationById: (id) => {
                    return get().store.data.find((item) => item.id === id)
                },
            })
            // { name: 'relationsStore' }
        )
    )
)

export const selectRelations = (state: IRelationsStore) => state.store.data
export const selectRelation = (state: IRelationsStore) => state.getRelationById
export const selectAllAttributesByIndex = (state: IRelationsStore) => state.index.id
export const selectAttributeByIndex = (state: IRelationsStore) => state.getByIndex
export const selectRelationByIndex = (state: IRelationsStore) => state.getByIndex
export const selectRelationsUpdateParams = (state: IRelationsStore) => {
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
export const selectFindRelation = (state: IRelationsStore) => (id: number) => state.getByIndex('id', id)

type TRelationsStore = TBaseStore<IRelation[]>

export const useRelations = create(
    immer<TRelationsStore>((set, get) => ({
        ...createBaseStore<IRelation[]>(set, get),
        data: [],
        timer: 60_000,
        localeName: 'Релейшены',
        request: () => getRelations({ all: true }),
    }))
)
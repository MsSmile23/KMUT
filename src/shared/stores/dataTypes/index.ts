import { create } from 'zustand'
import { TBaseStore } from '../types/types'
import { createBaseStore } from '../utils/createBaseStore'
import { immer } from 'zustand/middleware/immer'
import { IDataType } from '@shared/types/data-types'
import { getDataTypes } from '@shared/api/DataTypes/Models/getDataTypes/getDataTypes'
import { StoreStates } from '@shared/types/storeStates'
import { devtools, persist } from 'zustand/middleware'
import _ from 'lodash'
import { interceptorErrorsStore } from '../utils/interceptorErrorsStore'

type Store = TBaseStore<IDataType[]>

export const useDataTypeStore = create(
    immer<Store>((set, get) => ({
        ...createBaseStore<IDataType[]>(set, get),
        data: [],
        localeName: 'Типы данных',
        request: () => getDataTypes({ all: true }),
    }))
)
export interface IDataTypesStore {
    store: {
        data: IDataType[]
        state: StoreStates
        error: string
    }
    params: {
        loadLoopTime: number
        updateLoop: any
        isLoadAtStart: boolean
        loadOrder: number
    }
    localeName: string
    forceUpdate: () => void
    fetchData: () => void
    setData: (value: IDataTypesStore['store']['data']) => void
    setState: (value: IDataTypesStore['store']['state']) => void
    setError: (error?: string) => void
    setStartApiUpdateLoop: (time?: number) => void
    setStopApiUpdateLoop: () => void
    setInitialStoreState: () => void
    getDateTypeById: (id: number) => IDataType
}
export const useDataTypes = create<IDataTypesStore>()(
    devtools(
        immer(
            persist(
                (set, get) => ({
                    store: {
                        data: [],
                        state: StoreStates.NONE,
                        error: '',
                    },
                    params: {
                        loadLoopTime: 60000,
                        updateLoop: null,
                        isLoadAtStart: true,
                        loadOrder: 2,
                    },
                    localeName: 'Типы данных',
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
                        get().setState(StoreStates.LOADING)

                        try {
                            const response = await getDataTypes({ all: true })

                            if (response?.success) {
                                const isEqual = _.isEqual(get().store.data, response.data)

                                if (!isEqual) {
                                    if (response.data !== null || undefined || [] || {}) {
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
                    getDateTypeById: (id) => {
                        return get().store.data.find((state) => state.id === id)
                    },
                }),
                { name: 'dataTypes' }
            )
        )
    )
)

export const selectDataTypes = (state: IDataTypesStore) => state.store.data
export const selectDataType = (state: IDataTypesStore) => state.getDateTypeById
export const selectDataTypesUpdateParams = (state: IDataTypesStore) => {
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
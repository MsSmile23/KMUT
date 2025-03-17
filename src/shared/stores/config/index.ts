import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { StoreStates } from '@shared/types/storeStates'
import _ from 'lodash'
import { IConfig } from '@shared/types/config'
import { SERVICES_CONFIG } from '@shared/api/Config'
import { interceptorErrorsStore } from '../utils/interceptorErrorsStore'

export interface IConfigStore {
    store: {
        data: IConfig[]
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
    setData: (value: IConfigStore['store']['data']) => void
    setState: (value: IConfigStore['store']['state']) => void
    setError: (error?: string) => void
    setStartApiUpdateLoop: (time?: number) => void
    setStopApiUpdateLoop: () => void
    setInitialStoreState: () => void
    getConfigByMnemo: (mnemo: string) => IConfig
}
export const useConfigStore = create<IConfigStore>()(
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
                localeName: 'Конфиг',
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

                    return get().store.state
                },
                fetchData: async () => {
                    try {
                        const response = await SERVICES_CONFIG.Models.getConfig({ all: true })

                        if (response?.success) {
                            const isEqual = _.isEqual(get().store.data, response.data)

                            if (!isEqual) {
                                // get().setState(StoreStates.FINISH)

                                // if (response.data !== null || undefined || [] || {}) {

                                //     // const newData = response.data.reduce((acc, cls, index) => {
                                //     //     acc.index.id[cls.id] = index

                                //     //     return acc
                                //     // }, {
                                //     //     index: {
                                //     //         id: {}
                                //     //     }
                                //     // })

                                //     get().setData(response.data ?? [])

                                //     get().setError(null)
                                // }
                                get().setData(response.data)

                                // get().setError(null)
                            }
                            get().setState(StoreStates.FINISH)
                            get().setError(null)
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
                getConfigByMnemo: (mnemo: string) => {
                    return get().store.data.find((item) => item.mnemo === mnemo)
                },
            })
            // { name: 'classesStore' }
        )
    )
)

export const selectConfig = (state: IConfigStore) => state.store.data
export const selectGetConfigByMnemo = (state: IConfigStore) => state.getConfigByMnemo
export const selectConfigUpdateParams = (state: IConfigStore) => {
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
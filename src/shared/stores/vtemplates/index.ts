import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { StoreStates } from '@shared/types/storeStates'
import _ from 'lodash'
import { dataVtemplateProps, paramsVtemplate } from '@shared/types/vtemplates'
import { SERVICES_VTEMPLATES } from '@shared/api/vtemplates'
import { interceptorErrorsStore } from '../utils/interceptorErrorsStore'

export interface IVTemplateStore {
    store: {
        data: dataVtemplateProps<paramsVtemplate>[]
        state: StoreStates
        error: any
    }
    index: {
        id: Record<dataVtemplateProps<paramsVtemplate>['id'], number>
    }
    params: {
        loadLoopTime: number
        updateLoop: any
        isLoadAtStart: boolean
        loadOrder: number
    }
    localeName: string
    setIndexByMnemo: (
        indexMnemo: keyof IVTemplateStore['index'],
        value: IVTemplateStore['index'][keyof IVTemplateStore['index']]
    ) => void
    getByIndex: (indexMnemo: keyof IVTemplateStore['index'], key: number) => dataVtemplateProps<paramsVtemplate>
    getItemById: (id: number) => dataVtemplateProps<paramsVtemplate>
    forceUpdate: () => void
    fetchData: () => void
    setData: (value: IVTemplateStore['store']['data']) => void
    setState: (value: IVTemplateStore['store']['state']) => void
    setError: (error?: string) => void
    setStartApiUpdateLoop: (time?: number) => void
    setStopApiUpdateLoop: () => void
    setInitialStoreState: () => void
}
export const useVTemplatesStore = create<IVTemplateStore>()(
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
                    loadOrder: 2,
                },
                localeName: 'Визуальные шаблоны',
                setIndexByMnemo: (indexMnemo, value) => {
                    set((state) => {
                        state.index[indexMnemo] = value
                    })
                },
                getByIndex: (indexMnemo, key) => {
                    const idx = get().index[indexMnemo][key]

                    return get().store.data[idx]
                },
                getItemById: (id: number) => {
                    return get().store.data.find((item) => item.id === id)
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
                    get().setState(StoreStates.LOADING)

                    try {
                        const response = await SERVICES_VTEMPLATES.Models.getVtemplates({ all: true })

                        if (response?.success) {
                            const isEqual = _.isEqual(get().store.data, response.data)

                            if (!isEqual) {
                                if (response.data !== null || undefined || [] || {}) {
                                    const newData = response.data.reduce(
                                        (acc, cls, index) => {
                                            acc.index.id[cls.id] = index

                                            return acc
                                        },
                                        {
                                            index: {
                                                id: {},
                                            },
                                        }
                                    )

                                    get().setData(response.data)
                                    get().setIndexByMnemo('id', newData.index.id)

                                    get().setError(null)
                                }
                            }
                            get().setState(StoreStates.FINISH)
                        } else {
                            set((state) => {
                                state.store.error = response?.error ?? 'Ошибка'
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
            })
            // { name: 'classesStore' }
        )
    )
)

export const selectVTemplates = (state: IVTemplateStore) => state.store.data
export const selectGetClassById = (state: IVTemplateStore) => state.getItemById
export const selectVTemplatesUpdateParams = (state: IVTemplateStore) => {
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
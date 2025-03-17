import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { StoreStates } from '@shared/types/storeStates'
import _ from 'lodash'
import { IClass } from '@shared/types/classes'
import { getClasses } from '@shared/api/Classes/Models/getClasses/getClasses'
import { PACKAGE_AREA } from '@shared/config/entities/package'
import { interceptorErrorsStore } from '../utils/interceptorErrorsStore'

export interface IClassesStore {
    store: {
        data: IClass[]
        state: StoreStates
        error: string
    }
    index: {
        id: Record<IClass['id'], number>
    }
    params: {
        loadLoopTime: number
        updateLoop: any
        isLoadAtStart: boolean
        loadOrder: number
    }
    localeName: string
    setIndexByMnemo: (
        indexMnemo: keyof IClassesStore['index'],
        value: IClassesStore['index'][keyof IClassesStore['index']]
    ) => void
    forceUpdate: () => void
    getByIndex: (indexMnemo: keyof IClassesStore['index'], key: number) => IClass
    getByStereotype: (id: number) => IClass[]
    getClassesIdsList: () => number[]
    getClassesMeasurableAttributesIdsList: () => Record<IClass['id'], IClass['attributes']>
    getClassById: (id: number) => IClass
    fetchData: () => void
    setData: (value: IClassesStore['store']['data']) => void
    setState: (value: IClassesStore['store']['state']) => void
    setError: (error?: string) => void
    setStartApiUpdateLoop: (time?: number) => void
    setStopApiUpdateLoop: () => void
    setInitialStoreState: () => void
}
export const useClassesStore = create<IClassesStore>()(
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
                localeName: 'Классы',
                setIndexByMnemo: (indexMnemo, value) => {
                    set((state) => {
                        state.index[indexMnemo] = value
                    })
                },
                getClassesIdsList: () => {
                    return get().store.data.map((item) => item.id)
                },
                getByStereotype: (id) => {
                    return get().store.data.filter((item) => item.class_stereotype_id === id)
                },
                getClassesMeasurableAttributesIdsList: () => {
                    return get().store.data.reduce((acc, cls) => {
                        if (cls.package_id === PACKAGE_AREA.SUBJECT) {
                            cls.attributes.forEach((attr) => {
                                if (attr.history_to_cache || attr.history_to_db) {
                                    if (!acc[cls.id]) {
                                        acc[cls.id] = [attr]
                                    } else {
                                        acc[cls.id].push(attr)
                                    }
                                }
                            })
                        }

                        return acc
                    }, {})
                },
                getByIndex: (indexMnemo, key) => {
                    const idx = get().index[indexMnemo][key]

                    return get().store.data[idx]
                },
                getClassById: (id: number) => {
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
                        const response = await getClasses({ all: true })

                        if (response?.success) {
                            // const isEqual = _.isEqual(get().store.data, response.data)

                            // if (!isEqual) {
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
                            get().setState(StoreStates.FINISH)
                            // }
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
            })
            // { name: 'classesStore' }
        )
    )
)

export const selectClasses = (state: IClassesStore) => state.store.data
export const selectGetClassById = (state: IClassesStore) => state.getClassById
export const selectClassByIndex = (state: IClassesStore) => state.getByIndex
export const selectClassesUpdateParams = (state: IClassesStore) => {
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
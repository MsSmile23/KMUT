import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { StoreStates } from '@shared/types/storeStates'
import _ from 'lodash'
import { IClassStereotype } from '@shared/types/classes-stereotypes'
import { SERVICES_CLASS_STEREOTYPES } from '@shared/api/ClassStereotypes'
import { interceptorErrorsStore } from '../utils/interceptorErrorsStore'

export interface IClassStereotypesStore {
    store: {
        data: IClassStereotype[]
        state: StoreStates
        error: any
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
    setData: (value: IClassStereotypesStore['store']['data']) => void
    setState: (value: IClassStereotypesStore['store']['state']) => void
    setError: (error?: string) => void
    getById: (id: number) => IClassStereotype
    setStartApiUpdateLoop: (time?: number) => void
    setStopApiUpdateLoop: () => void
    setInitialStoreState: () => void
}
export const useClassStereotypesStore = create<IClassStereotypesStore>()(
    devtools(
        immer((set, get) => ({
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
            localeName: 'Стереотипы классов',
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
            getById: (id: number) => {
                return get().store.data.find((item) => item.id === id)
            },
            fetchData: async () => {
                get().setState(StoreStates.LOADING)

                try {
                    const response = await SERVICES_CLASS_STEREOTYPES.Models.getClassStereotypes({ all: true })

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

                        interceptorErrorsStore({
                            errorCode: response?.status,
                            callBack: () => get().setState(StoreStates.FINISH),
                        })
                        // if (response?.status === 403) {
                        //     get().setState(StoreStates.ERROR)
                        // }
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
        }))
    )
)

export const selectClassStereotypes = (state: IClassStereotypesStore) => state.store.data
export const selectClassStereotype = (state: IClassStereotypesStore) => state.getById
export const selectClassStereotypesUpdateParams = (state: IClassStereotypesStore) => {
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
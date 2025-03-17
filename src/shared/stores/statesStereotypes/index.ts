import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { StoreStates } from '@shared/types/storeStates'
import _ from 'lodash'
import { getStateStereotypes } from '@shared/api/StateStereotypes/Models/getStateStereotypes'
import { IStateStereotype } from '@shared/types/state-stereotypes'
import { interceptorErrorsStore } from '../utils/interceptorErrorsStore'

export interface IStateStereotypesStore {
    store: {
        data: IStateStereotype[]
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
    setData: (value: IStateStereotypesStore['store']['data']) => void
    setState: (value: IStateStereotypesStore['store']['state']) => void
    setError: (error?: string) => void
    setStartApiUpdateLoop: (time?: number) => void
    setStopApiUpdateLoop: () => void
    setInitialStoreState: () => void
    getStateStereotypeById: (id: number) => IStateStereotype
}
export const useStateStereotypesStore = create<IStateStereotypesStore>()(
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
            localeName: 'Стереотипы состояний',
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
                    const response = await getStateStereotypes({ all: true })

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
            getStateStereotypeById: (id) => {
                return get().store.data.find((state) => state.id === id)
            },
        }))
    )
)

export const selectStateStereotypes = (state: IStateStereotypesStore) => state.store.data
export const selectStateStereotype = (state: IStateStereotypesStore) => state.getStateStereotypeById
export const selectStateStereotypesUpdateParams = (state: IStateStereotypesStore) => {
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
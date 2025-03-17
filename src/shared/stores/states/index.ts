import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { StoreStates } from '@shared/types/storeStates'
import { IState } from '@shared/types/states'
import { getStates } from '@shared/api/States/Models/getStates'
import { TBaseStore } from '../types/types'
import { createBaseStore } from '../utils/createBaseStore'
import { interceptorErrorsStore } from '../utils/interceptorErrorsStore'

export interface IStatesStore {
    store: {
        data: IState[]
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
    setData: (value: IStatesStore['store']['data']) => void
    setState: (value: IStatesStore['store']['state']) => void
    setError: (error?: string) => void
    setStartApiUpdateLoop: (time?: number) => void
    setStopApiUpdateLoop: () => void
    setInitialStoreState: () => void
    getStateById: (id: number) => IState
    getObjectStateById: (id: number) => IState
    getAttributeStateById: (id: number) => IState
    getRandomState: () => IState
}
export const useStatesStore = create<IStatesStore>()(
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
        localeName: 'Типы состояний',
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
                const response = await getStates({ all: true })

                if (response?.success) {
                    if (response.data && response.data?.length > 0) {
                        const preparedData = response.data.map((currentState) => ({
                            ...currentState,
                            priority: currentState?.state_stereotype?.priority ?? currentState?.priority,
                        }))

                        get().setData(preparedData)

                        get().setError(null)
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
        getStateById: (id) => {
            return get().store.data.find((state) => state.id === id)
        },
        getObjectStateById: (id) => {
            return get().store.data['object_states'][id]
        },
        getAttributeStateById: (id) => {
            return get().store.data['attribute_states']?.[id]
        },
        //Метод рандома для генерации статусов
        getRandomState: () => {
            const randomIndex = Math.floor(Math.random() * get().store.data.length)

            return get().store.data[randomIndex]
        },
    }))
)

export const selectStates = (state: IStatesStore) => state.store.data
export const selectObjectState = (state: IStatesStore) => state.getObjectStateById
export const selectState = (state: IStatesStore) => state.getStateById
export const selectAttributeState = (state: IStatesStore) => state.getAttributeStateById
export const selectStatesUpdateParams = (state: IStatesStore) => {
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

type TStateStore = TBaseStore<IState[]>

export const useStates = create(
    immer<TStateStore>((set, get) => ({
        ...createBaseStore<IState[]>(set, get),
        data: [],
        timer: 60_000,
        localeName: 'Все состояния',
        request: () => getStates({ all: true }),
    }))
)
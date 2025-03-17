import { IAttributeStereotype } from '@shared/types/attribute-stereotypes'
import { StoreStates } from '@shared/types/storeStates'
import { create } from 'zustand'
import { devtools /* persist */ } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import _ from 'lodash'
import { getAttributeStereotypes } from '@shared/api/AttributeStereotypes/Models/getAttributeStereotypes/getAttributeStereotypes'
import { interceptorErrorsStore } from '../utils/interceptorErrorsStore'
export interface IAttributesStereotypesStore {
    store: {
        data: IAttributeStereotype[]
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
    setData: (value: IAttributesStereotypesStore['store']['data']) => void
    setState: (value: IAttributesStereotypesStore['store']['state']) => void
    setError: (error?: string) => void
    setStartApiUpdateLoop: (time?: number) => void
    setStopApiUpdateLoop: () => void
    setInitialStoreState: () => void
    getAttributeSTereotypeById: (id: number) => IAttributeStereotype
}

export const useAttributeStereotypesStore = create<IAttributesStereotypesStore>()(
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
                loadOrder: 1,
            },
            localeName: 'Стереотипы атрибутов',
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
                    const response = await getAttributeStereotypes({ all: true })

                    if (response?.success) {
                        const isEqual = _.isEqual(get().store.data, response.data)

                        if (!isEqual) {
                            if (response?.data?.length > 0) {
                                get().setData(response.data)

                                get().setError(null)
                            }
                        }

                        get().setState(StoreStates.FINISH)
                    } else {
                        //@ts-ignore
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
            getAttributeSTereotypeById: (id) => {
                return get().store.data.find((item) => item.id === id)
            },
        }))
    )
)

export const selectAttributeStereotypes = (state: IAttributesStereotypesStore) => state.store.data
export const selectAttributeStereotype = (state: IAttributesStereotypesStore) => state.getAttributeSTereotypeById
export const selectAttributeStereotypesUpdateParams = (state: IAttributesStereotypesStore) => {
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
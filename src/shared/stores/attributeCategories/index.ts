import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { devtools } from 'zustand/middleware'
import { TBaseStore } from '../types/types'
import { createBaseStore } from '../utils/createBaseStore'
import { IAttributeCategory } from '@shared/types/attribute-categories'
import { getAttributeCategories } from '@shared/api/AttributeCategories/Models/getAttributeCategories/getAttributeCategories'
import { StoreStates } from '@shared/types/storeStates'
import _ from 'lodash'
import { interceptorErrorsStore } from '../utils/interceptorErrorsStore'

type Store = TBaseStore<IAttributeCategory[]>

export const useAttributeCategoryStore = create(
    immer<Store>((set, get) => ({
        ...createBaseStore<IAttributeCategory[]>(set, get),
        data: [],
        localeName: 'Категории атрибутов',
        request: () => getAttributeCategories({ all: true }),
    }))
)

export interface IIAttributeCategoryStore {
    store: {
        data: IAttributeCategory[]
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
    getById: (id: number) => IAttributeCategory
    forceUpdate: () => void
    fetchData: () => void
    setData: (value: IIAttributeCategoryStore['store']['data']) => void
    setState: (value: IIAttributeCategoryStore['store']['state']) => void
    setError: (error?: string) => void
    setStartApiUpdateLoop: (time?: number) => void
    setStopApiUpdateLoop: () => void
    setInitialStoreState: () => void
}
export const useAttributeCategoryStore2 = create<IIAttributeCategoryStore>()(
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
            localeName: 'Категории атрибутов',
            getById: (id: number) => {
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
                    const response = await getAttributeCategories({ all: true })

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
        }))
    )
)

export const selectAttrCategories = (state: IIAttributeCategoryStore) => state.store.data
export const selectAttrCategory = (state: IIAttributeCategoryStore) => state.getById
export const selectAttributeCategoriesUpdateParams = (state: IIAttributeCategoryStore) => {
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
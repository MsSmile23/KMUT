import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { StoreStates } from '@shared/types/storeStates'
import _ from 'lodash'
import { SERVICES_LICENSES } from '@shared/api/License'
import { useClassesStore } from '../classes'
import { useAttributesStore } from '../attributes'
import { useObjectsStore } from '../objects'
import { useVTemplatesStore } from '../vtemplates'
import { ILicenseStore } from '@shared/types/license'
import { interceptorErrorsStore } from '../utils/interceptorErrorsStore'

export const useLicenseStore = create<ILicenseStore>()(
    devtools(
        subscribeWithSelector(
            immer((set, get) => ({
                store: {
                    data: null,
                    state: StoreStates.NONE,
                    error: '',
                },
                params: {
                    loadLoopTime: 60000,
                    updateLoop: null,
                    isLoadAtStart: true,
                    loadOrder: 1,
                },
                localeName: 'Лицензия',
                isActiveLicense: true,
                setActiveLicense: (value) => {
                    set((state) => ({
                        ...state,
                        isActiveLicense: value,
                    }))
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
                        const response = await SERVICES_LICENSES.Models.getLicense()

                        /* // генерация мокового числа лимитов
                        const randomIntFromInterval = (min, max) => { 
                            return Math.floor(Math.random() * (max - min + 1) + min);
                        }

                        const mockState: ILicenseStore['store']['data'] = {
                            ...response.data,
                            limits: {
                                ...response.data.limits,
                                classes: randomIntFromInterval(235, 245),
                            }
                        }
                        
                        get().setData(mockState)
                        get().setState(StoreStates.FINISH) */

                        if (response?.success) {
                            const isEqual = _.isEqual(get().store.data, response.data)

                            if (response.data !== null || undefined || [] || {}) {
                                get().setData(response.data)
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
                            data: null,
                            state: StoreStates.NONE,
                            error: '',
                        }
                    })
                },

                //*Функция проверки на возможность добавления новых элементов
                isCreatable: ({
                    entity,
                    count,
                }: {
                    entity: 'classes' | 'attributes' | 'objects' | 'vtemplates' | 'users'
                    count?: number
                }) => {
                    const storeData = get()?.store?.data?.limits

                    if (storeData) {
                        const entities = {
                            classes: useClassesStore.getState()?.store?.data?.length,
                            attributes: useAttributesStore.getState()?.store?.data?.length,
                            objects: useObjectsStore.getState()?.store?.data?.length,
                            vtemplates: useVTemplatesStore.getState()?.store?.data?.length,
                        }
                        const result =
                            entity == 'users' && count !== undefined
                                ? count < storeData?.users
                                : entities[entity] < storeData[entity]

                        return result
                    }

                    return false
                },
            }))
        )
    )
)

export const selectLicense = (state: ILicenseStore) => state.store.data
export const selectIsCreatable = (state: ILicenseStore) => state.isCreatable
export const selectLicenseUpdateParams = (state: ILicenseStore) => {
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
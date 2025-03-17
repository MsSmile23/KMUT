import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware'
import { create } from 'zustand'
import { StoreStates } from '@shared/types/storeStates';
import { SERVICES_GROUP_POLICIES } from '@shared/api/GroupPolicies';
import _ from 'lodash';
import { IGroupPolicy } from '@shared/types/group-policies';
import mockData from '@containers/groupPolicies/mock';
import { IApiReturn } from '@shared/lib/ApiSPA';

interface IGroupPoliciesStore {
    store: {
        data: IGroupPolicy[]
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
    setState: (value: IGroupPoliciesStore['store']['state']) => void
    fetchData: () => Promise<IApiReturn<IGroupPolicy[]>>
    createGroupPolicy: (payload: IGroupPolicy) => Promise<IApiReturn<IGroupPolicy>>
    updateGroupPolicyById: (id: number, payload: IGroupPolicy) => Promise<IApiReturn<IGroupPolicy>>
    deleteGroupPolicyById: (id: number) => Promise<IApiReturn<any>>
    setData: (value: IGroupPoliciesStore['store']['data']) => void
    setError: (error?: string) => void
    setStartApiUpdateLoop: (time?: number) => void
    setStopApiUpdateLoop: () => void
    setInitialStoreState: () => void
}

export const useGroupPoliciesStore = create<IGroupPoliciesStore>()(
    devtools (
        immer (
            (set, get) => ({
                store: {
                    data: [],
                    state: StoreStates.NONE,
                    error: ''
                },
                params: {
                    loadLoopTime: 60000,
                    updateLoop: null,
                    isLoadAtStart: true,
                    loadOrder: 2
                },
                localeName: 'Групповые политики',
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
                fetchData: async () => {
                    set((state) => {
                        state.store.state = StoreStates.LOADING
                    })

                    try {
                        const response = await SERVICES_GROUP_POLICIES.Models.getGroupPolicies({ all: true })

                        if (response.success) {
                            let data: IGroupPolicy[]

                            if (typeof response.data === 'string') {
                                data = JSON.parse(response.data);
                            } else {
                                data = response.data as IGroupPolicy[];
                            }

                            const isEqual = _.isEqual(get().store.data, data)

                            if (!isEqual) {
                                set((state) => {
                                    state.store.data = data
                                    state.store.state = StoreStates.FINISH
                                    state.store.error = ''
                                }) 
                            } 
                            get().setStopApiUpdateLoop()
                        } else {
                            set((state) => {
                                state.store.error = response.message || 'Ошибка получения стора'
                                state.store.state = StoreStates.ERROR
                            })
                        }

                        return response
                    } catch (error) {
                        set((state) => {
                            state.store.state = StoreStates.ERROR
                            state.store.error = error.message || 'Неизвестная ошибка'
                        })
                        get().setStopApiUpdateLoop()
                    } finally {
                        set((state) => {
                            state.store.state = StoreStates.FINISH
                        })
                    }
                    // Для тестирования на mockData
                    // set((state) => {
                    //     const data = JSON.parse(mockData)

                    //     state.store.data = data.data
                    // })
                },
                createGroupPolicy: async (payload) => {
                    set((state) => {
                        state.store.state = StoreStates.LOADING
                    })

                    try {
                        const response = await SERVICES_GROUP_POLICIES.Models.postGroupPolicy(payload)

                        set((state) => {
                            if (response.success) {
                                state.store.data.push(response.data)
                                state.store.state = StoreStates.FINISH
                                state.store.error = ''
                            } else {
                                state.store.state = StoreStates.ERROR
                                state.store.error = response.message || 'Ошибка добавления групповой политики'
                            }
                        })

                        return response
                    } catch (error) {
                        set((state) => {
                            state.store.state = StoreStates.ERROR
                            state.store.error = error.message || 'Неизвестная ошибка'
                        })
                    } finally {
                        set((state) => {
                            state.store.state = StoreStates.FINISH
                        })
                    }
                },
                updateGroupPolicyById: async (id, payload) => {
                    set((state) => {
                        state.store.state = StoreStates.LOADING
                    })

                    try {
                        const response = await SERVICES_GROUP_POLICIES.Models.patchGroupPolicyById(id, payload)

                        set((state) => {
                            if (response.success) {
                                state.store.data = state.store.data.map(item => item.id === id ? response.data : item)
                                state.store.state = StoreStates.FINISH
                                state.store.error = ''
                            } else {
                                state.store.state = StoreStates.ERROR
                                state.store.error = response.message || 'Ошибка обновления групповой политики'
                            }
                        })

                        return response
                    } catch (error) {
                        set((state) => {
                            state.store.state = StoreStates.ERROR
                            state.store.error = error.message || 'Неизвестная ошибка'
                        })
                    } finally {
                        set((state) => {
                            state.store.state = StoreStates.FINISH
                        })
                    }
                },
                deleteGroupPolicyById: async (id) => {
                    set((state) => {
                        state.store.state = StoreStates.LOADING
                    })

                    try {
                        const response = await SERVICES_GROUP_POLICIES.Models.deleteGroupPolicyById(id)

                        set((state) => {
                            if (response.success) {
                                state.store.data = state.store.data.filter(item => item.id !== id)
                                state.store.state = StoreStates.FINISH
                                state.store.error = ''
                            } else {
                                state.store.state = StoreStates.ERROR
                                state.store.error = response.message || 'Ошибка удаления групповой политики'
                            }
                        })

                        return response
                    } catch (error) {
                        set((state) => {
                            state.store.state = StoreStates.ERROR
                            state.store.error = error.message || 'Неизвестная ошибка'
                        })
                    } finally {
                        set((state) => {
                            state.store.state = StoreStates.FINISH
                        })
                    }
                    // Для тестирования
                    // set((state) => {
                    //     state.store.data = state.store.data.filter(item => item.id !== id)
                    // })
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
                            error: ''
                        }
                    })
                }
            })  
        )
    )
)

export const selectGroupPolicies = (state: IGroupPoliciesStore) => state.store.data
export const selectGroupPoliciesUpdateParams = (state: IGroupPoliciesStore) => {
    return {
        store: state.store,
        name: state.localeName,
        params: state.params,
        fetchData: state.fetchData,
        setStartApiUpdateLoop: state.setStartApiUpdateLoop,
        setStopApiUpdateLoop: state.setStopApiUpdateLoop,
        setInitialStoreState: state.setInitialStoreState
    }
}
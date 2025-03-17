import { getSystem } from '@shared/api/System/Models/getSystem'
import { StoreStates } from '@shared/types/storeStates'
import { ISystem } from '@shared/types/system'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { IThemes } from '@app/themes/types'
import { IObjectNotification } from '@shared/types/objects'
import _ from 'lodash'
import { useObjectsStore } from '@shared/stores/objects'
import { useObjectAttributesStore } from '../objectAttributes/useObjectAttributesStore'

export type IPermissionedInterfaces = ['constructor', 'manager', 'showcase']
export type IInterfaceView = IPermissionedInterfaces[number] | ''
export type IShowcaseLayouts = 'default' | 'custom'
export interface INotificationWithUnread extends IObjectNotification {
    unread: boolean
}
export interface IGeneralStore {
    localeName: string
    store: {
        data: ISystem
        state: StoreStates
        error: string
    }
    params: {
        loadLoopTime: number,
        updateLoop: any,
        isLoadAtStart: boolean,
        loadOrder: number
    },
    endGeneralLoad: boolean
    setEndGeneralLoad: (value: IGeneralStore['endGeneralLoad']) => void
    endPreload: boolean
    setEndPreload: (value: IGeneralStore['endPreload']) => void
    licenseIsActive: boolean
    setLicenseIsActive: (value: IGeneralStore['licenseIsActive']) => void
    interfaceView: IInterfaceView
    setInterfaceView: (value: IGeneralStore['interfaceView']) => void
    layout: IShowcaseLayouts
    changeLayout: () => void
    permissionedInterfaces: ['constructor', 'manager', 'showcase']
    setPermissionedInterfaces: (value: IGeneralStore['permissionedInterfaces']) => void
    previousLocation: string
    setPreviousLocation: (value: IGeneralStore['previousLocation']) => void
    fetchData: () => void,
    setInitialStoreState: () => void
    lastNotifications: INotificationWithUnread[]
    setLastNotifications: (value: INotificationWithUnread[]) => void
    toggleUnread: (id: number) => void
    setStartApiUpdateLoop: (time?: number) => void
    setStopApiUpdateLoop: () => void
}

const separatePackageLoadingStores = () => { 
    return {
        objects: useObjectsStore,
        objectAttributes: useObjectAttributesStore 
    }
} 

export const generalStore = create<IGeneralStore>()(
    devtools(
        immer(
            persist(

                (set, get) => ({
                    localeName: 'Общие данные приложения',
                    params: {
                        loadLoopTime: 60000,
                        updateLoop: null,
                        isLoadAtStart: true,
                        loadOrder: 1
                    },
                    store: {
                        data: {
                            project_mnemo: IThemes.MISHK,
                            enterTime: '',
                            ws_server: ''
                        },
                        state: StoreStates.NONE,
                        error: ''
                    },
                    endGeneralLoad: false,
                    setEndGeneralLoad: (value) => {
                        set((state) => {
                            state.endGeneralLoad = value
                        }, false, 'generalStore/setEndGeneralLoad')
                    },
                    endPreload: false,
                    setEndPreload: (value) => {
                        set((state) => {
                            state.endPreload = value
                        }, false, 'generalStore/setEndPreload')
                    },
                    licenseIsActive: false,
                    setLicenseIsActive: (value) => {
                        set((state) => {
                            state.licenseIsActive = value
                        }, false, 'generalStore/setLicenseIsActive')
                    },
                    interfaceView: '',
                    setInterfaceView: (value) => {
                        const prevInterfaceView = get().interfaceView

                        if (value !== prevInterfaceView) {
                            set((state) => {
                                state.interfaceView = value
                            }, false, 'generalStore/setInterfaceView')
    
                            const changePackageZoneCondition = (
                                prevInterfaceView === 'manager' && ['showcase', 'constructor'].includes(value)
                            ) || (
                                ['showcase', 'constructor'].includes(prevInterfaceView) && value === 'manager' 
                            )

                            if (changePackageZoneCondition) {
                                const stores = separatePackageLoadingStores()
        
                                for (const storeName in stores) {
                                    const { 
                                        setInitialStoreState, 
                                        setStopApiUpdateLoop, 
                                        fetchData, 
                                        setStartApiUpdateLoop 
                                    } = stores[storeName].getState()
                                
                                    const reloadingStores = async () => {
                                        await setStopApiUpdateLoop()
                                        await setInitialStoreState()
                                        await fetchData()
                                        await setStartApiUpdateLoop()
                                    }   

                                    reloadingStores()
                                }
                                    
                            }
                        }                        
                    },
                    layout: 'default',
                    changeLayout: () => {
                        const newLayout = generalStore.getState().layout === 'custom' ? 'default' : 'custom'

                        set((state) => {
                            state.layout = newLayout
                        }, false, 'generalStore/changeLayout')
                    },
                    permissionedInterfaces: ['constructor', 'manager', 'showcase'],
                    setPermissionedInterfaces: (value) => {
                        set((state) => {
                            state.permissionedInterfaces = value
                        }, false, 'generalStore/setPermissionedInterfaces')
                    },
                    previousLocation: '',
                    setPreviousLocation: (value) => {
                        set((state) => {
                            state.previousLocation = value
                        }, false, 'generalStore/setPreviousLocation')
                    },
                    fetchData: async () => {

                        // set((state) => {
                        //     state.store.state = StoreStates.LOADING
                        // }, false, 'generalStore/fetchData-state')

                        const currentStoreData = get().store.data

                        try {
                            const response = await getSystem()

                            if (response?.success) {

                                const isEqualState = _.isEqual(get().store.state, StoreStates.FINISH)

                                if (!isEqualState) {
                                    set((state) => {
                                        state.store.state = StoreStates.FINISH
                                    }, false, 'generalStore/fetchData-state')
                                }
                                
                                const currentResponseData = response.data

                                currentResponseData['time'] = currentStoreData['time']

                                const isEqual = _.isEqual(currentResponseData, currentStoreData)

                                if (!isEqual) {
                                    set((state) => {
                                        state.store.data = response.data
                                    }, false, 'generalStore/fetchData-data')
                                    get().setStopApiUpdateLoop()
                                }

                            } else {
                                set((state) => {
                                    state.store.error = response?.error.message
                                    state.store.state = StoreStates.ERROR
                                }, false, 'generalStore/fetchData-error')
                            }
                        } catch {
                            ((error) => {
                                set((state) => {
                                    state.store.state = StoreStates.ERROR
                                    state.store.error = error
                                }, false, 'generalStore/fetchData-error')
                            })
                        } finally {
                        // console.log('')
                        }

                        /* function setCacheAsData(error) {
                            useObjectsStore.getState().setError(error)
                            
                            //Если данные не были получены по какой либо причине-
                            //ищем данные в локалСторедж
                            const cachedData = getLocalStorageData(name)
                            //Если дата есть - заношу в стор и предупреждаю что используются закешированные данные
                            
                            if (cachedData?.length > 0) {
                                storeState.data = cachedData
                                storeState.state = DataStoreApiState.CACHE
                            } else {
                                storeState.state = DataStoreApiState.ERROR
                            }
                        } */

                    },
                    setInitialStoreState: () => {
                        set((state) => {
                        // state.endGeneralLoad = false
                            state.endPreload = false
                            state.store.data.project_mnemo = IThemes.DEFAULT
                        // state.licenseIsActive = false
                        // state.interfaceView = ''
                        // state.layout = 'default'
                        }, false, 'generalStore/setInitialStoreState')
                    },
                    lastNotifications: [],
                    setLastNotifications: (value) => {
                        set((state) => {
                            state.lastNotifications = value
                        })
                    },
                    toggleUnread: (id) => {
                        set((state) => {
                            const currIdx = state.lastNotifications.findIndex((item) => item.id === id)

                            state.lastNotifications[currIdx].unread = !state.lastNotifications[currIdx].unread
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
                }),
                {
                    name: 'generalStore',
                    partialize: (state) => {
                        return Object.fromEntries(
                            Object.entries(state).filter(
                                ([key]) => !['endPreload', 'store', 'lastNotifications'].includes(key)
                            )
                        )
                    }
                }

            )
        )
    )
)

export const selectLastNotifications = (state: IGeneralStore) => {
    return {
        lastNotifications: state.lastNotifications,
        setLastNotifications: state.setLastNotifications,
        toggleUnread: state.toggleUnread
    }
}

export const selectGeneralUpdateParams = (state: IGeneralStore) => {
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
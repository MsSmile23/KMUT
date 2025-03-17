import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { StoreStates } from '@shared/types/storeStates'
import { useAttributesStore } from '../attributes'
import { IObjectAttribute } from '@shared/types/objects'
import { getObjectAttributes } from '@shared/api/ObjectAttributes/Models/getObjectAttributes/getObjectAttributes'
import { generalStore } from '../general'
import { interceptorErrorsStore } from '../utils/interceptorErrorsStore'
import { useClassesStore } from '../classes'
import { useConfigStore } from '../config'

type TIndexTypes = {
    object_id: IObjectAttribute[]
}

export interface IObjectAttributesStore {
    store: {
        data: IObjectAttribute[]
        state: StoreStates
        error: string
    }
    index: {
        object_id: Record<IObjectAttribute['object_id'], number[]>
    }
    params: {
        loadLoopTime: number
        updateLoop: any
        isLoadAtStart: boolean
        loadOrder: number
    }
    localeName: string
    setIndexByMnemo: <T extends keyof TIndexTypes>(indexMnemo: T, value: IObjectAttributesStore['index'][T]) => void
    // getMeasurableObjectAttribute: (object_id: number, oaId: number) => IObjectAttribute['object_attributes'][number]
    // getMeasurableObjectAttributesList: (object_id: number) => IObjectAttribute['object_attributes']
    getByIndex: <T extends keyof TIndexTypes>(
        indexMnemo: T,
        key: number
    ) => T extends 'object_id' ? IObjectAttribute[] : IObjectAttribute
    forceUpdate: () => void
    fetchData: () => Promise<void>
    updateData: () => void
    setData: (value: IObjectAttributesStore['store']['data']) => void
    setState: (value: IObjectAttributesStore['store']['state']) => void
    setError: (error?: string) => void
    setStartApiUpdateLoop: (time?: number) => void
    setStopApiUpdateLoop: () => void
    setInitialStoreState: () => void
}

export const useObjectAttributesStore = create<IObjectAttributesStore>()(
    devtools(
        (set, get) => ({
            store: {
                data: [],
                state: StoreStates.NONE,
                error: '',
            },
            index: {
                object_id: {},
            },
            params: {
                loadLoopTime: 60000,
                updateLoop: null,
                isLoadAtStart: true,
                loadOrder: 2,
            },
            localeName: 'Атрибуты объектов',
            setIndexByMnemo: (indexMnemo, value) => {
                set((state) => {
                    state.index[indexMnemo] = value

                    return { ...state };
                })
            },
            getByIndex: (indexMnemo, key) => {
                switch (indexMnemo) {
                    case 'object_id': {
                        const indexedData = get().index[indexMnemo][key] // as number[]

                        const objectAttributes = Array.isArray(indexedData)
                            ? indexedData.map((idx) => get().store.data[idx])
                            : []

                        return objectAttributes as any
                    }
                    default: {
                        return undefined
                    }
                }
            },
            setState: (value) => {
                set((state) => {
                    state.store.state = value

                    return { ...state };
                })
            },
            setData: (value) => {
                set((state) => {
                    state.store.data = value

                    return { ...state };
                })
            },
            fetchData: async () => {
                if (get().store.state == StoreStates.LOADING) {
                    return
                }

                const interfaceView = generalStore.getState().interfaceView

                //* Фильтрация по package_id и class_id из настроек проекта

                let payload

                if (interfaceView === 'constructor') {
                    payload = interfaceView
                        ? {
                            'filter[package_id]': 1,
                        }
                        : {}
                } else {
                    const config = useConfigStore.getState()?.store?.data
                        .find(el => el.mnemo == 'front_settings')?.value

                    const systemKeys = {
                        'manager': 'managerObjects',
                        'showcase': 'showcaseObjects',
                    }

                    const defaultPackageValues = {
                        'manager': [1, 2, 3],
                        'showcase': [1]
                    }
                    const system = config ? JSON.parse(config).system : {}

                    const settings = system ? system[systemKeys[interfaceView]] : {}

                    const isDefaultPackages = settings ? settings?.packages?.includes('default') : true
                    const isDefaultClasses = settings ? settings?.classes?.includes('default') : true

                    const packagesValue = defaultPackageValues[interfaceView]
                    const allClasses = useClassesStore.getState().store.data

                    const classes = isDefaultClasses
                        ? isDefaultPackages
                            ? allClasses.filter(cls => packagesValue?.includes(cls.package_id)).map(cls => cls.id)
                            : allClasses.filter(cls => settings?.packages?.includes(cls.package_id)).map(cls => cls.id)
                        : settings?.classes

                    payload = interfaceView && !!classes && classes?.length > 0 ?
                        {
                            'filter[class_id]': classes.join(',')
                        } : {}
                }



                // const payload =
                //     interfaceView && interfaceView !== 'manager'
                //         ? {
                //             'filter[package_id]': 1,
                //         }
                //         : {}

                get().store.data.length === 0
                    ? get().setState(StoreStates.LOADING)
                    : get().setState(StoreStates.REFRESHING)

                const getAttributeByIndex = useAttributesStore.getState().getByIndex

                try {
                    const response = await getObjectAttributes({
                        all: true,
                        ...payload,
                    })

                    if (response?.success) {
                        if (response.data) {
                            if (response.data.length > 0) {
                                const newData: {
                                    rawData: IObjectAttribute[]
                                    index: IObjectAttributesStore['index']
                                } = {
                                    rawData: [],
                                    index: {
                                        object_id: {},
                                    },
                                }

                                const length = response.data.length

                                for (let index = 0; index < length; index++) {
                                    const item = response.data[index]

                                    const newItem = {
                                        ...item,
                                        attribute: getAttributeByIndex('id', item.attribute_id),
                                    }

                                    newData.rawData.push(newItem)
                                    // newData.index.object_id[item.id] = index

                                    // if (item.object_id in newData.index.object_id) {

                                    // }
                                    if (newData.index.object_id[item.object_id]) {
                                        newData.index.object_id[item.object_id].push(index)
                                    } else {
                                        newData.index.object_id[item.object_id] = [index]
                                    }
                                }

                                get().setIndexByMnemo('object_id', newData.index.object_id)
                                get().setData(newData.rawData)

                                get().setError(null)

                                get().setState(StoreStates.FINISH)
                            } else {
                                get().setData([])
                                get().setState(StoreStates.FINISH)
                            }
                        }
                    } else {
                        set((state) => {
                            state.store.error = response?.error ?? 'Ошибка'
                            state.store.state = StoreStates.ERROR

                            return { ...state };
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

                        return { ...state };
                    })
                } finally {
                    //
                }
            },
            setError: (error) => {
                set((state) => {
                    state.store.error = error

                    return { ...state };
                })
            },
            updateData: () => {
                get().fetchData()
            },
            forceUpdate: () => {
                get().fetchData()
            },
            setStartApiUpdateLoop: (time = get().params.loadLoopTime) => {
                const updateLoop = get().params.updateLoop

                if (updateLoop !== null) {
                    clearInterval(updateLoop)
                    set((state) => {
                        state.params.updateLoop = null

                        return { ...state };
                    })
                }

                set((state) => {
                    // state.params.updateLoop = setInterval(() => {
                    //     get().fetchData()
                    // }, time)

                    function doLoop() {
                        state.params.updateLoop = setTimeout(() => {
                            get().fetchData().then(() => {
                                doLoop();
                            });
                        }, time);
                    }

                    doLoop();

                    return { ...state };
                })
            },
            setStopApiUpdateLoop: () => {
                const updateLoop = get().params.updateLoop

                if (updateLoop !== null) {
                    clearInterval(updateLoop)
                }

                set((state) => {
                    state.params.updateLoop = null

                    return { ...state };
                })
            },
            setInitialStoreState: () => {
                set((state) => {
                    state.store = {
                        data: [],
                        state: StoreStates.NONE,
                        error: '',
                    }

                    state.index = {
                        object_id: {},
                    }

                    return { ...state };
                })
            },
        })
    )
)

export const selectObjectAttributes = (state: IObjectAttributesStore) => state.store.data
export const selectObjectAttribute = (state: IObjectAttributesStore) => state.getByIndex
export const selectObjectAttributeState = (state: IObjectAttributesStore) => state.store.state

export const selectObjectAttributesUpdateParams = (state: IObjectAttributesStore) => {
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
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { StoreStates } from '@shared/types/storeStates'
import _ from 'lodash'
import { getStateEntities } from '@shared/api/State-entities/Models/getStateEntities'
import { IStateEntities, IStateEntity } from '@shared/types/state-entities'
import { TBaseStore } from '../types/types'
import { createBaseStore } from '../utils/createBaseStore'
import { useStatesStore } from '../states'
import { interceptorErrorsStore } from '../utils/interceptorErrorsStore'

type TIndexTypes = {
    id: IStateEntities
    stateId: IStateEntities
}

interface ISetByIndex<T> {
    indexMnemo: T
    value: IIndexedGroup
}
interface IGetByIndex<T, P> {
    indexMnemo: T
    group: P
    key: number
}
interface IIndexedGroup {
    objects: Record<string, number>
    object_attributes: Record<string, number[]>
}
const initialStateEntitiesStoreState: IStateEntities = {
    objects: [],
    object_attributes: [],
}
const initialIndexedState: IIndexedGroup = {
    objects: {},
    object_attributes: {},
}

export interface IStateEntitiesStore {
    store: {
        data: IStateEntities
        state: StoreStates
        error: string
    }
    params: {
        loadLoopTime: number
        updateLoop: any
        isLoadAtStart: boolean
        loadOrder: number
    }
    index: Record<keyof TIndexTypes, IIndexedGroup>
    localeName: string
    setIndexByMnemo: <T extends keyof TIndexTypes>(params: ISetByIndex<T>) => void
    getByIndex: <T extends keyof TIndexTypes, P extends keyof IIndexedGroup>(params: IGetByIndex<T, P>) => any
    // getByIndex: <T extends keyof IStateEntities, >(params: IGetByIndex<T>) => number
    forceUpdate: () => void
    fetchData: () => void
    setData: (value: IStateEntitiesStore['store']['data']) => void
    setState: (value: IStateEntitiesStore['store']['state']) => void
    setError: (error?: string) => void
    setStartApiUpdateLoop: (time?: number) => void
    setStopApiUpdateLoop: () => void
    setInitialStoreState: () => void
    getObjectStateEntityById: (objectId: number) => IStateEntity
    getAllObjectStateEntitiesById: (objectId: number) => IStateEntity[]
    getAttributeStateEntityById: (attributeId: number) => IStateEntity
    getTypeStateEntityById: (type: keyof IStateEntities, attributeId: number) => IStateEntity
    getAllTypeStateEntitiesById: (type: keyof IStateEntities, id: number) => IStateEntity[]
}

//Функция генерации рандомных статусов
function randomStates(data: any) {
    const randomObjects = data.objects.map((object) => ({
        ...object,
        state: useStatesStore.getState().getRandomState().id,
    }))

    const randomAttributes = data.object_attributes.map((attribute) => ({
        ...attribute,
        state: useStatesStore.getState().getRandomState().id,
    }))

    return {
        objects: randomObjects,
        object_attributes: randomAttributes,
    }
}

export const useStateEntitiesStore = create<IStateEntitiesStore>()(
    devtools(
        immer((set, get) => ({
            store: {
                data: initialStateEntitiesStoreState,
                state: StoreStates.NONE,
                error: '',
            },
            params: {
                loadLoopTime: 60000,
                // loadLoopTime: 10000,
                updateLoop: null,
                isLoadAtStart: true,
                loadOrder: 2,
            },
            localeName: 'Состояния',
            index: {
                id: { ...initialIndexedState },
                stateId: { ...initialIndexedState },
            },
            setState: (value) => {
                set((state) => {
                    state.store.state = value
                })
            },
            getByIndex: ({ indexMnemo, group, key }) => {
                return get().index[indexMnemo][group][key]
            },
            setIndexByMnemo: ({ indexMnemo, value }) => {
                set((state) => {
                    state.index[indexMnemo] = value
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
                    const response = await getStateEntities({ all: true })

                    if (response?.success) {
                        //@ts-ignore
                        if (response.data?.length === 0) {
                            get().setData(initialStateEntitiesStoreState)

                            get().setError(null)
                        }

                        if (response.data !== null || undefined || [] || {}) {
                            get().setData(response.data)

                            const indexedData = {
                                id: {
                                    objects: {},
                                    object_attributes: {},
                                },
                                stateId: {
                                    objects: {},
                                    object_attributes: {},
                                },
                            }

                            
                            const data = { ...response.data };

                            // ======= Рандомные статусы
                            // const randomStatusData = randomStates(response.data);

                            // get().setData(randomStatusData)
                            // Object.assign(data, randomStatusData)
                            // =======

                            Object.keys(data).forEach((group) => {
                                for (let index = 0; index < data[group].length; index++) {
                                    const { state, entity } = data[group][index]

                                    indexedData.id[group][entity] = state

                                    if (!indexedData.stateId[group]?.[state]) {
                                        indexedData.stateId[group][state] = [entity]
                                    } else {
                                        indexedData.stateId[group][state].push(entity)
                                    }
                                }
                            })

                            get().setIndexByMnemo({ indexMnemo: 'id', value: indexedData.id })
                            get().setIndexByMnemo({ indexMnemo: 'stateId', value: indexedData.stateId })

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
                        data: initialStateEntitiesStoreState,
                        state: StoreStates.NONE,
                        error: '',
                    }
                })
            },
            getObjectStateEntityById: (objectId) => {
                return get().store.data['objects']?.find((item) => item.entity === objectId)
            },
            getAllObjectStateEntitiesById: (objectId) => {
                return get().store.data['objects']?.filter((item) => item.entity === objectId)
            },
            getAttributeStateEntityById: (attributeId) => {
                return get().store.data['object_attributes']?.find((item) => item.entity === attributeId)
            },
            getTypeStateEntityById: (type, attributeId) => {
                return get().store.data[type]?.find((item) => item.entity === attributeId)
            },
            getAllTypeStateEntitiesById: (type, id) => {
                return get().store.data[type]?.filter((item) => item.entity === id)
            },
        }))
    )
)

export const selectStateEntities = (state: IStateEntitiesStore) => state.store.data
export const selectObjectStateEntity = (state: IStateEntitiesStore) => state.getObjectStateEntityById
export const selectAllObjectStateEntities = (state: IStateEntitiesStore) => state.getAllObjectStateEntitiesById
export const selectAttributeStateEntity = (state: IStateEntitiesStore) => state.getAttributeStateEntityById
export const selectAllTypeStateEntityById = (state: IStateEntitiesStore) => state.getAllTypeStateEntitiesById
export const selectStateEntitiesUpdateParams = (state: IStateEntitiesStore) => {
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

type TStateEntitiesStore = TBaseStore<IStateEntities>

export const useStatesEntities = create(
    immer<TStateEntitiesStore>((set, get) => ({
        ...createBaseStore<IStateEntities>(set, get),
        data: {
            objects: [],
            object_attributes: [],
        },
        timer: 10_000,
        localeName: 'Cостояния объектов и атрибутов',
        request: () => getStateEntities({ all: true }),
    }))
)
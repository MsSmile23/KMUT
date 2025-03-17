import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { IObject } from '@shared/types/objects'
import { getObjects } from '@shared/api/Objects/Models/getObjects/getObjects'
import { StoreStates } from '@shared/types/storeStates'
// import _ from 'lodash';
import { TBaseStore } from '../types/types'
import { createBaseStore } from '../utils/createBaseStore'
import { useAttributesStore } from '../attributes'
import { useRelationsStore } from '../relations'
import { useClassesStore } from '../classes'
// import { generalStore } from '@shared/stores/general'
// import { PACKAGE, PACKAGE_AREA } from '@shared/config/entities/package'
// import { INTERFACE_TYPES } from '@shared/config/const'
import { useObjectAttributesStore } from '../objectAttributes/useObjectAttributesStore'
import { generalStore } from '../general'
import { interceptorErrorsStore } from '../utils/interceptorErrorsStore'
import { useThemeStore } from '../theme'
import { useConfigStore } from '../config'

type TIndexTypes = {
    id: IObject
    class_id: IObject[]
}

export interface IObjectsStore {
    store: {
        data: IObject[]
        state: StoreStates
        error: string
    }
    index: {
        id: Record<IObject['id'], number>
        class_id: Record<IObject['class_id'], number[]>
    }
    params: {
        loadLoopTime: number
        updateLoop: any
        isLoadAtStart: boolean
        loadOrder: number
    }
    isExternalObjectAttributes: boolean
    localeName: string
    setOASource: (value: 'backend' | 'oaStore') => void
    setIndexByMnemo: <T extends keyof TIndexTypes>(indexMnemo: T, value: IObjectsStore['index'][T]) => void
    getMeasurableObjectAttribute: (objectId: number, oaId: number) => IObject['object_attributes'][number]
    getMeasurableObjectAttributesList: (objectId: number) => IObject['object_attributes']
    getByIndex: <T extends keyof TIndexTypes>(indexMnemo: T, key: number) => T extends 'class_id' ? IObject[] : IObject
    forceUpdate: () => void
    fetchData: (force?: boolean) => Promise<void>
    updateData: () => void
    setData: (value: IObjectsStore['store']['data']) => void
    setState: (value: IObjectsStore['store']['state']) => void
    setError: (error?: string) => void
    setStartApiUpdateLoop: (time?: number) => void
    setStopApiUpdateLoop: () => void
    setInitialStoreState: () => void
    getObjectById: (id: number) => IObject
    getObjectNameById: (id: number) => IObject['name']
}
export const useObjectsStore = create<IObjectsStore>()(
    devtools(
        (set, get) => ({
            store: {
                data: [],
                state: StoreStates.NONE,
                error: '',
            },
            index: {
                id: {},
                class_id: {},
            },
            params: {
                loadLoopTime: 60000,
                updateLoop: null,
                isLoadAtStart: true,
                loadOrder: 3,
            },
            isExternalObjectAttributes: true,
            localeName: 'Объекты',
            setOASource: (value) => {
                set((state) => {
                    state.isExternalObjectAttributes = value === 'oaStore'

                    return { ...state }
                })
            },
            setIndexByMnemo: (indexMnemo, value) => {
                set((state) => {
                    state.index[indexMnemo] = value

                    return { ...state }
                })
            },
            getMeasurableObjectAttribute: (objectId, oaId) => {
                const currentObject = get().getByIndex('id', objectId)

                return currentObject?.object_attributes.find((oa) => oa.id === oaId)
            },
            getMeasurableObjectAttributesList: (objectId) => {
                const currentObject = get().getByIndex('id', objectId)

                return (
                    currentObject?.object_attributes.filter((oa) => {
                        return oa.attribute.history_to_cache || oa.attribute.history_to_db
                    }) ?? []
                )
            },
            getByIndex: (indexMnemo, key) => {
                switch (indexMnemo) {
                    case 'class_id': {
                        const indexedData = get().index[indexMnemo][key] as number[]

                        // console.log(indexedData, get().store.data);

                        const classObjects = Array.isArray(indexedData)
                            ? indexedData?.map((idx) => get().store.data[idx])
                            : []

                        return classObjects as any
                    }
                    case 'id': {
                        const index = get().index[indexMnemo][key] as number

                        const object = get().store.data[index]

                        const newObject =
                            object && get().isExternalObjectAttributes
                                ? ({
                                    ...object,
                                    object_attributes: useObjectAttributesStore
                                        .getState()
                                        .getByIndex('object_id', object.id),
                                    class: useClassesStore
                                        .getState()
                                        .getByIndex('id', object.class_id)
                                } as IObject)
                                : object

                        return object ? newObject : undefined
                    }
                    default: {
                        return undefined
                    }
                }
            },
            setState: (value) => {
                set((state) => {
                    state.store.state = value

                    return { ...state }
                })
            },
            setData: (value) => {
                set((state) => {
                    state.store.data = value

                    return { ...state }
                })
            },
            fetchData: async (force?) => {
                const interfaceView = generalStore.getState().interfaceView

                //* Фильтрация по package_id и class_id из настроек проекта

                const config = useConfigStore.getState()?.store?.data.find(el => el.mnemo == 'front_settings')?.value

                const systemKeys = {
                    'manager': 'managerObjects',
                    'showcase': 'showcaseObjects',
                    'constructor': 'constructorObjects'
                }

                const defaultPackageValues = {
                    'manager': [1, 2, 3],
                    'showcase': [1],
                    'constructor': [1, 2, 3]
                }
                const system = !!config && JSON.parse(config).system

                const settings = !!system && system[systemKeys[interfaceView]]

                // console.log('system', system)
                // console.log('settings', settings)

                const isDefaultPackages = settings ? settings?.packages?.includes('default') : true
                const isDefaultClasses = settings ? settings?.classes?.includes('default') : true

                const getObjectsForConstructor = system?.constructorObjects 
                    ? (system[systemKeys['constructor']]?.getObjectsForConstructor ?? true) 
                    : true

                const packagesValue = defaultPackageValues[interfaceView]
                const allClasses = useClassesStore.getState().store.data

                const classes = isDefaultClasses
                    ? isDefaultPackages
                        ? allClasses.filter(cls => packagesValue?.includes(cls.package_id)).map(cls => cls.id)
                        : allClasses.filter(cls => settings?.packages.includes(cls.package_id)).map(cls => cls.id)
                    : settings?.classes

                const payload = interfaceView && !!classes && classes?.length > 0 ?
                    {
                        'filter[class_id]': classes.join(',')
                    } : {}

                // const payload =
                //     interfaceView && interfaceView !== 'manager'
                //         ? {
                //             'filter[package_id]': 1,
                //         }
                //         : {}


                if (get().store.state == StoreStates.LOADING) {
                    return
                }

                const debug = false

                debug && console.log('start fetchData Objects')

                get().store.data.length === 0
                    ? get().setState(StoreStates.LOADING)
                    : get().setState(StoreStates.REFRESHING)

                // const iface = generalStore.getState().interfaceView
                const classByIndex = useClassesStore.getState().getByIndex
                const getRelationByIndex = useRelationsStore.getState().getByIndex
                const getAttributeByIndex = useAttributesStore.getState().getByIndex

                try {
                    const startRequest = performance.now()

                    // * Принудительный пропуск загрузки объектов в конструкторе
                    if (!force) {
                        if (classes?.length < 1 || (interfaceView == 'constructor' && !getObjectsForConstructor)) {
                            get().setState(StoreStates.FINISH)

                            return
                        }
                    }

                    const response = await getObjects({
                        all: true,
                        ...payload,
                    })

                    debug && console.log('fetchData', new Date().getTime())


                    if (response?.success) {
                        if (response.data) {
                            if (response.data.length > 0) {
                                // if (response.data !== null || undefined || [] || {}) {
                                const startEnrichment = performance.now()

                                /* 
                                        Обогащение стора объектов классами, атрибутами и релейшенами

                                        Тест обогащения на 13078 объектах 12.03.2024
                                        FOR endEnrichment time = 51 - 71 мс
                                        REDUCE endEnrichment time = 50 - 73 мс
                                    */

                                const newData = {
                                    rawData: [] as IObject[],
                                    index: {
                                        id: {},
                                        class_id: {},
                                    },
                                }

                                const length = response.data.length

                                for (let index = 0; index < length; index++) {
                                    const item = response.data[index]

                                    // TODO: нужен механизм отслеживания изменения интерфейса
                                    //  в generalStore.interfaceView
                                    //  и блокировки загрузки до релоада объектов
                                    // if (
                                    //     iface == INTERFACE_TYPES.showcase
                                    //     && item.class.package_id !== PACKAGE_AREA.SUBJECT
                                    // ) {
                                    //     continue
                                    // }
                                    const newObjectAttributes = get().isExternalObjectAttributes
                                        ? item.object_attributes
                                        : // ? useObjectAttributesStore.getState().getByIndex('object_id', item.id)
                                        item?.object_attributes?.map((attribute) => {
                                            return {
                                                ...attribute,
                                                attribute: getAttributeByIndex('id', attribute.attribute_id),
                                            }
                                        })
                                    const newItem = {
                                        ...item,
                                        class: classByIndex('id', item.class_id),
                                        object_attributes: newObjectAttributes,
                                        // object_attributes: item.object_attributes.map((attribute) => {
                                        //     return {
                                        //         ...attribute,
                                        //         attribute: getAttributeByIndex('id', attribute.attribute_id),
                                        //     }
                                        // }),
                                        links_where_left: item.links_where_left?.map((link) => {
                                            return {
                                                ...link,
                                                relation: getRelationByIndex('id', link.relation_id),
                                            }
                                        }),
                                        links_where_right: item.links_where_right?.map((link) => {
                                            return {
                                                ...link,
                                                relation: getRelationByIndex('id', link.relation_id),
                                            }
                                        }),
                                    }


                                    newData.rawData.push(newItem)
                                    // Попутно проводим индексацию стора по id и class_id
                                    newData.index.id[item.id] = index

                                    if (newData.index.class_id[item.class_id]) {
                                        newData.index.class_id[item.class_id].push(index)
                                    } else {
                                        newData.index.class_id[item.class_id] = [index]
                                    }
                                }

                                /*
                                    const newData = response.data.reduce((acc, item, index) => {
                                        const newItem = {
                                            ...item,
                                            class: classByIndex('id', item.class_id),
                                            object_attributes: item.object_attributes.map((attribute) => {
                                                return {
                                                    ...attribute,
                                                    attribute: getAttributeByIndex('id', attribute.attribute_id),
                                                    

                                                }
                                            }),
                                            links_where_left: item.links_where_left.map((link) => {
                                                return {
                                                    ...link,
                                                    relation: getRelationByIndex('id', link.relation_id),
                                                }
                                            }),
                                            links_where_right: item.links_where_right.map((link) => {
                                                return {
                                                    ...link,
                                                    relation: getRelationByIndex('id', link.relation_id),
                                                }
                                            })
                                        }

                                        acc.rawData.push(newItem)
                                        // Попутно проводим индексацию стора по id и class_id
                                        acc.index.id[item.id] = index

                                        if (acc.index.class_id[item.class_id]) {
                                            acc.index.class_id[item.class_id].push(index)
                                        } else {
                                            acc.index.class_id[item.class_id] = [index]
                                        }

                                        return acc
                                    }, {
                                        rawData: [] as IObject[],
                                        index: {
                                            id: {},
                                            class_id: {}
                                        } 
                                    })
                                    */
                                // console.log('equality', _.isEqual(newData.rawData, enrichedData))
                                //console.log('ARDEV', newData.rawData.length)
                                const endEnrichment = performance.now()

                                debug && console.log('endEnrichment time', endEnrichment - startEnrichment)

                                /* after for enrichment */
                                /* get().setIndexByMnemo('id', indexedData.id)
                                    get().setIndexByMnemo('class_id', indexedData.class_id)
                                    get().setData(enrichedData) */

                                /* after reduce enrichment */
                                get().setIndexByMnemo('id', newData.index.id)
                                get().setIndexByMnemo('class_id', newData.index.class_id)
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

                            return { ...state }
                        })

                        // if (response?.status === 403 || response?.status === 418) {
                        //     get().setState(StoreStates.ERROR)
                        // }

                        interceptorErrorsStore({
                            errorCode: response?.status,
                            callBack: () => get().setState(StoreStates.FINISH)
                        })
                    }

                    const endRequest = performance.now()

                    debug && console.log('request time', endRequest - startRequest)
                } catch (error) {
                    set((state) => {
                        state.store.error = error ?? 'Ошибка'
                        state.store.state = StoreStates.ERROR

                        return { ...state }
                    })
                } finally {
                    debug && console.log('end fetchData Objects')
                }
            },
            setError: (error) => {
                set((state) => {
                    state.store.error = error
                    state.store.state = StoreStates.ERROR

                    return { ...state }
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

                        return { ...state }
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

                    return { ...state }
                })
            },
            setStopApiUpdateLoop: () => {
                const updateLoop = get().params.updateLoop

                if (updateLoop !== null) {
                    clearInterval(updateLoop)
                }

                set((state) => {
                    state.params.updateLoop = null

                    return { ...state }
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
                        id: {},
                        class_id: {},
                    }

                    return { ...state }
                })
            },
            getObjectById: (id: number) => {
                return get().getByIndex('id', id)
                // return get().store.data.find((item) => item.id === id)
            },
            getObjectNameById: (id: number) => {
                return get().store.data.find((item) => item.id === id).name
            },
        })
    )
)

export const selectObjects = (state: IObjectsStore) => state.store.data
export const selectObject = (state: IObjectsStore) => state.getObjectById
export const selectState = (state: IObjectsStore) => state.store.state
export const selectAllObjectsByIndex = (state: IObjectsStore) => state.index.id
export const selectObjectByIndex = (state: IObjectsStore) => state.getByIndex
export const selectFindObject = (state: IObjectsStore) => (id: number) => state.getByIndex('id', id)
export const selectObjectNameById = (state: IObjectsStore) => state.getObjectNameById

export const selectObjectsUpdateParams = (state: IObjectsStore) => {
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

export { useObjectsStore as objectsStore }

type TObjectsStore = TBaseStore<IObject[]>

export const useObjects = create(
    immer<TObjectsStore>((set, get) => ({
        ...createBaseStore<IObject[]>(set, get),
        data: [],
        timer: 60_000,
        localeName: 'Объекты',
        request: () => getObjects({ all: true }),
    }))
)
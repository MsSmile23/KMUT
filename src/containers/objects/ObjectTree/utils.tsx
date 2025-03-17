import { IObject } from '@shared/types/objects'
import { IBuildBranches, ITreeObjectsStatesProps } from './treeTypes'
import { CustomTreeNode } from './CustomTreeNode'
import { CustomTreeTitle } from './CustomTreeTitle'
import { IAccumState, getAccumulatedStateFromStates, /* getStateViewParamsWithDefault, */ stateViewParamsDefault } from '@shared/utils/states'
import { StoreApi, UseBoundStore } from 'zustand'
import { shallow } from 'zustand/shallow'
import { useStateEntitiesStore } from '@shared/stores/state-entities'
import { useTreeStore } from '@shared/stores/trees'
import { IParams, IState } from '@shared/types/states'
import { IStateStereotype } from '@shared/types/state-stereotypes'
import { patchAccountById } from '@shared/api/Accounts/Models/patchAccountById/patchAccountById'
import { useAccountStore } from '@shared/stores/accounts'
import { StoreStates } from '@shared/types/storeStates'
import { Modal, message } from 'antd'
import { SERVICES_ACCOUNTS } from '@shared/api/Accounts'
// import { message } from 'antd'

export const saveTreeIdSettings = async (
    settings: any,
    treeSettings: any, 
    widgetId: number,
    showHorizontalScroll?: boolean,
    setUpdatingState?: (value: React.SetStateAction<string>) => void) => {
    const accountData = useAccountStore.getState()?.store?.data?.user
    const { forceUpdate, setState, setError } = useAccountStore.getState()
     
    setState(StoreStates.REFRESHING)

    try {
        const newSettings = {
            ...settings,
            trees: {
                ...settings?.trees,
                [widgetId]: {
                    ...settings?.trees?.[widgetId],
                    ...treeSettings
                }
            }
            // trees: {}

        }

        if (showHorizontalScroll !== undefined) {
            newSettings.trees.showHorizontalScroll = showHorizontalScroll
        }
        // const response = await patchAccountById(`${accountData?.id}`, { 
        //     settings: newSettings
        // })
        const response = await SERVICES_ACCOUNTS.Models.patchAccountMyself({ 
            settings: newSettings
        })

     
        if (response?.success) {
            // setState(StoreStates.FINISH)
            forceUpdate()
            // message.success(`Настройки дерева ${accountData?.id ?? ''} сохранены`)
        } else {
            setUpdatingState('error')
            const error: any[] = []
            const chosenErrors = response.error?.response?.data?.errors

            if (chosenErrors !== undefined) {
                Object.keys(chosenErrors)?.map((key) => {
                    error.push(chosenErrors[key])
                })
                Modal.warning({
                    title: 'Ошибка привязки атрибутов',
                    content: error[0],
                    zIndex: 999999
                })
            } else {
                Modal.warning({
                    title: 'Ошибка привязки атрибутов',
                    content: response.error.response.data.message,
                    zIndex: 999999
                })
            }
            setError('Ошибка сохранения настроек')
            setState(StoreStates.ERROR)
        }
        // }
    } catch {
        setError('Ошибка сохранения настроек')
        setState(StoreStates.ERROR)

        // message.error('Ошибка сохранения настроек')
    } finally {
        // 
    }
}
export const makeKey = (key: string, count: number, idx: number | string) => {
    const pos = '0'.repeat(count).split('').join('-')

    return `${key}-${pos ? pos + '-' + idx : idx}`
}

export const getRandom = (number: number) => {
    return Math.random() * number
}

export const buildBranches: IBuildBranches = ({
    tempTree, groupingOrder, object, objectState, allClassifiers, id, key, 
    /* showHierarchy,  getLinkById,*/ selectCurrObject, themeStyles
}) => {
    // Записываем ссылку на чилдрены во временную переменную 
    // для последующего рекурсивного прохода вглубь выстраемого дерева
    let tempArray = tempTree[0].children
    // const key = '0-0'

    // Проходимся по массиву типов группировки для получения массива названий групп
    groupingOrder.map((group, index) => {
        let currTitle: string

        // Исходя из условий получаем название группы из типа группировки (relation name)
        // По типу объекта
        if (Number(group.id) === 0) {
            /* // Ищем нужный класс в классификаторе "Тип объекта" 
            const currentClassOfObject = allClassifiers['0']?.children
                .find(child => child.id === object.class.id) */

            // Если нашёлся, берём название, если нет - то присваиваем "Без привязки"
            currTitle = group.name === 'Класс объекта' 
                ? object?.class?.name ?? 'Без привязки'
                : group.name
            // currTitle = currentClassOfObject?.name ?? 'Без привязки'
        } else {
            // Проходимся по остальным классификаторам, если тип группировки не "Тип объекта"

            // Получаем из типа группировки relationId
            // const relationId = Number(allClassifiers[group.id]?.id)

            // Если есть такой relationId
            // if (relationId) {

                
                
            // По relationId находим id объекта, где текущий объект левый
            const rightObjectId = object.links_where_left
                .find(link => link.relation_id === Number(group.id))?.right_object_id
                // .find(link => link.relation_id === relationId)?.right_object_id
            
            /* // По relationId получаем линк, где текущий объект левый
            const linkId = object.links_where_left
                .find(link => link.relation_id === relationId)?.id */

            // Если есть такой линк, берём название правого объекта в линке, если нет - присваиваем "Без привязки"
            currTitle = rightObjectId
                ? selectCurrObject('id', rightObjectId)?.name
                : 'Без привязки'
                /* 
                // Если есть такой линк, берём название правого объекта в линке, если нет - присваиваем "Без привязки"
                currTitle = linkId
                    ? getLinkById(linkId)?.right_object?.name
                    : 'Без привязки' 
                */

            // } else {
            //     // Если нет, то присваиваем "Без привязки"
            //     currTitle = 'Без привязки'
            // }
        }
        ///////////////////

        // Если это не последний элемент массива типа группировки, то создаём группы
        if (index < groupingOrder.length - 1) {

            //Проверяем, есть ли такая группа в массиве
            const groupIdx = tempArray.findIndex(item => item.group === currTitle)

            // Если нет такой группы
            if (groupIdx < 0) {
                // Создаём новую группу
                tempArray.push({
                    title: currTitle,
                    key: makeKey(
                        key, index, `${currTitle}-${object.name}-${object.id}`
                        // key, index, `${currTitle}-${getRandom(new Date().getTime())}-${object.id}`
                    ),
                    children: [],
                    group: currTitle,
                    states: [{
                        state: objectState,
                        count: 1
                    }]
                })

                // Отдельно изменяем название группы, 
                // чтобы можно было положить только что созданные стейты в его компонент
                tempArray[tempArray.length - 1].title = (
                    <CustomTreeTitle
                        id={id}
                        title={currTitle}
                        groupTitle={group.name}
                        statuses={tempArray[tempArray.length - 1].states}
                        styles={themeStyles}
                    />
                )

                // Перезаписываем в переменную ссылку уже на массив новой группы 
                tempArray = tempArray[tempArray.length - 1].children
            } else {
                // Если есть такая группа, то ищем индекс стейта, совпадающего с текущим объектом и увеличиваем счётчик
                const stateIdx = tempArray[groupIdx].states?.findIndex(item => item.state.id === objectState.id)

                // Если нет такого стейта, то добавляем
                if (stateIdx < 0) {
                    tempArray[groupIdx].states.push({
                        state: objectState,
                        count: 1
                    })
                } else {
                    // Если есть такой стейт, то увеличиваем счётчик
                    tempArray[groupIdx].states[stateIdx].count++
                }

                // Перезаписываем в переменную ссылку на массив найденной группы 
                tempArray = tempArray[groupIdx].children
            }
        } else {
            // Если это последний тип группировки в массиве

            // Проверяем, есть ли такая группа в массиве группы
            const lastGroupIdx = tempArray.findIndex(item => item.group === currTitle)

            // const itemKey = `${currTitle}-${index}-${object.id}`

            // Если нет такой группы
            if (lastGroupIdx < 0) {
                // Создаём новую группу
                tempArray.push({
                    title: currTitle,
                    key: makeKey(
                        key, index, `${currTitle}-${object.name}-${key}-${object.id}`
                        // key, index, `${currTitle}-${getRandom(new Date().getTime())}-${object.id}`
                    ),
                    children: [],
                    group: currTitle,
                    states: [{
                        state: objectState,
                        count: 1
                    }]
                })

                // Отдельно изменяем название группы, 
                // чтобы можно было положить только что созданные стейты в его компонент
                tempArray[tempArray.length - 1].title = (
                    <CustomTreeTitle
                        id={id}
                        title={currTitle}
                        groupTitle={group.name}
                        statuses={tempArray[tempArray.length - 1].states}
                        styles={themeStyles}
                    />
                )

                // Так как группа последняя, добавляем текущий объект в текущую ветку дерева
                tempArray[tempArray.length - 1].children.push({
                    title: (
                        <CustomTreeNode
                            id={object.id}
                            name={object.name}
                            icon={object.class.icon}
                            state={objectState}
                            styles={{
                                backgroundColor: themeStyles.backgroundColor,
                            }}
                        />
                    ),
                    key: makeKey(
                        key, index, `${currTitle}-${object.name}-${object.id}`
                        // key, index, `${currTitle}-${getRandom(new Date().getTime())}-${object.id}`
                    ),
                    isLeaf: true, 
                    // eslint-disable-next-line react/jsx-no-useless-fragment
                    icon: <></>
                })
            } else {
                // Если есть такая группа, то ищем индекс стейта, совпадающего с текущим объектом и увеличиваем счётчик
                const stateIdx = tempArray[lastGroupIdx].states.findIndex(item => item.state.id === objectState.id)

                // Если нет такого стейта, то добавляем
                if (stateIdx < 0) {
                    tempArray[lastGroupIdx].states.push({
                        state: objectState,
                        count: 1
                    })
                } else {
                    // Если есть такой стейт, то увеличиваем счётчик
                    tempArray[lastGroupIdx].states[stateIdx].count++
                }

                // Так как группа последняя, добавляем текущий объект в текущую ветку дерева
                tempArray[lastGroupIdx].children.push({
                    title: (
                        <CustomTreeNode
                            id={object.id}
                            name={object.name}
                            icon={object.class.icon}
                            state={objectState}
                            styles={themeStyles}
                        />
                    ),
                    key: makeKey(
                        key, index, `${currTitle}-${object.name}-${object.id}`
                        // key, index, `${currTitle}-${getRandom(new Date().getTime())}-${object.id}`
                    ),
                    isLeaf: true,
                    // eslint-disable-next-line react/jsx-no-useless-fragment
                    icon: <></>
                })
            }

        }
    })

    return tempArray
}

export const getObjectState = (
    tempStates: ITreeObjectsStatesProps['statuses'],
    objectId: IObject['id'],
    stateStereotypes: IStateStereotype[]
) => {
    // Добавить состояние объекта в общий счётчик состояний
    // Получаем все состояния объекта из стора
    const allStates = useStateEntitiesStore.getState().getAllObjectStateEntitiesById(objectId)
    const withDefaultParams: IParams[] = Object.entries(stateViewParamsDefault)
        .filter(([key,]) => {
            return ['fill', 'textColor', 'border', 'icon'].includes(key)
        })
        .map(([key, value]) => {
            return {
                type: key,
                value: String(value)
            }
        })

    let objectState: IAccumState

    // Получаем агрегирование состояние объекта, если их у него несколько
    if (allStates && allStates.length > 0) {
        objectState = getAccumulatedStateFromStates(allStates)
    } else {
        // if (stateStereotypes) {
        //     const stereoId = stateStereotypes.find(stereo => stereo.view_params.name === 'Нет состояния')?.id
        //     const stereo = stateStereotypes.find(stereo => stereo.id === stereoId)

        //     const stereoParamsWithDefault = getStateViewParamsWithDefault(stereo)
        //     const newStereoParams = Object.entries(stereoParamsWithDefault)
        //         .filter(([key,]) => {
        //             return ['fill', 'textColor', 'border', 'icon'].includes(key)
        //         })
        //         .map(([key, value]) => {
        //             return {
        //                 type: key,
        //                 value: String(value)
        //             }
        //         })
            
        //     objectState = {
        //         id: stereo?.id,
        //         view_params: {
        //             name: stereoParamsWithDefault.name,
        //             params: newStereoParams
        //         },
        //         states: []
        //     }
        // } else {
        objectState = {
            id: 0,
            view_params: {
                name: stateViewParamsDefault.name,
                params: withDefaultParams
            },
            priority: 1000,
            states: []
        }
        // }
    }

    const stateIdx = tempStates.findIndex(item => item.state.id === objectState.id)

    const accumState: IState = Object.entries(objectState).reduce((acc, [key, value]) => {
        if (key !== 'states') {
            acc[key] = value
        }


        return acc
    }, {} as IState)

    if (stateIdx < 0) {
        tempStates.push({
            state: {
                ...objectState,
                states: [accumState]
            },
            count: 1
        })
    } else {
        tempStates[stateIdx].count++
        tempStates[stateIdx].state.states.push(accumState)
    }

    return objectState
}


export const getIndex = () => {
    return Math.floor(Math.random() * (45 - 0) + 0)
}
export const objectGenerator = (count: number, objects: IObject[]): IObject[] => {
    // console.time('generateObjects')

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const newObjects = Array.from('0'.repeat(count)).reduce((acc, _, i) => {
        const idx = getIndex()

        if (objects[idx].class.package_id === 1) {
            acc.push(objects[idx])
        }

        return acc
    }, [])

    // console.timeEnd('generateObjects')

    return newObjects
}

type GenericState = Record<string, any>

export const createTreeStoreWithSelectors = <T extends GenericState>(
    store: UseBoundStore<StoreApi<T>>, id: number
): (<K extends keyof T>(keys: K[]) => Pick<T, K>) => {
    const useStore: <K extends keyof T>(keys: K[]) => 
        Pick<T, K> = <K extends keyof T>(keys: K[]) => {

            return store((state) => {
                const x = keys.reduce((acc, cur) => {
                    if ([
                        'chosenClassifiersCount',
                        'groupingOrder',
                        'searchValue',
                        'stateType',
                        'chosenClassifiers',
                    ].includes(cur as string)) {
                        acc[cur] = state[cur][id]
                    } else {
                        acc[cur] = state[cur]
                    }
                    // acc[cur] = state[cur]
                    
                    return acc
                }, {} as T)

                return x as Pick<T, K>
            }, shallow)
        }

    return useStore
}

export const createStoreWithSelectors = <T extends GenericState>(
    store: UseBoundStore<StoreApi<T>>
): (<K extends keyof T>(keys: K[]) => Pick<T, K>) => {
    const useStore: <K extends keyof T>(keys: K[]) => 
        Pick<T, K> = <K extends keyof T>(keys: K[]) => {

            return store((state) => {
                const x = keys.reduce((acc, cur) => {
                    
                    acc[cur] = state[cur]
                    
                    return acc
                }, {} as T)

                return x as Pick<T, K>
            }, shallow)
        }

    return useStore
}
interface ITreeWidgetHeightProps {
    windowHeight: number
    count: number
    treeContentHeight: number
    empty?: boolean
    headerEnabled?: boolean
    footerEnabled?: boolean
}

type ITreeWidgetHeight = (props: ITreeWidgetHeightProps) => number

const treeWidgetHeightWithoutTree = (empty: boolean) => {
    const treePaddings = 16 * 2
    const treeHeader = 40 /* tree header height */ + 14 /* tree marginBottom */
    const treeSearch = 32
    const divider = 1 /* divider height */ + 14 * 2 /* divider marginTop and marginBottom */
    
    return  empty 
        ? 0
        : treePaddings + treeHeader + treeSearch + divider
}

export const treeWidgetHeight: ITreeWidgetHeight = (props) => {
    const { 
        windowHeight,
        count,
        treeContentHeight,
        empty,
        headerEnabled,
        footerEnabled
    } = props

    const header = headerEnabled ? 64 : 0
    const footer = footerEnabled ? 60 : 0
    const treeWidgetsGap = 24 * count + 2

    return (windowHeight - header - footer - treeWidgetsGap - 
        count * treeWidgetHeightWithoutTree(empty)) * treeContentHeight
} 

export const useCurrentTreeStore = (id: number) => {
    const store = useTreeStore()
    
    return Object.entries(store).reduce((acc, [key, val]) => {
        // console.log('key', key, typeof acc[key], typeof val)
        // console.log('key', key)
        // console.log('val', val)

        if (typeof val === 'object') {
            acc[key] = val[id]
        } else {
            acc[key] = val
        } 
        // console.log('acc', acc)
        
        return acc
    }, {} as typeof store)
}
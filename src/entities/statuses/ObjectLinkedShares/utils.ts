import { IObject, IObjectAttribute } from '@shared/types/objects'
import { IStateEntities } from '@shared/types/state-entities'
import { IStateStereotype } from '@shared/types/state-stereotypes'
import { IStates } from '@shared/types/states'
import { IECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
import { getStateFromEntity, getStateViewParam, stateViewParamsDefault } from '@shared/utils/states'
import { IStatusProps } from './ObjectLinkedShares'
import { useObjectsStore } from '@shared/stores/objects'

export interface IPieProps {
    data: {
        id: number
        count: number
        value: string
        icon?: IECIconView['icon']
        color?: string,
        shortName?: string
    }[]
}

export interface IPreparedData {
    id: number
    title?: string
    data: IPieProps['data']
    icon?: IECIconView['icon']
    color?: string
    shortName?: string
}

export type IStatusTypes = 'class' | 'status'

export interface IExtendedOAttribute extends IObjectAttribute {
    class: Pick<IObject['class'], 'icon' | 'id' | 'name' >
}

export const mockStatusData: IStateEntities['objects'] = [
    {
        entity: 1, 
        state: 1
    },
    {
        entity: 2, 
        state: 1
    },
    {
        entity: 3, 
        state: 2
    },
    {
        entity: 4, 
        state: 3
    },
    {
        entity: 5, 
        state: 3
    },
    {
        entity: 6, 
        state: 2
    },
    {
        entity: 7, 
        state: 2
    },
    {
        entity: 8, 
        state: 3
    },
    {
        entity: 9, 
        state: 1
    },
    {
        entity: 10, 
        state: 2
    },
    {
        entity: 11, 
        state: 3
    },
    {
        entity: 12, 
        state: 1
    },
    {
        entity: 13, 
        state: 2
    },
    {
        entity: 14, 
        state: 3
    },
    {
        entity: 15, 
        state: 3
    }
]
export const mockStatusValues: IStates['object_states'] = [
    {
        id: 1,
        view_params: {
            color: '#75D175',
            type: 'fill',
        },
        name: 'В норме'
    },
    {
        id: 2,
        view_params: {
            color: '#8373E6',
            type: 'fill',
        },
        name: 'В ремонте'
    },
    {
        id: 3,
        view_params: {
            color: '#B21919',
            type: 'fill',
        },
        name: 'Не доступно'
    }
]
export const mockColors = [
    '#6929c4',
    '#1192e8',
    '#005d5d',
    '#9f1853',
    '#fa4d56',
    '#570408',
    '#198038',
    '#002d9c',
    '#ee538b',
    '#b28600',
    '#009d9a',
    '#012749',
    '#8a3800',
    '#a56eff',
]

export const countEntitiesByStates = ({
    data,
    stateStereotypes,
    groupingType,
    entityType,
    filters,
    blankData,
    linkedObjects,
    linkedObjectsClasses,
    showFilters
}: {
    data: {
        objects: IObject[];
        object_attributes: IExtendedOAttribute[];
    },
    stateStereotypes: IStateStereotype[],
    groupingType: 'class',
    entityType: 'objects' | 'object_attributes',
    filters: {
        type: IStatusTypes;
        values: number[];
    }[],
    blankData: IPreparedData[]
    linkedObjectsClasses?: IStatusProps['linkedObjectsClasses']
    linkedObjects?: IStatusProps['linkedObjects']
    showFilters?: boolean
}) => {
    const preparedData = data[entityType]?.reduce((acc, entity) => {
        // Достаём данные по классу
        const currClass_id = entity?.class?.id
        const currClass_name = entity?.class?.name
        const currIcon = entity?.class?.icon ?? 'CarOutlined'
        // Получаем состояние сущности и стереотип этого состояния
        const currState = getStateFromEntity(entity.id, entityType)
        // const currState = getStateFromEntity(object.id, 'objects')
        const currStereo = stateStereotypes?.find(st => st.id === currState?.state_stereotype_id)

        let shortName

        if ('object_attributes' in entity) {
            shortName =  entity?.object_attributes?.find(
                (oa) => oa?.attribute?.attribute_stereotype?.mnemo == 'short_name'
            )?.attribute_value
        }
        else {
            if (entity.attribute?.attribute_stereotype?.mnemo == 'short_name') {
                shortName = entity?.attribute_value
            }
        }
        
        let groupItem: IPreparedData

        // При наличии/отсутствии группировки находим элемент массива или создаём новый 
        if (groupingType) {
            if (showFilters) {                 
                const rightLink = entity?.links_where_left.find(link => {
                    // const isInLinkedList = linkedObjects?.length > 0
                    //     ? linkedObjects.includes(link.right_object_id)
                    //     : true

                    return link.relation.right_class_id === linkedObjectsClasses/*  && isInLinkedList */
                        
                })
                const linkedObject = useObjectsStore.getState().getByIndex('id', rightLink?.right_object_id)
                
                // const leftLink = entity.links_where_right.find(link => {
                //     const isInLinkedList = groupingLinkedObjects?.length > 0
                //         ? groupingLinkedObjects.includes(link.left_object_id)
                //         : true

                //     return link.relation.left_class_id === groupingLinkedClass && isInLinkedList
                // })
                
                // const currentLink = leftLink || rightLink
                const groupIdx =  acc.findIndex(accItem => accItem.id === rightLink?.right_object_id)

                // if (linkedObjects.includes(linkedObject?.id)) {
                if (groupIdx < 0) {
                    const isInLinkedList = linkedObjects?.length > 0
                        ? linkedObjects.includes(linkedObject?.id)
                        : true

                    if (isInLinkedList) {
                        
                        groupItem = {
                            id: linkedObject?.id,
                            title: linkedObject?.name,
                            data: [],
        
                            icon: currIcon,
                            shortName: shortName
                        }
        
                        acc.push(groupItem)
                    }
                } else {
                    groupItem = acc[groupIdx]
                }
                // }
            } else {
                // Захардкожена группировка по классу
                const existDataItemIndex = acc.findIndex(accItem => accItem.id === currClass_id)
    
                if (existDataItemIndex < 0) {
                    // Создаём новую группу
                    groupItem = {
                        id: currClass_id,
                        title: currClass_name ?? 'Класс ' + currClass_id,
                        data: [],
                        // data: states.map(stVal => ({
                        //     id: stVal.state_stereotype_id ?? stVal.id,
                        //     // id: stVal.id,
                        //     value: stVal.state_stereotype?.view_params?.name ?? stVal.view_params.name,
                        //     // value: stVal.view_params.name,
                        //     count: 0,
                        //     color: getStateViewParam(stVal, 'fill')
                        // })),
    
                        icon: currIcon,
                        shortName: shortName
                    }
    
                    acc.push(groupItem)
                } else {
                    // Записываем в ссылку найденную группу
                    groupItem = acc[existDataItemIndex]
                }
            }
        } else {
            // Записываем в ссылку группу "Без группировки"
            groupItem = acc.find(accItem => accItem.id === 0)
        }

        if (groupItem) {
            // В данных группы ищем стереотип или состояние или дефолтное значение состояния 
            // (в зависимости от наличия стереотипа/состояния у сущности)
            const statusDataIndx = groupItem.data.findIndex(item => {
                const isIn = [
                    currState?.state_stereotype_id, 
                    currState?.id,
                    0
                ].includes(item.id)

                return isIn
            })

            if (statusDataIndx < 0) {
                //  Если не нашли, создаём новую группу состояния и пушим в группу класса
                const stateItem: IPieProps['data'][number] = {
                    // Порядок присвоения id, name и color: стереотип -> состояние -> дефолтное значение
                    id: currState?.state_stereotype_id ?? 
                        currState?.id ?? 
                        0,
                    value: currStereo?.view_params.name ?? 
                        currState?.view_params.name ?? 
                        stateViewParamsDefault.name,
                    count: 1,
                    color: getStateViewParam(currStereo, 'fill') ??
                        getStateViewParam(currState, 'fill') ??
                        stateViewParamsDefault.fill,
                    shortName: shortName
    
                }
    
                groupItem.data.push(stateItem)
            } else {
                // Не используется, переводится сразу в true
                // фильтры разбивки по классу и статусам (пока реализовано только по классам и через groupingType)
                const conditions = filters &&
                    filters.length > 0
                    ? filters
                        .map((filterItem) => {
                            switch (filterItem.type) {
                                case 'class': {
                                    return filterItem.values.includes(currClass_id)
                                }
                                case 'status': {
                                    const id = currStereo
                                        ? currState?.state_stereotype_id
                                        : currState.id
    
                                    return filterItem.values.includes(id)
                                }
                            }
                        })
                        .every((item) => item === true)
                    // Срабатывает сразу здесь
                    : true
    
                if (conditions) {
                    if (groupingType) {
                        groupItem.data[statusDataIndx].count++
                    } else {
                        groupItem.data[statusDataIndx].count++
                    }
                }
            } 
        }

        return acc
    }, blankData)
    // не отображать объекты с нулевым количеством по всем статусам
        .filter(groupItem => groupItem.data.some(subGroupItem => {
            return subGroupItem.count > 0 
        }))
        // убрать нулевые значения статусов, если какой-то из статусов не нулевой
        .map(groupItem => ({
            id: groupItem.id,
            title: groupItem.title,
            data: groupItem.data.filter(subGroupItem => subGroupItem.count > 0),
            icon: groupItem.icon,
            color: groupItem.color,
            shortName: groupItem?.shortName
        }))

    return preparedData
}

export const countEntitiesByAttribute = (
    enitites: IObject[], 
    dividingCriteriaProps: {attribute_id: number}
) => {
    const data: any[] = []

    if (!dividingCriteriaProps?.attribute_id || !enitites) {
        return []
    }

    enitites?.forEach((entity, i) => {
        const attributeValue = entity?.object_attributes
            .find((oa) => oa?.attribute_id === dividingCriteriaProps?.attribute_id)
            ?.attribute_value

        const existAttributeValue = data?.find(item => item.value.includes(attributeValue))

        if (!attributeValue || attributeValue === null) {
            return
        } else if (attributeValue && !existAttributeValue) {
            data?.push({
                id: i,
                value: attributeValue,
                count: 1,
                icon: undefined,
                color: undefined
            })
        } else if (existAttributeValue) {
            existAttributeValue.count++
        }
    })

    const fullData = [{
        id: 0,
        title: 'Без группировки', 
        data: data,
        icon: undefined,
        color: undefined,
        shortName: undefined
    }]

    return fullData
}
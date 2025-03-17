import { IRelation } from '@shared/types/relations';
import { ILink } from '@shared/types/links';
import { IObject } from '@shared/types/objects';
import { IAttribute } from '@shared/types/attributes';
import { IAttributeStereotype } from '@shared/types/attribute-stereotypes';
import { jsonParseAsObject } from '@shared/utils/common';
import moment from 'moment';
import { useObjectsStore } from '@shared/stores/objects';
import { uniqBy } from 'lodash';
import { findObjectLinkByRelationStereotype } from './links';
import { findObjectAttributeByStereotype } from './objectAttributes';
import { ATTR_STEREOTYPE } from '@shared/config/attr_stereotypes';

/**
 * Функция сливает в один массив левые и правые линки объекта
 * @param object
 */
export const getObjectLinks = (object: IObject): ILink[] => {
    return [
        ...object?.links_where_left ?? [],
        ...object?.links_where_right ?? []
    ]
}

export const getObjectAttributeProps = (object: IObject) => {
    const publicAttrs = (object.object_attributes || []).filter(
        (item) =>
            item.attribute.visibility == 'public'
            && item.attribute_value
    )

    const publicAttrsStrs = publicAttrs.map(item =>
        `${item.attribute.name}: ${item.attribute_value}`)

    const label =
        (publicAttrsStrs.length > 0)
            ? publicAttrsStrs.join(', ')
            : `${object?.class?.name || 'Название класса'} [${object.id}]`

    return {
        label: label,
        values:
            (publicAttrs.length > 0)
                ? publicAttrs.map((pa) => pa.attribute_value).join(', ')
                : `Без названия [Класс ${object?.class?.name || object.id}]`
    }
}

interface IGetAttributeValueByMnemo {
    object: IObject,
    mnemo: string,
    attributes: IAttribute[],
    attribute_stereotypes: IAttributeStereotype[],
}
export const getAttributeValueByMnemo = ({
    object,
    mnemo,
    attributes,
    attribute_stereotypes,
}: IGetAttributeValueByMnemo) => {
    const filteredStereotypes = attribute_stereotypes.filter(item => item.mnemo == mnemo)
    const filteredStereotypesIds: IAttributeStereotype['id'][] = filteredStereotypes.map( item => item.id )
    const filteredAttrs = attributes.filter(
        (item: IAttribute) =>
            item.attribute_stereotype_id && filteredStereotypesIds.includes(item.attribute_stereotype_id)
    )
    const filteredAttrsIds: IAttribute['id'][] = filteredAttrs.map( item => item.id )
    const object_attribute = object.object_attributes.find( item => filteredAttrsIds.includes(item.attribute_id) )

    return {
        value: object_attribute?.attribute_value ?? 'Нет названия',
        object_attribute: object_attribute,
        attributes: filteredAttrs,
        attribute_stereotypes: filteredStereotypes
    }
}

type IGetObjectNameProps = Omit<IGetAttributeValueByMnemo, 'mnemo'>
export const getObjectName = ({
    object,
    attributes,
    attribute_stereotypes,
}: IGetObjectNameProps) => {
    return getAttributeValueByMnemo({
        object: object,
        mnemo: 'name',
        attributes: attributes,
        attribute_stereotypes: attribute_stereotypes,
    })
}



interface IGetAggregationObjectsProps {
    object?: Partial<IObject>,
    objects?: IObject[],
    links?: ILink[],
    relation_type?: IRelation['relation_type']
}
export const getLinkedObjects = ({
    object,
    objects,
    links,
    relation_type
}: IGetAggregationObjectsProps): IObject[] => {

    const objectKeys: {
        source: 'left_object_id' | 'right_object_id'
        linked: 'left_object_id' | 'right_object_id'
    } =  relation_type !== 'aggregation'
        ? { source: 'left_object_id', linked: 'right_object_id' }
        : { source: 'right_object_id', linked: 'left_object_id' }

    const filteredLinks = links.filter(
        link =>
            link.relation.relation_type == relation_type
            && link[objectKeys.source] == object.id
    )

    const linkedObjects = filteredLinks.reduce( (acc: IObject[], link) => {
        const newObject = objects.find( item => item.id == link[objectKeys.linked] );

        if (newObject) { acc.push(newObject) }

        return acc
    }, [])

    return linkedObjects
}

export const getObjectName2 = (object: IObject) => {

    if (object?.name !== null) {
        return object?.name
    }
    else {
        return object?.class.name
    }
}

export const getObjectProps = (object: IObject) => {
    const objName = getObjectName2(object)

    const icon = object?.class?.icon ?? 'FileOutlined'

    return ({
        name: objName,
        icon: icon
    }
    )
}

export type IGetLinkedObjects = (args: {
    object: IObject,
    relationIds: number[],
    objects: IObject[]
}) => IObject[]

/**
 * Поиск дочерних объектов
 */
export const findLinkedObjects: IGetLinkedObjects = ({ object, relationIds, objects }) => {
    let linkedObjectIds = (object?.links_where_left || [])
        .filter((link) => relationIds.includes(link.relation_id) )
        .map((link) => link.right_object_id)

    linkedObjectIds = [...linkedObjectIds, ...(object?.links_where_right || [])
        .filter((link) => relationIds.includes(link.relation_id) )
        .map((link) => link.left_object_id)]

    return objects.filter(obj => linkedObjectIds.includes((obj.id)))
}




export type IGetOAValueFormFieldProps = {
    value: any,
    attribute: IAttribute,

} | {
    value: any,
    attribute_id: IAttribute['id'],
    attributes: IAttribute[]
}
/**
 * Подготовка значений для формы
 * @param value
 * @param attribute_id
 * @param attribute
 * @param attributes
 */
export const getOAValueFormField = ({ value, attribute_id, attribute, attributes }: IGetOAValueFormFieldProps) => {
    const attrData: IAttribute = attribute ? attribute : attributes.find(item => item.attribute_id = attribute_id)

    switch (true) {
        case (
            attrData?.data_type?.inner_type == 'jsonb'
            && attrData?.data_type?.mnemo == 'schedule'
        ): {
            return jsonParseAsObject(value)
        }
        default: return value
    }
}

export const formatDataUTC = (chart: any) => {
    const arr: any = []

    chart?.map((item: [string | number, string | number]) => {
        const x = moment.unix(Number(item[0])).format('DD.MM.YYYY HH:mm')
        const y = item[1]

        arr.push([x, y])
    })

    return arr
}

/**
 * Получение дочерних объектов на основе базовых классов
 * @param currentObj - текущий объект, чьи дочерние объекты необходимо получить
 * @param targetClassIds - массив id базовых классов
 * @param childClassIds - массив id дочерних классов
 * @param depth - максимальная глубина поиска
 * @returns массив id дочерних объектов
 */

export type IFindChildObjects = (params: {
    currentObj: IObject
    childClassIds: number[]
    targetClassIds: number[]
    objects?: IObject[]
    depth?: number
}) => number[]
export const findChildObjectsByBaseClasses: IFindChildObjects = ({
    childClassIds = [],
    targetClassIds = [],
    currentObj,
    objects,
    depth
}) => {
    const childObjects: number[] = []
    let tempObj: IObject = currentObj
    let currentDepth = 0

    // рекурсионно проходимся по цепочке дочерних объектов от текущего
    const findObjects = (objectsArr: IObject['links_where_right']) => {
        // Если в фунцкию придёт пустой массив дочерних объектов, то рекурсия заканчивается
        if (objectsArr?.length === 0 || currentDepth === depth) {
            return []
        }

        currentDepth = currentDepth + 1

        const tempObjects: IObject[] = []

        objectsArr?.forEach(link => {
            if (link?.relation?.relation_type == undefined) {
                return false
            }
            const type = ['aggregation', 'composition'].includes(link.relation.relation_type)
            // есть ли класс дочернего объекта в отслеживаемых классах
            const isInTargetClassIds = targetClassIds.includes(link.relation.left_class_id)
            // const isInTargetClassIds = targetClassIds.length > 0 
            //     ? targetClassIds.includes(link.relation.left_class_id) 
            //     : true
            
            // если есть, то добавляем в массив дочерних объектов
            if (type && isInTargetClassIds) {
                childObjects.push(link.left_object_id)
            // в обратном случае проверяем, есть ли класс дочернего объекта в дочерних
            } else {
                const childIdx = childClassIds
                    .findIndex(child => child === link.relation.left_class_id)

                // если есть, то добавляем и запускаем рекурсивно текущую функцию с его массивом дочерних объектов
                if (childIdx > -1) {
                    

                    if (!objects) {
                        tempObj = useObjectsStore.getState().getByIndex('id', link.left_object_id)
                        findObjects(tempObj.links_where_right)

                        tempObjects.push(useObjectsStore.getState().getByIndex('id', link.left_object_id))
                        // tempObjects.push(link)
                    } else {
                        tempObj = objects.find((obj) => obj.id === link.left_object_id)
                        findObjects(tempObj.links_where_right)

                        tempObjects.push(objects.find((obj) => obj.id === link.left_object_id))
                        // tempObjects.push(link)
                    }
                } 
            }
        })

    }

    findObjects(tempObj?.links_where_right)

    return childObjects

}

export type IFindChildObjectsWithPaths = (params: {
    currentObj: IObject
    childClassIds: number[]
    targetClassIds: number[]
    objects?: IObject[]
    visibleClasses?: number[]
    intermediateClasses?: number[]
    filter?: {
        linkedObjects?: {
            classId: number
            objectIds: number[]
        }[]
        attrValues?: {
            attributeId: number
            value: string
        }[]
    }
    allChildClassIds?: boolean
    //direction?: 'up' | 'down',
    onlyUnique?: boolean
    id?: number
}) => IFindChildObjectsWithPathsReturn

export interface IShortObj {
    id: number
    classId: number
    name: string
}

export interface IChildObjectWithPaths extends IShortObj{
    paths: {
        allStr?: string
        allArr?: IShortObj[]
        parentsStr?: string
        parentArr?: IShortObj[]
        visibleStr?: string
        visibleArr?: IShortObj[]
        allClassArr?: number[]
        allClassStr?: string
    }
}
export interface IFindChildObjectsWithPathsReturn {
    objectIds: number[],
    objectsWithPath: IChildObjectWithPaths[]
}

export const findChildObjectsWithPaths: IFindChildObjectsWithPaths = ({
    childClassIds = [],
    targetClassIds = [],
    currentObj,
    objects,
    visibleClasses,
    intermediateClasses = [],
    filter,
    allChildClassIds = true,
    onlyUnique = true,
    id
}) => {
    const childObjects: number[] = []
    let tempObj: IObject = currentObj

    const childObjectsWithPaths: IChildObjectWithPaths[] = []
    const pathIds = []
    // рекурсионно проходимся по цепочке дочерних объектов от текущего
    const findObjects = (
        objectsArr: IObject['links_where_right'], 
        tempPathIds: IShortObj[]
    ) => {
        // Если в фунцкию придёт пустой массив дочерних объектов, то рекурсия заканчивается
        if (objectsArr?.length === 0) {
            return []
        }

        const tempObjects: IObject[] = []
        
        objectsArr?.forEach(link => {
            if (link?.relation?.relation_type == undefined) {
                return false
            }
            const type = ['aggregation', 'composition'].includes(link.relation.relation_type)

            if (type) {
                tempObj = useObjectsStore.getState().getByIndex('id', link.left_object_id)

                const childObj: IShortObj = { 
                    id: tempObj?.id, 
                    classId: tempObj?.class_id, 
                    name: tempObj?.name 
                }

                if (tempObj) {

                    const allPathsArr = [...tempPathIds, childObj]
                    const parentPathsArr = allPathsArr.filter(obj => obj.id !== tempObj.id)
                    const visiblePathsArr = allPathsArr.filter((obj, index) => {
                        const isVisible = visibleClasses?.length > 0
                        // ? visibleClasses.some(vc => vc === obj.classId)
                            ? visibleClasses.includes(obj.classId)
                            : true
                        const isLast = index === allPathsArr.length - 1
                    
                        return  isVisible && !isLast
                    })
                    const allClassPathsArr = allPathsArr.map(pathItem => pathItem.classId)
                    // есть ли класс дочернего объекта в отслеживаемых классах
                    const isInTargetClassIds = targetClassIds.length > 0
                        ? targetClassIds.includes(tempObj.class_id)
                        : allChildClassIds
                            ? allChildClassIds
                            : true

                    // const isInTargetClassIds = targetClassIds.includes(tempObj.class_id)

    
                    const isDuplicate = (onlyUnique)
                        ? childObjectsWithPaths.findIndex(obj => obj.id === tempObj.id) > -1
                        : false
                    const isInVisible = visibleClasses?.some(id => id === tempObj.class_id)
                    const isInIntermediate = intermediateClasses?.some(id => id === tempObj.class_id)
                    // Фильтр - имеет ли данный объект любую связь с данным классом или с конкретными объектами
                    const isInLeftLinks = filter?.linkedObjects?.length > 0
                        ? tempObj.links_where_left.some(link => {
                            return filter?.linkedObjects.some(linkGroup => {
                                const isInCurrentObjects = linkGroup?.objectIds?.length > 0
                                    ? linkGroup?.objectIds?.includes(link.right_object_id) 
                                    : true

                                return linkGroup.classId === link.relation.right_class_id && isInCurrentObjects
                                
                            })
                        })
                        : true
                

                        
                    const isInRightLinks = filter?.linkedObjects?.length > 0
                        ? tempObj.links_where_right.some(link => {
                            return filter?.linkedObjects.some(linkGroup => {
                                const isInCurrentObjects = linkGroup?.objectIds?.length > 0 
                                    ? linkGroup?.objectIds?.includes(link.left_object_id) 
                                    : true

                                return linkGroup.classId === link.relation.left_class_id && isInCurrentObjects
                                
                            })
                        })
                        : true

                    const isFilteredByLinkedObjects = filter?.linkedObjects?.length > 0
                        ? (isInLeftLinks || isInRightLinks)
                        : true
                    // const isFilteredByLinkedObjectsAttrs = filter?.attrValues?.length > 0
                    //     ? tempObj.links_where_left.some(link => {
                    //         // link.right_object_id
                    //         return 
                    //     }) ||
                    //         tempObj.links_where_right.some(link => {
                    //             // link.left_object_id
                    //             return
                    //         })
                    //     : true

                    // если есть, то добавляем в массив дочерних объектов
                    if (isInTargetClassIds && 
                    !isDuplicate &&
                    !isInVisible &&
                    !isInIntermediate &&
                    isFilteredByLinkedObjects // &&
                    // isFilteredByLinkedObjectsAttrs
                    ) {
                    

                        childObjectsWithPaths.push({
                            id: tempObj.id,
                            classId: tempObj.class_id,
                            name: tempObj.name,
                            paths: {
                                allArr: allPathsArr,
                                allStr: allPathsArr.map(obj => obj.id).join('.'),
                                parentArr: parentPathsArr,
                                parentsStr: parentPathsArr.map(obj => obj.id).join('.'),
                                visibleArr: visiblePathsArr,
                                visibleStr: visiblePathsArr.map(obj => obj.id).join('.'),
                                allClassArr: allClassPathsArr,
                                allClassStr: allClassPathsArr.join('.'),
                            }
                        })
                    }                     

                    // в обратном случае проверяем, есть ли класс дочернего объекта в дочерних
                    const childIdx = childClassIds
                        .findIndex(child => child === tempObj.class_id)
    
                    // если есть, то добавляем и запускаем рекурсивно текущую функцию с его массивом дочерних объектов
                    if (childIdx > -1) {
                        if (!objects) {
                            findObjects(tempObj.links_where_right, allPathsArr)
    
                            tempObjects.push(tempObj)
                        } else {
                            tempObj = objects.find((obj) => obj.id === link.left_object_id)
    
                            findObjects(tempObj?.links_where_right, [...tempPathIds])
    
                            tempObjects.push(objects.find((obj) => obj.id === link.left_object_id))
                        }
                    } else {
                        if (allChildClassIds) {
                            findObjects(tempObj.links_where_right, allPathsArr)
        
                            tempObjects.push(tempObj)
                        }
                    }
                }
            }
            
            // }
        })

    }

    findObjects(tempObj?.links_where_right, pathIds)

    return {
        objectIds: childObjects,
        objectsWithPath: childObjectsWithPaths
    }
}

export const findChildObjects_TEST = ({
    objects,
    object,
    targetClasses,
    searchByIndex,
}: {
    objects: IObject[]
    object: IObject,
    targetClasses: number[]
    searchByIndex?: boolean
}) => {
    const result = []

    const findObjects = ({
        objects,
        object,
        targetClasses,
        searchByIndex,
    }: {
        objects: IObject[]
        object: IObject,
        targetClasses?: number[]
        searchByIndex?: boolean
    }) => {
        const parentLinks = object?.links_where_left

        const parents = [...new Set(parentLinks?.reduce((acc, link) => {
            //console.log('link.relation.right_class.id', link.relation.right_class.id)

            return targetClasses?.includes(link.relation.right_class_id) 
                ?  [ ...acc, link?.right_object_id ]
                : acc
        }, []).values())].map((id) => {
            if (searchByIndex) {
                return useObjectsStore.getState().getByIndex('id', id)
            } else {
                return objects?.find((obj) => obj.id === id)
            }
        })
    
        parents.forEach((parent) => result.push(parent))
        parents.forEach((parent) => {
            findObjects({
                objects,
                object: parent,
                targetClasses,
                searchByIndex
            })
        })
    }

    findObjects({
        objects,
        object,
        targetClasses,
        searchByIndex
    })

    return uniqBy(result, (el) => el?.id) as IObject[]
}

export const findParentsByBaseClasses = ({
    objects,
    object,
    targetClasses,
    linkedClasses
}: {
    objects: IObject[]
    object: IObject,
    targetClasses: number[],
    linkedClasses?: number[]
}) => {
    const result = []

    const findObjects = ({
        objects,
        object,
        targetClasses,
        linkedClasses
        
    }: {
        objects: IObject[]
        object: IObject,
        targetClasses: number[]
        linkedClasses?: number[]
    }) => {

      
        const parentLinks = object?.links_where_left

        const localTargetClasses =  targetClasses ? [...targetClasses, ...linkedClasses] : [...linkedClasses]

        const parents = [...new Set(parentLinks?.reduce((acc, link) => {
            return localTargetClasses?.includes(link.relation.right_class_id) 
                ?  [ ...acc, link?.right_object_id ]
                : acc
        }, []).values())].map((id) => objects?.find((obj) => obj.id === id))

        if (targetClasses) {
            parents.filter(item => targetClasses.includes(item?.class_id)).forEach((parent) => result.push(parent))
        }
        else {
            parents.forEach((parent) => result.push(parent))
        }
      
        parents.forEach((parent) => {
            findObjects({
                objects,
                object: parent,
                targetClasses,
                linkedClasses
            })
        })
    }

    findObjects({
        objects,
        object,
        targetClasses,
        linkedClasses
    })

    return uniqBy(result, (el) => el?.id) as IObject[]

}

export const sortObjectsByPriority = (objects: IObject[]): Array<IObject & { sort?: number }> => {
    const objectsWithSort: Array<IObject & { sort: number }> = []
    const objectsWithoutSort: IObject[] = []

    objects.forEach((obj) => {
        const link = findObjectLinkByRelationStereotype('sort', obj)
        const categoryObject = useObjectsStore.getState().getByIndex('id', link?.right_object_id)
        const value = Number(findObjectAttributeByStereotype(
            ATTR_STEREOTYPE.priority, 
            categoryObject?.object_attributes
        )?.attribute_value)

        if (!isNaN(value)) {
            objectsWithSort.push({ ...obj, sort: value  })
        } else {
            objectsWithoutSort.push(obj)
        }
    })

    return [
        ...objectsWithSort.sort((a, b) => a.sort - b.sort),
        ...objectsWithoutSort
    ]
}
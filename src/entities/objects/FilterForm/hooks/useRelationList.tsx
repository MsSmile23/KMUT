import { PACKAGE_AREA } from '@shared/config/entities/package'
import { selectRelations, useRelationsStore } from '@shared/stores/relations'
import { ICascaderOptionList, IFilterFormProps, IOption, IOptionList, IRelationFilterItem } from '../types'
import { useMemo } from 'react'
import { selectObjectByIndex, selectObjects, useObjectsStore } from '@shared/stores/objects'
import { defaultFormValues, sortGroupedList } from '../utils'
import { IRelation } from '@shared/types/relations'

export const useRelationList = ({
    relationSettings,
    objectSettings
}: {
    relationSettings: IRelationFilterItem[],
    objectSettings: IFilterFormProps['objectFilter']
}) => {
    // const storeObjects = useObjectsStore(selectObjects)
    //     .reduce((acc, obj) => {
    //         if (obj.class.package_id === PACKAGE_AREA.SUBJECT) {
    //             acc.push(obj.id)
    //         }

    //         return acc
    //     }, [])
    const relations = useRelationsStore(selectRelations)
    // const getRelationByIndex = useRelationsStore(selectRelationByIndex)
    const getObjectByIndex = useObjectsStore(selectObjectByIndex)

    // console.log('relationSettings', relationSettings)
    // console.log('objectSettings', objectSettings)
    // console.log('relations', relations)
    // console.log('relations', relations.filter(rel => rel.right_class.is_abstract))
    const lists = useMemo(() => {
        const filteredRelations: IOptionList[][] = []
        const filteredStereo: IOption[][] = []
        const filteredGroupedRelations: IOptionList[][] = []
        const cascaderRelations: ICascaderOptionList[][] = []
        const filteredRelatedObjects: IOptionList[][] = []
        // const filteredRelatedObjects: IOption[][] = []

        const relationFilter = relationSettings ?? defaultFormValues.relationFilter

        // console.log('relationSettings', relationSettings)
        // console.log('defaultFormValues.relationFilter', defaultFormValues.relationFilter)
        relations.forEach(rel => {
            if (rel.left_class.package_id === PACKAGE_AREA.SUBJECT && 
                rel.right_class.package_id === PACKAGE_AREA.SUBJECT
            ) {
                (relationFilter).forEach((item, index) => {
                    if (item.type 
                        ? item.type === rel.relation_type
                        : true
                    ) {
                        if (!filteredRelations[index]) {
                            filteredRelations[index] = []
                        } 

                        if (!filteredStereo[index]) {
                            filteredStereo[index] = []
                        } 

                        if (!filteredGroupedRelations[index]) {
                            filteredGroupedRelations[index] = []
                        } 

                        if (!cascaderRelations[index]) {
                            cascaderRelations[index] = []
                        } 

                        const groupRelIndex = filteredGroupedRelations[index].findIndex(item => {
                            return item.title === rel.right_class.id
                        })

                        if (groupRelIndex < 0) {
                            filteredGroupedRelations[index].push({
                                title: rel.right_class.id,
                                label: `Цель - [${rel.right_class.name}]`,
                                options: [{
                                    label: `${rel.name} [Источник - ${rel.left_class.name}]`,
                                    // label: `${rel.left_class.name} [${rel.name}]`,
                                    value: rel.id
                                }]
                            })
                        } else {
                            const relInGroupIndex = filteredGroupedRelations[index][groupRelIndex].options
                                .findIndex(item => {
                                    return item.value === rel.id
                                })
                            
                            if (relInGroupIndex < 0) {
                                // const lastIndex = filteredGroupedRelations[index][groupRelIndex].options.length - 1
                                
                                filteredGroupedRelations[index][groupRelIndex].options.push({
                                    label: `${rel.name} [Источник - ${rel.left_class.name}]`,
                                    // label: `${rel.left_class.name} [${rel.name}]`,
                                    value: rel.id
                                })
                            } 
                        }


                        if (rel.relation_stereotype_id) {

                            const stereoIdx = filteredStereo[index].findIndex(item => {
                                return item.value === rel.relation_stereotype_id
                            })
    
                            if (stereoIdx < 0) {
                                filteredStereo[index].push({
                                    label: rel.relation_stereotype.name,
                                    value: rel.relation_stereotype_id
                                })
                            }
                        } else {
                            const stereoIdx = filteredStereo[index].findIndex(item => {
                                return item.value === 0 
                            })

                            if (stereoIdx < 0) {
                                filteredStereo[index].push({
                                    label: 'Без стереотипа',
                                    value: 0
                                })
                            }
                        }

                        if (item.stereoId
                            ? item.stereoId === 0
                                ? !rel.relation_stereotype_id
                                : item.stereoId === rel.relation_stereotype_id
                            : true
                        ) {
                            const relationName = rel.virtual
                                ? `${rel.name} [${rel.left_class.name} -> ${rel.right_class.name}]`
                                : rel.name

                            if (rel.relation_stereotype_id) {
                                const groupRelIndex = filteredRelations[index].findIndex(item => {
                                    return item.title === rel.relation_stereotype_id
                                })

                                if (groupRelIndex < 0) {
                                    filteredRelations[index].push({
                                        label: rel.relation_stereotype.name,
                                        title: rel.relation_stereotype_id,
                                        options: [{
                                            label: relationName,
                                            value: rel.id
                                        }]
                                    }) 
                                } else {
                                    const relIdx = filteredRelations[index][groupRelIndex].options.findIndex(item => {
                                        return item.value === rel.id
                                    })

                                    if (relIdx < 0) {
                                        filteredRelations[index][groupRelIndex].options.push({
                                            label: relationName,
                                            value: rel.id
                                        })
                                    }
                                }
                            } else {
                                const groupRelIndex = filteredRelations[index].findIndex(item => {
                                    return item.title === 0
                                })
                                
                                if (groupRelIndex < 0) {
                                    filteredRelations[index].push({
                                        label: 'Без стереотипа',
                                        title: 0,
                                        options: [{
                                            label: relationName,
                                            value: rel.id
                                        }]
                                    }) 
                                } else {
                                    const relIdx = filteredRelations[index][groupRelIndex].options.findIndex(item => {
                                        return item.value === rel.id
                                    })

                                    if (relIdx < 0) {
                                        filteredRelations[index][groupRelIndex].options.push({
                                            label: relationName,
                                            value: rel.id
                                        })
                                    }
                                }
                            }
                        }

                        if (item.id) {
                            if (item.id === rel.id) {
                                console.log('current rel', rel)
    
                                getRelationOptions({ 
                                    rel, 
                                    index, 
                                    filteredRelatedObjects,
                                    direction: 'right',
                                    objectIds: objectSettings.objectIds
                                })
                            } else if (rel.original_id === item.id) {
                                console.log('linked to original rel', rel)
                                
                                if (objectSettings?.objectIds?.length > 0) {
                                    const objectClassIds = objectSettings.objectIds.map(id => {
                                        return getObjectByIndex('id', id).class_id
                                    })

                                    console.log('objectIds', objectSettings?.objectIds)

                                    const isLeft = objectClassIds.includes(rel.left_class_id)
                                    const isRight = objectClassIds.includes(rel.right_class_id)

                                    // if (isLeft || isRight) {
                                    if (isLeft) {
                                        getRelationOptions({ 
                                            rel, 
                                            index, 
                                            filteredRelatedObjects,
                                            direction: 'right',
                                            objectIds: objectSettings.objectIds
                                        })
                                    }

                                    if (isRight) {
                                        getRelationOptions({ 
                                            rel, 
                                            index, 
                                            filteredRelatedObjects,
                                            direction: 'left',
                                            objectIds: objectSettings.objectIds
                                        })
                                    }
                                    // }
                                } else {
                                    getRelationOptions({ 
                                        rel, 
                                        index, 
                                        filteredRelatedObjects,
                                        direction: 'right',
                                        objectIds: objectSettings.objectIds
                                    })
                                }
                            }

                        } 
                    }

                })
            }
        })

        return {
            relations: filteredRelations
                .map(arr => {
                    return sortGroupedList(arr)
                }),
            stereo: filteredStereo
                .map(arr => {
                    return arr.sort((a, b) => a.label.localeCompare(b.label))
                }),
            relatedObjects: filteredRelatedObjects
                .map(arr => {
                    return sortGroupedList(arr)
                }),
        }
    }, [
        relations,
        relationSettings,
        objectSettings,
    ])

    return {
        relationList: lists.relations,
        relationStereoList: lists.stereo,
        relatedObjectList: lists.relatedObjects
    }
}

const getRelationOptions = ({
    rel,
    index,
    filteredRelatedObjects,
    direction,
    objectIds = []
}: {
    rel: IRelation,
    index: number,
    filteredRelatedObjects: IOptionList[][]
    direction: 'left' | 'right'
    objectIds?: number[]
}) => {
    const source = direction === 'left' 
        ? 'right'
        : 'left' 

    const relatedToObjects = useObjectsStore.getState()
        .getByIndex('class_id', rel[`${direction}_class_id`])
                 
    // console.log('objectIds', objectIds)
    // console.log('targetObjects', relatedToObjects)

    if (!filteredRelatedObjects[index]) {
        filteredRelatedObjects[index] = []
    }
    
    const relIdx = filteredRelatedObjects[index].findIndex(item => {
        return item.title === rel.id
    })
    const relationName = rel.virtual
        ? `${rel.left_class.name} -> ${rel.right_class.name}`
        : rel.name

    if (relIdx < 0) {
        filteredRelatedObjects[index].push({
            title: rel.id,
            label: relationName,
            options: []
        })

        const lastIndex = filteredRelatedObjects[index].length - 1

        relatedToObjects.forEach((obj) => {
            if (
                objectIds.length > 0
                    ? obj[`links_where_${direction}`]
                        .findIndex(link => objectIds.includes(link[`${source}_object_id`])) >= 0
                    : true
            ) {
                filteredRelatedObjects[index][lastIndex].options.push({
                    label: obj.name,
                    value: obj.id
                })
            }

            /* filteredRelatedObjects[index][lastIndex].options.push({
                label: obj.name,
                value: obj.id
            }) */
        })
    } else {
        relatedToObjects.forEach((obj) => {
            if (
                objectIds.length > 0
                    ? obj[`links_where_${direction}`]
                        .findIndex(link => objectIds.includes(link[`${source}_object_id`])) >= 0
                    : true
            ) {
                filteredRelatedObjects[index][relIdx].options.push({
                    label: obj.name,
                    value: obj.id
                })
            }
            /* filteredRelatedObjects[index][relIdx].options.push({
                label: obj.name,
                value: obj.id
            }) */
        })
    }
}
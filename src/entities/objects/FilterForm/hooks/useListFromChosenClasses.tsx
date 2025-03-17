import { useMemo } from 'react'
import { defaultFormValues, sortGroupedList } from '../utils'
import { IFilterFormProps, IOptionList } from '../types'
import { selectObjectByIndex, selectObjects, useObjectsStore } from '@shared/stores/objects'
import { selectClassByIndex, useClassesStore } from '@shared/stores/classes'
import { selectRelations, useRelationsStore } from '@shared/stores/relations'
import { IClass } from '@shared/types/classes'
import { PACKAGE_AREA } from '@shared/config/entities/package'
import { selectAttributeStereotype, useAttributeStereotypesStore } from '@shared/stores/attributeStereotypes/useAttributeStereotypesStore'
import { selectAttributes, useAttributesStore } from '@shared/stores/attributes'
import { IAttribute } from '@shared/types/attributes'
import { IObject } from '@shared/types/objects'
import { useGetObjects } from '@shared/hooks/useGetObjects'

export type IListFromChosenClassesHook = (props: Partial<IFilterFormProps>) => {
    objectOptionsList: IOptionList[],
    attributeOptionsList: IOptionList[]
}

export const useListFromChosenClasses: IListFromChosenClassesHook = (props) => {
    const { classFilter } = props ?? {}
    const { 
        classIds,
        stereotypeClassIds,
        abstractClassIds,
    } = classFilter ?? {}
    
    const relations = useRelationsStore(selectRelations)
    // const storeObjects = useObjectsStore(selectObjects)
    const storeObjects = useGetObjects()
    const getClassByIndex = useClassesStore(selectClassByIndex)
    const getByStereotype = useClassesStore(st => st.getByStereotype)
    const getObjectByIndex = useObjectsStore(selectObjectByIndex)
    const getAttributeStereotypeById = useAttributeStereotypesStore(selectAttributeStereotype)

    const allAttributes = useAttributesStore(selectAttributes)

    const getGroupClasses = ({ 
        group, id 
    }: {
        group: keyof IFilterFormProps['classFilter'], 
        id: number
    }) => {
        switch (group) {
            case 'abstractClassIds': {
                const result: IClass[] = []

                relations.forEach(relation => {
                    if ([
                        relation.right_class_id === id,
                        relation.relation_type === 'generalization' 
                    ].every(Boolean)) {
                        result.push(getClassByIndex('id', relation.left_class_id))
                    }
                })

                return result
            }
            case 'classIds': {
                const currentClass = getClassByIndex('id', id)

                return [currentClass]
            }
            case 'stereotypeClassIds': {
                return getByStereotype(id)
            }
        }
    }
    
    const chosenClassesList = useMemo<IClass[]>(() => {
        const resultSet = new Set<number>()
        const result: IClass[] = []

        let key: keyof typeof defaultFormValues.classFilter

        for (key in defaultFormValues.classFilter) {
            const idsArray = classFilter?.[key] ?? defaultFormValues.classFilter[key]

            if (idsArray && idsArray.length > 0 ) {
                idsArray.forEach(id => {
                    const currentClasses = getGroupClasses({ 
                        group: key, 
                        id 
                    })
                    
                    currentClasses.forEach(currentClass => {
                        if (!resultSet.has(currentClass.id)) {
                            result.push(currentClass)
                            resultSet.add(currentClass.id)
                        }
                    })
                })
            }
        }

        return result
    }, [
        classIds,
        stereotypeClassIds,
        abstractClassIds,
    ])

    const objectOptionsList = useMemo<IOptionList[]>(() => {
        const defaultAcc: IOptionList[] = []
        const resultObjectsSet = new Set<number>()
        const objectsToShow = chosenClassesList.length > 0
            ? chosenClassesList
                .reduce((acc, currentClass) => {
                    const objects = getObjectByIndex('class_id', currentClass.id)

                    objects.forEach(object => {
                        if (!resultObjectsSet.has(object.id)) {

                            resultObjectsSet.add(object.id)

                            acc.push(object)
                        }
                    })
                    
                    return acc
                                
                }, [] as IObject[])
            : storeObjects
                .reduce((acc, object) => {
                    if (object.class.package_id === PACKAGE_AREA.SUBJECT) {
                        if (!resultObjectsSet.has(object.id)) {
                            resultObjectsSet.add(object.id)

                            acc.push(object)
                        }
                    }

                    return acc
                }, [] as IObject[])

        const result: IOptionList[] = objectsToShow
            .reduce((acc, object) => {
                const idx = acc.findIndex(group => group?.title === object.class_id)

                if (idx < 0) {
                    acc.push({
                        label: object.class.name,
                        title: object.class_id,
                        options: [{
                            label: object.name,
                            value: object.id
                        }]
                    })                    
                } else {
                    acc[idx].options.push({
                        label: object.name,
                        value: object.id
                    })
                }

                return acc
            }, defaultAcc)

        return sortGroupedList(result)
    }, [
        chosenClassesList
    ])

    const attributeOptionsList = useMemo<IOptionList[]>(() => {
        const result: IOptionList[] = []

        const chosenClassesAttributes = chosenClassesList.length > 0
            ? chosenClassesList
            // ? Object.values(chosenClassesList)
                .reduce((acc, currentClass) => {
                    currentClass.attributes.forEach(attr => {
                        const idx = acc.findIndex(clsAttr => clsAttr.id === attr.id)

                        if (idx < 0) {
                            acc.push(attr)
                        }
                            
                    })

                    return acc
                }, [] as IAttribute[])
            : allAttributes

        chosenClassesAttributes.forEach(attr => {
            if (attr.package_id === PACKAGE_AREA.SUBJECT) {
                if (attr.attribute_stereotype_id) {
                    const stereo = getAttributeStereotypeById(attr.attribute_stereotype_id)
                    const idx = result.findIndex(group => group?.title === attr.attribute_stereotype_id)

                    if (idx < 0) {

                        result.push({
                            label: stereo?.name ?? 
                                `Стереотип id[${attr.attribute_stereotype_id}]`,
                            title: attr.attribute_stereotype_id,
                            options: [],
                        })

                        const attrIdx = result[result.length - 1].options
                            .findIndex(option => option.value === attr.id)

                        if (attrIdx < 0) {
                            result[result.length - 1].options.push({
                                label: attr.name,
                                value: attr.id
                            })
                        }

                        
                    } else {
                        const attrIdx = result[idx].options.findIndex(option => option.value === attr.id)

                        if (attrIdx < 0) {
                            result[idx].options.push({
                                label: attr.name,
                                value: attr.id
                            })
                        }
                    }
                } else {
                    const idx = result.findIndex(group => group?.title === 0)

                    if (idx < 0) {
                        result.push({
                            label: 'Без стереотипа',
                            title: 0,
                            options: []
                        })
                        
                        const attrIdx = result[result.length - 1].options
                            .findIndex(option => option.value === attr.id)

                        if (attrIdx < 0) {
                            result[result.length - 1].options.push({
                                value: attr.id,
                                label: attr.name
                            })
                        }

                    } else {
                        const attrIdx = result[idx].options
                            .findIndex(option => option.value === attr.id)

                        if (attrIdx < 0) {
                            result[idx].options.push({
                                label: attr.name,
                                value: attr.id
                            })
                        }
                    }
                }
            }
        })

        return sortGroupedList(result)
    }, [
        chosenClassesList
    ])

    return {
        objectOptionsList,
        attributeOptionsList
    }
}
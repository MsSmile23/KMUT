import { IRelation, IRelationsByTypeArrayItem, RelationWithDirect, relationTypesLeft, relationTypesRight } from '@shared/types/relations'
import { ILink, ILinkField } from '@shared/types/links'
import { SERVICES_OBJECTS } from '@shared/api/Objects'
import { SERVICES_RELATIONS } from '@shared/api/Relations'
import { getClassFromClassesStore } from './common'
import { IObject } from '@shared/types/objects'

export const getRelationName = (relation: IRelation) => {
    if (relationTypesLeft.includes(relation.relation_type)) {
        return relation.name || getClassFromClassesStore(relation.right_class_id)?.name || relation.id
    }

    if (relationTypesRight.includes(relation.relation_type)) {
        return relation.name || getClassFromClassesStore(relation.left_class_id)?.name || relation.id
    }

    return relation.id
}

export const getRelationProps = (relation: RelationWithDirect, objectClassId?: number) => {

    //*Если связь плоская(ассоциация), то определяем по переданному классу объекта
    if (relation.relation_type == 'association' && objectClassId) {
        const rel = relation.left_class_id == objectClassId ? 
            {
                classId: relation.right_class_id,
                multiplicity_left: relation.right_multiplicity_left,
                multiplicity_right: relation.right_multiplicity_right ?? Infinity,
                name: relation.name || getClassFromClassesStore(relation.right_class_id)?.name || relation.id,
                dirType: 'left',
                direction: relation.direction, 
                className: getClassFromClassesStore(relation.right_class_id)?.name,
                anonym: getClassFromClassesStore(relation.right_class_id)?.has_anonymous_objects,
            }
            : {
                classId: relation.left_class_id,
                multiplicity_left: relation.left_multiplicity_left,
                multiplicity_right: relation.left_multiplicity_right ?? Infinity,
                name: relation.name ||  getClassFromClassesStore(relation.left_class_id)?.name || relation.id,
                dirType: 'right',
                direction: relation.direction,
                className: getClassFromClassesStore(relation.left_class_id)?.name,
                anonym: getClassFromClassesStore(relation.left_class_id)?.has_anonymous_objects,
            }


        return rel
    }

    //Объект является левым в связи (вяжется он, он источник - ассоциации, зависимости)
    if (relation.direction == 'up' || (relationTypesLeft.includes(relation.relation_type)) ) {
        return {
            classId: relation.right_class_id,
            multiplicity_left: relation.right_multiplicity_left,
            multiplicity_right: relation.right_multiplicity_right ?? Infinity,
            name: relation.name || getClassFromClassesStore(relation.right_class_id)?.name || relation.id,
            dirType: 'left',
            direction: relation.direction, 
            className: getClassFromClassesStore(relation.right_class_id)?.name,
            anonym: getClassFromClassesStore(relation.right_class_id)?.has_anonymous_objects,

        }
    }

    //Объект является правым в связи (вяжутся к нему, он цель - агрегации, композиции)
    if (relation.direction == 'down' || relationTypesRight.includes(relation.relation_type)) {
        return {
            classId: relation.left_class_id,
            multiplicity_left: relation.left_multiplicity_left,
            multiplicity_right: relation.left_multiplicity_right ?? Infinity,
            name: relation.name ||  getClassFromClassesStore(relation.left_class_id)?.name || relation.id,
            dirType: 'right',
            direction: relation.direction,
            className: getClassFromClassesStore(relation.left_class_id)?.name,
            anonym: getClassFromClassesStore(relation.left_class_id)?.has_anonymous_objects,
        }
    }

    return {
        classId: relation.left_class_id,
        className: getClassFromClassesStore(relation.left_class_id)?.name,
        multiplicity_left: 0,
        multiplicity_right: Infinity,
        name: relation.name || relation.id,
        dirType: undefined,
        direction: null
    }
}

export const getLinksFields =  async (
    relation: IRelation,
    links: ILink[] = [],
    objectFromStore?: any, 
    objectsNotInStore?: IObject[]) => {
  


    //todo сделать пропсы через объект
    // const linkFields: ILinkField[] = []
    const relationProps = getRelationProps(relation)

    const getLinkValue = (link: ILink) => {

        if (relationProps.dirType == 'left') {
            return link.right_object_id
        }

        if (relationProps.dirType == 'right') {
            return link.left_object_id
        }

        return null
    }

    interface ResultObject {
        data: object
    }

    const getObjById = async (link?: ILink): Promise<ResultObject | object | null> => {
        try {
            if (!link) {
                // If link is not provided, return null immediately
                return null
            }

            const obj = await SERVICES_OBJECTS.Models.getObjectById(getLinkValue(link))
            const object = { data: obj.data }

            return object
        } catch (error) {
            console.error(error)

            return null
        }
    }

    const generateLinkField = async (i: number, link?: ILink | undefined): Promise<ILinkField> => {
        let object: any
    

        if (link.objectId !== undefined) {
            const objectId = link.objectId == link.right_object_id ? link.left_object_id : link.right_object_id

            //*Ищем объект либо в сторе объектов, либо в объектах, полученных внутри формы линков
            // const obj = await SERVICES_OBJECTS.Models.getObjectById(objectId)
            const localObject = objectFromStore('id', objectId) ||  objectsNotInStore.find(item => item.id == objectId)

            object = { data: localObject }
            // object = objectFromStore('id', objectId)
        }
        else {
            
            // object = await getObjById(link)
            object =  { data: objectFromStore('id', getLinkValue(link))  
                ||  objectsNotInStore.find(item => item.id == getLinkValue(link)) }
        }


     
        const num = i + 1


        const output: ILinkField = {
            id: link?.id ?? 0,
            value: link ? getLinkValue(link) : null,
            name: `${relation.id}_${i}`,
            relation_id: relation.id,
            relation: relation,
            isDeletable: !(num <= relationProps.multiplicity_left),
            isNextAddable: num < relationProps.multiplicity_right,
            isRequired: num <= relationProps.multiplicity_left,
            num: num,
            object: object ? object : null,
            originRelation: relation?.original,
            direction: relationProps.direction,
            classId: object?.data.class_id,
            order: link?.order 
        }

        return output
    }

    async function processLinks(links: ILink[]): Promise<ILinkField[]> {
        const linkFields: ILinkField[] = []

        /*
        linkFields.push(await generateLinkField(0));

        for (let i = 0; i < relationProps.multiplicity_left; i++) {
            linkFields.push(await generateLinkField(i));
        }

         */

        //Замешиваем линки - заполняем поля и создаём новые если надо
        const newElements = await Promise.all(
            links.map(async (link, index) => {
                // console.log('LINK2', link)

                if (linkFields[index]) {
                    try {
                        return await generateLinkField(index, link)
                    } catch (error) {
                        console.error(error)
                    }
                } else {
                    try {
                        return await generateLinkField(linkFields.length, link)
                    } catch (error) {
                        console.error(error)
                    }
                }
            })
        )

        linkFields.push(...newElements)

        
        return linkFields
    }

    const processedLinkFields: ILinkField[] = await processLinks(links)



    return processedLinkFields
}

export const getRelationsForObjectForm = async (classId: number, all?: boolean, relations?: IRelation[]) => {
    const relationsByTypes =
     await SERVICES_RELATIONS.Services.getRelationsByClassGroupByType(
         { classId: classId, allRelations: all, relations: relations }
     )
    const relationTypes = relationsByTypes
    const filteredRelations: IRelationsByTypeArrayItem[] = []
    const originIds: number[] = []

 
    const notOriginRelations:  RelationWithDirect[] = []

    relationTypes.forEach((relType) => {
        const localRelations:  RelationWithDirect[] = []

        relType.relations.forEach((item) => {
    

            if (item.original !== null) {
                if (originIds.includes(item.original_id) == false) {
                  
                    localRelations.push({
                        direction: item?.direction,

                        // left_class: item.left_class,
                        // right_class: item.right_class,
                        // left_class_id: item.left_class_id,
                        // right_class_id: item.right_class_id,

                        ...item.original })
                    originIds.push(item.original_id)
                }
                notOriginRelations.push(item)
            } else {
                if (
                    originIds.includes(item.id) == false &&
                    relType.type !== 'generalization' &&
                    getClassFromClassesStore(item.right_class_id)?.is_abstract !== true &&
                    getClassFromClassesStore(item.left_class_id)?.is_abstract !== true
                ) {

          
                    localRelations.push(item)
                    
                }
            }
        })
        

      
        filteredRelations.push({ type: relType.type, relations: localRelations })
    })

    const result = { relationTypes: filteredRelations, virtualRelations: notOriginRelations }

   

    return result
}

export const getRelationsForConstructor = (relations: IRelation[]) => {
    return relations.filter((relation) => relation.virtual !== true)
}
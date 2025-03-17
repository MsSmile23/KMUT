import { getRelations } from '../../Models/getRelations/getRelations'
import {
    IRelation,
    IRelationsByTypeArrayItem,
    IRelationTypes,
    relationsTypes,
    relationTypesLeft,
    relationTypesRight,
    RelationWithDirect,
} from '@shared/types/relations'
import { IApiReturn } from '@shared/lib/ApiSPA'
import { IClass } from '@shared/types/classes'
import { ConsoleSqlOutlined } from '@ant-design/icons'
import { selectRelations, useRelationsStore } from '@shared/stores/relations'

interface ILocalPayload {
    classId: IClass['id']
    allRelations?: boolean
    relations?: IRelation[]
}

export const getRelationsByClassGroupByType = async ({
    classId,
    allRelations = false,
    relations,
}: ILocalPayload): Promise<IRelationsByTypeArrayItem[]> => {
    const response = relations ? relations : (await getRelations({ all: true }))?.data ?? []

    const newData: { type: IRelationTypes; relations: RelationWithDirect[] }[] = [
        { type: relationsTypes.association, relations: [] },
        { type: relationsTypes.aggregation, relations: [] },
        { type: relationsTypes.composition, relations: [] },
        { type: relationsTypes.generalization, relations: [] },
        { type: relationsTypes.dependency, relations: [] },
    ]
    //down
    // То есть это
    // - агрегация и композиция где класс объекта является правым (целевым)
    // - ассоциация где класс объекта является левым (источником)

    //up
    //     - агрегация и композиция где класс объекта является ЛЕВЫМ (источником)
    // - ассоциация где класс объекта является Правым (целевым)

    if (allRelations) {
        const data = response?.filter((item) => item.left_class_id == classId || item.right_class_id == classId)

        data.forEach((relation) => {
            const index = newData.findIndex((item) => item.type == relation.relation_type)

            if (
                (relationTypesRight.includes(relation.relation_type) && relation.right_class_id == classId) ||
                (relation.relation_type == 'association' && relation.left_class_id == classId)
            ) {
                newData[index].relations.push({ direction: 'down', ...relation })
            }

            if (
                (relationTypesRight.includes(relation.relation_type) && relation.left_class_id == classId) ||
                (relation.relation_type == 'association' && relation.right_class_id == classId)
            ) {
                newData[index].relations.push({ direction: 'up', ...relation })
            }
        })
    } else {
        if (response) {
            response.map((relation) => {
                if (relationTypesLeft.includes(relation.relation_type) && relation.left_class_id == classId) {
                    const index = newData.findIndex((item) => item.type == relation.relation_type)

                    newData[index].relations.push({ direction: 'down', ...relation })

                    return relation
                }

                if (relationTypesRight.includes(relation.relation_type) && relation.right_class_id == classId) {
                    const index = newData.findIndex((item) => item.type == relation.relation_type)

                    newData[index].relations.push({ direction: 'down', ...relation })

                    return relation
                }

                return relation
            })
        }
    }

   
    return newData
    // data: newData
}
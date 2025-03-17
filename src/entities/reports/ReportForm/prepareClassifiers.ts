import { IRelation } from '@shared/types/relations'
import { getClassFromClassesStore } from '@shared/utils/common'
import { getRelationProps } from '@shared/utils/relations'

// todo: удалить? осталось от предыдущей формы с поиском классификаторов
export const prepareClassifiers = (relations: IRelation[], classesIds: number[]) => {
    const tempClassifiers: Record<number, { id: number, name: string, children: any[] }> = {
        0: {
            id: 0,
            name: 'Тип объекта',
            children: []
        }
    }

    relations.map((relationItem) => {
        if (relationItem.relation_type === 'association' && classesIds.includes(relationItem.left_class_id)) {
            const { classId, name } = getRelationProps(relationItem)
            const classTypeIdx = tempClassifiers['0'].children.findIndex(child => child.id === classId)

            if (classTypeIdx < 0) {
                tempClassifiers['0'].children.push({
                    id: classId,
                    name: getClassFromClassesStore(relationItem.right_class_id)?.name,
                })
            }

            if (!tempClassifiers[classId]) {
                tempClassifiers[classId] = {
                    id: relationItem.id,
                    name: `${name}`,
                    children: []
                }
            }
        }
    })

    return Object.values(tempClassifiers).filter((clf) => clf.children.length > 0)
}
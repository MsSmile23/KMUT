//*Функция для добавление объекта и , при необходимости, рекурсивного прохода по связанным объектам

import { ILink } from '@shared/types/links'
import { IObject } from '@shared/types/objects'

export const addObjectToTreeArray = ({
    links,
    objects,
    directionObjectId,
    parentId,
    array,
    createDataForTree,
}: {
    links: ILink[]
    objects: IObject[]
    directionObjectId: 'right_object_id' | 'left_object_id'
    parentId?: number
    array: IObjectsForTree[]
    createDataForTree: (obj: IObject, array: IObjectsForTree[], parentObjId?: number) => void
}) => {
    if (links?.length > 0) {
        links.forEach((item) => {
            const object = objects.find((ob) => ob.id == item[directionObjectId])

            if (array.find((it) => it.id == object.id) == undefined) {
                createDataForTree(object, array, parentId)
            }
        })
    }
}

export interface IObjectsForTree extends IObject {
    parentObjId?: number
}
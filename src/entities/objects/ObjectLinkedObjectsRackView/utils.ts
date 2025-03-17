import { IObject } from '@shared/types/objects'
import { IChildObjectWithPaths } from '@shared/utils/objects'

export const groupByPath = ({ data, find }: { 
    data: IChildObjectWithPaths[], 
    find: (id: number) => IObject
}) => {
    return data.reduce((acc, element) => {
        const object = find(element.id)
        const key = element?.paths?.parentsStr
        const section = acc?.[key]

        if (section) {
            acc[key] = {
                ...section,
                objects: [ ...section.objects, object ] 
            }

            return acc
        }

        acc[key] = {
            name: element?.paths?.visibleArr.map((el) => el.name).join(', '), 
            objects: [ object ] 
        }

        return acc
    }, {} as Record<string, { name: string, objects: IObject[] }>)
}

export const findAttributeValue = (obj: IObject, attributeId?: number): number | string | null => {
    return obj?.object_attributes.find((oa) => oa.attribute_id === attributeId)?.attribute_value
}

export const createEmptyUnits = (size?: number) => new Array(size || 0).fill(null).map((_, i) => i + 1)
import { IObjectAttribute } from '@shared/types/objects';
import { IAttribute } from '@shared/types/attributes';
import { IClass } from '@shared/types/classes';
import { getByIndexes } from '@shared/lib/MLKit/MLKit';



type TGetAttributesByClassesProps = {
    //Массив id классов по которым нужно получить атрибуты
    classesIds: IClass['id'][],
    //Массив атрибутов
    attributes: IAttribute[],
    //Кросс объект id классов в ключах, индекс атрибута в значениях
    mapClassAttributes?: Record<IClass['id'], number[]>
}
/**
 * Функция получения атрибутов по классам
 * @param classesIds Массив id классов по которым нужно получить атрибуты
 * @param attributes Массив атрибутов
 * @param mapClassAttributes (Опционально) Кросс объект id классов в ключах, индекс атрибута в значениях
 */
export const getAttributesByClasses = async ({
    classesIds = [],
    attributes,
    mapClassAttributes
}: TGetAttributesByClassesProps): Promise<TUMLReturn<IAttribute[]>> => {
    try {
        if (classesIds?.length > 1) {
            const classesIdsSet = new Set(classesIds)
            const filteredAttributes =
                (mapClassAttributes)
                    ? classesIds
                        .flatMap(classId => getByIndexes<IAttribute[]>(mapClassAttributes[classId], attributes))
                    : attributes
                        .filter( attribute => { attribute.classes_ids.some( id => classesIdsSet.has(id))})

            return {
                success: true,
                data: Array.from(new Set(filteredAttributes))
            }
        }

        return {
            success: true,
            data: attributes
        }
    } catch (error) {
        return {
            success: false,
            data: [],
            message: error
        }
    }
}


const attributesBindData = [
    { mnemo: 'contour', label: 'Контур на карте' },
] as const

const attributesMnemos = attributesBindData.map(item => item.mnemo) as const

type TAttributeBindMnemos = attributesMnemos

type TAttributesBind = Record<attributesMnemos, {id: number} | {stereotype_id: number} >

/**
 * Функция получения id атрибута из объекта attributesBind
 * @param attributesBind
 * @param mnemo
 * @param attributes
 * @constructor
 */

export const MLKitGetAttributeBindId = ({
    attributesBind,
    mnemo,
    attributes
}: {
    attributesBind: TAttributesBind,
    mnemo: TAttributeBindMnemos
    attributes?: IAttribute[]
}): IAttribute['id'] | undefined => {
    const searchData = attributesBind?.[mnemo]

    if (searchData?.id) { return searchData.id }

    if (searchData?.stereotype_id) {
        return
        attributes
            .find(item => item.attribute_stereotype_id == searchData?.stereotype_id)
            ?.id
    }

    return undefined
}

/**
 * Функция получения значения конкретного атрибута объекта
 * @param attribute_id
 * @param object_attributes
 * @constructor
 */

export const MLKitGetAttributeValue = ({
    attribute_id,
    object_attributes,
}) => {
    return object_attributes.find((oa) => oa?.attribute_id === id)?.attribute_value
}
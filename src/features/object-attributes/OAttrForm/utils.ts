import { IAttrData } from '@features/object-attributes/OAttrForm/OAttrForm'
import { IDataType } from '@shared/types/data-types'

export const getAttributeFieldProps = (
    attributeObject: IAttrData,
    dataType: IDataType,
    index: number,
    classId?: number | string
) => {
    const inner_type = dataType?.inner_type ?? 'integer'
    const i = index

    const classAttributeInitialValue = attributeObject?.classes_ids?.find((cl) => cl?.id == classId)?.initial_value
    const classAttributeStaticFuture = attributeObject?.classes_ids?.find((cl) => cl?.id == classId)?.static_feature


    return {
        rules: [
            {
                required: i <= attributeObject.minAmount && inner_type !== 'boolean',
                message: 'Обязательное поле',
            },
        ],
        id: attributeObject?.objectAttributes ? attributeObject?.objectAttributes[i - 1]?.id : null,
        inner_type: inner_type,
        initialValue:
            classAttributeInitialValue ||
            classAttributeStaticFuture ||
            attributeObject.initial_value ||
            attributeObject.static_feature ||
            undefined,
        valuePropName: inner_type === 'boolean' ? 'checked' : undefined,
        name: attributeObject.id + '-' + i,
        isDeletable: attributeObject.currentAmount == i && i !== 1,
        isNextAddable: i < attributeObject.maxAmount && attributeObject.currentAmount == i,
        isLast: i == attributeObject.currentAmount,
        isButtons:
            attributeObject.currentAmount > 1 || (i < attributeObject.maxAmount && i == attributeObject.currentAmount),
        description: attributeObject?.description
            ? attributeObject?.description
            : attributeObject?.attribute_stereotype?.description
                ? attributeObject?.attribute_stereotype?.description
                : attributeObject?.data_type?.description,
    }
}
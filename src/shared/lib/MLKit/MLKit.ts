import { IObjectAttribute } from '@shared/types/objects';
import { TMLObjectAttributeBindProps, TMLReturn } from '@shared/lib/MLKit/types';
import { IAttribute } from '@shared/types/attributes';
import { jsonParseAsObject } from '@shared/utils/common';
import { useObjectsStore } from '@shared/stores/objects';

/**
 * Получение атрибута объекта по привязке (bind)
 * @param bindObject
 * @param objectAttributes
 */

type TMLGetObjectAttributeByBindProps = {
    objectAttributeBindProps: TMLObjectAttributeBindProps,
    objectAttributes: IObjectAttribute[]
}

export const MLGetObjectAttributeByBind = ({
    objectAttributeBindProps,
    objectAttributes,
}: TMLGetObjectAttributeByBindProps): TMLReturn<IObjectAttribute | undefined> => {

    if (objectAttributeBindProps.attribute_id) {
        return generateOutput<IObjectAttribute | undefined>(
            objectAttributes
                .find(item => item.attribute_id === objectAttributeBindProps.attribute_id)
        )
    }

    if (objectAttributeBindProps.stereotype_id) {
        return generateOutput<IObjectAttribute | undefined>(
            objectAttributes
                .find(item => item.attribute.attribute_stereotype_id === objectAttributeBindProps.stereotype_id)
        )
    }

    if (objectAttributeBindProps.mnemo) {
        return generateOutput<IObjectAttribute | undefined>(
            objectAttributes
                ?.find(item => item.attribute?.attribute_stereotype?.mnemo === objectAttributeBindProps.mnemo)
        )
    }

    return generateOutput<IObjectAttribute | undefined>(undefined)
}

export const findObjAtrValueByMnemo = (mnemo: string, objAtrs: IObjectAttribute[]) => {
    const objAtr = MLGetObjectAttributeByBind({
        objectAttributeBindProps: {
            mnemo: mnemo
        },
        objectAttributes: objAtrs
    })

    return objAtr?.data?.attribute_value
}

//Вспомогательные функции
const getByIndexes = <T>(indexes, arr): T => {
    return indexes.map(indx => arr[indx])
}

const generateOutput = <T>(result: T): TMLReturn<T> => {
    if (result) {
        return {
            success: true,
            data: result
        }
    }

    return {
        success: false,
        data: undefined,
        message: 'Сущность не найдена'
    }
}

// TODO: Сделать на вход один объект с ключами oa, attribute
export const getOAValue = ({ oa, attribute }: {
    oa: Partial<IObjectAttribute>
    attribute?: IAttribute
}) => { 
    let value_converter;

    if (oa.attribute) {
        value_converter = jsonParseAsObject(oa.attribute.view_type?.params)?.value_converter
    } else {
        value_converter = jsonParseAsObject(attribute?.view_type?.params)?.value_converter
    }
    const currentSource = value_converter?.find(item => item.source === oa.attribute_value)
    
    return currentSource?.converted ?? oa?.attribute_value    
}

export const getObjectsAsSelectOptions = (classes_selector = []) => {

    if (classes_selector.length > 0) {
        return classes_selector
            .reduce((accum, current) => {
                const objects = useObjectsStore.getState().getByIndex('class_id', current);
                                    
                return [...accum, ...objects.map(obj => ({ value: obj.id, label: obj.name }))];
            }, [])
    }
    
    return useObjectsStore.getState().store.data
        .map(obj => ({ value: obj.id, label: obj.name }))
}
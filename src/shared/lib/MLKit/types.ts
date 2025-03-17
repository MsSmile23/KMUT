//Получение атрибута объекта по привязке
import { IAttribute } from '@shared/types/attributes';
import { IAttributeStereotype } from '@shared/types/attribute-stereotypes';
import { IObjectAttribute } from '@shared/types/objects';

export type TMLReturn<T> = {
    success: boolean,
    data: T,
    message?: string
}

export type TMLObjectAttributeBindProps = {
    mnemo?: string,
    label?: string,
    attribute_id?: IAttribute['id'],
    stereotype_id?: IAttributeStereotype['id']
}
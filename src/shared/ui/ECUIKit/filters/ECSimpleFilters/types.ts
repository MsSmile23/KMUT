import { IAttribute } from '@shared/types/attributes';
import { IClass } from '@shared/types/classes';
import { IObject } from '@shared/types/objects'

export type ECSimpleFilterCustomFieldProps = { // TODO проработать
    type: string,
}

export type ECSimpleFiltersClassFieldProp = {
    type: 'class',
    class_id: number,
    isMultiSelect?: boolean,
    tagCloud?: boolean,
    defaultValues?: number | number[],
    version?: string,
}
export type ECSimpleFiltersAttributeFieldProp = {
    type: 'attribute',
    attribute_id: number,
    isMultiSelect?: boolean,
    tagCloud?: boolean,
    defaultValues?: number | number[],
    version?: string,
}
export type ECSimpleFiltersDatesFieldProp = {
    type: 'dates',
}
export type ECSimpleFiltersDatesLastFieldProp = {
    type: 'dates_last',
}
export type ECSimpleFiltersUserLoginFieldProp = {
    type: 'user_login',
}

// Передаваемые параметры фильтров
export type ECSimpleFiltersFieldsProps = ECSimpleFiltersClassFieldProp | ECSimpleFiltersAttributeFieldProp
    | ECSimpleFiltersDatesFieldProp | ECSimpleFiltersDatesLastFieldProp | ECSimpleFiltersUserLoginFieldProp

// Объект, возвращаемый фильтрами в onChange/onApplyClick
export type ECSimpleFiltersDTO = {
    objects?: IObject;
    classes: Array<{
        class_id: number,
        values: number[],
    }>;
    attributes: Array<{
        attribute_id: number,
        values: any[], // TODO
    }>
    custom?: Array<{
        type: string,
        value: any,
    }>
}

export type ECSimpleClassForm = {
    type: 'class';
    class: IClass;
    value: number[] | number | null; // object ids
    isMultiSelect?: boolean,
    tagCloud?: boolean,
    defaultValues?: number | number[],
    version?: string,
}
export type ECSimpleAttributeForm = {
    type: 'attribute';
    attribute: IAttribute,
    value: any;
    isMultiSelect?: boolean,
    tagCloud?: boolean,
    defaultValues?: number | number[],
    version?: string,
}
export type ECSimpleDatesForm = {
    type: 'dates';
    value: any; // TODO
}
export type ECSimpleDatesLastForm = {
    type: 'dates_last';
    value: any; // TODO
}
export type ECSimpleUserLoginForm = {
    type: 'user_login';
    value: any; // TODO
}
// Внутненнее поле для стейта формы
export type ECSimpleFormField =
    ECSimpleClassForm | ECSimpleDatesForm | ECSimpleDatesLastForm
    | ECSimpleAttributeForm | ECSimpleUserLoginForm;
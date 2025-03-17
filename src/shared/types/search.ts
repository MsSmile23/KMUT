import { IAttribute } from './attributes';
import { IClass } from './classes';
import { IObject } from './objects';

export interface ISearchResponse {
    object_attributes: Array<Partial<{
        attribute: IAttribute,
        attribute_id: number
        attribute_state_id: number
        attribute_value: string
        id: number
        object: IObject
        object_id: number
    }>>,
    objects: Array<Partial<{
        class: IClass
        class_id: number
        id: number
        name: string
        state_id: number
    }>>
}
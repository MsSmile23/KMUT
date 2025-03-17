import { IAttribute } from './attributes'
import { IClass } from './classes'

export interface IClassAttributes {
    class_id: number
    attributes: number[]
}

export interface IClassesAttributes {
    class_id: number
    attribute_id: number
    virtual: boolean,
    id: number,
    initial_value: any
    static_feature: any,
    order: number,
    class: IClass,
    attribute: IAttribute
}
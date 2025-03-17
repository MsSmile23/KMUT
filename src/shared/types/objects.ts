import { IClass } from '@shared/types/classes'
import { IAttribute } from '@shared/types/attributes'
import { ILink } from '@shared/types/links';
import { IRelation } from './relations';

export interface IObjectAttribute {
    id: number,
    object_id: number | null,
    attribute_id: number | null,
    attribute_value: string | null
    attribute: IAttribute | null
    show?: boolean
}

export interface IObject {
    id: number
    class_id: number
    class: IClass
    name: string,
    object_attributes: IObjectAttribute[]
    links_where_assoc: ILink[]
    links_where_left: ILink[]
    links_where_right: ILink[]
    relation: IRelation
    codename?: string
}

export interface IObjectPost {
    class_id: number
    attributes: {
        attribute_id: number
        attribute_value: any
    }[]
}

export interface IObjectStateHistory {
    object_id: number | null,
    name: string | null,
    series: Array<{
        name: string | number | null,
        data: Array<{
            state_id: number | null,
            time_in: string | number | null,
            time_out: string | number | null,
        }> | null
    }> | null,
}

export interface IObjectNotification {
    id: number,
    class_id: number | null,
    name: 'web' | 'mail' | 'telegram' | string | null,
    class: IClass | null
    object_attributes: IObjectAttribute[] | null
}
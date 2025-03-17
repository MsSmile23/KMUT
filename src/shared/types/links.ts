import { IRelation } from './relations'

export interface ILink {
    id: number
    left_object: {
        id: number
        class_id: number
        name?: string
    }
    left_object_id: number
    right_object: {
        id: number
        class_id: number
        name?: string
    }
    right_object_id: number
    assoc_object: {
        id: number
        class_id: number
    } | null
    assoc_object_id: number | null
    relation_id: number
    relation: IRelation
    name: string

    objectId?: number
    order?: number
}

export interface ILinkPost {
    id?: number,
    left_object_id?: number
    right_object_id?: number
    relation_id: number
    order?: number
}

export interface ILinkField {
    id: number,
    value: number,
    name: string,
    relation_id: IRelation['id'],
    relation: IRelation,
    isDeletable: boolean,
    isNextAddable: boolean,
    isRequired: boolean,
    object?: any,
    num?: number,
    errors?: any,
    originRelation?: IRelation
    direction?: 'down' | 'up',
    classId?: number
    order?: number

}
export interface IAttributesLinks {
    attribute_id: number,
    classes_ids: any
}

import { IClass } from './classes'
import { VISIBILITY } from '@shared/config/const'
import { IDataType } from './data-types'

interface IAttributeStereotype{
    id: number,
    mnemo: string, 
    package_id: number
    description?: string
    name?: string

}
interface IAttributeBase {
    id: number,
    name: string,
    icon: string | null,
    visibility: keyof typeof VISIBILITY,
    multiplicity_left: number,
    multiplicity_right: number,
    attribute_category_id: number,
    data_type_id: number,
    attribute_stereotype_id: number,
    sort_order: number,
    unit: string | null,
    history_to_cache: boolean,
    history_to_db: boolean,
    readonly: boolean,
    package_id: number
    initial_value?: any
    static_feature?: any
    classes_ids?: any[]
    classes?: IClass[]
    view_type_id: number
    data_type: IDataType
    params?: any,
    view_type?: IViewType
    attribute_stereotype: IAttributeStereotype
    codename?: string
    description?: string
}

export interface IAttribute extends Partial<IAttributeBase> {
    secondary_view_type_ids?: number[]
    id: number
    pivot?: {
        attribute_id?: number
        class_id?: number,
        initial_value?: string
        static_feature?: string
        order?: number
    }
}

export interface IAttributeViewType {
    id: number
    type: 'table' | 'chart' | 'default' | 'traceroute' | 'connection_map'
    name: string
    params: string
}

export interface IAttributePost extends Omit<IAttribute, 'id' | 'classes_ids'> {
    classes_ids?: {id: number, status: boolean}[] //Record<number, boolean>
    secondary_view_type_ids?: number[]
    params?: string
}

interface IViewType {
    id: number, 
    name: string,
    type: any,
    params: any
}

export type TAttributeStateRulesFlat = {
    attribute_id: string,
    states: {
        rule: {
            min: number,
            max: number,
            'max-including': boolean
            'min-including': boolean
        }
        color: string
    }[]
}
import { IAttribute } from './attributes'
import { IClass } from './classes'

export const relationsTypes = {
    aggregation: 'aggregation',
    association: 'association',
    composition: 'composition',
    generalization: 'generalization',
    dependency: 'dependency',
} as const

export const relationTypesLeft: Partial<keyof typeof relationsTypes>[]
    = [relationsTypes.association, relationsTypes.generalization, relationsTypes.dependency]
export const relationTypesRight: Partial<keyof typeof relationsTypes>[]
    = [relationsTypes.aggregation, relationsTypes.composition]

export type IRelationTypesKeys = keyof typeof relationsTypes
export type IRelationTypes = typeof relationsTypes[IRelationTypesKeys];
export type IRelationsByType = Record<IRelationTypes, IRelation[]>
export type IRelationsByTypeArrayItem = {type: IRelationTypes, relations: RelationWithDirect[]}


export type RelationWithDirect = IRelation & {
    direction?: 'up' | 'down';
};
export interface IRelation {
    id: number
    left_class_id: number
    right_class_id: number
    assoc_class_id: number
    left_attribute_id: number
    right_attribute_id: number
    relation_stereotype_id: number
    relation_stereotype?: {
        id?: number
        name?: string
        mnemo?: string
    }
    relation_type: keyof typeof relationsTypes
    name: string
    left_multiplicity_right: number
    left_multiplicity_left: number
    right_multiplicity_right: number
    right_multiplicity_left: number
    left_class: IClass
    right_class: IClass
    assoc_class: IClass
    left_attribute: IAttribute
    right_attribute: IAttribute
    virtual: boolean,
    original: IRelation,
    original_id: number
    codename?: string
}

export type TRelations = IRelation[]

export type TGetRelationProps = (relation: IRelation) => {
    classId: number,
    multiplicity_left: number,
    multiplicity_right: number,
    name: string | number,
    dirType: 'left' | 'right',
}
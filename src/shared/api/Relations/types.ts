import { IRelation } from '@shared/types/relations'

type TOmittedRelationFields = 
    | 'id' 
    // | 'relation_stereotype_id'
    | 'left_class'
    | 'right_class'
    | 'assoc_class'
    | 'left_attribute'
    | 'right_attribute'
    | 'virtual'
    | 'original'
    |'original_id'
export type TRelationPayload = Omit<IRelation, TOmittedRelationFields>
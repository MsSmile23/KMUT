import { IRelation } from '@shared/types/relations';

export type FormClassGrouping = {
    type: 'by_class',
    id: string;
    name: string;
}

export type FormRelationGrouping = {
    type: 'by_relation',
    relation: IRelation,
    id: string;
    name: string;
}

export type FormTreeGrouping = FormClassGrouping | FormRelationGrouping;
import { IClass } from '@shared/types/classes';
import { IObject } from '@shared/types/objects';
import { IRelation } from '@shared/types/relations';
import { TreeDataNode } from 'antd';

export type QuickTreeFilter<Options = undefined> = (object: IObject, options?: Options) => boolean;

export interface QuickTreeDataNode extends TreeDataNode {
    children?: QuickTreeDataNode[];
    icon?: IClass['icon'];
    /* unix время в миллисекундах, когда был сделан кэш тэгов */
    
    extra: {
        objectId: number;
        object?: IObject;
        targetClassNode?: boolean;
        cachedTags?: TagCollection;
        expanded?: boolean;
        tagsCachedTime?: number;
        filteredTreeData?: QuickTreeDataNode[];
    }
}

export interface StereotypeTagObject {
    view_params: {
        fill: string,
        color: string,
    }
    stereotype_id: number,
    name: string,
    count: number,
}
export type TagCollection = Record<number, StereotypeTagObject>;

export interface QuickTreeSettings {
    textFilterValue: string;
    horizontalScroll: boolean;
    expandedKeys: string[];
}

export type GroupingOption =
    `r${number}` | // по связи, number = id связи
    'c' // по классам

export type GroupingChainOption =
    {
        type: 'target_class',
    } |
    {
        type: 'by_relation',
        relation: IRelation,
        parent_class_id: number,
    } |
    {
        type: 'by_class',
    }

export type ChainObject =
    {
        type: 'object',
        object: IObject,
        class_id: number,
        id: number,
    } |
    {
        type: 'class',
        class: IClass,
        id: number,
    }
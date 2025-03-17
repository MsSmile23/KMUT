export interface IStatsProps {
    source: 'class' | 'object' | 'none'
    attributeId: number
    sourceObjectId?: number
    sourceClassId?: number
    targetClassId?: number
    targetObjectId?: number
    relationIds?: number[]
    regexp?: { values?: string, indexes?: string }
}

export interface IStatsPayload {
    source: 'class' | 'object' | 'none'
    attribute_id?: number
    source_object_id?: number
    source_class_id?: number
    target_class_id?: number
    target_object_id?: number
    relation_ids?: number[]
    values_props_regexp?: string
    indexes_props_regexp?: string
}

export interface ICheckNetChartPayload extends IStatsPayload {
    rcv_attribute_id: number
    trn_attribute_id: number
    left_bound: number
    right_bound: number
    group_by: 'day' | 'minute' | 'hour'
}

export interface ITopResponseData {
    attribute_id: string
    tops: [
        {
            id: number
            name: string
            value: string
            count: number
        }
    ]
    total: number
}

export interface IIncidentPayload {
    class_id: number
    object_id?: number
    object_ids?: string
}

export interface IIncidentDataItem {
   time: number
   in: number
   up: number
   down: number
}

export type IIncidentData = Record<string, IIncidentDataItem>

export interface IAttributeCountStringsPayload {
    attribute_id: number,
    object_ids: number[],
    start?: string,
    end?: string,
    limit?: number,
    extract?: 'url' | 'host' | 'none',
}

export interface IFrequentFallsPayload {
    object_ids: number[],
    start?: string,
    end?: string,
    limit?: number,
}

export interface IAttributeAggregationPayload extends Omit<IAttributeCountStringsPayload, 'extract'> {
    aggregation: 'count' | 'sum' | 'avg' | 'time',
    condition?: string,
}

export interface IAttributeCountStringsDataItem {
    name: string,
    value: number,
    percentage: number
}

export interface IFrequentFallsData extends IAttributeCountStringsDataItem {
    object: {
        id: number,
        class_id: number,
        name: string,
        codename: string,
        deleted_at: any
    },
}

export interface IAttributeAggregationDataItem extends IAttributeCountStringsDataItem {
    object: {
        id: number,
        class_id: number,
        name: string,
        codename: string,
        deleted_at: null
      },
}
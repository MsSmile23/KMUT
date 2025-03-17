import { dataSourcesML } from '@entities/stats/ValuesHistoryAggregationWidget/prepare';
import { createTimeRange } from '@entities/stats/ValuesHistoryAggregationWidget/createTimeRange';
import {
    TValuesHistoryAggregationFields
} from '@entities/stats/ValuesHistoryAggregationWidget/ValuesHistoryAggregationWidget';

export const createApiRequest = (props: TValuesHistoryAggregationFields) => {

    const source = dataSourcesML?.find((ds) => ds.value === props.dataSource)

    if (!source) {
        return {
            success: false,
            source: undefined,
            payload: undefined,
            error: '',
        }
    }
    let payload: any = {}

    if (props.dataSource == 2) {
        payload = {
            ...createTimeRange(props),
            source_class_id: props.source_class_id, //10104,
            target_class_id: props.target_class_id, //42,
            relation_ids: props.relation_ids, //[20058]
            rcv_attribute_id: props.rcv_attribute_id, //246,
            source: props.source, //'class',
            values_post_regexp: encodeURIComponent(props.values_post_regexp),
            trn_attribute_id: props.trn_attribute_id, //248,
            group_by: props.groupBy, //'day'
        }
    }

    return {
        success: true,
        source: source,
        payload: { ...payload, ...source.payload },
        error: '',
    }
}
import { useAttributesStore } from '@shared/stores/attributes';
import { IAttribute } from '@shared/types/attributes';

export const isHistoryAttr = (attribute: IAttribute) => {
    return  useAttributesStore.getState().getByIndex('id', attribute.id)?.history_to_db
}

export const convertAttributeValue = (attribute: IAttribute, value: any): Array<{
    source: any,
    converted: string
}> => {
    const params = attribute?.view_type?.params

    if (!params) {
        return value
    }

    const data: IAttribute['view_type']['params'] = typeof params === 'string'
        ? JSON.parse(params)
        : params

    return (data?.value_converter || []).find(({ source }) => source === value)?.converted || value
}
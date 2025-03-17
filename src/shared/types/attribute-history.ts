import { IDataType } from '@shared/types/data-types';

export interface IAttributeHistorySerieData {
    integer: [number, number ][]
    float: [number, number ][]
    double: [number, number ][]
    boolean: [number, boolean ][]
    string: [number, string ][]
    jsonb: [number, {value: any}[] ][]
    array: [number, any[] ][]
}

interface IValueConverterItem {
    source: string | number
    order?: string | number
    converted: string
}
export interface IAttributeHistorySerie {
    params: {
        view: {
            type: 'chart' | 'table' | null
            min?: number
            max?: number
            value_converter?: IValueConverterItem[]
            headers?: any[]
        }
    }
    unit?: string
    name?: string
    data_type: IDataType['inner_type']
    //data: [number, string][]
    data: IAttributeHistorySerieData[IAttributeHistorySerie['data_type']]
} 
export interface IAttributeHistory {
    series: IAttributeHistorySerie[]
    name: string
}

export type IAttributeHistoryDateIntervalForGet = [
    string, string
]
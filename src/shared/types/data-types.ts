export interface IDataType {
    id: number
    name: string
    inner_type: InnerType
    history_table: string
    min_val: number
    max_val: number
    check_regexp: string | null
    array_length: number | null
    basic: boolean
    mnemo: string
    description?: string
    params?: {
        formats: IFormats[],
        metrics: IMetrics[],
        postprocessing_types: IFormats['postppostprocessing_type']
    }
}

export type InnerType = 'integer' | 'double' | 'string' | 'boolean' | 'array' | 'jsonb'

interface IFormats {
    label: 'Число' | 'Строка' | 'JSON'
    mnemo: 'double' | 'string' | 'json'
    postppostprocessing_type?: 'postprocessing' | 'regex'
}

interface IMetrics {
    args: Record<TArgsName, IArgsValue>
    format: IFormats['mnemo']
    group: string
    label: string
    mnemo: string
}

type TArgsName = 'ip' | 'name'
interface IArgsValue {
    label: string
    required: boolean
} 
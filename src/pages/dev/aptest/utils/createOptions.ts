import { ColumnType, ColumnsType } from 'antd/es/table/interface'

type TTitleWidth = [string, string | number]
type TColumnType = Omit<ColumnType<any>, 'key' | 'dataIndex'>


export const createColumns = (config: Record<
    string, 
    TTitleWidth | React.ReactElement | string | TColumnType
>): ColumnsType<any> => {
    return Object.entries(config).map(([ key, options ]) => {
        const colKey = { key, dataIndex: key }

        if (['string', 'function'].includes(typeof options)) {
            return { ...colKey, title: options } as ColumnType<any>
        }

        if (Array.isArray(options)) {
            const [ title, width ] = options

            return { ...colKey, title, width } as ColumnType<any>
        }

        return { ...colKey, ...options as object } as ColumnType<any>
    })
}
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from 'react'
import { Table as AntdTable, TableProps } from 'antd'

interface ITable extends TableProps<any> {
    columns: any[]
    rows: any[]
}
export const Table: FC<ITable> = ({ columns, rows, ...props }) => {
    return <AntdTable columns={columns} dataSource={rows} {...props} />
}
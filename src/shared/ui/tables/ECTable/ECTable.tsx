import { Table, TableProps } from 'antd'
import { FC } from 'react'

export const ECTable: FC<TableProps<any>> = (props) => {
    return (
        <Table {...props} />
    )
}
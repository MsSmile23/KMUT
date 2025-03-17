/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from 'react'

import { Table } from '@shared/ui/tables'

interface IAttributeCategoriesTable {
    rows: any[]
    columns: any[]
}
const AttributeCategoriesTable: FC<IAttributeCategoriesTable> = ({ rows, columns }) => {
    return <Table rows={rows} columns={columns} />
}

export default AttributeCategoriesTable
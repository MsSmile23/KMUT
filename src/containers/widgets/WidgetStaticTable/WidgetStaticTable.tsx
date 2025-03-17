import { EditTable } from '@shared/ui/tables/ECTable2/EditTable/EditTable'
import { FC } from 'react'
import { IWidgetStaticTable } from './WidgetStaticTableForm'
import { TWidgetSettings } from '@shared/types/widgets'


const WidgetStaticTable: FC<TWidgetSettings<IWidgetStaticTable>> = (props) => {
    const { settings } = props
    const { widget } = settings

    const columnsData = widget?.rowsData?.[0]?.data?.map((col, index) => ({
        title: col.inputValue,
        dataIndex: `col${index}`,
        key: `col${index}`,
        width: 1000
    })) || []

    const rowsData = widget?.rowsData?.slice(1).map(row => {
        const rowObject = { key: row.id }

        row.data.forEach((cell, index) => {
            const colKey = `col${index}`

            rowObject[colKey] = cell.inputValue
        })
        
        return rowObject
    }) || []

    return (
        <EditTable
            columns={columnsData}
            hideSettingsButton={true}
            sortDirections={['descend', 'ascend']}
            bordered={true}
            tableId="static-table"
            key="static-table"
            rows={rowsData}
            virtual={false}
            rowSelection={undefined}
        />
    )
}

export default WidgetStaticTable
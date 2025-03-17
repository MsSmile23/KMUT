/* eslint-disable */
import { ReportsTableContainer } from '@containers/reports/ReportsTableContainer/ReportTableContainer'
import { FC } from 'react'
import { Card } from 'antd'
import ReportsTableContainer2 from '@containers/reports/ReportTableContainer2/ReportTableContainer2'
import { TWidgetSettings } from '../widget-types'

interface WidgetReportsTableProps {
    tableHeight?: number | string
}
const WidgetReports2: FC<TWidgetSettings<WidgetReportsTableProps>> = (props) => {

    const { settings } = props
    const { widget } = settings

    return (
        <div style={{ width: "100%", overflow: 'auto' }}>
            <ReportsTableContainer2 tableHeight={widget?.tableHeight} />
        </div>
    )
}

export default WidgetReports2

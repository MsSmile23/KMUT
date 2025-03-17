/* eslint-disable */
import { ReportsTableContainer } from '@containers/reports/ReportsTableContainer/ReportTableContainer'
import { TWidgetReports, TReportFormFilters, TTableOptions } from './types/WidgetReports'
import { FC } from 'react'
import { Card } from 'antd'


const WidgetReports: FC<TWidgetReports> = (props) => {
    
    const { settings } = props
    const filters: TReportFormFilters = settings?.widget.filters;
    const tableOptions: TTableOptions = settings?.widget.tableOptions;

    return (
        <div style={{width:"100%", overflow: 'auto'}}>
            <ReportsTableContainer 
                displayReportTableFormInModal={true} 
                filters={filters} 
                tableOptions={tableOptions} 
            />
        </div>
    )
}

export default WidgetReports

import {  ObjectOAttrsWithAggregationTable } from '@containers/object-attributes/ObjectOAttrsWithAggregationTable/ObjectOAttrsWithAggregationTable'
import { FC } from 'react'
import { TWidgetFormSettings } from '../widget-types'
import { WidgetObjectOAttrsWithAggregationTableForm } from './WidgetObjectOAttrsWithAggregationTableForm'
import dayjs, { Dayjs } from 'dayjs'

const WidgetObjectOAttrsWithAggregationTable: FC<
    TWidgetFormSettings<WidgetObjectOAttrsWithAggregationTableForm>
> = (props) => {

    const { settings } = props
    const { widget, vtemplate } = settings
    const { aggregations, objectId, viewType, attributes, period, linkedMetrics } = widget

    const currentObjectId = vtemplate?.objectId || objectId

    const newDates = period?.map(p => {
        return p 
            ? dayjs(p * 1000) 
            : null
    }) as [Dayjs, Dayjs]

    return currentObjectId 
        ? (
            <ObjectOAttrsWithAggregationTable 
                objectId={currentObjectId}
                aggregations={aggregations || ['current']}
                viewType={viewType || 'table'}
                attributes={attributes || []}
                period={newDates}
                linkedMetrics={linkedMetrics?.mode 
                    ? linkedMetrics 
                    : undefined
                }
            />
        ) 
        : (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    fontSize: 18
                }}
            >
                Не выбран объект для отображения виджета
            </div>
        )
}

export default WidgetObjectOAttrsWithAggregationTable
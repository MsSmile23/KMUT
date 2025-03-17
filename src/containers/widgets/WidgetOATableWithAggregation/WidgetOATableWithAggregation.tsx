import { ObjectOAttrsWithAggregationTable } from '@containers/object-attributes/ObjectOAttrsWithAggregationTable/ObjectOAttrsWithAggregationTable'
import { FC } from 'react'
import { TWidgetSettings } from '../widget-types'

interface WidgetOATableWithAggregationProps {
    aggregations: ('current' | 'max' | 'min' | 'average')[],
    viewType: 'table'
}

const WidgetOATableWithAggregation: FC<TWidgetSettings<WidgetOATableWithAggregationProps>> = (props) => {

    const { settings } = props
    const { widget, vtemplate } = settings
    const { aggregations, viewType } = widget

    return (
        <ObjectOAttrsWithAggregationTable 
            objectId={vtemplate?.objectId || undefined}
            // aggregations={['current', 'max', 'min', 'average']}
            aggregations={aggregations || []}
            viewType={viewType || 'table'}
        />
    )
}

export default WidgetOATableWithAggregation
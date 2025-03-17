import { FC } from 'react';
import { TWidgetSettings } from '../widget-types';
import ObjectsWithOAStates from '@entities/objects/ObjectsWithOAStates/ObjectsWithOAStates';


interface IWidgetObjectsWithOAStates {
    objectIds: number[]
    metricAttrIds: number[]
    height?: number
}
const WidgetObjectsWithOAStates: FC<TWidgetSettings<IWidgetObjectsWithOAStates>> = (props) => {

    const { settings } = props
    const { widget } = settings
    //const objectId = settings?.vtemplate?.objectId

    return (
        <ObjectsWithOAStates
            objectIds={widget?.objectIds ?? []}
            metricAttrIds={widget?.metricAttrIds ?? []}
            height={widget?.height}
        />
    )
}

export default WidgetObjectsWithOAStates
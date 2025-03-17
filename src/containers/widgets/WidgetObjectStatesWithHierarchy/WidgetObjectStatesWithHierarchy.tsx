import ObjectStatesWithHierarchy from '@entities/objects/ObjectStatesWithHierarchy/ObjectStatesWithHierarchy'
import { FC } from 'react'
import { TStateFormWidgetObjectStatesWithHierarchyForm } from './WidgetObjectStatesWithHierarchyForm'
import { TWidgetSettings } from '../widget-types'

const WidgetObjectStatesWithHierarchy: FC<TWidgetSettings<TStateFormWidgetObjectStatesWithHierarchyForm>> = (props) => {
    const { settings } = props
    const { widget } = settings

    return (
        <ObjectStatesWithHierarchy
            objectId={settings?.vtemplate?.objectId}
            viewType={widget?.viewType}
            parentLinkedObjectsParams={widget?.linkedObjectsForm}
            childrenLinkedObjectsParams={widget?.linkedObjectsChilds}
            oncClickType={widget?.onClickType}
            attrMainObjects={widget?.attrMainObjects}
            attrLinkedObjects={widget?.attrLinkedObjects}
        />
    )
}

export default WidgetObjectStatesWithHierarchy
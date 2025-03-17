import { FC } from 'react'
import { TWidgetObjectsOverImage } from './WidgetObjectsOverImageForm'
import { TWidgetSettings } from '../widget-types'
import { ObjectsOverImage } from '@entities/stats/ObjectsOverImage/ObjectsOverImage'

const WidgetObjectsOverImage: FC<TWidgetSettings<TWidgetObjectsOverImage>> = (props) => {
    const { settings } = props
    const { widget, vtemplate } = settings

    return (
        <ObjectsOverImage
            {...widget}
            objects={widget?.linkedObjectsForm?.chosenObjectsIds}
            attributesBindProps={{
                schemeAttributeId: widget?.schemeAttributeId,
                coordinateXAttributeId: widget?.coordinateXAttributeId,
                coordinateYAttributeId: widget?.coordinateYAttributeId,
                attributeMarkupId: widget?.attributeMarkupId,
                attributeSortId: widget?.attributeSortId,
            }}
            linkedObjectsSearchProps={{
                targetClasses: widget?.linkedObjectsForm?.targetClasses,
                linkingClasses: widget?.linkedObjectsForm?.connectingClasses,
                parentObjectId: widget?.linkedObjectsForm?.baseObject ?? vtemplate?.objectId,
                linksDirection: widget?.linkedObjectsForm?.linksDirection,
            }}
        />
    )
}

export default WidgetObjectsOverImage
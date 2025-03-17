import { ObjectOAttrStateWithAggregation } from '@containers/object-attributes/ObjectOAttrStateWithAggregation/ObjectOAttrStateWithAggregation'
import { FC, useMemo } from 'react'
import { TWidgetSettings } from '../widget-types'
import { selectObjectByIndex, useObjectsStore } from '@shared/stores/objects'
import { IWidgetObjectOAttrStateWithAggregation } from './WidgetObjectOAttrStateWithAggregationForm'
import { findChildObjectsWithPaths } from '@shared/utils/objects'

const WidgetObjectOAttrStateWithAggregation: FC<TWidgetSettings<IWidgetObjectOAttrStateWithAggregation>> = (props) => {
    const { settings } = props
    const { widget, vtemplate } = settings
    const { objectAttribute, value, aggrValues, maxWidth, customStyle, targetClass, 
        linkedClass, linkedClassObjects, currentName, valNextLine, noAttributeTitle } = widget

    const objectId = vtemplate?.objectId
    const getObject = useObjectsStore(selectObjectByIndex)

    const selectedObjectAttribute = useMemo(() => {
        const vtemplateObject = getObject('id', objectId)
        const filterPayload = linkedClass
            ? {
                filter: {
                    linkedObjects: [{
                        classId: linkedClass,
                        objectIds: linkedClassObjects ?? []
                    }]
                }
            } : {}
        const childrenObjects = findChildObjectsWithPaths({
            currentObj: vtemplateObject,
            targetClassIds: [targetClass],
            childClassIds: [],
            allChildClassIds: true,
            ...filterPayload
        }).objectsWithPath

        const currentObject = childrenObjects?.length > 0 
            ? getObject('id', childrenObjects[0].id)
            : vtemplateObject

        const currenObjectAttribute = currentObject?.object_attributes
            ?.find((oa) => oa.attribute_id === objectAttribute)

        return currenObjectAttribute
    }, [
        vtemplate?.objectId,
        targetClass,
        linkedClass,
        linkedClassObjects
    ])

    const attrValue = useMemo(() => {
        const currentObject = getObject('id', selectedObjectAttribute?.object_id)

        if (currentName) {
            switch (typeof currentName) {
                case 'number': {
                    const attr = currentObject?.object_attributes
                        ?.find(oa => oa.attribute_id === currentName)

                    return attr?.attribute_value
                }
                case 'string': {
                    return currentObject[currentName]
                }
                default: {
                    return ''
                }
            }
        } else {
            return ''
        }
    }, [
        currentName,
        selectedObjectAttribute
    ])

    return (
        <ObjectOAttrStateWithAggregation 
            objectAttribute={selectedObjectAttribute}
            value={value}
            aggrValues={aggrValues}
            maxWidth={maxWidth}
            customStyle={customStyle}
            currentName={attrValue}
            valNextLine={valNextLine}
            noAttributeTitle={noAttributeTitle}
        />
    )
}

export default WidgetObjectOAttrStateWithAggregation
/* eslint-disable max-len */
import { forumThemeConfig } from '@app/themes/forumTheme/forumThemeConfig'
import { IObjectAttributesAndChildStates } from '@containers/objects/ObjectAttributesAndChildStates/ObjectAttributesAndChildStates'
import ObjectOAttrs from '@entities/objects/ObjectOAttrs/ObjectOAttrs'
import { IObject } from '@shared/types/objects'
import { FC } from 'react'

interface WidgetObjectAttributesProps {
    settings: {
        widget: {
            object: IObject
        }
        view: any
    }
}

const WidgetObjectAttributes: FC<WidgetObjectAttributesProps> = (props) => {
    const { settings } = props
    const { widget } = settings

    const objectAttributesAndChildStatesProps = {
        objectAttributesWidgetProps: {
            oaAtrrWidgetProps: {
                attributesIds: forumThemeConfig.build.deviceStatuses.attributes.attributeIds,
            },
        },
    } as IObjectAttributesAndChildStates['sections']

    return (
        <ObjectOAttrs
            showLinks
            objectId={widget?.object?.id || undefined}
            displayType="strings"
            attributesIds={objectAttributesAndChildStatesProps?.objectAttributesWidgetProps?.oaAtrrWidgetProps?.attributesIds}
        />
    )
}

export default WidgetObjectAttributes
import { FC, PropsWithChildren } from 'react'
import { TWidgetSettings } from '../widget-types'
import { IObjectOAttrStateProps, ObjectOAttrState } from '@containers/objects/ObjectOAttrState/ObjectOAttrState'
import { forumThemeConfig } from '@app/themes/forumTheme/forumThemeConfig'
import { useObjectsStore } from '@shared/stores/objects';

const WidgetObjectOAttrState: FC<TWidgetSettings<PropsWithChildren<IObjectOAttrStateProps>>> = (props) => {

    const { settings } = props
    const { widget } = settings
    const objectId = settings?.vtemplate?.objectId
    const object = useObjectsStore().getByIndex('id', objectId)
 


    return (
        <ObjectOAttrState
            height ={widget?.height}
            object={object || undefined}
            representationType={widget?.representationType} 
            oslProps={{ 

                object_id: objectId,
                classes_id: widget?.targetClasses ?? [],
                childClsIds: [],
                // labelWidth: '200px',
                linkedObjects: {
                    linksClsIds: widget?.linkedClasses ?? [],
                    linksDirection: widget?.linksDirection || 'parents',
                    targetClsIds: widget?.targetClasses ?? []
                },
            }}
            labelProps={widget?.labelProps}
            statusChartProps={widget?.statusChartProps}
            children={widget?.children}
            maxWidth={widget?.maxWidth}
            customStyles={widget?.customStyles}
            labelsCount={widget?.labelsCount}
            labelsContainerHeight={widget?.labelsContainerHeight}
            horizontalAligning={widget?.horizontalAligning}
            verticalAlining={widget?.verticalAlining}
            chosenObjectsIds={widget?.chosenObjectsIds}
            chosenObjectsPrefix={widget?.chosenObjectsPrefix}
            labelWidth={widget?.labelWidth}
            labelValue={widget?.labelValue}
            showParentStatus={widget?.showParentStatus}
        />
    )
}

export default WidgetObjectOAttrState
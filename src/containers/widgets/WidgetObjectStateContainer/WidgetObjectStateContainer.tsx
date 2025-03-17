import { forumThemeConfig } from '@app/themes/forumTheme/forumThemeConfig'
import { ObjectOAttrState } from '@containers/objects/ObjectOAttrState/ObjectOAttrState'
import { IObject } from '@shared/types/objects'
import { FC } from 'react'

interface WidgetObjectStateContainerProps {
    settings: {
        widget: {
            object: IObject
        },
        view: any
    }
}

const WidgetObjectStateContainer: FC<WidgetObjectStateContainerProps> = (props) => {

    const { settings } = props
    const { widget } = settings

    return (
        <ObjectOAttrState
            height ={forumThemeConfig.build.deviceStatuses.chart.height}
            object={widget?.object || undefined} 
            representationType="verticalTags" 
            oslProps={{ 
                object_id: widget?.object?.id,
                classes_id: [...forumThemeConfig.classesGroups.favor,
                ],
                childClsIds: [],
                labelWidth: '200px',
                linkedObjects: {
                    linksClsIds: forumThemeConfig.classesGroups.services,
                    linksDirection: 'parents',
                    targetClsIds: forumThemeConfig.classesGroups.favor
                },
            }}
        />
    )
}

export default WidgetObjectStateContainer
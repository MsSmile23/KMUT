import { forumThemeConfig } from '@app/themes/forumTheme/forumThemeConfig'
import { ObjectsLinkedTable } from '@entities/objects/ObjectsLinkedTable/ObjectsLinkedTable'
import { useRelationsStore } from '@shared/stores/relations'
import { IObject } from '@shared/types/objects'
import { FC } from 'react'

interface WidgetObjectAdvancedLinkedClassesTableProps {
    settings: {
        widget: {
            object: IObject
        },
        view: any
    }
}

const WidgetObjectAdvancedLinkedClassesTable: FC<WidgetObjectAdvancedLinkedClassesTableProps> = (props) => {

    const { settings } = props
    const { widget } = settings

    const allRelationIds = useRelationsStore((st) => st.store.data.map(({ id }) => id))

    return (
        <ObjectsLinkedTable
            parentObjectId={widget?.object?.id}
            parentObject={widget?.object}
            relationIds={allRelationIds}
            targetClasses= {{
                ids: forumThemeConfig.classesGroups.devices,
                attributeIds: [],
                filterByAttributes: (a) => a.readonly && a.history_to_db
            }}
            parentClasses= {[{ id: 10055, attributeIds: [10008, 10065] }]}
            statusColumn= "Состояние оборудования"
            childClsIds= {forumThemeConfig.classesGroups.devices}
            scroll= {{ x: 2000 }}
        />
    )
}

export default WidgetObjectAdvancedLinkedClassesTable
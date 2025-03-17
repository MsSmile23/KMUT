import { FC, useMemo } from 'react'
import { TWidgetSettings } from '@shared/types/widgets'
import IncidentTableServerFiltration from '@entities/incidents/IncidentTableServerFiltration/IncidentTableServerFiltration'
import { findChildObjectsWithPaths } from '@shared/utils/objects'
import { selectObjectByIndex, useObjectsStore } from '@shared/stores/objects'
import { IWidgetIncidentsListFormProps } from './WidgetIncidentsListForm'
import { useTheme } from '@shared/hooks/useTheme'
import { DEFAULT_TABLE_ROW_COUNT } from '@shared/config/table.config'

const WidgetIncidentsList: FC<TWidgetSettings<IWidgetIncidentsListFormProps>> = (props) => {
    const { settings } = props
    const { widget, vtemplate, baseSettings } = settings
    const { classes, tableRowCount, hide_attr, editColumns } = widget || {}
    const findObject = useObjectsStore(selectObjectByIndex)

    const theme = useTheme()

    const getRowPerPage = () => {
        if (widget?.tableRowCount) {
            return widget?.tableRowCount
        }

        if (theme?.table?.tableRowCount) {
            return theme?.table?.tableRowCount
        }
        
        return DEFAULT_TABLE_ROW_COUNT
    }

    const obj_ids = useMemo(() => {
        const objId = vtemplate?.objectId

        if (objId) {
            const object = findObject('id', objId)

            if (classes?.length > 0 && classes[0]?.target.length > 0 && classes[0]?.linking.length > 0) {
                return classes.reduce((accum, curr) => {
                    return [...accum, ...findChildObjectsWithPaths({
                        currentObj: object,
                        targetClassIds: curr.target,
                        childClassIds: curr.linking
                    }).objectsWithPath].map(obj => obj.id)
                }, [])
            }

            return objId
        }

        return []
    }, [vtemplate?.objectId, classes])

    return (
        <div style={{ width: '100%', overflow: 'auto' }}>
            {/* <IncidentTableContainer2 
                objectIds={[settings?.vtemplate.objectId]}
            /> */}
            <IncidentTableServerFiltration
                hide_attr={hide_attr}
                objectIds={obj_ids}
                rowPerPage={getRowPerPage()}
                editColumns={editColumns || null}
            />
        </div>
    )
}

export default WidgetIncidentsList
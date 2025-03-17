import { ObjectsInOutHistory } from '@entities/objects/ObjectsInOutHistory/ObjectsInOutHistory'
import { selectObject, useObjectsStore } from '@shared/stores/objects'
import { FC } from 'react'
import { useGetChildrenObjectIds } from './utils'
import { TWidgetSettings } from '../widget-types'
import { WidgetObjectsInOutHistoryFormProps } from './WidgetObjectsInOutHistoryForm'
import { IncidentTableContainer2 } from '@entities/incidents/IncidentTableContainer/IncidentTableContainer2'
export interface WidgetObjectsInOutHistoryProps extends WidgetObjectsInOutHistoryFormProps{}

const WidgetObjectsInOutHistory: FC<TWidgetSettings<WidgetObjectsInOutHistoryProps>> = (props) => {
    const { settings } = props
    const { widget, vtemplate } = settings
    const { target, linking, title, height } = widget
    const getObject = useObjectsStore(selectObject)
    const objectIdFromPath = vtemplate?.objectId
    const object = getObject(objectIdFromPath)

    // Получаем массив айди объектов, инциденты которых необходимо отобразить
    // При пустом массиве отображаются все возможные объекты, имеющие инциденты
    const objectIds = useGetChildrenObjectIds({
        objectIdFromPath,
        target,
        linking
    })

    const incidentsList = (objectIds?: number[], periodForModal?: { start: any, end: any }, message?: string ) => {
        return <IncidentTableContainer2 objectIds={objectIds} periodForModal={periodForModal} message={message} />
    }

    return (
        <ObjectsInOutHistory
            title={title}
            object={object}
            sourceClass={300}
            height={height ?? 400}
            objectIds={objectIds?.length > 0 ? objectIds : undefined}
            incidentsList={incidentsList}
        />
    )
}

export default WidgetObjectsInOutHistory
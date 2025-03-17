import { IncidentTableContainer } from "@containers/incidents/IncidentTableContainer/IncidentTableContainer"

export const Incidents = () => {
    return (
        <IncidentTableContainer
            incidentClassId={300}
            incidentRangeAttributeIds={[10110, 10111]}
            monitoringAttributeId={10112}
            // todo: перенести сюда все атрибуты
            attributeIds={{
                criticality: 10115,
                manufacturer: 10046,
                post: 0,
                floor: 0,
                room: 0,
                rack: 0,
                unit: 0,
                monitoringObjectName: 0,
                model: 0,
                monitoringObjectType: 0,
                incidentType: 0,
                monitoringIp: 0,
                serialNumber: 0,
                inventoryNumber: 0,
                responsible: 0,
                requestNumber: 0,
                status: 0,
                specialist: 10175,
            }}
            attributesColumnsOrder={[10116, 10115]}
            excludedColumnAttributeIds={[10115]}
        />
    )
}
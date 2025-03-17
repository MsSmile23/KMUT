import { CircleMarker } from 'react-leaflet'
import { IPoint } from '../../types/types'
import { ObjectTooltip } from '../../ObjectTooltip'

const CircleMarkerComponent = ({ point, onClick }: { point: IPoint, onClick: (id: number) => void }) => (
    <CircleMarker
        key={`${point.properties.pointId}-point`}
        center={[point.geometry.coordinates[1], point.geometry.coordinates[0]]}
        //@ts-ignore
        radius={8}
        fillColor={point.properties?.statuses?.color}
        fillOpacity={1}
        color={point.properties.statuses?.color}
        interactive={true}
        pane="markerPane"
        eventHandlers={{
            click: () => onClick(point.properties.pointId),
            mouseover: (e) => {
                e.target.openPopup(),
                e.target.setStyle({
                    fillOpacity: 0.4         
                })
            },
            mouseout: (e) => {
                e.target.closePopup(),
                e.target.setStyle({
                    fillOpacity: 1         
                })
            },
        }}
    >
        <ObjectTooltip 
            prefix={`${point?.properties?.pointId}`} 
            text={point?.properties?.name} 
            state={point?.properties.statuses?.description}
        />
    </CircleMarker>
)

export default CircleMarkerComponent
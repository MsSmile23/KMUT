import { Polygon } from 'react-leaflet'
import { adjustBrightness } from '../../utils/utils'
import { ObjectTooltip } from '../../ObjectTooltip';
import { IPolygon } from '../../types/types';


const PolygonComponent = ({ polygon, onClick }: { polygon: IPolygon, onClick: (id: number) => void }) => (
    <Polygon
        key={`${polygon.properties.pointId}-polygon`}
        positions={polygon.coordinatesPolygon}
        pathOptions={{
            color: adjustBrightness(polygon?.properties?.stateParamsMap?.border 
                ?? polygon.properties.stateParamsMap?.fill, -30),
            fillColor: adjustBrightness(polygon?.properties?.stateParamsMap?.fill, 10),
            fillOpacity: 0.6,
            weight: 1,
        }}
        eventHandlers={{
            click: (event) => onClick(polygon.properties.pointId),
            mouseover: (e) => {
                e.target.setStyle({
                    fillOpacity: 0.25,
                    weight: 3,
                    strokeWidth: 3,
                    strokeOpacity: 1,
                });
            },
            mouseout: (e) => {
                e.target.setStyle({
                    fillOpacity: 0.6,
                    weight: 1,
                    strokeWidth: 1,
                    strokeOpacity: 0.7,
                });
            }
        }}
    >
        <ObjectTooltip 
            prefix={`${polygon?.properties?.pointId}`} 
            text={polygon?.properties?.name} 
            state={polygon?.properties?.stateParamsMap?.name}
        />
    </Polygon>
)

export default PolygonComponent
import { FC } from 'react'
import { Polyline, Popup } from 'react-leaflet'

interface ILine {
    positions: any
}

export const Line: FC<ILine> = ({ positions }) => {
    return (
        <Polyline
            pathOptions={
                positions?.dotted == true
                    ? { color: positions?.color, weight: 4, dashArray: '5, 5', dashOffset: '0' }
                    : { color: positions?.color, dashArray: '0, 0' }
            }
            positions={positions?.coordinates}
        >
            <Popup>test</Popup>
        </Polyline>
    )
}
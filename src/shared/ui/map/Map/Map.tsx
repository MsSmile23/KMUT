import { FC, useEffect } from 'react'
import { TileLayer, useMap } from 'react-leaflet'
import { useTheme } from '@shared/hooks/useTheme'

interface IMap {
    setMap: any,
    isTile?: boolean,
    isMapBlocked?: boolean
}
export const Map: FC<IMap> = ({ setMap, isTile = true, isMapBlocked }) => {
    const map = useMap()
    const theme = useTheme()

    useEffect(() => {
        setMap(map)
    }, [map])

    useEffect(() => {
        if (isMapBlocked) {
            map.dragging.disable()
            map.scrollWheelZoom.disable()
            map.touchZoom.disable()
            map.keyboard.disable()
            map.zoomControl.remove()
        } else {
            map.dragging.enable()
            map.scrollWheelZoom.enable()
            map.touchZoom.enable()
            map.keyboard.enable()
            map.zoomControl.addTo(map)
        }
    }, [isMapBlocked, map])

    return isTile ? (
        <TileLayer
            //@ts-ignore
            //url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            url={theme?.map?.tilesUrl}
        />
    ) : null
}
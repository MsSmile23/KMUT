import { getAttributeHistoryById } from '@shared/api/AttributeHistory/Models/getAttributeHistoryById/getAttributeHistoryById'
import { FC, useEffect, useState } from 'react'
import { MapContainer } from 'react-leaflet'
import { Map, Marker, Line } from '@shared/ui/map'
import 'leaflet/dist/leaflet.css'
import { formatDataUTC } from '@shared/utils/objects'
import { IObjectAttribute } from '@shared/types/objects'
import WrapperMetricData from '@shared/ui/wrappers/WrapperMetricData/WrapperMetricData'
import { useApi2 } from '@shared/hooks/useApi2'
import CustomPreloader from '@shared/ui/preloader/CustomPreloader'
import { IAttributeHistoryDateIntervalForGet } from '@shared/types/attribute-history'

const OAHistoryMap: FC<{
    height?: number
    objectAttribute?: IObjectAttribute
    styleForMap?: any
    dateInterval?: IAttributeHistoryDateIntervalForGet
    limit?: number
}> = ({ height = 400, objectAttribute, styleForMap = { height: '100%' }, dateInterval, limit }) => {
    const [contentData, setContentData] = useState<any>(null)
    const [convertedData, setConvertedData] = useState<any[]>([])
    const [position, setPosition] = useState<number[]>([55.702868, 37.530865])
    const [linePositions, setLinePositions] = useState<any[]>([])
    const [markers, setMarkers] = useState<any[]>([])
    const [map, setMap] = useState<any>()
    const [data, setData] = useState<any[]>([])
    const limitPayload = limit ? { limit } : {}
    const [isLoading, setIsLoading] = useState<boolean>(true)
    
    const attrHistory = useApi2(getAttributeHistoryById, {
        state: null,
        onmount: false,
        payload: {
            id: objectAttribute?.id,
            ...limitPayload
        }
    })

    useEffect(() => {
        attrHistory.request({ id: objectAttribute?.id, ...limitPayload }).then((resp) => {
            if (resp.success) {
                if (resp.data) {
                    setData(resp.data?.series)
                }
                setIsLoading(false)
            }
        })
    }, [objectAttribute])

    useEffect(() => {
        if (dateInterval && dateInterval[0] && dateInterval[1]) {
            attrHistory.request({ 
                id: objectAttribute?.id, 
                start: dateInterval[0], 
                end: dateInterval[1],
                ...limitPayload
            }).then((resp) => {
                if (resp.success) {
                    if (resp.data) {
                        setData(resp.data?.series)
                    }
                }
            })
        }
    }, [dateInterval, objectAttribute])

    useEffect(() => {
        const convertedData: any[] = []

        data?.forEach((point) => {
            formatDataUTC(point?.data).forEach((item) => {
                const string = item[1]
                const time = item[0]
                const content = string

                convertedData.push({ time: time, content: content })
            })
        })

        setConvertedData(convertedData)
       
    }, [data])

    useEffect(() => {
        if (contentData !== undefined && contentData !== null) {
            const parsedContent: any = contentData

            const markers: any[] = []
            const markersForLine: any = []
            const firstMarker: any = parsedContent?.geo_location?.before
            const secondMarker: any = parsedContent?.geo_location?.after
            //*Добавляем координаты в переменные для исключения ошибок

            const firstMarkerLongitude = firstMarker?.longitude
            const firstMarkerLatitude = firstMarker?.latitude
            const secondMarkerLongitude = secondMarker?.longitude
            const secondMarkerLatitude = secondMarker?.latitude

            if (firstMarker !== undefined && firstMarker !== null && firstMarkerLongitude && firstMarkerLatitude) {
                markers.push({
                    coordinates: [firstMarkerLongitude, firstMarkerLatitude],
                    color: '#FFFF00',
                    title: 'Приставка',
                    ip: parsedContent?.ip?.before ? `IP-адрес: ${parsedContent?.ip?.before}` : '',
                })
            }

            if (parsedContent?.ip?.before !== parsedContent?.ip?.after) {
                if (
                    secondMarker !== undefined &&
                    secondMarker !== null &&
                    secondMarkerLatitude &&
                    secondMarkerLongitude
                ) {
                    markers.push({
                        coordinates: [secondMarkerLongitude, secondMarkerLatitude],
                        color: '#FF8C00',
                        title: ' VPN',
                        ip: parsedContent?.ip?.after ? `IP-адрес: ${parsedContent?.ip?.after}` : '',
                    })
                }

                if (
                    firstMarker !== undefined &&
                    firstMarker !== null &&
                    secondMarker !== undefined &&
                    secondMarker !== null &&
                    firstMarkerLatitude &&
                    firstMarkerLongitude &&
                    secondMarkerLatitude &&
                    secondMarkerLongitude
                ) {
                    markersForLine.push({
                        coordinates: [
                            [firstMarkerLatitude, firstMarkerLongitude],
                            [secondMarkerLatitude, secondMarkerLongitude],
                        ],
                        color: '#DC143C',
                        dotted: true,
                    })
                }
            }

            if (parsedContent?.resources !== undefined) {
                const values = Object.values(parsedContent?.resources)
                const keys = Object.keys(parsedContent?.resources)

                values.forEach((item: any, key: any) => {
                    const resourceFirstMarker = item?.before
                    const resourceSecondMarker = item?.after
                    //*Добавляем координаты в переменные для исключения ошибок

                    const resourceFirstMarkerLongitude = resourceFirstMarker?.longitude
                    const resourceFirstMarkerLatitude = resourceFirstMarker?.latitude
                    const resourceSecondMarkerLongitude = resourceSecondMarker?.longitude
                    const resourceSecondMarkerLatitude = resourceSecondMarker?.latitude

                    if (
                        resourceFirstMarker !== undefined &&
                        resourceFirstMarker !== null &&
                        resourceFirstMarkerLongitude &&
                        resourceFirstMarkerLatitude
                    ) {
                        setPosition([resourceFirstMarkerLongitude, resourceFirstMarkerLatitude])

                        markers.push({
                            coordinateString: `${resourceFirstMarkerLongitude}_${resourceFirstMarkerLatitude}`,
                            coordinates: [resourceFirstMarkerLongitude, resourceFirstMarkerLatitude],
                            color: '#0000FF',
                            title: `Сервис: ${keys[key]}`,
                            ip: `IP-адрес: ${resourceFirstMarker?.ip}`,
                        })
                    }

                    if (
                        resourceSecondMarker !== undefined &&
                        resourceSecondMarker !== null &&
                        resourceSecondMarkerLongitude &&
                        resourceSecondMarkerLatitude
                    ) {
                        markers.push({
                            coordinateString: `${resourceSecondMarkerLongitude}_${resourceSecondMarkerLatitude}`,
                            coordinates: [resourceSecondMarkerLongitude, resourceSecondMarkerLatitude],
                            color: '#0000FF',
                            title: `Сервис: ${keys[key]}`,
                            ip: `IP-адрес: ${resourceSecondMarker?.ip}`,
                        })
                    }

                    if (parsedContent?.ip?.before !== parsedContent?.ip?.after) {
                        if (
                            secondMarker !== undefined &&
                            secondMarker !== null &&
                            resourceSecondMarker !== undefined &&
                            resourceSecondMarker !== null
                        ) {
                            markersForLine.push({
                                coordinates: [
                                    [secondMarkerLatitude, secondMarkerLongitude],
                                    [resourceSecondMarkerLatitude, resourceSecondMarkerLongitude],
                                ],
                                color: '#FF0000',
                            })
                        }
                    }

                    if (
                        firstMarker !== undefined &&
                        firstMarker !== null &&
                        resourceFirstMarker !== undefined &&
                        resourceFirstMarker !== null &&
                        resourceFirstMarkerLongitude &&
                        resourceFirstMarkerLatitude &&
                        firstMarkerLatitude &&
                        firstMarkerLongitude
                    ) {
                        markersForLine.push({
                            coordinates: [
                                [firstMarkerLatitude, firstMarkerLongitude],
                                [resourceFirstMarkerLatitude, resourceFirstMarkerLongitude],
                            ],
                            color: '#87CEEB',
                        })
                    }
                })
            }
            setLinePositions(markersForLine)

            //*Бежим по созданным маркерам, чтобы узнать,
            //*если ли точки на одной координате для создание кастомного туллтипа
            const coordinatesArray: string[] = []

            const filteredMarkers: any[] = []

            markers.forEach((item) => {
                if (item?.coordinateString == undefined) {
                    filteredMarkers.push(item)
                } else {
                    if (coordinatesArray.includes(item?.coordinateString) == false) {
                        const localCoordinates = markers.filter(
                            (item2) => item2?.coordinateString == item.coordinateString
                        )
                        const tooltip = {}

                        if (localCoordinates.length > 1) {
                            localCoordinates.forEach((coordinate) => {
                                tooltip[coordinate?.title] = coordinate?.ip
                            })

                            item.customTooltip = tooltip
                            coordinatesArray.push(item?.coordinateString)
                        }

                        filteredMarkers.push(item)
                    }
                }
            })

            setMarkers(filteredMarkers)
        } else {
            setLinePositions([])
            setMarkers([])
        }
    }, [contentData])

    useEffect(() => {
        if (map !== undefined) {
            if (markers.length > 0) {
                const bounds: any[] = []

                markers.forEach((item) => {
                    bounds.push([item.coordinates[1], item.coordinates[0]])
                })
                map.fitBounds(bounds)
            }
        }
    }, [markers, map])


    if (isLoading) {
        return (
            <div
                style={{
                    maxHeight: `${height || 400}px`,
                    height: '100%',
                    minHeight: `${height || 400}px`,
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#ffffff',
                }}
            >
                <CustomPreloader size="default" />
            </div>
        )
    }

    if (convertedData && convertedData.length < 1 && !isLoading) {
        return (
            <div
                style={{
                    maxHeight: `${height || 400}px`,
                    height: '100%',
                    minHeight: `${height || 400}px`,
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#ffffff',
                }}
            >
                <div>Нет данных за период</div>
            </div>
        )
    }

    return (
        <div style={{ height: `${height}px` }}>
            {data && data.length > 0 && (
                <WrapperMetricData
                    setContentData={setContentData}
                    data={convertedData}
                    objectAttribute={objectAttribute}
                >
                    <div style={{ height: `calc(${height}px - 52px)` }}>
                        <MapContainer
                            //@ts-ignore
                            preferCanvas
                            //@ts-ignore
                            center={position}
                            zoom={markers?.length > 0 ? null : 6}
                            loadingControl={true}
                            // scrollWheelZoom={true}
                            doubleClickZoom={false}
                            style={styleForMap}
                        >
                            <Map setMap={setMap} />
                            {markers?.length > 0 &&
                                markers.map((item, index) => {
                                    return (
                                        <Marker
                                            key={`${index}_${item?.time}`}
                                            marker={{
                                                title: item?.title,
                                                type: 'Feature',
                                                color: item?.color,
                                                ip: item?.ip,
                                                geometry: {
                                                    type: 'Point',
                                                    coordinates: item?.coordinates,
                                                },
                                                customTooltip: item?.customTooltip,
                                            }}
                                        />
                                    )
                                })}

                            {linePositions?.length > 0 &&
                                linePositions.map((line, key) => {
                                    return <Line key={key} positions={line} />
                                })}
                        </MapContainer>
                    </div>
                </WrapperMetricData>
            )}
        </div>
    )
}

export default OAHistoryMap
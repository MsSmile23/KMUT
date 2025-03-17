import { useStateEntitiesStore, selectStateEntities } from '@shared/stores/state-entities'
import { useStatesStore, selectStates } from '@shared/stores/states'
import { FC, useCallback, useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, Polygon, CircleMarker } from 'react-leaflet'
import L from 'leaflet'
import useSupercluster from 'use-supercluster'
import { Card, Tag } from 'antd'
import { DefaultModal2 } from '@shared/ui/modals/DefaultModal2/DefaultModal2'
import ObjectCardContainer from '@containers/objects/ObjectCardContainer/ObjectCardContainer'
import { objectsGeoJSON } from '@entities/objects/ObjectsMap/MOK/objectsGeoJSON'
import { IObject } from '@shared/types/objects'
import React from 'react'
import { Map } from '@shared/ui/map'

interface IObjectsMap {
    objects: IObject[]
    startZoom: number
    mapCenter: [number, number]
    attributesBind?: {
        contour: number | undefined
        coordinates:  number | undefined
    }
    // filter?: {
    //     class_ids?: IClass['id'][]
    //     }
}

const maxZoom = 22
const ObjectsMap2: FC<IObjectsMap> = ({ 
    objects, 
    startZoom,
    mapCenter,
    attributesBind,
    // filter
}) => {
    const states = useStatesStore(selectStates)
    const statesEntities = useStateEntitiesStore(selectStateEntities)?.objects ?? []
    const [mapObjects, setMapObjects] = useState([])
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [objForModalId, setObjForModalId] = useState<number | undefined>(undefined)
    const [points, setPoints] = useState<any[]>([])
    const [map, setMap] = useState<any>()
    const [bounds, setBounds] = useState<any>(null)
    const [zoom, setZoom] = useState(startZoom ?? 14)
    const icons = {}

    //Тест статусы
    function getRandomStatus() {
        const mockStatuses = [
            { name: 'Доступен', color: '#006400', id: 1 },
            { name: 'Проблема', color: '#FFFF00', id: 2 },
            { name: 'Ошибка', color: '#FF7F50', id: 3 },
            { name: 'Критическая ошибка', color: '#DC143C', id: 4 },
            { name: 'Профилактика', color: '#6495ED', id: 5 },
        ];
            
        const randomIndex = Math.floor(Math.random() * mockStatuses.length);
        const { name, color, id } = mockStatuses[randomIndex];
            
        return { name, color, id };
    }

    const defaultStateViewParams = {
        fill: '#939393', 
        border: '#000000', 
        textColor: '#000000', 
        description: 'Статус отсутствует'
    }

    const handleMouseOver = (event) => {
        event.target.openPopup()
        event.target.setStyle({
            fillOpacity: 0.4,
            weight: 3,
            strokeWidth: 3,
            strokeOpacity: 1,
        })
    }

    const handleMouseOut = (event) => {
        event.target.closePopup()
        event.target.setStyle({
            fillOpacity: 0.25,
            weight: 1,
            strokeWidth: 1,
            strokeOpacity: 0.7,
        })
    }

    //Обновление карты при сдвиге и обновлении объектов
    function updateMap() {
        if (!map) {
            return
        }
        const b = map.getBounds()

        setBounds([b.getSouthWest().lng, b.getSouthWest().lat, b.getNorthEast().lng, b.getNorthEast().lat])
        setZoom(map.getZoom())
    }
    const onMove = useCallback(() => {
        updateMap()
    }, [map])

    useEffect(() => {
        updateMap()
    }, [map, objects])

    useEffect(() => {
        if (!map) {
            return
        }
        map.on('moveend', onMove)

        return () => {
            map.off('moveend', onMove)
        }
    }, [map, onMove])

    //Получаем данные для вывода статуса
    const getStateForMap = (obj: IObject) => {
        const stateId = statesEntities?.find((st) => st?.entity == obj?.id)?.state
        const objState = states?.find((state) => state?.id == stateId)
        const stateParamsMap = objState?.view_params?.params.reduce((acc, param) => {
            acc[param.type] = param.value

            return acc
        }, {})

        return { stateParamsMap, objState }
    }

    //Данные для точек
    useEffect(() => {
        const dataForPoints = objects?.reduce((dataPoints, obj) => {            
            const allCoordinates = obj.object_attributes.find(
                (attr) => attr.attribute?.data_type?.mnemo == 'geo_coordinates_2d')?.attribute_value

            if (allCoordinates === undefined) {
                
                return dataPoints
            }

            const coordinates = obj.object_attributes.find(
                (attr) => attr.attribute_id == attributesBind?.coordinates)
                ?.attribute_value ?? allCoordinates

            const statusObj = getRandomStatus()

            dataPoints.push({
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [coordinates[1], coordinates[0]],
                },
                properties: {
                    pointId: obj.id,
                    cluster: false,
                    statuses: {
                        color: statusObj?.color,
                        description: statusObj?.name,
                    },
                }                
            })

            return dataPoints
        }, [])

        dataForPoints.push(...mapObjects)

        setPoints(dataForPoints)

    }, [objects, mapObjects])

    //Данные для объктов с контурами
    useEffect(() => {
        const polygons = objects?.reduce((tmpMapObjs, obj) => {
            const tmpPolygon = objectsGeoJSON?.[obj.id]?.features?.[0].geometry.coordinates
                .map(([lng, lat]) => [lat, lng])

            if (tmpPolygon === undefined) {
                
                return tmpMapObjs
            }
            const polygon = obj.object_attributes.find(
                (oa) => oa.attribute_id == attributesBind?.contour)
                ?.attribute_value ?? tmpPolygon

            const { stateParamsMap, objState } = getStateForMap(obj)

            tmpMapObjs.push({
                id: obj.id,
                name: obj.name,
                coordinates: polygon,
                // state: objState,
                // stateParamsMap: stateParamsMap,
                type: 'Feature',
                geometry: {
                    type: 'Polygon',
                    coordinates: [polygon[0][1], polygon[0][0]],
                },
                properties: {
                    stateParamsMap: stateParamsMap,
                    cluster: false,
                    statuses: {
                        color: stateParamsMap?.fill,
                        description: objState?.view_params?.name,
                    },
                }
            })

            return tmpMapObjs
        
        }, [])

        setMapObjects(polygons)
    }, [objects])

    const clusterIcon = (count, size, L, status) => {
        //Считаем одинаковые статусы
        const counts = {}

        status.map((item) => {
            counts[item?.properties?.statuses?.status] = {
                count: (counts[item?.properties?.statuses?.status]?.count || 0) + 1,
                color: item?.properties?.statuses?.color,
            }
        })

        const group: { sum: number; color: string }[] = []
        //Считаем сумму всех статусов
        const sum = Object.keys(counts).reduce(
            (previous: number, key: number | string) => previous + counts[key].count,
            0
        )

        //Создаем массив для отрисовки со статусами и цветом
        Object.entries<any>(counts).map(([key, item]) => {
            group.push({ sum: (item.count * 100) / sum, color: item.color })
        })

        const total = 100

        const oneOffset = 25 //Смещение
        const radius = total / (2 * Math.PI) //Считаем радиус

        let countAll = 0 //сумма предыдущих итераций

        const paths = group?.map((item, index) => {
            const n = total - item.sum // получаем остаток от 100
            const result = item.sum + ' ' + n //Формируем stroke-dasharray

            if (index === 0) {
                countAll += item.sum

                return `<circle 
                        key="${index}"
                        class="donut-segment" 
                        cx="23" cy="23" 
                        r="${radius}" 
                        fill="transparent" 
                        stroke="${item.color}" 
                        stroke-width="3" 
                        stroke-dasharray="${result}" 
                        stroke-dashoffset="${oneOffset}"/>`
            } else {
                const offset = total - countAll + oneOffset //Считаем смещение каждого блока после первого

                countAll += item.sum

                return `<circle 
                        key="${index}"
                        class="donut-segment" 
                        cx="23" 
                        cy="23" 
                        r="${radius}" 
                        fill="transparent" 
                        stroke="${item.color}" 
                        stroke-width="3" 
                        stroke-dasharray="${result}" 
                        stroke-dashoffset="${offset}"/>`
            }
        })

        // if (!icons[count]) {
        icons[count] = L.divIcon({
            html: `
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                        width=${size}
                        height=${size}
                        version="1.1"
                        class="chart"
                        viewBox="0 0 46 47"
                    >
                        <circle class="donut-hole" cx="23" cy="23" r="${radius}" fill="#fff"></circle>
                            <circle class="donut-ring" cx="23" cy="23" r="${radius}" fill="transparent"
                            stroke="#d2d3d4" stroke-width="3"></circle>
                            
                            ${paths.join('')}
                            <g class="chart-text" style="
                                fill: #000;
                                -moz-transform: translateY(0.25em);
                                -ms-transform: translateY(0.25em);
                                -webkit-transform: translateY(0.25em);
                                transform: translateY(0.25em); font: (16px/1.4em)">
                                <text x="23" y="27" class="chart-number" 
                                    style="font-size: 0.7em;
                                    line-height: 1;
                                    text-anchor: middle;
                                -moz-transform: translateY(-0.45em);
                                    -ms-transform: translateY(-0.45em);
                                    -webkit-transform: translateY(-0.45em);
                                    transform: translateY(-0.35em);"
                                >
                                ${count}
                                </text>
                            </g>
                        </svg>
                `,
            className: 'customMarker',
            iconSize: L.point(size, size, true),
        })
        // }

        return icons[count]
    }

    const modalMarkerGroup = (count, points, reg, countryName) => {
        const counts = {}

        Object.entries<any>(points).map(([key, value]) => {
            counts[value?.properties?.statuses?.status] = {
                count: (counts[value?.properties?.statuses?.status]?.count || 0) + 1,
                color: value?.properties?.statuses?.color,
                description: value?.properties?.statuses?.description,
            }
        })

        return (
            <div style={{ textAlign: 'center' }}>
                {reg !== 0 && countryName !== 0 && (
                    <div>
                        Регион{' '}
                        <b>
                            {reg} {countryName}
                        </b>
                    </div>
                )}
                <div style={{ marginTop: 10, marginBottom: 10 }}>
                    <p style={{ margin: 0 }}>
                        Всего объектов: <b>{count}</b>
                    </p>
                </div>
                {Object.entries<any>(counts)?.map(([, value], index) => {
                    return (
                        <div
                            key={index}
                            className="modalBlock"
                            style={{
                                backgroundColor: value.color,
                                padding: 5,
                                borderRadius: 3,
                                marginBottom: 5,
                            }}
                        >
                            <div className="modalText">
                                <span style={{ marginRight: 5 }}>{value.description}</span>
                                <Tag color="white" style={{ color: 'black' }}>
                                    {value.count}
                                </Tag>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }

    const dataModal = (count?, points?, countryName?) => {
        const popupHtml = modalMarkerGroup(count, points, 0, countryName)

        return popupHtml
    }

    const { clusters, supercluster } = useSupercluster({
        points: points,
        bounds: bounds,
        zoom: zoom,
        options: { radius: 200, maxZoom: 17 },
    })

    // Автоцентрирование карты, отображение всех точек
    useEffect(() => {
        if (points.length > 0 || mapObjects.length > 0) {
            const pointCoordinates = points?.map((point) => point.geometry.coordinates).map(([lng, lat]) => [lat, lng])
            const contourCoordinates = mapObjects?.map((contour) => contour.geometry.coordinates)

            pointCoordinates.push(...contourCoordinates)

            map.fitBounds(pointCoordinates)
        }
    }, [points])

    return (
        <div>
            <MapContainer
                //@ts-ignore
                zoom={zoom}
                center={mapCenter ?? [43.40758654559397, 39.95466648943133]}
                loadingControl={true}
                doubleClickZoom={false}
                style={{ height: '700px' }}
            >
                <Map setMap={setMap} />

                {clusters?.map((cluster) => {
                    const [latitude, longitude] = cluster.geometry.coordinates
                    const { cluster: isCluster, point_count: pointCount } = cluster.properties

                    if (isCluster) {
                        const ClusterGroup = supercluster.getLeaves(Number(cluster.id), Infinity, 0)

                        return (
                            <Marker
                                key={`cluster-${cluster.id}`}
                                position={[longitude, latitude]}
                                //@ts-ignore
                                icon={clusterIcon(pointCount, 40 + (pointCount / points.length) * 40, L, ClusterGroup)}
                                eventHandlers={{
                                    click: () => {
                                        const expansionZoom = Math.min(
                                            //@ts-ignore
                                            supercluster.getClusterExpansionZoom(cluster.id),
                                            maxZoom
                                        )

                                        map.setView([longitude, latitude], expansionZoom, {
                                            animate: true,
                                        })
                                    },
                                    mouseover: (e) => {
                                        e.target.openPopup()
                                    },
                                    mouseout: (e) => {
                                        e.target.closePopup()
                                    },
                                }}
                            >
                                <Popup>
                                    {dataModal(pointCount, supercluster.getLeaves(Number(cluster.id), Infinity, 0))}
                                </Popup>
                            </Marker>
                        )
                    }

                    return (
                        <React.Fragment key={`crime-${cluster.properties.pointId}`}>
                            
                            {//@ts-ignore
                                cluster.geometry.type === 'Polygon' ? 
                                    <Polygon
                                        key={cluster.id}
                                        positions={cluster.coordinates}
                                        pathOptions={{
                                            color: cluster.properties.stateParamsMap ?.border
                                                ?? cluster.properties.stateParamsMap ?.fill
                                                ?? defaultStateViewParams.border,
                                            fillColor: cluster.properties.stateParamsMap?.fill
                                            ?? defaultStateViewParams.fill,
                                            fillOpacity: 0.25,
                                            weight: 1,
                                            strokeWidth: 1,
                                            strokeOpacity: 0.7,
                                        }}
                                        eventHandlers={{
                                            click: () => {
                                                setIsModalVisible(true)
                                                setObjForModalId(cluster.id)
                                            },
                                            mouseover: handleMouseOver,
                                            mouseout: handleMouseOut,
                                        }}
                                    >
                                        <Popup>
                                            {`${cluster.properties?.statuses?.description
                                ?? defaultStateViewParams.description}`}
                                        </Popup>
                                    </Polygon> :                                    
                                    <CircleMarker
                                        center={[longitude, latitude]}
                                        //@ts-ignore
                                        radius={8}
                                        fillColor={cluster.properties?.statuses?.color}
                                        fillOpacity={1}
                                        color={cluster.properties.statuses?.color}
                                        interactive={true}
                                        pane="markerPane"
                                        eventHandlers={{
                                            click: () => {
                                                setObjForModalId(cluster.properties.pointId)
                                                setIsModalVisible(true)
                                            },
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
                                        <Popup>
                                            {`${cluster.properties.statuses?.description
                                        ?? defaultStateViewParams.description}`}
                                        </Popup>
                                    </CircleMarker>
                            }                            
                        </React.Fragment>
                    )
                }
                )}
              
            </MapContainer>

            <DefaultModal2
                width="80%"
                title="Просмотр объекта"
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false)
                    setObjForModalId(undefined)
                }}
                // destroyOnClose
                footer={null}
            >
                <Card style={{ marginTop: 20 }}>
                    {' '}
                    <ObjectCardContainer id={objForModalId} />
                </Card>
            </DefaultModal2>
        </div>
    )
}

export default ObjectsMap2
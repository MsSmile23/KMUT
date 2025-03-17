import { objectsStore, selectObjects } from '@shared/stores/objects'
import { useStateEntitiesStore, selectStateEntities } from '@shared/stores/state-entities'
import { useStatesStore, selectStates } from '@shared/stores/states'
import { IObject } from '@shared/types/objects'
import { FC, useCallback, useEffect, useState } from 'react'
import { CircleMarker, MapContainer, Popup, Marker as LFMarker, GeoJSON, Polyline } from 'react-leaflet'
import useSupercluster from 'use-supercluster'
import { Map } from '@shared/ui/map'
import React from 'react'
import { Tag } from 'antd'
import L from 'leaflet'
import { selectClasses, useClassesStore } from '@shared/stores/classes'
import { IClass } from '@shared/types/classes'
import { ButtonSettings } from '@shared/ui/buttons'
import MapModalWithSettings from './MapModalWithSettings'
import { CheckBox } from '@shared/ui/forms'
import { renderToString } from 'react-dom/server'
import ObjectCardModal from '@features/objects/ObjectCardModal/ObjectCardModal'
import { useGetObjects } from '@shared/hooks/useGetObjects'


interface IObjectsMap {
    objectsIds?: number[]
    showClustering?: boolean
    showStatuses?: boolean
}
const maxZoom = 22
const ObjectsMap: FC<IObjectsMap> = ({ objectsIds, showClustering = true, showStatuses = true }) => {
    const objects = useGetObjects()
    const classes = useClassesStore(selectClasses)
    const statuses = useStatesStore(selectStates)?.object_states
    const states = useStateEntitiesStore(selectStateEntities)?.objects ?? []
    const [points, setPoints] = useState<any[]>([])
    const [bounds, setBounds] = useState<any>(null)
    const [zoom, setZoom] = useState(12)
    const [map, setMap] = useState<any>()
    const [position] = useState<number[]>([55.702868, 37.530865])
    const icons = {}
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [objForModalId, setObjForModalId] = useState<number | undefined>(undefined)

    const [classesForMap, setClassesForMap] = useState<IClass[]>([])
    const [open, setOpen] = useState<boolean>(false)

    const [dataForMapLayers, setDataForMapLayers] = useState<any[]>([])

    const [polygons, setPolygons] = useState<any>([])
    const [polylines, setPolylines] = useState<any[]>([])

    ////*Для проверки нагрузки

    const [points2, setPoints2] = useState<any[]>([])

    function getRandomInRange(from, to, fixed) {
        return (Math.random() * (to - from) + from).toFixed(fixed) * 1
        // .toFixed() returns string, so ' * 1' is a trick to convert to number
    }
    const mockStatuses = [
        { name: 'Доступен', color: '#006400', id: 1 },
        { name: 'Проблема', color: '#FFFF00', id: 2 },
        { name: 'Ошибка', color: '#FF7F50', id: 3 },
        { name: 'Критическая ошибка', color: '#DC143C', id: 4 },
        { name: 'Профилактика', color: '#6495ED', id: 5 },
    ]

    useEffect(() => {
        const mockData: any[] = []

        for (let i = 1; i <= 6; i++) {
            const random = Math.floor(Math.random() * mockStatuses.length)

            mockData.push({
                type: 'Feature',
                properties: {
                    cluster: false,
                    crimeId: i ?? '',
                    category: 'test',
                    name: `Объект номер ${i}`,
                    statuses: {
                        status: mockStatuses[random]?.id,
                        color: mockStatuses[random]?.color ?? 'grey',
                        description: mockStatuses[random]?.name ?? 'Статус отсутствует',
                    },
                },
                geometry: {
                    type: 'Point',
                    coordinates: [getRandomInRange(-100, 100, 3), getRandomInRange(-100, 100, 3)],
                },
            })
        }
        mockData.push({
            type: 'Feature',
            properties: {
                cluster: false,
                crimeId: 500 ?? '',
                category: 'test',
                name: `Объект номер ${500}`,
                statuses: {
                    status: mockStatuses[1]?.id,
                    color: mockStatuses[1]?.color ?? 'grey',
                    description: mockStatuses[1]?.name ?? 'Статус отсутствует',
                },
            },
            geometry: {
                type: 'Point',
                coordinates: [55.8163, 51.2887],
            },
        })

        setPoints2(mockData)
    }, [])
    ////*Для проверки нагрузки

    const showModal = () => {
        setOpen(true)
    }

    useEffect(() => {
        let localObjects: IObject[] = objects

        const dataForMap: any[] = []

        if (objectsIds !== undefined && objectsIds?.length > 0) {
            localObjects = objects.filter((obj) => objectsIds.includes(obj?.id))
        }

        localObjects.forEach((obj, index) => {
            const geolocation = obj.object_attributes.find(
                (attr) => attr.attribute?.data_type?.mnemo == 'geo_coordinates_2d'
            )

            const coordinates = JSON?.parse(geolocation?.attribute_value ?? '{}')

            if (coordinates !== undefined) {
                dataForMap.push({
                    type: 'Feature',
                    properties: {
                        cluster: false,
                        crimeId: obj?.id ?? '',
                        category: 'test',
                        name: obj?.name || 'Нет названия',
                    },
                    geometry: {
                        type: 'Point',
                        coordinates: [coordinates?.lng, coordinates?.lat],
                    },
                })

                if (showStatuses) {
                    const statusId = states.find((st) => st.entity == obj?.id)?.state
                    const status = statuses.find((status) => status?.id == statusId)

                    dataForMap[index].properties.statuses = {
                        status: status?.id ?? 1,
                        color: 'grey',
                        description: status?.name ?? 'Статус отсутствует',
                    }
                }
            }
        })

        setPoints(dataForMap)
    }, [objects])

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
    }, [map, objectsIds])

    useEffect(() => {
        if (!map) {
            return
        }
        map.on('moveend', onMove)

        return () => {
            map.off('moveend', onMove)
        }
    }, [map, onMove])

    const { clusters, supercluster } = useSupercluster({
        //@ts-ignore
        points: points2,
        bounds: bounds,
        zoom: zoom,
        options: { radius: 200, maxZoom: 17 },
    })

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

    useEffect(() => {
        const classesWithGeo = classes.filter(
            (cl) => cl.attributes.filter((attr) => attr.view_type?.type == 'geo_shape')?.length > 0
        )

        setClassesForMap(classesWithGeo)
    }, [classes])

    const handleMouseOver = (event) => {
        event.target.setStyle({
            fillOpacity: 0.4,
            weight: 3,
            strokeWidth: 3,
            strokeOpacity: 1,
        })
    }

    const handleMouseOut = (event) => {
        event.target.setStyle({
            fillOpacity: 0.25,
            weight: 1,
            strokeWidth: 1,
            strokeOpacity: 0.7,
        })
    }

    const onEachFeature = (country, layer) => {


        //Подсвечиваем зоны
        layer.options.color = 'grey'
        layer.options.fillColor = 'grey'
        layer.options.fillOpacity = 0.25
        layer.options.weight = 1
        layer.options.strokeWidth = 1
        layer.options.strokeOpacity = 0.7
        layer.options.zIndex = 9999999999999

        layer.on({
            mouseover: handleMouseOver,
            mouseout: handleMouseOut,
            click: (e) => {
                const dataForModal = e?.target?.feature?.properties

                L.popup()
                    .setLatLng(e.latlng)
                    .setContent(renderToString(<div>{dataForModal.NAME}</div>))
                    .openOn(layer._map)
            },
        })
    }

    const checkBoxHandler = (e, cl) => {
        let newData = [...dataForMapLayers]

        if (e == false) {
            newData = dataForMapLayers.filter((item) => item.class_id !== cl.id)
        }

        if (e == true) {
            const coordinates: any[] = []
            const chosenObjects = objects.filter((obj) => obj?.class_id == cl.id)

            chosenObjects.forEach((obj) => {
                const geo = obj.object_attributes.find(
                    (attr) => attr?.attribute?.view_type?.type == 'geo_shape'
                )?.attribute_value

                coordinates.push(geo)
            })
            newData.push({
                class_id: cl.id,
                coordinates: coordinates,
            })
        }
        setDataForMapLayers(newData)
    }

    useEffect(() => {
        const localPolygons: any[] = []
        const localPolylines: any[] = []

        dataForMapLayers.forEach((item) => {
            item.coordinates.forEach((coordinate) => {
                const geoCoordinate = JSON.parse(coordinate)

                if (geoCoordinate.geometry.type === 'Polygon') {
                    localPolygons.push(geoCoordinate)
                }

                if (geoCoordinate.geometry.type === 'Polyline') {
                    localPolylines.push(geoCoordinate.coordinates)
                }
            })
        })

        setPolygons(localPolygons)
        setPolylines(localPolylines)
    }, [dataForMapLayers])

    const handleClose = () => {
        setIsModalVisible(false)
        setObjForModalId(undefined)
    }

    return (
        <>
            <MapModalWithSettings open={open} setOpen={setOpen}>
                {classesForMap.map((cl) => {
                    return (
                        <CheckBox
                            onChange={(e) => {
                                checkBoxHandler(e.target.checked, cl)
                            }}
                            key={cl.id}
                        >
                            {cl.name}
                        </CheckBox>
                    )
                })}
            </MapModalWithSettings>
            <MapContainer
                //@ts-ignore
                zoom={5}
                // preferCanvas
                center={position}
                loadingControl={true}
                doubleClickZoom={false}
                style={{ height: '700px' }}
            >
                <Map setMap={setMap} />
                <div className="leaflet-top leaflet-right" style={{ padding: '1px' }}>
                    <div className="leaflet-control leaflet-bar">
                        <ButtonSettings onClick={showModal} />
                    </div>
                </div>

                {polygons?.length > 0 && (
                    <GeoJSON
                        key="geo_key"
                        data={polygons}
                        //@ts-ignore
                        onEachFeature={(country, layer) => onEachFeature(country, layer)}
                    >
                    </GeoJSON>
                )}

                {clusters?.map((cluster) => {
                    const [latitude, longitude] = cluster.geometry.coordinates

                    const { cluster: isCluster, point_count: pointCount } = cluster.properties

                    if (isCluster) {
                        const ClusterGroup = supercluster.getLeaves(Number(cluster.id), Infinity, 0)

                        return (
                            <LFMarker
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
                            </LFMarker>
                        )
                    }

                    return (
                        <React.Fragment key={`crime-${cluster.properties.crimeId}`}>
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
                                        setObjForModalId(cluster.properties.crimeId)
                                        setIsModalVisible(true)
                                    },
                                    mouseover: (e) => {
                                        e.target.openPopup()
                                    },
                                    mouseout: (e) => {
                                        e.target.closePopup()
                                    },
                                }}
                            >
                                <Popup>{cluster.properties?.name}</Popup>
                            </CircleMarker>
                        </React.Fragment>
                    )
                })}

                {polylines.length > 0 &&
                
                <Polyline positions={polylines}>
                    <Popup>test</Popup>
                </Polyline>}
            </MapContainer>

            <ObjectCardModal objectId={objForModalId} modal={{ open: isModalVisible, onCancel: handleClose }} />
        </>
    )
}

export default ObjectsMap
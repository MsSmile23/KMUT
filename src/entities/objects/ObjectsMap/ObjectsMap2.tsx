import { useStateEntitiesStore, selectStateEntities } from '@shared/stores/state-entities'
import { useStatesStore, selectStates } from '@shared/stores/states'
import { FC, useEffect, useRef, useState } from 'react'
import { MapContainer, Marker, Tooltip } from 'react-leaflet'
import L from 'leaflet'
import useSupercluster from 'use-supercluster'
import { Tag } from 'antd'
import { IObject } from '@shared/types/objects'
import React from 'react'
import { Map } from '@shared/ui/map'
import { useLayoutSettingsStore } from '@shared/stores/settingsLayout'
import { getPointData, getPolygonData, legendData } from './utils/utils'
import { selectObjectByIndex, useObjectsStore } from '@shared/stores/objects'
import ObjectCardModal from '@features/objects/ObjectCardModal/ObjectCardModal'
import { BBox } from 'geojson'
import { clusterIcon } from './utils/utils'
import { IMapGroup, IObjectsMap, IPoint, IPolygon } from './types/types'
import PolygonComponent from './components/PolygonComponent/PolygonComponent'
import CircleMarkerComponent from './components/CircleMarkerComponent/CircleMarkerComponent'
import { useGetObjects } from '@shared/hooks/useGetObjects'
import { parseJSON } from '@shared/utils/common'
import { getMediaFileFromStorage } from '@shared/api/MediaFiles/Models/getMediaFileFromStorage/getMediaFileFromStorage'

/**
 * Функциональный компонент для отображения карты с объектами, кластерами и легендой
 *
 * @param {IObjectsMap} props - Свойства компонента.
 * @param {object[]} props.objects - Объекты, в которых производится поиск для отображения на карте.
 * @param {number} props.startZoom - Начальный уровень зума карты.
 * @param {number[]} props.mapCenter - Координаты центра карты.
 * @param {boolean} props.isTile - Использовать ли тайлы для карты.
 * @param {boolean} props.fixedMap - Зафиксировать карту.
 * @param {boolean} props.isLegend - Показывать легенду.
 * @param {boolean} props.fitToMarkers - Нужно ли подгонять карту под маркеры.
 * @param {object} props.groups - Группы объектов с настройками.
 * @param {object} props.attributesBind - Аттрибуты контура объектов (для обратной совместимости, входит в groups).
 * @param {object} props.objectFilters - Фильтры для объектов (для обратной совместимости, входит в groups).
 * @param {boolean} props.isClustering - Включить ли кластеризацию (для обратной совместимости, входит в groups).
 * @param {number} props.clustersMaxZoom - Максимальный уровень зума для кластеризации (для обратной совместимости, 
 * входит в groups).
 * @param {string} props.viewTypeBeforeZoom - Тип отображения перед зумированием (для обратной совместимости, 
 * входит в groups).
 * @param {string} props.viewTypeAfterZoom -  Тип отображения после зумирования (для обратной совместимости, 
 * входит в groups).
 * @param {number} props.zoomLevel - Уровень зума карты для тип отображений (для обратной совместимости, 
 * входит в groups).
 */

const ObjectsMap2: FC<IObjectsMap> = ({ 
    objects, 
    startZoom = 14,
    mapCenter = [43.40758654559397, 39.95466648943133],
    attributesBind,
    fitToMarkers,
    objectFilters,
    isClustering = false,
    clustersMaxZoom = 11,
    viewTypeBeforeZoom,
    viewTypeAfterZoom,
    zoomLevel,
    isTile = true,
    fixedMap = false,
    isLegend = false,
    groups
}) => {
    // Извлечение данных из хранилищ
    const states = useStatesStore(selectStates)
    const statesEntities = useStateEntitiesStore(selectStateEntities)?.objects ?? []
    const objectsStoreFull = useObjectsStore()
    // const objectsStore = useObjectsStore(selectObjects)
    const objectsStore = useGetObjects()

    const getObjectByIndex = useObjectsStore(selectObjectByIndex)

    // Определение стейтов
    //Все настройки теперь из groups, эти стейты будут не нужны (только обратная совместимость)-----
    const [objectsForMap, setObjectsForMap] = useState<IObject[]>([])
    const [mapObjects, setMapObjects] = useState<IPolygon[]>([])
    const [points, setPoints] = useState<any>([])
    //----------------------------------------------------------------------------------------------

    // Для модалок
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [objForModalId, setObjForModalId] = useState<number | undefined>(undefined)
    
    //Для карты
    const [map, setMap] = useState<any>()              // Инициализация карты
    const [bounds, setBounds] = useState<any>(null)    // Границы карты
    const [zoom, setZoom] = useState(startZoom)        // Зум карты

    //Для формирования объектов для отображения
    const [groupedObjects, setGroupedObjects] = useState<{ [key: string]: IMapGroup }>({})
    const [objectsForLegend, setObjectsForLegend ] = useState([])                // Объекты для легенды
    const [clusterData, setClusterData] = useState([])                           // Объекты для кластеризации

    //! Костыльное решение для принудитешльного старового зума
    const [startZoomMap, setStartZoomMap] = useState<boolean>(true)

    const prevMapCenter = useRef(mapCenter)
    const icons = {}


    const getObjectsById = (objects: number[]) => {
        const objectsById: IObject[] = []

        objects.forEach((obj) => {
            const objectFull = objectsStoreFull.getByIndex('id', obj)

            if (objectFull) { objectsById.push(objectFull) }
        })

        return objectsById
    }

    // eslint-disable-next-line max-len
    //! Функция для проверки идентичности объектов( сделана костыльнно для избавление от перерендера карты каждую минуту)
    const checkObjects = (arr1, arr2) => {
        if (arr1.length !== arr2.length) {
            return true;
        }
    
        // Сравниваем каждый элемент двух массивов
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                return true;
            }
        }
    
        // Если все элементы совпали, значит массивы одинаковые
        return false;
    }


    //Записываем переданные объекты в стейт (старая логика, для обратной совместимости)
    useEffect(() => {
        if (objects && objects?.length > 0 && !checkObjects(objectsForMap, getObjectsById(objects) )) {
            setObjectsForMap(getObjectsById(objects))
        }
    }, [objects])

    //Фильтрация объектов, если передан objectFilters (старая логика, теперь данные для поиска объектов в groups)----
    useEffect(() => {
        if (objects === undefined && objectFilters?.classIds?.length > 0) {
            const filteredObjects = objectsStore?.filter((obj) => objectFilters?.classIds?.includes(obj.class_id))

            setObjectsForMap(filteredObjects)
        } else if (objects === undefined && objectFilters?.classIds?.length === 0) {
            setObjectsForMap(objectsStore) 
        } else if (objects !== undefined && objectFilters?.classIds?.length > 0) {
            const filteredObjects = getObjectsById(objects)
                ?.filter((obj) => objectFilters?.classIds?.includes(obj.class_id))

            setObjectsForMap(filteredObjects) 
        } else if (objects !== undefined && objectFilters?.classIds?.length === 0) {
            setObjectsForMap(getObjectsById(objects))
        }
    }, [objectFilters])

    //Карта------------------------------------------------------------------------------------------------------------
    //Обновление карты при сдвиге и обновлении объектов
    function updateMap() {
        if (!map) {
            return
        }
        const b = map.getBounds()

        setBounds([b.getSouthWest().lng, b.getSouthWest().lat, b.getNorthEast().lng, b.getNorthEast().lat])
        setZoom(map.getZoom())
    }

    useEffect(() => {
        updateMap()
    }, [map, objectsForMap])

    useEffect(() => {
        if (!map) {
            return
        }
        map.on('moveend', updateMap)

        return () => {
            map.off('moveend', updateMap)
        }
    }, [map])

    //Проверяем изменился ли центр
    const areCoordinatesEqual = () => {
        return prevMapCenter.current[0] === mapCenter[0] && prevMapCenter.current[1] === mapCenter[1];
    }

    //Обновляем карту, если поменялся центр или зум
    useEffect(() => {
        if (map) {
            setZoom(startZoom)
            map.setView(mapCenter, startZoom)
            prevMapCenter.current = mapCenter 
        }
    }, [startZoom, map, areCoordinatesEqual()])

    // Автоцентрирование карты, отображение всех точек на карте
    useEffect(() => {
        if (fitToMarkers) {
            // Тут нужно собрать все объекты, которые выводятся на карте, чтобы рассчитать границы карты.
            const pointCoordinates = points?.map((obj) => obj.geometry.coordinates).map(([lng, lat]) => [lat, lng])
            const contourCoordinates = mapObjects?.map((obj) => obj.coordinatesPolygon)

            Object.values(groupedObjects).forEach(group => {
                const groupPointCoordinates = group.points.map((obj) => obj.geometry.coordinates)
                    .map(([lng, lat]) => [lat, lng])

                pointCoordinates.push(...groupPointCoordinates)
    
                const groupContourCoordinates = group.polygons.map((obj) => obj.coordinatesPolygon)

                contourCoordinates.push(...groupContourCoordinates)
            })

            pointCoordinates.push(...contourCoordinates)

            if (pointCoordinates.length > 0) {
                map.fitBounds(pointCoordinates)
            }   
        }
    }, [points, mapObjects, fitToMarkers])

    //Объекты---------------------------------------------------------------------------------------------------------

    //Данные для точек
    useEffect(() => {
        const dataForPoints = objectsForMap?.reduce((dataPoints: IPoint[], obj) => { 
            const point = getPointData(obj, attributesBind, states, statesEntities)

            if (point) {
                dataPoints.push(point)
            }

            return dataPoints
        }, [])

        //Объединяем массив контуров с массивом точек
        setPoints([...dataForPoints, ...mapObjects])
    }, [objectsForMap, attributesBind?.coordinates, mapObjects])



    //*Функция конвертации ОА (для атрибутов, где координаты указаны файлом)
    const convertObjectsArr = async (objArr) => {
        if (!Array.isArray(objArr)) {
            console.error('objArr is not an array:', objArr);
            
            return [];
        }
    
        const transformedArray = await Promise.all(
            [...objArr].map(async (obj) => {
                if (!Array.isArray(obj?.object_attributes)) {
                    console.warn('object_attributes is not an array for obj:', obj);
                    
                    return obj;
                }
    
                const updatedAttributes = await Promise.all(
                    obj.object_attributes.map(async (attr) => {
                        try {
                            if (attr?.attribute?.data_type?.mnemo === 'geo_json') {
                                const attrValue = parseJSON(attr?.attribute_value);
    
                                if (attrValue?.type == 'file') {
                                    const resp = await getMediaFileFromStorage({ url: attrValue?.url });
    
                                    if (resp?.success && resp?.data) {
                                        return { ...attr, attribute_value: JSON.stringify(resp.data) };
                                    }
                                }
                            }
                        } catch (error) {
                            console.error('Error processing attribute:', attr, error);
                        }
    
                        return attr;
                    })
                );
    
                return { ...obj, object_attributes: updatedAttributes };
            })
        );
    
        return transformedArray;
    };

    //.filter(item=>item.name.includes('Томская'))?.
    //Данные для объектов с контурами
    useEffect(() => {
        convertObjectsArr(objectsForMap).then(result => {
            const polygons = result?.reduce((tmpMapObjs: IPolygon[], obj) => {
                const polygon = getPolygonData(obj, attributesBind, states, statesEntities)

                if (polygon) {
                    tmpMapObjs.push(polygon)
                }
        
                return tmpMapObjs
            }, [])

            setMapObjects(polygons)
        })
     
    }, [objectsForMap, attributesBind?.contour])

    const dataForLegend = legendData(objectsForLegend)

    const getData = async () => {
        if (objects && objects.length > 0) {
            const updatedGroups = {};

            Object.entries(groups ?? {}).forEach(async ([groupKey, groupData]) => {
                let filteredObjects: IObject[] = []

                //Фильтрация по классу через получение списков по индексу из стора
                groupData?.objectFilters?.classIds.forEach(classId => {
                    filteredObjects = [
                        ...filteredObjects,
                        ...getObjectByIndex('class_id', classId) as IObject[]
                    ]
                })

                // Сохраняем отфильтрованные объекты в группу
                updatedGroups[groupKey] = {
                    ...groupData,
                    objects: filteredObjects,
                    points: [],
                    polygons: []
                }
                //*Конвертируем атрибуты на случай файла с координатами
                filteredObjects = await convertObjectsArr(filteredObjects)        
                const points = filteredObjects?.reduce((dataPoints: IPoint[], obj) => {
                    const point = getPointData(
                        obj, groupData.attributesBind, states, statesEntities, groupData.coordinates)

                    if (point?.geometry?.coordinates !== undefined) {
                        dataPoints.push(point)
                    }

                    return dataPoints
                }, [])

                const polygons = filteredObjects?.reduce( (tmpMapObjs: IPolygon[], obj) => {
                    const polygon =  getPolygonData(obj, groupData.attributesBind, states, statesEntities)            

                    if (polygon?.geometry?.coordinates !== undefined) {
                        tmpMapObjs.push(polygon)
                    }

                    return tmpMapObjs
                }, [])

                updatedGroups[groupKey] = {
                    ...groupData,
                    objects: filteredObjects,
                    points: [...points],
                    polygons: polygons
                }

                // Передаем объекты для легенды (было реализовано лоя регионов)
                setObjectsForLegend(polygons)

                // Передаем объекты для кластеров
                if (groupData.isClustering) {
                    setClusterData([
                        ...updatedGroups[groupKey].points, 
                        ...updatedGroups[groupKey].polygons
                    ])
                }
            })

            setGroupedObjects(updatedGroups)
        }
    }

    useEffect(() => {

        //TODO:: внимание! в фильтры подаются все объекты из стора без ограничений
        getData().then()
    }, [objects, groups, states, statesEntities])

    const handleObjectClick = (id: number) => {
        setIsModalVisible(true)
        setObjForModalId(id)
    }

    //Кластеры---------------------------------------------------------------------------------------------------------
    //Костыль!!! Расширяем границы, чтобы контуры не пропадали при частичном нахождении за пределами карты
    const maxBounds = bounds ? [bounds[0] - 1, bounds[1] - 1, bounds[2] + 1, bounds[3] + 1 ] : null

    const { clusters, supercluster } = useSupercluster({
        points: [...points, ...clusterData],
        bounds: maxBounds as BBox,
        zoom: zoom,
        options: { 
            // radius: (isClustering || viewTypeBeforeZoom === 'clustersVeiw') ? 100 : 0, // так можно отключать кластер
            radius: 100, 
            maxZoom: Number(clustersMaxZoom) === 0 ? 11 : Number(clustersMaxZoom),
            minPoints: 1 
        },
    })

    //Модалка для кластеров
    const modalMarkerGroup = (count, points, reg, countryName) => {
        const counts = {}

        Object.entries<any>(points).map(([, value]) => {
            counts[value?.properties?.statuses?.description] = {
                count: (counts[value?.properties?.statuses?.description]?.count || 0) + 1,
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
        return modalMarkerGroup(count, points, 0, countryName)
    }

    //----------------------------------------------------------------------------------------------------------------
    /**
     * Стейт для сохранения контекста tooltip после открытия модального окна
     * используется для удаления после закрытия модального окна
     */
    const [ tooltipContext, setTooltipContext ] = useState<any>()
    const ref = useRef();
    //const [width, setWidth] = useState<any>('100%');
    //const [height, setHeight] = useState<any>('100%');
    const width = '100%'
    const height = '100%'
    const { dataLayout } = useLayoutSettingsStore()

    useEffect(() => {     
        setTimeout(() => {
            if (ref?.current !== undefined) {
                // @ts-ignore
                ref?.current?.invalidateSize();
            }
        }, 400 );
    }, [dataLayout.leftSidebar.visibility])

    //Закрытие модального окна и скрытие tooltip
    const handleClose = () => {
        setIsModalVisible(false)
        setObjForModalId(undefined)

        if (tooltipContext) {
            setTimeout(() => {
                tooltipContext?.closeTooltip?.()
            }, 270)
        }
    }

    //!Костыль для принудительно стартового зума
    useEffect(() => {
        if (startZoomMap && map && startZoom) {

            setTimeout(() => {

                map?.setZoom(startZoom) 
                setStartZoomMap(false)
            }, 300)
        
        }
    }, [map, startZoomMap])
    //!Костыль для принудительно стартового зума

    return (
        <div style={{ width, height, position: 'relative' }}>
            {/* <Button
                onClick={() => {
                    map?.setZoom(10) 
                    // setZoom(1)
                }}
            > 
            </Button> */}
            <MapContainer
                ref={ref}
                //@ts-ignore
                zoom={zoom}
                center={mapCenter}
                //@ts-ignore
                loadingControl={true}
                doubleClickZoom={false}
                style={{ height: '100%',  width: '100%', background: '#fff' }}
            >
                <Map setMap={setMap} isTile={isTile} isMapBlocked={fixedMap} />

                {clusters?.map((cluster, i) => {
                    const [latitude, longitude] = cluster.geometry.coordinates
                    const { cluster: isCluster, point_count: pointCount } = cluster.properties

                    // Получаем настройки из группы с пометкой кластера
                    const groupData = Object.entries(groupedObjects)?.find(([groupKey, groupData]) => 
                        groupData.isClustering === true
                    )?.[1]

                    const zoomLvl = groupData?.zoomLevel ?? zoomLevel
                    const beforeZoom = groupData?.viewTypeBeforeZoom ?? viewTypeBeforeZoom
                    const afterZoom = groupData?.viewTypeAfterZoom ?? viewTypeAfterZoom

                    if (isCluster && (!groupData || Object.keys(groupData)?.length > 0)) {
                        const ClusterGroup = supercluster.getLeaves(Number(cluster.id), Infinity, 0)

                        return (
                            <Marker
                                key={`cluster-${cluster.id}`}
                                position={[longitude, latitude]}
                                //@ts-ignore
                                icon={clusterIcon(
                                    pointCount, 40 + (pointCount / [ ...points, ...clusterData ].length) * 40,
                                    L, ClusterGroup, icons)}
                                eventHandlers={{
                                    click: () => {
                                        const expansionZoom = Math.min(
                                            supercluster.getClusterExpansionZoom(cluster.id as number),
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
                                <Tooltip direction="top" offset={[0, -5]}>
                                    {dataModal(pointCount, supercluster.getLeaves(Number(cluster.id), Infinity, 0))}
                                </Tooltip>
                            </Marker>
                        )
                    }

                    return (
                        <React.Fragment key={i}>   
                            {//@ts-ignore
                                cluster.geometry.type == 'Polygon' 
                                && (typeof zoomLvl == 'undefined' 
                                || (Number(zoomLvl) >= zoom
                                && beforeZoom !== ('pointsVeiw' || 'clustersVeiw'))
                                || (Number(zoomLvl) < zoom 
                                && afterZoom !== 'pointsVeiw')) && (
                                    <PolygonComponent polygon={cluster} onClick={handleObjectClick} />
                                )
                            } 
                            {//@ts-ignore
                                // cluster.geometry.type == 'Point' &&
                                (typeof zoomLvl == 'undefined' 
                                || (Number(zoomLvl) >= zoom 
                                && beforeZoom !== ('polygonsVeiw' || 'clustersVeiw'))
                                || (Number(zoomLvl) < zoom 
                                && afterZoom !== 'polygonsVeiw')) && (
                                    <CircleMarkerComponent point={cluster} onClick={handleObjectClick} />
                                )
                            }                         
                        </React.Fragment>
                    )
                }                
                )}

                {Object.entries(groupedObjects).map(([groupKey, groupData], i) => {
                    const { 
                        isClustering, 
                        zoomLevel, 
                        representationType, 
                        viewTypeBeforeZoom, 
                        viewTypeAfterZoom,
                        polygons,
                        points 
                    } = groupData

                    if (!isClustering) {

                        return (
                            <React.Fragment key={`${i}-${groupKey}`}>
                                {representationType !== 'points' &&
                                (typeof zoomLevel == 'undefined' 
                                || (Number(zoomLevel) >= zoom
                                && viewTypeBeforeZoom !== ('pointsVeiw' || 'clustersVeiw'))
                                || (Number(zoomLevel) < zoom 
                                && viewTypeAfterZoom !== 'pointsVeiw')) &&
                                polygons.map((polygon) => (
                                    <PolygonComponent 
                                        key={polygon.properties.pointId} 
                                        polygon={polygon} 
                                        onClick={handleObjectClick} 
                                    />)
                                )}
                                {representationType !== 'polygons' &&
                                (typeof zoomLevel == 'undefined' 
                                || (Number(zoomLevel) >= zoom 
                                && viewTypeBeforeZoom !== ('polygonsVeiw' || 'clustersVeiw'))
                                || (Number(zoomLevel) < zoom 
                                && viewTypeAfterZoom !== 'polygonsVeiw')) &&
                                points.map((point) => (
                                    <CircleMarkerComponent 
                                        key={point.properties.pointId} 
                                        point={point}
                                        onClick={handleObjectClick}
                                    />
                                ))}
                            </React.Fragment>
                        )
                    }})}

            </MapContainer>
            {isLegend && 
                <div 
                    style={{ 
                        width: 120, 
                        // height: 200, 
                        position: 'absolute',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                        top: '50%', 
                        right: 30, 
                        zIndex: 5000 }}
                >
                    {dataForLegend.map((state, i) => (
                        <div 
                            key={`${state.description}-${i}`} 
                            style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span 
                                    style={{ 
                                        background: state.color, 
                                        width: 8, 
                                        height: 8, 
                                        borderRadius: 4 }}
                                >
                                </span>
                                <div style={{ fontWeight: 700, fontSize: 8 }}>{state.description}</div>
                            </div> 
                            <div style={{ fontWeight: 700, fontSize: 8 }}>{`${state.count}%`}</div>
                        </div>
                    ))}
                </div>}
            <ObjectCardModal objectId={objForModalId} modal={{ open: isModalVisible, onCancel: handleClose }} />
            
        </div>
    )
}

export default ObjectsMap2
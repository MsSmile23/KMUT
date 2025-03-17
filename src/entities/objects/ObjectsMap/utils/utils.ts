import { jsonParseAsObject } from '@shared/utils/common'
import { IState } from '@shared/types/states'
import { IStateEntity } from '@shared/types/state-entities'
import { getStateViewParamsWithDefault } from '@shared/utils/states'
import { IPoint, IPolygon } from '../types/types'
import { IObject } from '@shared/types/objects'

//Конвертация цвета (для яркости объектов)
export const adjustBrightness = (color, percent) => {
    // Проверка на формат HEX
    if (color?.startsWith('#')) {
        // Преобразование HEX в RGB
        let r = parseInt(color.slice(1, 3), 16) - 15
        let g = parseInt(color.slice(3, 5), 16) + 10
        let b = parseInt(color.slice(5, 7), 16) + 10

        // Увеличение яркости на заданный процент
        r = Math.round(Math.min(255, r * (1 + percent / 100)));
        g = Math.round(Math.min(255, g * (1 + percent / 100)));
        b = Math.round(Math.min(255, b * (1 + percent / 100)));

        // Преобразование обратно в HEX
        return `#${r.toString(16)
            .padStart(2, '0')}${g.toString(16)
            .padStart(2, '0')}${b.toString(16)
            .padStart(2, '0')}`;
    }

    // Возврат исходного цвета, если не удалось его обработать
    return color;
}

export const legendData = (points: IPoint[]) => {
    const counts = []

    points.forEach((item) => {
        counts[item?.properties?.statuses?.description] = {
            count: (counts[item?.properties?.statuses?.description]?.count || 0) + 1,
            color: item?.properties?.statuses?.color,
        }
    })

    const legendArray = Object.keys(counts).map((key) => ({
        description: key,
        count: Math.round((counts[key].count / points.length) * 100),
        color: counts[key].color,
    }))

    legendArray.sort((a, b) => b.count - a.count);

    return legendArray
}

export const clusterIcon = (count, size, L, status, icons) => {
    //Считаем одинаковые статусы
    const counts = {}

    status.map((item) => {
        counts[item?.properties?.statuses?.description] = {
            count: (counts[item?.properties?.statuses?.description]?.count || 0) + 1,
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
    Object.entries<any>(counts).map(([, item]) => {
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

    icons[count] = L.divIcon({
        html: `
                <svg 
                    xmlns="http://www.w3.org/2000/svg"
                    width=${size}
                    height=${size}
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

    return icons[count]
}

// Координаты полигона
const getPolygonFromObject = (obj: IObject, attributesBind: any) => {
    let polygon: any;

    if (attributesBind?.contour?.attribute_id !== undefined) {
        try {
            const polygonData = !!obj.object_attributes && JSON.parse(obj.object_attributes?.find(
                (oa) => oa.attribute_id === attributesBind?.contour?.attribute_id
            )?.attribute_value)

            const geometry = polygonData?.geometry ? polygonData.geometry : polygonData?.features?.[0]?.geometry

            if (geometry == undefined || geometry?.coordinates == undefined) {
                return undefined
            }


            // Если мультиполигон
            if (Array.isArray(geometry.coordinates[0][0])) {


                
                // //Альтернативый перебор для дебага
                // geometry.coordinates
                //     ?.forEach(item => item
                //         ?.forEach(ring => ring
                //             ?.forEach(test => console.log(test))
                //     ))
                //!ХАРДКОД
                polygon = geometry.coordinates
                    ?.map(item => 
                        
                    {
                      
                        
                        return    item
                            .map(ring =>
                                
                            {  
                                const test = ring?.length !== 2
 
                                
                                return test ? ring  .map(([lng, lat]) => {
                                    
                                    return [lat, lng]})
                                    : [ring[1], ring[0]]

                                   
                                //Спотыкается здесь на данный МОбл,
                                // пытается итерироваться по координате, то есть массива нет
                            })})
            } else {
                polygon = geometry.coordinates.map(([lng, lat]) => [lat, lng])
            } 
        } catch (e) {
            console.log(e)

            return undefined
        }

        return polygon
    } else if (attributesBind?.contour?.stereotype_id !== undefined && obj.object_attributes.find(
        (oa) => oa?.attribute?.attribute_stereotype_id === attributesBind?.contour?.stereotype_id
    )?.attribute_value !== null) {
        try {
            polygon = JSON.parse(obj.object_attributes.find(
                (oa) => oa?.attribute?.attribute_stereotype_id === attributesBind?.contour?.stereotype_id
            )?.attribute_value)?.features?.[0].geometry.coordinates.map(([lng, lat]) => [lat, lng])
        } catch {
            return undefined
        }
    }


    return polygon
}

// Координаты точки
const getPointFromObject = (obj: IObject, attributesBind: any, coordinates: { x: number, y: number },) => {
    let pointCoordinates

    function getValue(coordX: number) {
        const value = obj?.object_attributes?.find(
            (attr) => attr.attribute_id == coordX
        )?.attribute_value
        const parsedValue = parseFloat(value.replace(',', '.'))

        return !isNaN(parsedValue) ? parsedValue : undefined
    }

    if (attributesBind?.coordinates !== undefined) {
        const allCoordinates = jsonParseAsObject(obj?.object_attributes?.find(
            (attr) => attr.attribute?.data_type?.mnemo === 'geo_coordinates_2d'
        )?.attribute_value)
    
        if (allCoordinates === undefined || Object.keys(allCoordinates).length === 0) {
            return undefined
        }
    
        pointCoordinates = obj?.object_attributes?.find(
            (attr) => attr.attribute_id === attributesBind?.coordinates
        )?.attribute_value ?? allCoordinates
    } else if (coordinates?.x && coordinates?.y) {
        const x = getValue(coordinates?.x)
        const y = getValue(coordinates?.y)

        if (x === undefined || y === undefined) {
            return undefined
        }

        pointCoordinates = [x, y]
    }
    
    return pointCoordinates
}

const getStateForMap = (
    obj: IObject,
    states: IState[],
    statesEntities: IStateEntity[]
) => {
    const stateId = statesEntities?.find((st) => st?.entity === obj?.id)?.state;
    const objState = states.find((state) => state?.id === stateId);
    const stateParamsMap = getStateViewParamsWithDefault(objState);

    return { stateParamsMap, objState };
};

// Данные для полигона
export const getPolygonData = (
    obj: IObject, 
    attributesBind: any, 
    states: IState[], 
    statesEntities: IStateEntity[]
): IPolygon => {
    const polygon = getPolygonFromObject(obj, attributesBind)

    if (!polygon) { return undefined }

    const { stateParamsMap, objState } = getStateForMap(obj, states, statesEntities)

    return {
        type: 'Feature',
        class_id: obj.class_id,
        coordinatesPolygon: polygon,
        geometry: {
            type: 'Polygon',
            coordinates: Array.isArray(polygon[0][0]) 
                ? [polygon[0][0][1], polygon[0][0][0]] 
                : [polygon[0][1], polygon[0][0]],
        },
        properties: {
            pointId: obj.id,
            name: obj.name,
            state: objState,
            stateParamsMap: stateParamsMap,
            cluster: false,
            statuses: {
                color: stateParamsMap?.fill,
                description: objState?.view_params?.name,
            },
        },
    }
}

// Данные для точки
export const getPointData = (
    obj: IObject, 
    attributesBind: any,
    states: IState[], 
    statesEntities: IStateEntity[],
    coordinates?: { x: number, y: number },
): IPoint => {
    const pointCoordinates = getPointFromObject(obj, attributesBind, coordinates)

    if (!pointCoordinates || pointCoordinates?.[0] === undefined || pointCoordinates?.[1] === undefined) { 
        return undefined 
    }

    const { stateParamsMap, objState } = getStateForMap(obj, states, statesEntities)

    return {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [
                pointCoordinates?.lng || pointCoordinates?.[1], 
                pointCoordinates?.lat || pointCoordinates?.[0]],
        },
        properties: {
            pointId: obj.id,
            name: obj.name,
            cluster: false,
            statuses: {
                color: stateParamsMap?.fill,
                description: objState?.view_params?.name,
            },
        },
    }
}
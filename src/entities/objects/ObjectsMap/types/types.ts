import { IClass } from '@shared/types/classes'
import { IObject } from '@shared/types/objects'
import { IState } from '@shared/types/states'

export interface IObjectsMap {
    objects: IObject['id'][]
    startZoom: number
    mapCenter: [number, number]
    attributesBind?: {
        coordinates?: number
        contour?: {
        attribute_id?: number
        stereotype_id?: number
    }
    }
    fitToMarkers?: boolean,
    objectFilters?: {
            classIds?: IClass['id'][]
            }
    isClustering?: boolean
    clustersMaxZoom?: number
    viewTypeBeforeZoom?: 'pointsVeiw' | 'polygonsVeiw' |'clustersVeiw'
    viewTypeAfterZoom?: 'pointsVeiw' | 'polygonsVeiw' //|'clustersVeiw'
    zoomLevel?: number,
    isTile?: boolean,
    fixedMap?: boolean,
    isLegend?: boolean,
    groups: IMapGroups
}

interface IStateParamsMap {
    fill: string;
    border: string;
    borderWidth: number;
    textColor: string;
    icon: string;
    name: string;
}

interface IGroup {
    order: number,
    attributesBind?: { 
        coordinates?: number
        contour?: {
            attribute_id?: number
            stereotype_id?: number
        }
    },
    objectFilters?: {
        classIds: IClass['id'][]
    },
    representationType: 'points' | 'polygons' | 'pointsAndPolygons',
    isClustering?: boolean,
    clustersMaxZoom?: number,
    // сombinedMode?: boolean,
    zoomLevel?: number,
    viewTypeBeforeZoom?: 'pointsVeiw' | 'polygonsVeiw' |'clustersVeiw'
    viewTypeAfterZoom?:  'pointsVeiw' | 'polygonsVeiw', //|'clustersVeiw'
    coordinates?: { x: number, y: number }
}

interface IMapGroups {
    [key: string]: IGroup
}

export interface IMapGroup extends IGroup {
    objects: IObject['id'][]
    points?: IPoint[]
    polygons?: IPolygon[]
}

export interface IPolygon {
    type: 'Feature',
    class_id?: number,
    coordinatesPolygon?: L.LatLngExpression[] | L.LatLngExpression[][] | L.LatLngExpression[][][],
        geometry: 
        {
            type: 'Polygon',
            coordinates: L.LatLngExpression,
        },
        properties: {
            pointId: number,
            name: string,
            cluster: boolean,
            state?: IState,
            stateParamsMap?: IStateParamsMap,
            statuses: {
                color: string,
                description: string
            },
        }     
}

export interface IPoint extends Omit<IPolygon, 'geometry' | 'class_id' | 'coordinatesPolygon' | 'properties'> {
    geometry: {
        type: 'Point'
        coordinates: L.LatLngExpression;
    };
    properties: Omit<IPolygon['properties'], 'state' | 'stateParamsMap'>
}
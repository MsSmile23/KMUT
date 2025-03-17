import { IObject } from '@shared/types/objects'

export interface IObjectCableMap {
    parentObject?: number | IObject
    paintCablesByState?: boolean
    height?: number | string
    cablesPortsDevices?: Record<'cable' | 'portA' | 'portB' | 'deviceA' | 'deviceB', IObject>[] | {
        portA?: IObject;
        portB?: IObject;
        deviceA: IObject;
        deviceB?: IObject;
        cable?: IObject;
    }[]
    cableClasses?: number[]
    childClassesIds?: number[]
    targetClassesIds?: number[]
    relationsCablePort?: number[];
    relationsPortDevice?: number[];
    attributes?: {
        id: number,
        value: boolean | number | string,
        method: 'both' | 'some'
    },
    isInitialPositionMap?: boolean
    mnemoMapCore?: string;
    backgroundColorMap?: string
    devicesClasses?: number[]
    portClasses?: number[]
}

export type CoordinateContextType = {
    top: number,
    left: number,
    bottom: number,
    right: number,
    width: number,
    height: number,
    oldCoordinatePoint: {
        top: number,
        left: number,
    },
    indexPosition: number,
    id: string,
    name: string
}

export type coordTooltipLineInitial = {
    x: number,
    y: number,
    content: any[]
}
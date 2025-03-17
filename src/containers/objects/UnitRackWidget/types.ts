import { IObject } from '@shared/types/objects'
import { IState } from '@shared/types/states'

export interface IRackParams<T> {
    maxPower: T
    currentPower: T
    temperature: T
    humidity: T
}

// удалить "?" после ввода виджета в эксплуатацию
export interface IUnitRackWidgetProps {
    object: IObject
    width?: number
    backgroundColor?: string
    rackNameLength?: number
    deviceNameLength?: number
    rackSizeId?: number
    unit?: {
        rackRelationId?: number
        orderAttributeId?: number
    }
    deviceUnit?: {
        relationId?: number
        relationIds?: number[]
        sizeAttributeId?: number
        unitPlacements?: number[]
    }
    unitsFilterIds?: number[]
    attributeIds?: Partial<IRackParams<[number, number]>>
    rackParams?: Partial<IRackParams<number>>
    loading?: boolean
    unitsDirection?: 'direct' | 'reverse'
}

export interface IUnit {
    id: number
    name: string
    order: number
    device?: {
        id: number
        name: string
        size: number
        classId: number
        state: IState | undefined
        links_where_left?: {
            right_object_id: number
        }[]
    }
}
import { IVoshodRegionStatuses } from '@shared/types/voshod'

export interface IGridObject {
    id: number
    name: string
    color: string
    x: number
    y: number
}

export type TViewType = 'square' 

export interface IECGridMap {
    rows?: number
    columns?: number
    objects: IVoshodRegionStatuses[]
    onClick?: (id: IVoshodRegionStatuses['id']) => void
    viewType?: TViewType 
}
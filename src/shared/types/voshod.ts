export interface IVoshodRegionStatus {
    id: number
    name: string
    classId: number
    status: {
        color: string
    }
    dost: number
    statusCount: {
        connected: number
        notAvailable: number
        repair: number
    }
    municipalities: {
        id: number
        name: string
        status: {
            color: string
        }
        statusCount: {
            connected: number
            notAvailable: number
            repair: number
        }
        dost: number
    }[]
}

export interface IVoshodRegionStatusesPayload {
    filters: {
    filterType: string
    backFilterName: string
    filterClassId: number
    filterLabel: string
    filterView: string
    values: number[]
    }[]
}
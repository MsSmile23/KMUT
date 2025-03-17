/* eslint-disable */
export type TReportFormFilters = {
    reportTypesAllowArray?: Array<number>,
    reportFormatsAllowArray?: Array<string>,
    linkedClassesForObjects?: Array<number>
}

export type TPagination = { 
    page: number, 
    pageSize: number, 
    enablePageSelector: boolean 
}

export type TTableOptions = {
    paginator?: TPagination
    height?: number
    authorOfReport?: string
}

export type TReports = {
    filters?: TReportFormFilters,
    tableOptions?: TTableOptions
}

export type TPage = {
    name: string, 
    url: string,   
    vtemplate_id: number,
    isActive: boolean
}


export type TSelect = {
    label:string;
    value: number;
}

export type TReportState = {
    widget: TReports,
    vtemplate: {
        objectId?: number
    }
}

export type TWidgetReports = {
    onChangeForm?: <T>(data: T) => void
    settings: TReportState
}

export type TOptionType = {
    value: string;
    label: string;
};  
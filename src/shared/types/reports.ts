import { Moment } from 'moment-timezone'

export type TId = { id: number }
export type TReportType = PartialNull<{
    name: string
    mnemo: string 
}> & TId
export type TReport = PartialNull<{
    report_type_id: number | string
    author_name: string
    author_id: number
    created_at: string
    finished_at:  string
    start_datetime:  Moment
    end_datetime:  Moment
    objects: number[]
    status: number | string
    progress_bar: number
    report_type: TReportType
    formats?: string[]
    ready_formats: Array<{
        mnemo: string
        status: number
        message: string
    }>
    author: {
        id: number
        login: string
        email: string
        full_name: string
        company_name: string | null
        phone_number: string | null
    }
    root_class: string | number
    root_attributes: any[]
    timeRounding: number
    frequency_type?: string | number
    frequency?: string | number
    frequency_started_at?: Moment
    construction_period?: string
    selectedObjects?: number[]
}> & TId

export type TReportPayload = {
    report_type_id: number
    start_datetime: string
    end_datetime: string
    objects: number[]
    formats: string[]
}

// todo: experimantal utility, оставить?
export type PartialNull<T> = {
    [P in keyof T]: T[P] | null;
};
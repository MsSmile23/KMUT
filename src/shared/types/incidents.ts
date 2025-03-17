// todo: типизировать any после заполнения доки
export interface IIncident {
    id: number
    name: string
    description: string
    object_id: number
    severity_level: string
    sd_case_number: number
    sd_application_status: string
    sd_responsible_name: string
    kmut_url: string
    started_at: string
    finished_at: string
    last_sync_date: string
    attempts: number
    sync_status: number
    task_state_date: string
    object: {
        id: number
        class_id: number
        name: string
        codename: any
    }
}
export interface IRole {
    id: number
    name: string
    interface_elements: any
    permissions_flg: any
    interfaces: string[]
    permissions: any[]
    password_change_freq_max_days?: number
    password_expiration_days?: number
    password_last_unique_count_min?: number
    password_min_length?: number
}

export interface IRolePostPayload {
    name: string,
    interface_elements: any
    permissions_flg: any
    interfaces: string[]
    permissions: number[]
}
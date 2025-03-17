export interface IAccount extends IAccountPost {
    id: number,
}

export interface IAccountGet extends IAccount {
    role?: IAccountRole,
    created_at?: string,
    updated_at?: string,
    is_deletable: number
    token?: string
}

export interface IAccountPost {
    login: string,
    email: string,
    role_id: number,
    group_permission_id: number,
    password?: string,
    settings?: string | null
}
export interface IAccountRole {
    id: number,
}
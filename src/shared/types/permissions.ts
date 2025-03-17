export interface IPermission {
    id: number
    name: string
    mnemo: string
    permissions: {
        id: number
        name: string
        guard_name: string
        permission_section_id: number
        label: string
    }[]
}

export interface IPermissionsGroup {
    id: number
    name: string
    mnemo: string
    children: IPermission[]
    created_at: string
    updated_at: string
    description: string | null
    parent_id: number | null
}
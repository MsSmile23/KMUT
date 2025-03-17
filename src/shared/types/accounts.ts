import { IGroupPolicy } from './group-policies'
import { IRole } from './roles'

export type IInterfaces = 'constructor' | 'manager' | 'showcase'
export interface IAccount {
    id: number | null
    login: string | null
    email: string | null
    group_permission_id: number | null,
    role_id: number | null,
    // role: {
    //     interfaces: IInterfaces[],
    //     name: string
    // } | null,
    role: IRole,
    user_group_id: number | null,
    settings: any,
    full_name: string,
    company_name: string,
    position: string,
    phone_number: string
    groupPolicies?: IGroupPolicy[]

//     name: string | null
//     created_at?: string | null
//     updated_at?: string | null
}
export interface IFullAccount {
    token: string
    user: IAccount
}

export interface IAccountPost {
    login: string
    email: string
    role_id: number 
    settings?: any,
    password: string
    full_name: string,
    company_name: string,
    position: string,
    phone_number: string
    groupPolicies: number[]
}
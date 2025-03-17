import { AxiosError, Method } from 'axios'

export interface IApiReturnObject<T> extends Omit<IApiReturn<T>, 'meta'> {}
export interface IApiReturn<T> {
    success: boolean
    data: T
    code?: number
    meta?: {
        current_page: number
        per_page: number
        total?: number
        from?: number
        to?: number
        last_page?: number
    }
    codeMessage?: string,
    statusText?: string,
    status?: number,
    message?: string
    errors?: Record<string, string[]>
    error?: any
}

export interface ISchemeMethod {
    method: Method
    url: string
}

export type IApiEntityScheme<T extends string | number> = Record<T, ISchemeMethod>

export interface IApiGetPayload {
    sortBy?: string
    limit?: number
    page?: number
    id?: string
    all?: boolean
    sort?: string
    filters?: Record<string, any[] | string | number | boolean>
    sorting?: string[] | string,
    per_page?: number
}
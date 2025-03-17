import { IApiGetPayload, IApiReturn } from '@shared/lib/ApiSPA'

export type TStoreStatus = 
    | 'init' // инициализация
    | 'load' // загружается
    | 'idle' // не обновляется
    | 'auto' // в ожидании обновления
    | 'fresh' // обновляется

export type TStoreItem<T> = T extends any[] ? T[number] : T

type TRequestGet<T> = (payload?: IApiGetPayload) => Promise<IApiReturn<T>>
export interface IBaseStore<T = any> {
    //name: string
    localeName: string
    status: TStoreStatus
    data: T | undefined
    cache: T | undefined
    cached: boolean,
    timer: number
    loadOnStart: boolean,
    loadOrder: number,
    loading: boolean

    update(status?: 'idle'): Promise<void>
    request?: TRequestGet<T>
    init(): void
    load?(): void
    stop(): void
    run(): void
    find(id: number): TStoreItem<T> | undefined
    add(payload?: any): void
    addItem?(payload?: any): Promise<{ id: number }>
    remove?(id: number): void

    error: string
    setError(params: { msg: string, status: TStoreStatus }): void 
}

type OmittedFields = 'localeName' | 'name'
export type TBaseStoreDefaultFields<T> = Omit<IBaseStore<T>, OmittedFields>

export type TBaseStore<T> = IBaseStore<T> & { request: TRequestGet<T> }
import { PartialNull } from './reports'

export type TReportType = { id: number } & PartialNull<{
    name: string
    mnemo: string
}>
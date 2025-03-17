import { IECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'

export type TTreeMapChartContainer = {
    data: {
        id?: number
        count: number
        value: string
        icon?: IECIconView['icon']
        color?: string
    }[],
    color?: string
    height?: number
    width?: number,
    valueDisplayType?: 'absolute' | 'percent' | 'combine'
}
import { getCheckNetChart } from '@shared/api/Stats/Models/getCheckNetChart'
import { getUserActivity } from '@shared/api/Stats/Models/getUserActivity'
import { SelectProps } from 'antd'
import { FC } from 'react'

interface ISelectOption {
    value: any
    label: any
    labelFilter?: string
    disabled?: boolean
}

export interface ISelectProps extends SelectProps {
    data?: ISelectOption[]
    customData?: {
        data: any[]
        convert: {
            valueField: string
            optionLabelProp: string
            optionFilterProp?: string
            optionLabelComponent?: FC
            optionDisabled?: string
        }
    }
    searchable?: boolean
    selectLabel?: any
    dropdownMatchSelectWidth?: any
    allowClear?: boolean
    selectChildren?: any
    selectOptionValue?: any
}

export type TDataSourceOption = {
    value: any
    label: any
    labelFilter?: string
    disabled?: boolean
    apiFunction: (payload: any) => Promise<any>,
    payload?: Record<string, any>
}


export interface ISelectSourcesProps extends ISelectProps {
    data: TDataSourceOption[]
}

export const dataSourcesML = [
    {
        label: 'История статусов',
        value: 1,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        apiFunction: () => {} /* SERVICES_STATS.Models.getStatsStatusTimeline */,
        payload: {},
    },
    {
        label: 'История трафика',
        value: 2,
        apiFunction: getCheckNetChart /* SERVICES_STATS.Models.getStatsStatusTimeline */,
        payload: {},
    },
]

export const dataSources2 = {
    checkNetChart: getCheckNetChart,
    userActivity: getUserActivity
} as const

export const dataSources: ISelectSourcesProps['data'] = [
    {
        label: 'История статусов',
        value: 1,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        apiFunction: () => {} /* SERVICES_STATS.Models.getStatsStatusTimeline */,
        payload: {},
    },
    {
        label: 'История точек метрики',
        value: 2,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        apiFunction: () => Promise.resolve(), // SERVICES_STATS.Models.getStatsMetricPoints,
        payload: {
            //ВНИМАНИЕ! ФИКСИРУЕМ ЭТОТ ПАРАМЕТР C ЭТИМ ЗНАЧЕНИЕМ В PAYLOAD ДЛЯ ИСТОЧНИКА ДАННЫХ
            //metric_type_codes: 'mishk-arm-check_net_rcv-mbits,mishk-arm-check_net_trn-mbits',
        },
    },
    {
        label: 'История активности пользователей',
        value: 3,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        apiFunction: () => {}, // SERVICES_STATS.Models.getStatsMetricPoints,
        payload: {
            //ВНИМАНИЕ! ФИКСИРУЕМ ЭТОТ ПАРАМЕТР C ЭТИМ ЗНАЧЕНИЕМ В PAYLOAD ДЛЯ ИСТОЧНИКА ДАННЫХ
            metric_type_codes: 'mishk-user-get_cur_user',
        },
    },
    {
        label: 'История активных пользователей',
        value: 4,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        apiFunction: () => {}, // SERVICES_STATS.Services.getMetricPointsActiveAccounts,
        payload: {
            metric_type_codes: 'mishk-user-get_cur_user',
        },
    },
] as any[]

export const fields = {
    view: 'view',
    dataSource: 'dataSource',
    subjectChildTypes: 'subjectChildTypes',
    groupBy: 'groupBy',
    aggregationType: 'aggregationType',
    depth: 'depth',
    chartType: 'chartType',
    chartName: 'chartName',
    autoUpdated: 'autoUpdated'
} as const;

export const viewKeys = {
    column: 'Гистограмма',
    timeline: 'Таймлайн',
    lastPie: 'Диаграмма последней точки',
    lastColumn: 'Гистограмма последней точки'
} as const

export const groupKeys = {
    minute: 'По минутам',
    hour: 'По часам',
    day: 'По дням',
} as const;

export const aggregationKeys = {
    sum: 'Cумма',
    min: 'Минимум',
    max: 'Максимум',
    avg: 'Cреднее',
    count_by_value: 'По значениям'
} as const;

export const chartsKeys = {
    all: 'Все статусы',
    active: 'Только активные статусы',
    absolute: 'Абсолютные значения',
    percents: 'Проценты',
} as const;
import moment from 'moment-timezone'
import dayjs, { Dayjs, UnitTypeLong } from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
import localeData from 'dayjs/plugin/localeData'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
import 'dayjs/locale/ru'
dayjs.locale('ru')
dayjs.extend(weekday)
dayjs.extend(localeData)
dayjs.extend(quarterOfYear)

export type TDurationLabels = 'hour' | 'hour2' | 'hour3' | 'hour12' | 'hour24' | 'hour48' | 'week' | 'month'
export type TCurrentPeriodLabels = 'lastDay' | 'currentDay' | 'lastWeek' | 'currentWeek' | 
    'lastMonth' | 'currentMonth' | 'lastQuarter' | 'currentQuarter'
export type TPeriodValues = TDurationLabels | TCurrentPeriodLabels
export type TPeriodLabels = {
    duration: Record<TDurationLabels, string>,
    currentPeriod: Record<TCurrentPeriodLabels, string>,
} 
export type TPeriods = {
    values: TPeriodValues[],
    labels: TPeriodLabels
}

export const periods = {
    values: {
        duration: [
            'hour',
            'hour2',
            'hour3',
            'hour12',
            'hour24',
            'hour48',
            'week',
            'month',
        ],
        currentPeriod: [
            'lastDay',
            'currentDay',
            'lastWeek',
            'currentWeek',
            'lastMonth',
            'currentMonth',
            'lastQuarter',
            'currentQuarter',
        ]
    },
    labels: {
        duration: {
            hour: 'За последний час',
            hour2: 'За последние 2 часа',
            hour3: 'За последние 3 часа',
            hour12: 'За последние 12 часов',
            hour24: 'За последние 24 часа',
            hour48: 'За последние 2 дня',
            week: 'За последние семь дней',
            month: 'За последние 30 дней',
        }, 
        currentPeriod: { 
            lastDay: 'За прошлый день', // начало вчера - конец вчера
            currentDay: 'За текущий день', // начало сегодня - наст. вр.
            lastWeek: 'За прошлую неделю', // начало прошлой недели - конец прошлой недели
            currentWeek: 'За текущую неделю', // начало текущей недели - наст. вр.
            lastMonth: 'За прошлый календарный месяц', // начало прошлого месяца - конец прошлого месяца
            currentMonth: 'За текущий календарный', // начало текущего месяца - наст. вр.
            lastQuarter: 'За прошедший квартал', // начало прошлого квартала - конец прошлого квартала
            currentQuarter: 'За текущий квартал', // начало текущего квартала - наст. вр.
        }
    },
} as const

export const currentPeriodOptions = periods.values.currentPeriod.map((value) => {
    return { value, label: periods.labels.currentPeriod[value] };
});
export const durationOptions = periods.values.duration.map((value) => {
    return { value, label: periods.labels.duration[value] };
});
export const allOptions = [
    ...currentPeriodOptions,
    ...durationOptions
]

export const getDateTimeSql = (timestamp: number) => {
    return moment(timestamp * 1000).format('YYYY-MM-DD HH:mm:SS')
}

export const isNewYearPeriod = () => {
    return [52, 51, 1, 2].includes(moment().week())
}

export const getDayjsRange = (type: TPeriodValues): [Dayjs, Dayjs] => {
    switch (type) {
        // duration
        case 'hour':
            return [dayjs().subtract(1, 'hour'), dayjs()]
        case 'hour2':
            return [dayjs().subtract(2, 'hour'), dayjs()]
        case 'hour3':
            return [dayjs().subtract(3, 'hour'), dayjs()]
        case 'hour12':
            return [dayjs().subtract(12, 'hour'), dayjs()]
        case 'hour24':
            return [dayjs().subtract(1, 'days'), dayjs()]
        case 'hour48':
            return [dayjs().subtract(2, 'days'), dayjs()]
        case 'week':
            return [dayjs().subtract(1, 'week'), dayjs()]
        case 'month':
            return [dayjs().subtract(1, 'month'), dayjs()]

        // current period
        case 'lastDay':
            return [
                dayjs().subtract(1, 'days').startOf('day'),
                dayjs().subtract(1, 'days').endOf('day'),
            ]
        case 'currentDay':
            return [
                dayjs().startOf('day'),
                dayjs(),
            ]
        case 'lastWeek':
            return [
                dayjs().subtract(1, 'week').startOf('week'),
                dayjs().subtract(1, 'week').endOf('week'),
            ]
        case 'currentWeek':
            return [dayjs().startOf('week'), dayjs()]
        case 'lastMonth':
            return [
                dayjs().subtract(1, 'month').startOf('month'),
                dayjs().subtract(1, 'month').endOf('month'),
            ]
        case 'currentMonth':
            return [
                dayjs().startOf('month'),
                dayjs()
            ]
        case 'lastQuarter':
            return [
                dayjs().subtract(1, 'quarter').startOf('quarter'),
                dayjs().subtract(1, 'quarter').endOf('quarter'),
            ]
        case 'currentQuarter':
            return [
                dayjs().startOf('quarter'), 
                dayjs()
            ]
        default:
            return [null, null]
    }
}
export const getDuration = (type: TDurationLabels): number => {
    const hour = 60 * 60
    const day = 24 * hour
    const week = 7 * day

    switch (type) {
        // duration
        case 'hour':
            return hour
        case 'hour2':
            return 2 * hour
        case 'hour3':
            return 3 * hour
        case 'hour12':
            return 12 * hour
        case 'hour24': 
            return day
        case 'hour48':
            return 2 * day
        case 'week':
            return week
        case 'month':
            return 30 * hour
        default:
            return 0
    }
}

export const getTimeIntervalPreset = (seconds: number): string => {
    switch (seconds) {
        // duration
        case 3_600:
            return periods.labels.duration.hour
        case 7_200:
            return periods.labels.duration.hour2
        case 10_800:
            return periods.labels.duration.hour3
        case 43_200:
            return periods.labels.duration.hour12
        case 86_400: 
            return periods.labels.duration.hour24
        case 172_800:
            return periods.labels.duration.hour48
        case 604_800:
            return periods.labels.duration.week
        case 2_592_000:
            return periods.labels.duration.month
        // default:
        //     return 'Нет такого пресета'
    }
}

export const getLocalTimeFromUTC = (dt: string): string => {
    let output = ''

    if (dt && dt !== 'Invalid date') {
        const date = new Date(dt)
        const dtISO = date.toString()

        output = moment.utc(dtISO).local().format('YYYY-MM-DD HH:mm:ss')
    }

    return output !== 'Invalid Date' ? output : ''
}

export const getPeriod = (period) => {  
    const newDates = period?.map(p => {
        return p 
            ? dayjs(p * 1000) 
            : null
    }) as [Dayjs, Dayjs]
    
    return newDates
}
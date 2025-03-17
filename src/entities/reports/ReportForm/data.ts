import dayjs from 'dayjs';
import moment from 'moment';
import { RRule } from 'rrule';
import weekday from 'dayjs/plugin/weekday'
import localeData from 'dayjs/plugin/localeData'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
import 'dayjs/locale/ru'
dayjs.locale('ru')
dayjs.extend(weekday)
dayjs.extend(localeData)
dayjs.extend(quarterOfYear)

export const reportTypeOptions = [
    // { label: 'Стандартный отчет', value: 'standart' },
    { label: 'Неформализованный отчет', value: 9999 }
]

export const periods = {
    values: [
        'days',
        'today',
        'hours24',
        'hour',
        'lastWeek',
        'currentWeek',
        'lastMonth',
        'week',
        'month',
        'quarter',
        'currentQuarter',
    ],
    labels: {
        hour: 'За последний час',
        days: 'За вчера',
        today: 'За сегодня',
        hours24: 'За последние 24 часа',
        lastWeek: 'За прошедшую неделю',
        currentWeek: 'За текущую неделю',
        week: 'За последние семь дней',
        lastMonth: 'За прошлый календарный месяц',
        month: '30 дней c начала месяца по Н.В.',
        quarter: 'За прошедший квартал',
        currentQuarter: 'За текущий квартал',
    },
} as const;

export const periodOptions = periods.values.map((value) => {
    return { value, label: periods.labels[value] };
});

export const weekdays: { value: any; label: string }[] = [
    {
        value: RRule.MO,
        label: 'Понедельник',
    },
    {
        value: RRule.TU,
        label: 'Вторник',
    },
    {
        value: RRule.WE,
        label: 'Среда',
    },
    {
        value: RRule.TH,
        label: 'Четверг',
    },
    {
        value: RRule.FR,
        label: 'Пятница',
    },
    {
        value: RRule.SA,
        label: 'Суббота',
    },
    {
        value: RRule.SU,
        label: 'Воскресенье',
    },
];

export const months = moment.months().map((label, value) => {
    return { label, value };
});
export const hours = new Array(24).fill(0).map((_, i) => ({
    value: i + 1,
    label: i < 9 ? `0${i + 1}` : `${i + 1}`,
}));

export const reportFormats = [
    { ext: 'csv', name: 'CSV' },
    { ext: 'html', name: 'HTML' },
    { ext: 'odt', name: 'ODT' },
    { ext: 'pdf', name: 'PDF' },
    { ext: 'rtf', name: 'RTF' },
    { ext: 'docx', name: 'DOCX' },
    { ext: 'xlsx', name: 'XLSX' },
].map((f) => ({ ...f, mnemo: f.ext }))
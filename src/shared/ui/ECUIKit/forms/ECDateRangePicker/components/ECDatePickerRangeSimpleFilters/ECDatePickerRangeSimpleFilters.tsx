import { DatePicker } from 'antd'
import { RangePickerBaseProps } from 'antd/es/date-picker/generatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import './ECDatePickerRangeSimpleFilters.css'

export interface IECDatePickerRangeSimpleFiltersProps extends RangePickerBaseProps<Dayjs> {
    borderColor: string,
    textColor: string,
    backgroundColor: string,
    align?: 'horizontal' | 'vertical',
    applyDefaultPresets?: boolean,
}

const datePickerPresets: {
    label: string;
    value: any;
}[] = [
    {
        label: 'Сегодня',
        value: [dayjs(), dayjs()],
    },
    {
        label: '7 Дней',
        value: [dayjs().subtract(7, 'day'), dayjs()],
    },
    {
        label: 'Месяц',
        value: [dayjs().startOf('month'), dayjs()],
    },
    {
        label: 'Предыдущий месяц',
        value: [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')],
    },
    {
        label: 'Год',
        value: [dayjs().startOf('year'), dayjs()],
    },
];


export const ECDatePickerRangeSimpleFilters = ({
    backgroundColor,
    borderColor,
    align,
    textColor,
    applyDefaultPresets = false,
    ...props
}: IECDatePickerRangeSimpleFiltersProps) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <DatePicker.RangePicker
            className={'ECDateRangeFilterField ' + (isFocused ? 'ECDateRangeFilterField-focused' : '')}
            popupClassName="ECDateRangeFilterField-dropdown"
            style={{
                width: align === 'horizontal' ? 280 : '100%',
                minWidth: align === 'horizontal' && 150,
                height: 56,
                borderRadius: 4,

                ['--ecDateRange-field-border-color' as string]: borderColor,
                ['--ecDateRange-field-text-color' as string]: textColor,
                ['--ecDateRange-field-background-color' as string]: backgroundColor,
            }}
            popupStyle={{
                ['--ecDateRange-field-border-color' as string]: borderColor,
                ['--ecDateRange-field-text-color' as string]: textColor,
                ['--ecDateRange-field-background-color' as string]: backgroundColor,
            }}
            allowEmpty={[true, true]}
            placeholder={['Начальная дата', 'Конечная дата']}
            locale={{
                'lang': {
                    locale: 'ru_RU',
                    yearFormat: 'YYYY',
                    shortWeekDays: dayjs.Ls.ru.weekdaysMin,
                    shortMonths: dayjs.Ls.ru.monthsShort.s,
                },
                timePickerLocale: 'ru',
            }}
            onOpenChange={value => setIsFocused(value)}
            presets={applyDefaultPresets ? datePickerPresets : []}
            {...props}
        />
    )
}
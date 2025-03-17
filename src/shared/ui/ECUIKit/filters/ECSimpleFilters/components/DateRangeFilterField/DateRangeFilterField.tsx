import './DateRangeFilterField.css';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ru'
import { ECDateRangePicker } from '@shared/ui/ECUIKit/forms/ECDateRangePicker/ECDateRangePicker';

interface IDateRangeFilterFieldProps {
    align?: 'horizontal' | 'vertical',
    textColor?: string,
    borderColor?: string,
    backgroundColor?: string,
    value: {
        date_from: null | string,
        date_to: null | string,
    },
    onChange?: (data: {
        date_from: null | string,
        date_to: null | string,
    }) => void,
}


export const DateRangeFilterField = ({
    align,
    backgroundColor,
    borderColor,
    textColor,
    value,
    onChange,
}: IDateRangeFilterFieldProps) => {
    const valueFrom = value.date_from && dayjs(value.date_from);
    const valueTo = value.date_to && dayjs(value.date_to);

    const onValuesChange = (values: [null | Dayjs, null | Dayjs]) => {
        onChange?.({
            date_from: values?.[0]?.startOf('day')?.toISOString() || null,
            date_to: values?.[1]?.endOf('day')?.toISOString() || null,
        });
    }

    return (
        <ECDateRangePicker
            mode="ecSimpleFilters"
            props={{
                backgroundColor,
                align,
                picker: undefined,
                borderColor,
                textColor,
                onChange: onValuesChange,
                value: [valueFrom, valueTo],
                defaultValue: [valueFrom, valueTo],
                applyDefaultPresets: true,
            }}
        />
    )
}
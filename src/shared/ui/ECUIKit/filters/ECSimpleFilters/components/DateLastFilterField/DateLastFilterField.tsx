import dayjs from 'dayjs';
import { ECSelect } from '@shared/ui/ECUIKit/forms';

const current = dayjs();
const year = new Date().getFullYear();
const lastDatesYears = [year - 2, year - 1, year];
const months = Array.from({ length: 12 }).map((_, i) => i);

const dates = [];

const monthsNames = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь'
];

for (const month of months) {
    for (const year of lastDatesYears) {
        if (year === current.year() && month > current.month()) {
            break;
        }
        dates.push([year, month]);
    }
}

interface DateLastFilterFieldProps {
    align?: 'horizontal' | 'vertical',
    textColor?: string,
    borderColor?: string,
    backgroundColor?: string,
    // value: number[],
    onSelect?: (ids: number[]) => void,
}
export const DateLastFilterField = ({
    align,
    borderColor,
    backgroundColor,
    textColor = '#000000',
    // value,
    onSelect,
}: DateLastFilterFieldProps) => {
    return (
        <ECSelect
            mode="ECSimpleFilters"
            selectProps={{
                align,
                backgroundColor,
                borderColor,
                textColor,
                defaultValue: 1,
                options: [
                    {
                        label: 'Последние 30 дней',
                        value: 1,
                    },
                    ...dates.map(([a, b]) => ({
                        label: `${monthsNames[b]} ${a}`,
                        value: `${monthsNames[b]} ${a}`, // TODO to fix
                    }))
                ],
            }}
        />
    )
}
import { TDurationLabels, durationOptions, getDayjsRange } from '@shared/utils/datetime'
import { DatePicker, Select } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { FC, useEffect, useState } from 'react'

export const RangePickerWithPresets: FC<{
    onChange?: (value: [Dayjs, Dayjs]) => void
    value?: [Dayjs, Dayjs]
    initial?: [Dayjs, Dayjs]
    withPresets?: boolean  // добавить выбор пресетов к пикеру 
    onlyPresets?: boolean  // только пресеты, без пикера
    style?: {
        picker?: React.CSSProperties
        preset?: React.CSSProperties
    },
    format?: string
}> = ({
    onChange,
    value,
    initial,
    style,
    withPresets,
    onlyPresets,
    format
}) => {
    const dateFormat = format ?? 'HH:mm:ss DD.MM.YYYY'

    const initialPeriod = initial || [
        dayjs().subtract(48 * 60 * 60, 'second'), 
        dayjs()
    ] as [Dayjs, Dayjs]
    const [ interval, setInterval ] = useState(undefined)
    // const [ interval, setInterval ] = useState('hour48')
    const [, setPreset ] = useState([])




    // useEffect(() => {

    //     console.log('Ставим инициал валуе')

    const selectPredefinedRange = (value: TDurationLabels) => {
        setInterval(value)

        if (value !== undefined) {
            const period = getDayjsRange(value)

            setPreset(period)
            onChange(period)
        }
    }
    const onDatePickerChange = (_, values) => {
        if (onChange) {
            const newValues = values.map(val => val ? dayjs(val, dateFormat) : null) as [Dayjs, Dayjs]

            onChange(newValues)
        }
    }

    return (
        <div 
            style={{ 
                display: 'flex', 
                gap: 24 
            }}
        >
            {!onlyPresets && (
                <DatePicker.RangePicker 
                    showTime 
                    allowClear
                    format={dateFormat}
                    style={{
                        ...style.picker,
                    }}
                    value={value}
                    onChange={onDatePickerChange}
                />
            )}
            {(withPresets || onlyPresets) && (
                <Select
                    style={{
                        ...style.preset,
                    }}
                    placeholder="Выберите интервал"
                    options={durationOptions}
                    value={interval}
                    onChange={selectPredefinedRange}
                    allowClear
                />)}
        </div>
    )
}
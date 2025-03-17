import { TECDatePickerWithPresets } from '@shared/ui/ECUIKit/ECDatePickers/ECDatePickerWithPresets/types'
import { allOptions, getDayjsRange } from '@shared/utils/datetime'
import { Button, DatePicker, Select } from 'antd'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { FC, useState } from 'react'

export const ECDatePickerWithPresets: FC<TECDatePickerWithPresets> = ({ viewType, setDateInterval }) => {

    const [period, setPeriod] = useState<[Dayjs, Dayjs]>(null)
    const [activePeriod, setActivePeriod] = useState<number>(-1)
    const [disableActions, setDisableActions] = useState<boolean>(false)
    
    const dateFormat = 'DD.MM.YYYY HH:mm'
    
    const onChangeValue = (value: any, fromDatePicker?: boolean) => {

        if (value) {
            let localPeriod = value

            if (!fromDatePicker) {
                localPeriod = getDayjsRange(value as any)
            }

            if (fromDatePicker) {
                setActivePeriod(-1)
            }
            
            if (localPeriod && localPeriod[0] !== null && localPeriod[1] !== null) {
                const timestampStartTime = Math.floor(localPeriod[0].valueOf() / 1000)
                const timestampEndTime = Math.floor(localPeriod[1].valueOf() / 1000)

                setDateInterval([String(timestampStartTime), String(timestampEndTime)])
                
                setPeriod([dayjs.unix(timestampStartTime), dayjs.unix(timestampEndTime)])

                setDisableActions(true)
                setTimeout(() => setDisableActions(false), 1000);
            }

        }
    }

    if (!viewType) {
        return null
    }

    return (
        <div
            style={{
                marginTop: '16px'
            }}
        >
            <DatePicker.RangePicker 
                allowClear
                showTime
                value={period}
                format={dateFormat}
                onChange={(value) => onChangeValue(value, true)}
                disabled={disableActions}
                style={{
                    marginRight: '16px'
                }}
            />
            {viewType === 'select' && (
                <Select 
                    options={allOptions} 
                    onChange={(value) => onChangeValue(value)}
                    disabled={disableActions}
                />
            )}
            {viewType === 'buttons' && (
                allOptions.map((datePeriodItem, index) => {

                    return (
                        <Button 
                            onClick={() => {
                                onChangeValue(datePeriodItem.value)
                                setActivePeriod(index)
                            }}
                            disabled={disableActions}
                            style={{
                                pointerEvents: activePeriod === index ? 'none' : 'auto',
                                marginRight: '16px',
                                marginBottom: '16px'
                            }}
                            key={index}
                            type={activePeriod === index ? 'primary' : 'default'}
                        >
                            {datePeriodItem.label}
                        </Button>
                    )
        
                })
            )}
        </div>
    )
}
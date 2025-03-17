/* eslint-disable @typescript-eslint/no-explicit-any */

import { Select as SelectAntd, SelectProps } from 'antd'
import { FC, forwardRef } from 'react'

interface ISelectOption {
    value: string | number
    label: string | number
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
    selectLabel?: never
    dropdownMatchSelectWidth?: never
    allowClear?: boolean
    selectChildren?: never
    selectOptionValue?: never
    ref?: any
}

export const Select: FC<ISelectProps> = forwardRef((initialProps, ref) => {
    const {
        data = [],
        customData,
        searchable = true,
        allowClear = true,
        dropdownMatchSelectWidth = false,
        ...props
    } = initialProps

    if (searchable) {
        props.showSearch = true
        props.filterOption = (input, option: any) =>
            option?.label?.toLowerCase()?.includes(input.toLowerCase()) ?? false
    }

    let dataTmp: any[] = data

    if (customData?.data && customData?.convert) {
        dataTmp = customData.data?.map((item: any) => {
            const newItem: ISelectOption = {
                value: item?.[customData.convert.valueField] ?? '',

                label: customData?.convert?.optionLabelComponent ? (
                    <customData.convert.optionLabelComponent {...item} />
                ) : (
                    item?.[customData.convert.optionLabelProp] ?? item.name
                ),
                labelFilter: customData?.convert?.optionFilterProp
                    ? item?.[customData.convert.optionFilterProp]
                    : item?.[customData.convert.optionLabelProp],
                disabled: customData?.convert?.optionDisabled
                    ? item?.[customData?.convert?.optionDisabled]
                    : false,
            }

            return newItem
        })
    }

    return (
        <SelectAntd
            className="list-input"
            allowClear={allowClear}
            popupMatchSelectWidth={dropdownMatchSelectWidth}
            {...props}
        >
            {dataTmp?.map((item: ISelectOption) => {
                return (
                    <SelectAntd.Option
                        key={item.value}
                        value={item.value}
                        label={item.labelFilter ?? item.label}
                        disabled={item.disabled ?? false}
                        ref={ref}
                    >
                        {item.label}
                    </SelectAntd.Option>
                )
            })}
        </SelectAntd>
    )
})
import { Select, SelectProps } from 'antd';
import { FC, useRef } from 'react';

export interface IECSelectDefaultProps extends SelectProps {
    showSearch?: boolean
    selectLabel?: never
    dropdownMatchSelectWidth?: never
    popupMatchSelectWidth?: boolean | number
    allowClear?: boolean
    selectChildren?: never
    selectOptionValue?: never
    ref?: any
}

export const ECSelectDefault = (initialProps: IECSelectDefaultProps) => {
    const {
        showSearch = true,
        allowClear = true,
        popupMatchSelectWidth = false,
        dropdownMatchSelectWidth = false,
        ...props
    } = initialProps

    return (
        <Select
            showSearch={showSearch}
            allowClear={allowClear}
            popupMatchSelectWidth={dropdownMatchSelectWidth
                ? dropdownMatchSelectWidth
                : popupMatchSelectWidth}
            {...props}
        />
    )
}
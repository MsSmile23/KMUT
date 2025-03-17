import { Select, SelectProps } from 'antd';
import { FC, useRef } from 'react';

export interface ECSelectProps extends SelectProps {
    showSearch?: boolean
    selectLabel?: never
    dropdownMatchSelectWidth?: never
    popupMatchSelectWidth?: boolean | number
    allowClear?: boolean
    selectChildren?: never
    selectOptionValue?: never
    ref?: any
}

export const ECSelect: FC<ECSelectProps> = (initialProps) => {
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
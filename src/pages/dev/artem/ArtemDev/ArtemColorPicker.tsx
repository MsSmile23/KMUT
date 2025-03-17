import React, { useState } from 'react'
import { ColorPicker, Space } from 'antd'
import type { ColorPickerProps } from 'antd';

type TColorPickerColor = ColorPickerProps.value | string

const ArtemColorPicker = (defaultColor:TColorPickerColor = '#FFFFFF') => {
    const [colorHex, setColorHex] = useState<TColorPickerColor>(defaultColor);

    const onColorChange = (colorHex: TColorPickerColor) => {
        const colorValue = typeof colorHex === 'string' ? colorHex : colorHex?.toHexString()
        setColorHex(colorValue)
    }

    return (
        <Space>
            <ColorPicker
                format={'hex'}
                value={colorHex}
                onChange={(colorHex) => onColorChange(colorHex)}
            />
            <span>HEX: {colorHex}</span>
        </Space>
    );
}

export default ArtemColorPicker
import { useState, useEffect } from 'react';
import { ColorPicker, Space } from 'antd';
import type { ColorPickerProps } from 'antd';

type TColorPickerColor = ColorPickerProps['value'] | string;

interface ECColorPickerProps {
    defaultColor?: TColorPickerColor;
    value?: TColorPickerColor;
    onChange?: (color: TColorPickerColor) => void;
}

const ECColorPicker: React.FC<ECColorPickerProps> = ({
    defaultColor = '#FFFFFF',
    value,
    onChange
}) => {
    const [colorHex, setColorHex] = useState<TColorPickerColor>(value ?? defaultColor);

    useEffect(() => {
        if (value !== undefined) {
            setColorHex(value);
        }
    }, [value]);

    const handleColorChange = (color: TColorPickerColor) => {
        const colorValue = typeof color === 'string' ? color : color?.toHexString();

        setColorHex(colorValue);

        if (onChange) {
            onChange(colorValue);
        }
    };

    return (
        <Space>
            <ColorPicker
                format="hex"
                value={colorHex}
                onChange={handleColorChange}
            />
            {/* <span>{colorHex?.toString()}</span> */}
        </Space>
    );
};

export default ECColorPicker;
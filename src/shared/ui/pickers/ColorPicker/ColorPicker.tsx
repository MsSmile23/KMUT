import { Color, ColorPickerProps } from 'antd/es/color-picker'
import { FC, useEffect, useState } from 'react'
import { ColorPicker as AntdColorPicker } from 'antd'

interface IColorPicker {
    value?: string | Color
    onChange?: (value: Color | string) => void
    wideVersion?: boolean
}
const ColorPicker: FC<IColorPicker> = ({ value, onChange, wideVersion }) => {
    const [colorHex, setColorHex] = useState<Color | string>('#FFFFFF')
    const [formatHex, setFormatHex] = useState<ColorPickerProps['format']>('hex')

    useEffect(() => {
        if (value) {
            setColorHex(value)
        }
    }, [])
    useEffect(() => {
        onChange(colorHex)
    }, [colorHex])

    return (
        <>
            {wideVersion ? (
                <AntdColorPicker
                    format={formatHex}
                    value={colorHex}
                    onChange={setColorHex}
                    onFormatChange={setFormatHex}
                >
                    <div
                        style={{
                            width: '100%',
                            background: typeof colorHex == 'string' ? colorHex : colorHex.toHexString(),
                            border: '1px solid rgb(217, 217, 217',
                            height: '32px',
                            borderRadius: '6px'
                        }}
                    >
                    </div>
                </AntdColorPicker>
            ) : (
                <AntdColorPicker
                    format={formatHex}
                    value={colorHex}
                    onChange={setColorHex}
                    onFormatChange={setFormatHex}
                />
            )}
        </>
    )
}

export default ColorPicker
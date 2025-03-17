import { LoadingOutlined, PlayCircleOutlined } from '@ant-design/icons'
import { IButton } from '@shared/ui/buttons/types'
import { ECTooltip } from '@shared/ui/tooltips'
import { Button } from 'antd'
import { FC } from 'react'
import { iconFontSizes } from '../buttons.data'

interface IECButtonRowPlay extends IButton {
    baseStyle?: boolean 
}
export const ECButtonRowPlay: FC<IECButtonRowPlay > = ({ 
    onClick, 
    background = '#000000', 
    color = '#ffffff',
    tooltipText = 'Запуск',
    size = 'small',
    disabled = false,
    loading = false,
    type = 'primary',
    baseStyle = false
}) => {

    return (
        <ECTooltip title={tooltipText}>
            <Button 
                size={size}
                disabled={disabled}
                shape="circle"
                style={!baseStyle && { backgroundColor: background, color: color }}
                type={type}
                onClick={onClick}
                icon={loading 
                    ? <LoadingOutlined style={{ fontSize: iconFontSizes[size] }} />
                    : <PlayCircleOutlined style={{ fontSize: iconFontSizes[size] }} />}
            />
        </ECTooltip>
    )
}
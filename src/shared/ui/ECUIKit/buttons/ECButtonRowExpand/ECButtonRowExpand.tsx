import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import { IButton } from '@shared/ui/buttons/types'
import { ECTooltip } from '@shared/ui/tooltips'
import { Button } from 'antd'
import { FC } from 'react'

interface ExpandButton extends IButton {
    expanded: boolean
    baseStyle?: boolean 
}
//*baseStyle если нам нужны самые базовые стили кнопки
export const ECButtonRowExpand: FC<ExpandButton> = ({
    onClick,
    background = '#000000',
    color = '#ffffff',
    expanded = false,
    size = 'small',
    type = 'primary',
    baseStyle = false
}) => {
    return (
        <ECTooltip title={expanded ? 'Скрыть' : 'Раскрыть'}>
            <Button
                size={size}
                shape="circle"
                style={!baseStyle && { backgroundColor: background, color: color }}
                type={type}
                onClick={onClick}
                icon={expanded
                    ? <CaretUpOutlined style={{ fontSize: '17px' }} />
                    : <CaretDownOutlined style={{ fontSize: '17px', marginTop: '3px' }} />}
            />
        </ECTooltip>
    )
}
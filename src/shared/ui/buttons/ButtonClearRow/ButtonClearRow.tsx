import { ClearOutlined } from '@ant-design/icons'
import { ECTooltip } from '@shared/ui/tooltips'
import { Button } from 'antd'
import { FC } from 'react'
import { IButton } from '../types'

export const ButtonClearRow: FC<IButton> = ({ 
    onClick,
    tooltipText = 'Отменить',
    color = 'darkorange',
    ...arg
}) => {
    return (
        <ECTooltip title={tooltipText}>
            <Button
                size="small"
                shape="circle"
                style={{ backgroundColor: color, color: '#ffffff' }}
                type="primary"
                onClick={onClick}
                icon={<ClearOutlined />}
                {...arg}
            />
        </ECTooltip>
    )
}
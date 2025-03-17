import { RedoOutlined } from '@ant-design/icons'
import { IButton } from '@shared/ui/buttons/types'
import { ECTooltip } from '@shared/ui/tooltips'
import { Button } from 'antd'
import { FC } from 'react'
import { iconFontSizes } from '../buttons.data'

export const ECButtonReset: FC<IButton> = ({
    onClick,
    background = '#000000',
    color = '#ffffff',
    size = 'small',
    tooltipText = 'Обновить',
    style,
}) => {

    return (
        <ECTooltip title={tooltipText}>
            <Button
                style={{ ...style }}
                size={size}
                shape="circle"
                type="primary"
                onClick={onClick}
                icon={<RedoOutlined style={{ fontSize: iconFontSizes[size] }} />}
            />
        </ECTooltip>
    )
}
import { Button } from 'antd'
import { FC } from 'react'
import { EyeOutlined } from '@ant-design/icons'
import { IButton } from '@shared/ui/buttons/types'
import { ECTooltip } from '@shared/ui/tooltips'

export const ButtonLook: FC<IButton> = ({ onClick, disabled }) => {
    return (
        <ECTooltip title="Посмотреть">
            <Button
                size="small"
                shape="circle"
                style={{ backgroundColor: '#188EFC', color: '#ffffff' }}
                type="primary"
                onClick={onClick}
                disabled={disabled}
                icon={<EyeOutlined />}
            />
        </ECTooltip>
    )
}
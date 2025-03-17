import { Button } from 'antd'
import { ApiOutlined } from '@ant-design/icons'
import { FC } from 'react'
import { IButtonRow } from '@shared/ui/buttons/types'
import { ECTooltip } from '@shared/ui/tooltips'

export const ButtonUnlink: FC<IButtonRow> = ({ tooltipText, onClick }) => {
    return (
        <ECTooltip title={tooltipText || 'Отвязать'}>
            <Button
                size="small"
                shape="circle"
                style={{ backgroundColor: '#FFCB99', color: '#ffffff' }}
                type="primary"
                onClick={onClick}
                icon={<ApiOutlined />}
            />
        </ECTooltip>
    )
}
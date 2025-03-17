import { Button } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { FC } from 'react'
import { IButtonRow } from '@shared/ui/buttons/types'
import { ECTooltip } from '@shared/ui/tooltips'

export const ButtonEditRow: FC<IButtonRow> = ({ tooltipText, color, onClick }) => {
    return (
        <ECTooltip title={tooltipText || 'Редактировать'}>
            <Button
                size="small"
                shape="circle"
                style={{ backgroundColor: color ? color : '#188EFC', color: '#ffffff' }}
                type="primary"
                onClick={onClick}
                icon={<EditOutlined />}
            />
        </ECTooltip>
    )
}
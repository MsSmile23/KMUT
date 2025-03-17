import { Button } from 'antd'
import { FC } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { IButtonRow } from '@shared/ui/buttons/types'
import { ECTooltip } from '@shared/ui/tooltips'

export const ButtonAddRow: FC<IButtonRow> = ({ onClick, tooltipText = 'Добавить', color = '#188EFC',   ...arg }) => {
    return (
        <ECTooltip title={tooltipText}>
            <Button
                size="small"
                shape="circle"
                style={{ backgroundColor: color, color: '#ffffff' }}
                type="primary"
                onClick={onClick}
                icon={<PlusOutlined />}
                {...arg}
            />
        </ECTooltip>
    )
}
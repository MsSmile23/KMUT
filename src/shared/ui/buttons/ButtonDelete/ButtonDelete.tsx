import { Button } from 'antd'
import { FC } from 'react'
import { DeleteOutlined } from '@ant-design/icons'
import { IButton } from '@shared/ui/buttons/types'
import { ECTooltip } from '@shared/ui/tooltips'

export const ButtonDelete: FC<IButton> = ({ text = true, customText, color, tooltipText, ...arg }) => {
    return (
        <ECTooltip title={tooltipText ? tooltipText : 'Удалить'}>
            <Button
                size="large"
                style=
                    {{ backgroundColor: arg?.disabled ? 'grey' : color ? color : '#FF0000', color: '#ffffff',
                        boxShadow: '0 0 2px #f0f2f5',
                    }}
                icon={<DeleteOutlined />}
                type="primary"
                shape = "default"
                {...arg}
            >
                {text ? (customText ? customText : 'Удалить') : ''}
            </Button>
        </ECTooltip>
    )
}
import { Button } from 'antd'
import { FC } from 'react'
import { SwapOutlined } from '@ant-design/icons'
import { IButton } from '@shared/ui/buttons/types'
import { ECTooltip } from '@shared/ui/tooltips'

export const ButtonMoving: FC<IButton> = ({ text = true, customText, color, tooltipText, ...arg }) => {
    return (
        <ECTooltip title={tooltipText ? tooltipText : 'Переместить'}>
            <Button
                size="small"
                shape="circle"
                style=
                    {{ backgroundColor: arg?.disabled ? 'grey' : color ? color : '#ffcc33', color: '#ffffff',
                        boxShadow: '0 0 2px #f0f2f5',
                    }}
                icon={<SwapOutlined />}
                type="primary"
                {...arg}
            >
                {text ? (customText ? customText : 'Переместить') : ''}
            </Button>
        </ECTooltip>
    )
}
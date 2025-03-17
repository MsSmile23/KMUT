import { Button } from 'antd'
import { FC } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { IButton } from '@shared/ui/buttons/types'
import { ECTooltip } from '@shared/ui/tooltips'


export const ButtonCreateAnonObjects: FC<IButton> = ({ text = true, customText, color,
    tooltipText, icon = true, shape = 'default', ...arg }) => {

    return (
        <ECTooltip title={tooltipText ? tooltipText : customText ? customText : 'Добавить'}>
            <Button
                size="large"
                style=
                    {{ backgroundColor: arg?.disabled ? 'grey' : color ? color : '#188EFC', color: '#ffffff', 
                        boxShadow: '0 0 2px #f0f2f5',
                    }}
                icon={icon ? <><PlusOutlined /><PlusOutlined /></>  : null}
                type="primary"
                shape={shape}
                {...arg}
            >
                {text ? (customText ? customText : 'Добавить') : ''}
            </Button>
        </ECTooltip>
    )
}
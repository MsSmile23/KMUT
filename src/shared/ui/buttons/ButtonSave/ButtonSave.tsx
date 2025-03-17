import { Button } from 'antd'
import { FC } from 'react'
import { SaveOutlined } from '@ant-design/icons'
import { IButton } from '@shared/ui/buttons/types'
import { ECTooltip } from '@shared/ui/tooltips'

export const ButtonSave: FC<IButton> = ({ color,
    tooltipText, icon = true, shape = 'default', onChange, ...arg }) => {

    return (
        <ECTooltip title={tooltipText ? tooltipText : 'Сохранить'}>
            <Button
                size="small"
                style=
                    {{ backgroundColor: arg?.disabled ? 'grey' : color ? color : '#188EFC', color: '#ffffff', 
                        boxShadow: '0 0 2px #f0f2f5',
                    }}
                icon={icon ? <SaveOutlined /> : null}
                type="primary"
                shape="circle"
                onChange={onChange}
                {...arg}
            >
                
            </Button>
        </ECTooltip>
    )
}
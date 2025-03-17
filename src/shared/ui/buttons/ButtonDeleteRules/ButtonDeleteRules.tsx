import { Button } from 'antd'
import { FC } from 'react'
import { CloseOutlined } from '@ant-design/icons'
import { IButton } from '@shared/ui/buttons/types'

export const ButtonDeleteRules: FC<IButton> = ({ text = true, customText, ...arg }) => {
    return (
        <Button style={{ backgroundColor: 'darkorange' }} icon={<CloseOutlined />} type="primary" {...arg}>
            {text ? (customText ? customText : 'Удалить правила группы') : ''}
        </Button>
    )
}
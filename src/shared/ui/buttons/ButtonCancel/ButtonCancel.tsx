import { Button } from 'antd'
import { FC } from 'react'
import { CloseCircleOutlined } from '@ant-design/icons'
import { IButton } from '@shared/ui/buttons/types'

export const ButtonCancel: FC<IButton> = ({ text = true, customText, ...arg }) => {
    return (
        <Button
            style={{ backgroundColor: arg?.disabled ? 'grey' : '#f5222d', color: '#ffffff' }}
            icon={<CloseCircleOutlined />}
            type="primary"
            {...arg}
        >
            {text ? (customText ? customText : 'Отмена') : ''}
        </Button>
    )
}
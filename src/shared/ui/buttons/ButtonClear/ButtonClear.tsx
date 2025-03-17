import { Button } from 'antd'
import { FC } from 'react'
import { ClearOutlined } from '@ant-design/icons'
import { IButton } from '@shared/ui/buttons/types'

export const ButtonClear: FC<IButton> = ({ text = true, customText, ...arg }) => {
    return (
        <Button
            style={{ backgroundColor: 'darkorange' }}
            icon={<ClearOutlined />}
            type="primary"
            {...arg}
        >
            {text ? (customText ? customText : 'Очистить') : ''}
        </Button>
    )
}
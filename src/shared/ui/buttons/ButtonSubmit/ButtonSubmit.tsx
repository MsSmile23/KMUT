import { Button } from 'antd'
import { FC } from 'react'
import { IButton } from '@shared/ui/buttons/types'
import { SaveOutlined } from '@ant-design/icons'

export const ButtonSubmit: FC<IButton> = ({ text = true, customText, color,  ...arg }) => {
    return (
        <Button
            style={{ backgroundColor: color ? color : '#1890ff', color: '#ffffff' }}
            type="primary"
            icon={<SaveOutlined />}
            htmlType="submit"
            {...arg}
        >
            {text ? (customText ? customText : 'Сохранить') : ''}
        </Button>
    )
}
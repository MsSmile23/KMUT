import { Button } from 'antd'
import { FC } from 'react'
import { SettingOutlined } from '@ant-design/icons'
import { IButton } from '@shared/ui/buttons/types'

export const ButtonSettings: FC<IButton> = ({ ...arg }) => {
    return (
        <Button
            icon={<SettingOutlined />}
            {...arg}
        >
        </Button>
    )
}
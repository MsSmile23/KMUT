import { Button } from 'antd'
import { FC } from 'react'
import { IButton } from '@shared/ui/buttons/types'
import { AlertOutlined } from '@ant-design/icons'

export const ButtonWarn: FC<IButton> = ({   ...arg }) => {
    return (
        <Button
            style={{ backgroundColor: '#FF0000', color: '#ffffff' }}
            type="primary"
            // size="small"
            shape="circle"
            icon={<AlertOutlined />}
            htmlType="submit"
            {...arg}
        >

        </Button>
    )
}
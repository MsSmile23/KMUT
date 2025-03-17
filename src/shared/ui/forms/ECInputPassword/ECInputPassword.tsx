import { FC } from 'react'
import { Input } from 'antd'
import { PasswordProps } from 'antd/es/input'

export const ECInputPassword: FC<PasswordProps> = ({  ...props }) => {
    return <Input.Password placeholder="Пароль" {...props} />
}
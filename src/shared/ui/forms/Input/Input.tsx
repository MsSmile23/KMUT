import { FC } from 'react'
import { Input as AntdInput, InputProps } from 'antd'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IInput extends InputProps {}

export const Input: FC<IInput> = ({ ...props }) => {
    return <AntdInput {...props} />
}
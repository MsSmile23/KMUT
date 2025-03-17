import { FloatButton as AntdFloatButton, FloatButtonProps } from 'antd'
import { FC } from 'react'

export const FloatButton: FC<FloatButtonProps> = (props) => {
    return <AntdFloatButton {...props} />
}
import { FC } from 'react'
import { Switch as AntdSwitch, SwitchProps } from 'antd'
type ISwitch = SwitchProps
export const Switch: FC<ISwitch> = ({ ...props }) => {
    return <AntdSwitch {...props} />
}
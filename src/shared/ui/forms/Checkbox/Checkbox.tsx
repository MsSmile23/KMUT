/* eslint-disable @typescript-eslint/no-empty-interface */
import { FC } from 'react'
import { Checkbox as AntdCheckbox, CheckboxProps } from 'antd'
interface ICheckBox extends CheckboxProps{
   
}
export const CheckBox: FC<ICheckBox> = ({  ...props }) => {
    return <AntdCheckbox {...props} />
}
import { FC } from 'react'
import { Input } from 'antd'
import { TextAreaProps } from 'antd/es/input'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ITextArea extends TextAreaProps {}

export const TextArea: FC<ITextArea> = ({ ...props }) => {
    return <Input.TextArea {...props} />
}
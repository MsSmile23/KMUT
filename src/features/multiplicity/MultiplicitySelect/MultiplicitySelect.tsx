import { FC } from 'react'
import { Form } from 'antd'
import { Forms } from '@shared/ui/forms'

interface IMultiplicitySelect {
    label: string
    name: string
    required?: boolean
    placeholder?: string
    style?: any
}

const MultiplicitySelect: FC<IMultiplicitySelect> = ({
    placeholder,
    style,
    ...props
}) => {
    const options = [...new Array(9)].map((item, index) => ({
        label: '*' + (index + 1),
        value: index + 1,
    }))

    return (
        <Form.Item {...props}>
            <Forms.Select options={options} placeholder={placeholder} style={style} />
        </Form.Item>
    )
}

export default MultiplicitySelect
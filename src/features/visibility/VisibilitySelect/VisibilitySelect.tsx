import { FC } from 'react'
import { Form } from 'antd'

import { Forms } from '@shared/ui/forms'

import { VISIBILITY } from '@shared/config/const'

interface IVisibilitySelect {
    name: string
    required?: boolean
    style?: any
}

const VisibilitySelect: FC<IVisibilitySelect> = ({ style, ...props }) => {
    const visibilityOptions = Object.keys(VISIBILITY).map((item: string) => ({
        value: item,
        label: VISIBILITY[item],
    }))

    return (
        <Form.Item label="Видимость" {...props}>
            <Forms.Select
                options={visibilityOptions}
                placeholder="Выберите видимость"
                style={style}
            />
        </Form.Item>
    )
}

export default VisibilitySelect
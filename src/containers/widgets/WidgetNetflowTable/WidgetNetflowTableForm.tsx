import { Form } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { FC } from 'react'

interface INetflowWidget  {
}


export interface WidgetNetflowTableFormProps {
    onChangeForm: <T>(data: T) => void
    settings: { vtemplate: { objectId: number }; widget: INetflowWidget }
}

const WidgetNetflowTableForm: FC<WidgetNetflowTableFormProps> = (props) => {
    const { settings, onChangeForm } = props
    const [form] = useForm()

    return (
        <Form form={form}>
        </Form>
    )
}

export default WidgetNetflowTableForm
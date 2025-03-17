import { FC } from 'react'
import { TWidgetReports } from '../WidgetReports/types/WidgetReports';
import { Form, Input } from 'antd/lib';
import { useForm } from 'antd/lib/form/Form';

export const WidgetReportsForm2: FC<TWidgetReports> = (props) => {
    const { settings, onChangeForm } = props
    const { widget } = settings
    const [form] = useForm()

    const initialValues = {
        tableHeight: widget.tableHeight
    }

    const formChange = (v, vs) => {
        onChangeForm(vs)

        return v
    }

    return (
        <div>
            <Form
                form={form}
                layout="vertical"
                onValuesChange={formChange}
                initialValues={initialValues}
            >
                <Form.Item
                    label="Высота таблицы"
                    name="tableHeight"
                >
                    <Input
                        type="number"
                        min={0}
                        placeholder="Введите высоту"
                        style={{ width: 200 }}
                    />
                </Form.Item>
            </Form >
        </div >
    )
}

export default WidgetReportsForm2
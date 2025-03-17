import { WidgetECSimpleFiltersForm } from '@shared/ui/ECUIKit/filters/ECSimpleFilters/components/WidgetECSimpleFiltersForm/WidgetECSimpleFiltersForm'
import { ECSelect } from '@shared/ui/forms'
import { useForm } from 'antd/es/form/Form'
import { Form } from 'antd/lib'

const directionOptions = [
    { value: 'vertical', label: 'Вертикально' },
    { value: 'horizontal', label: 'Горизонтально' },
]

const ProjectMainForm = (props) => {
    const { settings, onChangeForm } = props
    const { widget } = settings
    const [form] = useForm()

    const initialValues = {
        output_direction: widget.output_direction,
        fields: widget.fields || [],
    }

    const formChange = (v, vs) => {
        onChangeForm(vs)

        return v
    }

    return (
        <Form
            form={form}
            layout="vertical"
            onValuesChange={formChange}
            initialValues={initialValues}
        >
            <Form.Item
                label="Направление вывода"
                name="output_direction"
                initialValue="vertical"
            >
                <ECSelect
                    style={{ width: 200 }}
                    options={directionOptions}
                    maxTagCount="responsive"
                />
            </Form.Item>

            <Form.Item name="fields">
                <WidgetECSimpleFiltersForm />
            </Form.Item>
        </Form >
    )
}

export default ProjectMainForm
import { Divider, Form, Switch } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { FC, useEffect, useState } from 'react';

type TStateFormType = {
    on: boolean,
}

const initialValuesForm = {
    on: true,
}

export interface WidgetObjectsCountFromProps {
    onChangeForm: <T>(data: T) => void
    settings: { vtemplate: { objectId: number }; widget: TStateFormType }
}

const WidgetAIsaevForm: FC<WidgetObjectsCountFromProps> = (props) => {
    const { settings, onChangeForm } = props;
    const [form] = useForm();
    const initialSettings = Object.keys(settings || {}).length
    const [stateForm, setStateForm] = useState<TStateFormType>(initialSettings ? settings?.widget : initialValuesForm)

    useEffect(() => {
        onChangeForm<TStateFormType>(stateForm)
    }, [stateForm])

    const onChangeFormHandler = (values) => {
        setStateForm((prev) => ({ ...prev, on: values.on }))
    }

    return (
        <Form initialValues={stateForm} form={form} onValuesChange={(_, vals) => onChangeFormHandler(vals)}>
            <Divider orientation="left" plain>
                Отображение
            </Divider>

            <Form.Item name="on" label="вкл/выкл" valuePropName="checked">
                <Switch />
            </Form.Item>
        </Form>
    )
}

export default WidgetAIsaevForm
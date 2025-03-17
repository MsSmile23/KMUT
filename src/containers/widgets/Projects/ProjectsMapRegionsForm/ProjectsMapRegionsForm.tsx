import { WidgetECSimpleFiltersForm } from '@shared/ui/ECUIKit/filters/ECSimpleFilters/components/WidgetECSimpleFiltersForm/WidgetECSimpleFiltersForm'
import { ECSimpleFiltersFieldsProps } from '@shared/ui/ECUIKit/filters/ECSimpleFilters/types';
import { Form } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useEffect, useState } from 'react';

type TStateFormType = {
    fields: ECSimpleFiltersFieldsProps[];
}

const initialValuesForm: TStateFormType = {
    fields: [],
}

interface IProjectsMapRegionsFormProps {
    onChangeForm: <T>(data: T) => void;
    settings: {
        vtemplate: any,
        widget: TStateFormType,
    },
}

const ProjectsMapRegionsForm = (props: IProjectsMapRegionsFormProps) => {
    const { settings, onChangeForm } = props;
    const [form] = useForm();
    const initialSettings = Object.keys(settings || {}).length
    const [stateForm, setStateForm] = useState<TStateFormType>(initialSettings ? settings?.widget : initialValuesForm)

    const onChangeFormHandler = (values) => {
        setStateForm((prev) => ({ ...prev, fields: values.fields }))
    }

    useEffect(() => {
        onChangeForm<TStateFormType>(stateForm)
    }, [stateForm])

    return (
        <Form initialValues={stateForm} form={form} onValuesChange={(_, vals) => onChangeFormHandler(vals)}>
            <Form.Item name="fields">
                <WidgetECSimpleFiltersForm />
            </Form.Item>
        </Form>
    )
}

export default ProjectsMapRegionsForm
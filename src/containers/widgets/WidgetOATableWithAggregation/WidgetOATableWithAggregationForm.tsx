import { useGetObjects } from '@shared/hooks/useGetObjects'
import { selectObjects, useObjectsStore } from '@shared/stores/objects'
import { IObject } from '@shared/types/objects'
import { Select } from '@shared/ui/forms'
import { Form } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { FC, useEffect, useMemo, useState } from 'react'

const optionsAgregations = [
    {
        label: 'current',
        value: 'current'
    },
    {
        label: 'max',
        value: 'max'
    },
    {
        label: 'min',
        value: 'min'
    },
    {
        label: 'average',
        value: 'average'
    }
]

const optionsWiewType = [
    {
        label: 'table',
        value: 'table'
    }
]

type stateFormType = {
    widget: {
        aggregations: ('current' | 'max' | 'min' | 'average')[],
        viewType: string
    },
    vtemplate: {
        objectId?: number
    }
}

const initialValuesForm = {
    aggregations: [],
    viewType: 'table'
}

interface WidgetOATableWithAggregationFormProps {
    onChangeForm: <T>(data: T) => void
    settings: stateFormType
}

const WidgetOATableWithAggregationForm: FC<WidgetOATableWithAggregationFormProps> = (props) => {
    const { settings, onChangeForm } = props
    const [form] = useForm()

    // const objects = useObjectsStore(selectObjects)
    const objects = useGetObjects()

    const objectList = useMemo(() => {
        return objects?.map((item) => {
            return {
                value: item?.id,
                label: item?.name
            }
        }) || []
    }, [objects])

    const [stateForm, setStateForm] = useState<stateFormType['widget']>(
        Object.keys(settings?.widget || {}).length
            ? settings.widget
            : initialValuesForm
    )

    useEffect(() => {
        form.setFieldsValue({
            aggregations: settings?.widget?.aggregations || [],
            viewType: settings?.widget?.viewType || 'table'
        })
    }, [settings])

    useEffect(() => {
        onChangeForm<stateFormType['widget']>(stateForm)
    }, [stateForm])

    return (
        <Form
            form={form}
            layout="vertical"
            style={{ maxWidth: 400 }}
            initialValues={initialValuesForm}
            onValuesChange={(_, onChangeForm) => {
                if ('aggregations' in onChangeForm) {
                    setStateForm((prev) => {
                        return {
                            ...prev,
                            ['aggregations']: onChangeForm['aggregations']
                        }
                    })
                }

                if ('viewType' in onChangeForm) {
                    setStateForm((prev) => {
                        return {
                            ...prev,
                            ['viewType']: onChangeForm['viewType']
                        }
                    })
                }
            }}
        >
            <Form.Item name="aggregations">
                <Select
                    options={optionsAgregations}
                    mode="multiple"
                    placeholder="Выбер агрегации"
                />
            </Form.Item>
            <Form.Item name="viewType">
                <Select
                    allowClear={false}
                    options={optionsWiewType}
                    placeholder="Выбер тип представления"
                />
            </Form.Item>
        </Form>
    )
}

export default WidgetOATableWithAggregationForm
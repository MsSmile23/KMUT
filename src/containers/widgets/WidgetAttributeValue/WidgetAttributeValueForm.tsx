import LinkedObjects, { ILinkedObjectsForm } from '@entities/objects/LinkedObjects/LinkedObjects'
import { selectAttributeByIndex, selectAttributes, useAttributesStore } from '@shared/stores/attributes'
import ECColorPicker from '@shared/ui/ECUIKit/forms/ECColorPicker/ECColorPicker'
import { Input, Select } from '@shared/ui/forms'
import { Col, Divider, Form, Row } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { FC, useEffect, useMemo, useState } from 'react'

type TStateFormType = {
    linkedObjectsForm?: ILinkedObjectsForm
    viewType: 'text' | 'histogram'
    aggregation: 'sum' | 'average'
    textPosition:
        | 'topLeft'
        | 'topCenter'
        | 'topRight'
        | 'centerLeft'
        | 'center'
        | 'centerRight'
        | 'bottomLeft'
        | 'bottomCenter'
        | 'bottomRight'

    attributes: number[]
    ratio: number
    textLabel: string
    textUnit: string
    textFontsize: number
    histogramDirection: 'horizontal' | 'vertical'
    histogramMaxValue: number
    histogramUnit: string
    histogramColumnColor: string
}


const TYPE_OPTIONS = [
    { label: 'Суммирование', value: 'sum' },
    {
        label: 'Среднее',
        value: 'average',
    },
]

const VIEW_TYPES = [
    {
        label: 'Текстовое',
        value: 'text',
    },
    {
        label: 'Гистограмма',
        value: 'histogram',
    },
]

const LABEL_POSITION_OPTIONS = [
    {
        label: 'Сверху слева',
        value: 'topLeft',
    },
    {
        label: 'Сверху в центре',
        value: 'topCenter',
    },
    {
        label: 'Сверху справа',
        value: 'topRight',
    },
    {
        label: 'В центре слева',
        value: 'centerLeft',
    },
    {
        label: 'По центру',
        value: 'center',
    },
    {
        label: 'В центре справа',
        value: 'centerRight',
    },
    {
        label: 'Снизу слева',
        value: 'bottomLeft',
    },
    {
        label: 'Снизу в центре',
        value: 'bottomCenter',
    },
    {
        label: 'Снизу справа',
        value: 'bottomRight',
    },
]

const HISTOGRAM_DIRECTION_OPTIONS = [
    { value: 'horizontal', label: 'Горизонтальное' },
    { value: 'vertical', label: 'Вертикальное' },
]

export interface WidgetObjectsCountFromProps {
    onChangeForm: <T>(data: T) => void
    settings: { vtemplate: { objectId: number }; widget: TStateFormType }
}

const WidgetAttributeValueForm: FC<WidgetObjectsCountFromProps> = (props) => {
    const { settings, onChangeForm } = props
    const { widget } = settings
    const [form] = useForm()
    // const initialSettings = Object.keys(settings || {}).length
    const [stateForm, setStateForm] = useState<TStateFormType>(settings?.widget)

    const attributes = useAttributesStore(selectAttributes)
    const getAttributeByIndex = useAttributesStore(selectAttributeByIndex)

    useEffect(() => {
        onChangeForm<TStateFormType>(stateForm)
    }, [stateForm])

    const onChangeFormHandler = (onChangeForm) => {
        setStateForm((prev) => {
            return {
                ...prev,
                ...onChangeForm,
            }
        })
    }

    const targetClassAttributes = useMemo(() => {
        let localTargetClassAttributes = []

        if (widget?.linkedObjectsForm?.targetClasses) {
            widget?.linkedObjectsForm?.targetClasses.forEach((cl) => {
                const localAttributes = attributes.filter(
                    (attr) => attr?.classes_ids?.filter((item) => item?.id == cl)?.length > 0
                )

                localTargetClassAttributes = localTargetClassAttributes.concat(localAttributes)
            })
        }


        return localTargetClassAttributes
    }, [widget?.linkedObjectsForm])


    return (
        <>
            <LinkedObjects 
                getFormValues={(value) => onChangeFormHandler({ linkedObjectsForm: value })} 
                {...widget?.linkedObjectsForm} 
            />
            <Form
                initialValues={stateForm}
                form={form}
                layout="vertical"
                // style={{ width: 800 }}
                onValuesChange={(_, onChangeForm) => {
                    onChangeFormHandler(onChangeForm)
                }}
            >
                <Row gutter={16}>
                    <Col span={6}>
                        <Form.Item name="attributes" label="Атрибуты">
                            <Select
                                mode="multiple"
                                options={targetClassAttributes.map((item) => {
                                    return {
                                        value: item?.id,
                                        label: item?.name,
                                    }
                                })}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={6}>
                        <Form.Item name="aggregation" label="Агрегация">
                            <Select options={TYPE_OPTIONS} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="viewType" label="Представление">
                            <Select options={VIEW_TYPES} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="ratio" label="Коэффициент">
                            <Input type="number" step ="0.001" defaultValue={1} />
                        </Form.Item>
                    </Col>
                </Row>
                {stateForm?.viewType == 'text' && (
                    <Row gutter={16}>
                        <Divider orientation="left">Текстовое</Divider>
                        <Col span={6}>
                            <Form.Item name="textLabel" label="Лейбл">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="textUnit" label="Юнит">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="textFontsize" label="Размер шрифта (в пикселях)">
                                <Input type="number" min={0} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="textPosition" label="Расположение">
                                <Select options={LABEL_POSITION_OPTIONS} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="valueRounding" label="Знаков после запятой">
                                <Input type="number" />
                            </Form.Item>
                        </Col>
                    </Row>
                )}
                {stateForm?.viewType == 'histogram' && (
                    <Row gutter={16}>
                        <Divider orientation="left">Гистограмма</Divider>
                        <Col span={6}>
                            <Form.Item name="histogramDirection" label="Направление">
                                <Select options={HISTOGRAM_DIRECTION_OPTIONS} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="histogramMaxValue" label="Максимальное значение">
                                <Input type="number" min={0} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="histogramUnit" label="Юнит">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="histogramColumnColor" label="Цвет колонок">
                                <ECColorPicker />
                            </Form.Item>
                        </Col>

                        {stateForm.attributes.map(attr => {
                            return (
                                <Col span={6} key={attr}>

                                    <Form.Item
                                        name={`customName_${attr}`}
                                        label={`Кастомное имя атрибута ${getAttributeByIndex('id', attr)?.name}`}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            )
                        })}
                    </Row>
                )}
            </Form>
        </>
    )
}

export default WidgetAttributeValueForm
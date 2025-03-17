import { Select } from '@shared/ui/forms'
import { Card, Col, Form, Input, Row, Switch } from 'antd'
import { FC, PropsWithChildren, useEffect, useState } from 'react'
import { ITicketsContainerProps } from '@entities/tickets/types'
import LinkedObjects from '@entities/objects/LinkedObjects/LinkedObjects'
import { TInitialDataSettingVTType } from '@containers/vtemplates/VtemplateFormContainer/types/types'
import { selectAttributes, useAttributesStore } from '@shared/stores/attributes'
import { durationOptions } from '@shared/utils/datetime'
import ECColorPicker from '@shared/ui/ECUIKit/forms/ECColorPicker/ECColorPicker'


export interface IWidgetTopFormState {
    vtemplate: { objectId: number }
    widget: PropsWithChildren<ITicketsContainerProps>
    baseSettings: TInitialDataSettingVTType
}

interface IWidgetTopForm {
    onChangeForm: <T>(data: T) => void
    settings: IWidgetTopFormState
}

const representationTypesOptions = [
    {
        label: 'Таблица с прогресс-баром',
        value: 'progressBar',
    },
    {
        label: 'Облако слов',
        value: 'wordCloud',
    },
    {
        label: 'Карта-дерево',
        value: 'treemap',
    },
    {
        label: 'Пайчарт',
        value: 'pieChart',
    },
    {
        label: 'Горизонтальные чарты',
        value: 'horizontalBarChart',
    }
]

const aggregationOptions = [
    {
        label: 'по-умолчанию',
        value: 'count',
    },
    {
        label: 'суммарно',
        value: 'sum',
    },
    {
        label: 'среднее',
        value: 'avg',
    },
    {
        label: 'по времени',
        value: 'time',
    },
]

const WidgetTopTicketsForm: FC<IWidgetTopForm> = (props) => {
    const { settings, onChangeForm } = props
    const { widget } = settings
    const [form] = Form.useForm()
    const [stateForm, setStateForm] = useState<IWidgetTopFormState['widget']>(widget)
    const attributesStore = useAttributesStore(selectAttributes)

    const filteredAttributes = attributesStore
        ?.filter((attr) => (attr?.data_type_id === 6 || attr?.data_type_id === 1) && attr?.package_id === 1)
        ?.sort((a, b) => a.name.localeCompare(b.name))

    //Получаем атрибуты целевых классов
    const attrOptions = filteredAttributes?.map(({ id, name }) => ({ label: `(${id}) ${name}`, value: id }))
    // ?.sort((a, b) => a.value - b.value)

    useEffect(() => {
        onChangeForm<IWidgetTopFormState['widget']>(stateForm)
    }, [stateForm])

    useEffect(() => {
        setStateForm(form.getFieldsValue())
    }, [widget.representationType])

    const onChangeFormHandler = (value, values) => {
        const key = Object.keys(value)[0]

        if (key === 'representationType') {
            setStateForm({
                ...stateForm,
                [key]: values[key],
            })
            form.setFieldsValue({ height: undefined })
        } else {
            setStateForm((prev) => {
                return {
                    ...prev,
                    [key]: values[key],
                }
            })
        }
    }

    return (
        <>
            <LinkedObjects 
                getFormValues={(value) => onChangeForm({ linkedObjectsForm: value })} 
                {...widget?.linkedObjectsForm} 
            />
            <Form
                form={form}
                layout="vertical"
                // style={{ maxWidth: 400 }}
                initialValues={widget}
                onValuesChange={onChangeFormHandler}
            >
                <Card type="inner" title="Получение данных" style={{ width: '100%', marginBottom: 10 }}>
                    <Form.Item name="dataType" label="Источник данных" style={{ width: 'calc(25% - 10px)' }}>
                        <Select
                            options={[
                                {
                                    label: 'Строковые данные',
                                    value: 'countStrings',
                                },
                                {
                                    label: 'Числовые данные',
                                    value: 'aggregation',
                                },
                                {
                                    label: 'Частые падения',
                                    value: 'frequent-falls',
                                },
                                {
                                    label: 'Длительность инцидентов',
                                    value: 'duration-incidents',
                                },
                                {
                                    label: 'Недоступные за 30 дней',
                                    value: 'aggregation-incidents',
                                },
                            ]}
                            placeholder="Выберите тип"
                        />
                    </Form.Item>
                    <Row style={{ width: '100%', display: 'flex', gap: 20, flexWrap: 'nowrap' }}>
                        {(widget?.dataType == 'aggregation' || widget?.dataType == 'countStrings') && (
                            <Form.Item name="attributeId" label="Атрибут" style={{ width: 'calc(25% - 10px)' }}>
                                <Select options={attrOptions} placeholder="Выберите атрибут" />
                            </Form.Item>
                        )}
                        {widget?.attributeId === 10283 &&
                            (widget?.dataType == 'aggregation' || widget?.dataType == 'countStrings') && (
                            <Form.Item
                                name="extract"
                                label="Тип строки в url"
                                style={{ width: 'calc(25% - 10px)' }}
                            >
                                <Select
                                    options={[
                                        {
                                            label: 'URL (без параметров)',
                                            value: 'url',
                                        },
                                        {
                                            label: 'HOST (только host)',
                                            value: 'host',
                                        },
                                    ]}
                                    placeholder="Выберите тип"
                                />
                            </Form.Item>
                        )}
                        {widget?.dataType !== 'aggregation-incidents' && (
                            <Form.Item name="period" label="Период" style={{ width: 'calc(25% - 10px)' }}>
                                <Select options={durationOptions} placeholder="Выберите период" />
                            </Form.Item>
                        )}

                        {widget?.dataType !== 'duration-incidents' && widget?.dataType !== 'aggregation-incidents' && (
                            <Form.Item name="limit" label="Лимит" style={{ width: 'calc(25% - 10px)' }}>
                                <Input type="number" placeholder="Введите лимит" />
                            </Form.Item>
                        )}

                        {widget?.dataType === 'aggregation' && (
                            <>
                                <Form.Item
                                    name="aggregation"
                                    label="Тип агрегации"
                                    style={{ width: 'calc(25% - 10px)' }}
                                >
                                    <Select options={aggregationOptions} placeholder="Выберите тип" />
                                </Form.Item>
                                <Form.Item name="condition" label="Условие" style={{ width: 'calc(25% - 10px)' }}>
                                    <Input placeholder="Введите условие" />
                                </Form.Item>
                            </>
                        )}
                    </Row>
                </Card>
                <Card type="inner" title="Настройки представления" style={{ width: '100%' }}>
                    <Form.Item name="representationType" label="Представление" style={{ width: '30%' }}>
                        <Select options={representationTypesOptions} placeholder="Выберите тип представления" />
                    </Form.Item>
                    {widget.representationType === 'horizontalBarChart' && (
                        <Col span={8}>
                            <Form.Item name="height" label="Высота виджета" style={{ width: '100%' }}>
                                <Input type="number" placeholder="Введите высоту" />
                            </Form.Item>
                            <Form.Item
                                valuePropName="checked"
                                name="showPercent"
                                label="Отображение процентов"
                                style={{ width: '100%' }}
                            >
                                <Switch />
                            </Form.Item>
                        </Col>
                    )}
                    {widget.representationType === 'progressBar' && (
                        <Row style={{ width: '100%' }} gutter={20}>
                            <Col span={8}>
                                <Form.Item name="height" label="Высота виджета" style={{ width: '100%' }}>
                                    <Input type="number" placeholder="Введите высоту" />
                                </Form.Item>
                            </Col>
                            {/* <Form.Item 
                                    name="iconColor"
                                    label="Цвет иконок"
                                    getValueFromEvent={(color) => {
                                        return '#' + color.toHex();
                                    }}
                                >
                                    <ColorPicker format="hex" defaultFormat="hex" showText />
                            </Form.Item> */}
                            <Col span={8}>
                                <Form.Item
                                    name="rightFromTitleView"
                                    label="Тип значения (Справа от заголовка)"
                                    style={{ width: '100%' }}
                                >
                                    <Select
                                        placeholder="Выберите тип значения"
                                        options={[
                                            {
                                                label: 'Изначальное значение',
                                                value: 'absolute',
                                            },
                                            {
                                                label: 'Процентное значение',
                                                value: 'percent',
                                            },
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="rightFromProgressBarView"
                                    label="Тип значения (Справа от прогресс-бара)"
                                    style={{ width: '100%' }}
                                >
                                    <Select
                                        placeholder="Выберите тип значения"
                                        options={[
                                            {
                                                label: 'Изначальное значение',
                                                value: 'absolute',
                                            },
                                            {
                                                label: 'Процентное значение',
                                                value: 'percent',
                                            },
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item
                                    name="labelMargin"
                                    label="Расстояние между пунктами"
                                    style={{ width: '100%' }}
                                >
                                    <Input type="number" placeholder="Введите значение" min={0} />
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item
                                    name="barColor"
                                    label="Цвет заполнения прогресс-бара"
                                    style={{ width: '100%' }}
                                >
                                    <ECColorPicker />
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item
                                    name="barBackgroundColor"
                                    label="Цвет фона прогресс-бара"
                                    style={{ width: '100%' }}
                                >
                                    <ECColorPicker />
                                </Form.Item>
                            </Col>
                        </Row>
                    )}

                    {widget.representationType === 'wordCloud' && (
                        <div
                            style={{
                                display: 'flex',
                                width: '100%',
                                gap: 24,
                            }}
                        >
                            {/* <Form.Item 
                                name="height"
                                label="Высота виджета"
                            >
                                <Input type="number" placeholder="Введите высоту" />
                            </Form.Item> */}
                        </div>
                    )}

                    {widget.representationType === 'treemap' && (
                        <Row style={{ width: '100%' }} gutter={20}>
                            <Col span={8}>
                                <Form.Item name="height" label="Высота виджета" style={{ width: '100%' }}>
                                    <Input type="number" placeholder="Введите высоту" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="valueDisplayType"
                                    label="Тип отображения значений"
                                    style={{ width: '100%' }}
                                >
                                    <Select
                                        placeholder="Выберите тип значения"
                                        options={[
                                            {
                                                label: 'Изначальное значение 1',
                                                value: 'absolute',
                                            },
                                            {
                                                label: 'Значение в процентах 1%',
                                                value: 'percent',
                                            },
                                            {
                                                label: 'В изначальное + в процентах 1 (1%)',
                                                value: 'combine',
                                            },
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    )}

                    {widget.representationType === 'pieChart' && (
                        <Row style={{ width: '100%' }} gutter={20}>
                            <Col span={8}>
                                <Form.Item
                                    name={['viewProps', 'chartTitle']}
                                    label="Название графика"
                                    style={{
                                        flex: 1,
                                        marginBottom: 10,
                                    }}
                                >
                                    <Input type="text" placeholder="Введите название" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name={['viewProps', 'height']}
                                    label="Высота виджета"
                                    style={{
                                        flex: 0.3,
                                        marginBottom: 10,
                                    }}
                                >
                                    <Input type="number" placeholder="Введите высоту" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name={['viewProps', 'chartRatio']} label="Высота графика, %">
                                    <Input type="number" placeholder="Введите высоту" />
                                </Form.Item>
                            </Col>
                            <Row style={{ width: '100%', display: 'flex' }}>
                                <Form.Item
                                    name={['viewProps', 'legendEnabled']}
                                    valuePropName="checked"
                                    label="Легенда"
                                >
                                    <Switch />
                                </Form.Item>

                                {widget?.viewProps?.legendEnabled && (
                                    <Form.Item
                                        name={['viewProps', 'legendRatio']}
                                        label="Высота легенды? %"
                                        style={{
                                            // flex: 0.3,
                                            marginBottom: 10,
                                        }}
                                    >
                                        <Input type="number" />
                                    </Form.Item>
                                )}
                            </Row>
                        </Row>
                    )}
                </Card>
            </Form>
        </>
    )
}

export default WidgetTopTicketsForm
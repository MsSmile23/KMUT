import { selectClasses, useClassesStore } from '@shared/stores/classes'
import { IObject } from '@shared/types/objects'
import { IconSelect, Input, Select } from '@shared/ui/forms'
import { IECIconView, ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
import ColorPicker from '@shared/ui/pickers/ColorPicker/ColorPicker'
import { Col, Form, Row } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { FC, useEffect, useState } from 'react'

type TStateFormType = {
    object: IObject
    title: string
    icon: IECIconView['icon']
    color: string
    filterMnemo: string
    filterValue: number[]
}

const filterMnemoOptions = [
    {
        value: 'class_id',
        label: 'Поиск по классу',
    },
]

const initialValuesForm = {
    object: {} as IObject,
    title: '',
    icon: undefined,
    color: '#000000',
    filterMnemo: 'class_id',
    filterValue: undefined,
}

export interface WidgetObjectsCountFromProps {
    onChangeForm: <T>(data: T) => void
    settings: { vtemplate: { objectId: number }; widget: TStateFormType }
}

const WidgetObjectsCountForm: FC<WidgetObjectsCountFromProps> = (props) => {
    const { settings, onChangeForm } = props
    const [form] = useForm()
    const initialSettings = Object.keys(settings || {}).length
    const [stateForm, setStateForm] = useState<TStateFormType>(initialSettings ? settings?.widget : initialValuesForm)
    const classes = useClassesStore(selectClasses)

    useEffect(() => {
        onChangeForm<TStateFormType>(stateForm)
    }, [stateForm])

    const onChangeFormHandler = (onChangeForm) => {
        if ('title' in onChangeForm) {
            setStateForm((prev) => {
                return {
                    ...prev,
                    ['title']: onChangeForm['title'],
                }
            })
        }

        if ('icon' in onChangeForm) {
            setStateForm((prev) => {
                return {
                    ...prev,
                    ['icon']: onChangeForm['icon'],
                }
            })
        }

        if ('color' in onChangeForm) {
            setStateForm((prev) => {
                return {
                    ...prev,
                    ['color']:
                        typeof onChangeForm['color'] == 'string'
                            ? onChangeForm['color']
                            : onChangeForm['color'].toHexString(),
                }
            })
        }

        if ('filterMnemo' in onChangeForm) {
            setStateForm((prev) => {
                return {
                    ...prev,
                    ['filterMnemo']: onChangeForm['filterMnemo'],
                }
            })
        }

        if ('filterValue' in onChangeForm) {
            setStateForm((prev) => {
                return {
                    ...prev,
                    ['filterValue']: onChangeForm['filterValue'],
                }
            })
        }

        if ('indent' in onChangeForm) {
            setStateForm((prev) => {
                return {
                    ...prev,
                    ['indent']: onChangeForm['indent'],
                }
            })
        }
    }

    return (
        <Form
            initialValues={stateForm}
            form={form}
            layout="vertical"
            style={{ width: 800 }}
            onValuesChange={(_, onChangeForm) => {
                onChangeFormHandler(onChangeForm)
            }}
        >
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item name="title" label="Заголовок">
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="icon" label="Иконка">
                        <IconSelect />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="color" label="Цвет">
                        <ColorPicker />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="filterMnemo" label="Классификация отбора объектов">
                        <Select options={filterMnemoOptions} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="indent" label="Размер отступов">
                        <Input type="number" min={1} />
                    </Form.Item>
                </Col>
                {form.getFieldValue('filterMnemo') == 'class_id' && (
                    <Col span={12}>
                        <Form.Item name="filterValue" label="Классы для отбора объектов">
                            <Select
                                mode="multiple"
                                customData={{
                                    data: classes ?? [],
                                    convert: { valueField: 'id', optionLabelProp: 'name' },
                                }}
                            />
                        </Form.Item>
                    </Col>
                )}
            </Row>
        </Form>
    )
}

export default WidgetObjectsCountForm
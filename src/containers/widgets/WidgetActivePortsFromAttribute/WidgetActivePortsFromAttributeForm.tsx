/* eslint-disable react/jsx-max-depth */
import { ECSelect } from '@shared/ui/forms'
import { Col, Form, Row } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { FC, useMemo } from 'react'
import WrapperCard from '@shared/ui/wrappers/WrapperCard/WrapperCard'
import { getStateViewParamsFromState } from '@shared/utils/states'
import { useStateStereotypesStore } from '@shared/stores/statesStereotypes'
import ECColorCircle from '@shared/ui/ECUIKit/common/ECColorCircle/ECColorCircle'
import { getAttributeOptions } from '@containers/mass-actions/MassActionsFormContainer/utils'
import ECColorPicker from '@shared/ui/ECUIKit/forms/ECColorPicker/ECColorPicker'
import { colStyles, REPRESENT_OPTIONS, rowStyles } from './utils'
import { Input } from 'antd/lib'

export interface WidgetActivePortsFromAttributeFormProps {
    onChangeForm: <T>(data: T) => void
    settings: { vtemplate: { objectId: number }; widget, baseSettings }
}

const stateStereotypeAsOptions = (statuses = useStateStereotypesStore.getState().store.data) => {
    return [...statuses.map(status => {
        return {
            value: getStateViewParamsFromState(status)?.fill,
            label:
                <div style={{ display: 'flex' }}>
                    <ECColorCircle color={getStateViewParamsFromState(status)?.fill} />
                </div>
        }
    })]
}

const WidgetActivePortsFromAttributeForm: FC<WidgetActivePortsFromAttributeFormProps> = (props) => {
    const { settings, onChangeForm } = props
    const [form] = useForm<WidgetActivePortsFromAttributeFormProps>()
    const representationType = Form.useWatch('representation', form)
    const classIds = settings?.baseSettings?.classes
    const attribute_options = useMemo(() => getAttributeOptions([], classIds), [classIds])
    const portColorOptions = useMemo(() => stateStereotypeAsOptions(), [])

    return (
        <Form
            labelCol={{ xs: 16 }}
            labelAlign="left"
            initialValues={{ ...settings?.widget }}
            form={form}
            layout="vertical"
            style={{ width: 1000 }}
            onValuesChange={() => onChangeForm(form.getFieldsValue())}
        >
            <WrapperCard
                styleMode="replace"
                bodyStyle={{ padding: '10px' }}
                title="Настройка индикации портов"
            >
                <Row {...rowStyles}>
                    <Col {...colStyles}>
                        <Form.Item required label="Выбор атрибута" name="selectAttribute">
                            <ECSelect
                                allowClear
                                placeholder="Выберите атрибут"
                                options={attribute_options} // Атрибуты классов, выбранных для макета
                            />
                        </Form.Item>
                    </Col>
                    <Col {...colStyles}>
                        <Form.Item
                            required
                            label="Представление"
                            name="representation"
                            initialValue="status_card"
                        >
                            <ECSelect
                                placeholder="Выберите представление"
                                options={REPRESENT_OPTIONS} // пока только Карточки статусов, выбран по умолчанию
                            />
                        </Form.Item>
                    </Col>

                </Row>
                <Row {...rowStyles}>
                    <Col {...colStyles}>
                        <Form.Item
                            required
                            label="Надпись при отсутствии портов"
                            name="noPortText"
                            initialValue="Порты (сервисы) не обнаружены"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                {representationType === 'status_card' &&
                    <Row {...rowStyles}>
                        <Col xs={6}>
                            <Form.Item required label="Цвета фона" name="backgroundColor">
                                <ECColorPicker />
                            </Form.Item>
                        </Col>
                        <Col xs={6}>
                            <Form.Item
                                required
                                label="Цвета порта"
                                name="portCardColor"
                            >
                                <ECColorPicker />
                            </Form.Item>
                        </Col>
                        <Col xs={6}>
                            <Form.Item
                                label="Активный порт"
                                name="activePortColor"
                                initialValue="#5cb85c"
                            >
                                <ECSelect
                                    style={{ width: '100px' }}
                                    allowClear
                                    maxTagCount="responsive"
                                    options={portColorOptions}
                                    placeholder="Выберите цвет"
                                    dropdownStyle={{ width: 'fit-content' }}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={6}>
                            <Form.Item
                                label="Неактивный порт"
                                name="disablePortColor"
                                initialValue="#428bca"
                            >
                                <ECSelect
                                    style={{ width: '100px' }}
                                    allowClear
                                    maxTagCount="responsive"
                                    options={portColorOptions}
                                    placeholder="Выберите цвет"
                                    dropdownStyle={{ width: 'fit-content' }}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={6}>
                            <Form.Item
                                label="Остальные порты"
                                name="otherPortColor"
                                initialValue="#428bca"
                            >
                                <ECSelect
                                    style={{ width: '100px' }}
                                    allowClear
                                    maxTagCount="responsive"
                                    options={portColorOptions}
                                    placeholder="Выберите цвет"
                                    dropdownStyle={{ width: 'fit-content' }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>}
            </WrapperCard>
        </Form>
    );
}

export default WidgetActivePortsFromAttributeForm
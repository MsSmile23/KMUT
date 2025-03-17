import { Buttons } from '@shared/ui/buttons'
import { ECSelect, IconSelect } from '@shared/ui/forms'
import { Col, Form, Input, Row } from 'antd'
import { ColProps, RowProps } from 'antd/lib'
import { BUTTON_PRESETS, TYPE_FUNCTIONAL, TYPE_OPTIONS } from './utils'
import { selectCheckPermission, useAccountStore } from '@shared/stores/accounts'
import { useMemo } from 'react'
import { findObjAtrValueByMnemo } from '@shared/lib/MLKit/MLKit'
import { useObjectsStore } from '@shared/stores/objects'

const rowStyles: RowProps = {
    gutter: [32, 0],
}

const colStyles: ColProps = {
    xs: 12
}

const ListConstructorForm = ({
    form,
    handleSubmitButton,
    objId
}) => {
    const itemType = Form.useWatch('itemType', form)
    const objectAttribute = useMemo(() => useObjectsStore.getState()
        .getByIndex('id', objId)?.object_attributes, [objId])

    const checkPermission = useAccountStore(selectCheckPermission)

    const sshClientData = useMemo(() => ({
        username: findObjAtrValueByMnemo('ssh_console_login', objectAttribute) ?? '',
        userpassword: findObjAtrValueByMnemo('ssh_console_password', objectAttribute) ?? '',
        port: findObjAtrValueByMnemo('ssh_console_port', objectAttribute) ?? '',
        ip: findObjAtrValueByMnemo('iface_ip', objectAttribute) ?? ''
    }), [objId]);

    const rdpClientData = useMemo(() => ({
        rdp_ip: findObjAtrValueByMnemo('rdp_ip', objectAttribute) ?? '',
        rdp_login: findObjAtrValueByMnemo('rdp_login', objectAttribute) ?? '',
        rdp_pass: findObjAtrValueByMnemo('rdp_pass', objectAttribute) ?? '',
    }), [objId]);

    const device_control_url = findObjAtrValueByMnemo('device_control_url', objectAttribute)

    const checkAllObjectValue = (object) => {
        return  Object.values(object).every(value => value !== '')
    }

    const FUNCTION_OPTIONS = [
        ...TYPE_FUNCTIONAL,
        checkPermission(['run tasks']) ? {
            label: 'Опросить всё',
            value: 'forceMeas',
        } : null,
        checkAllObjectValue(sshClientData) ? {
            label: 'SSH терминал',
            value: 'ssh_terminal',
        } : null,
        device_control_url ? {
            label: 'Консоль управления',
            value: 'device_cotrol_panel',
        } : null,
        checkAllObjectValue(rdpClientData) ? {
            label: 'RDP клиент',
            value: 'rdp_client',
        } : null,
        checkAllObjectValue(rdpClientData) ? {
            label: 'RDP клиент',
            value: 'rdp_client',
        } : null,
    ].filter(el => el !== null)

    return (
        <Form
            style={{ marginTop: 20 }}
            labelCol={{ xs: 8 }}
            labelAlign="left"
            form={form}
            onFinish={handleSubmitButton}
        >
            <Row {...rowStyles}>
                <Col {...colStyles}>
                    <Form.Item required label="Тип" name="itemType">
                        <ECSelect options={TYPE_OPTIONS} />
                    </Form.Item>
                </Col>
                {itemType === 'button' &&
                    <Col {...colStyles}>
                        <Form.Item label="Пресеты" name="presets">
                            <ECSelect
                                options={FUNCTION_OPTIONS}
                                onChange={(value) => {
                                    form.setFieldsValue(BUTTON_PRESETS[value])
                                }}
                            />
                        </Form.Item>
                    </Col>}
            </Row>
            {itemType === 'button' &&
                <>
                    <Row {...rowStyles}>
                        <Col {...colStyles}>
                            <Form.Item required label="Иконка" name="itemIcon">
                                <IconSelect />
                            </Form.Item>
                        </Col>
                        <Col {...colStyles}>
                            <Form.Item required label="Название" name="itemName">
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row {...rowStyles}>
                        <Col {...colStyles}>
                            <Form.Item required label="Описание" name="itemDescription">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col {...colStyles}>
                            <Form.Item required label="Функционал" name="itemFunctional">
                                <ECSelect
                                    options={FUNCTION_OPTIONS}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </>}
            <Buttons.ButtonSubmit />
        </Form>
    )
}

export default ListConstructorForm
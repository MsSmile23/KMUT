import { ExpandAltOutlined } from '@ant-design/icons'

import { BaseButton, ButtonAdd } from '@shared/ui/buttons'
import { Input } from '@shared/ui/forms/Input/Input'
import { DefaultModal } from '@shared/ui/modals'
import { ECTooltip } from '@shared/ui/tooltips'
import { Col, Row } from 'antd'
import { FC, useEffect, useMemo, useState } from 'react'
import OAttrFormField from '../OAttrFormField/OAttrFormField'
import CodeEditor from '@shared/ui/CodeEditor/CodeEditor'


interface IOAShortFieldView {
    value?: any
    onChange?: any
    attr: any
    formItemName?: string
    form?: any

    objectView?: boolean
    modalWidth?: string | number
}
const OAShortFieldView: FC<IOAShortFieldView> = ({
    value,
    onChange,
    form,
    attr,
    formItemName,
    objectView = false,
    modalWidth,
}) => {
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)

    const [initialValue, setInitialValue] = useState<any>(value)
    const [viewType, setViewType] = useState<'full' | 'short'>(null)

    const [localValue, setLocalValue] = useState<any>(value)

    const handleCancel = () => {
        setIsModalVisible(false)
        setViewType(null)

        if (form) {
            form.setFieldValue(formItemName, initialValue)
        }
    }

    const updateButtonHandler = () => {
        setIsModalVisible(false)
        onChange(localValue)
        setInitialValue(localValue)
        setViewType(null)
    }

    return (
        <>
            <DefaultModal
                width={modalWidth ? modalWidth : 'auto'}
                style={{ minWidth: 600 }}
                title="Редактирование"
                isModalVisible={isModalVisible}
                handleCancel={handleCancel}
            >
                <>
                    {viewType === 'full' && (
                        <OAttrFormField
                            value={localValue}
                            onChange={setLocalValue}
                            attribute={attr}
                            viewTypeId={attr.view_type_id}
                            dataType={String(attr.data_type?.inner_type)}
                            form={form}
                            viewType={attr.view_type?.type}
                            formItemName={formItemName}
                            jsonTypeValue
                        />
                    )}
                    {viewType === 'short' && (
                    // <TextArea value={value} onChange={(e) => onChange(e.target.value)} />

                        <CodeEditor
                            mnemonic="json"
                            editable={true}
                            placeholder="Введите код"
                            value={localValue}
                            onChange={setLocalValue}
                        />
                    )}
                </>
                <div style={{ marginTop: '10px' }}>
                    <ButtonAdd customText="Обновить значение" icon={false} onClick={updateButtonHandler} />
                </div>
            </DefaultModal>

            <Row gutter={4} justify="space-between" align="middle">
                <Col xxl={objectView ? 20 : 12} xl={6}>
                    {' '}
                    <Input disabled onChange={(e) => onChange(e.target.value)} value={initialValue} />
                </Col>
                <Col
                    xxl={objectView ? 4 : 12}
                    xl={18}
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                        justifyContent: 'space-between',
                    }}
                >
                    {' '}
                    <ECTooltip title="Открыть форму">
                        {' '}
                        <BaseButton
                            shape="circle"
                            size="small"
                            icon={
                                <ExpandAltOutlined
                                    onClick={() => {
                                        setIsModalVisible(true)
                                        setViewType('full')
                                    }}
                                />
                            }
                        />{' '}
                    </ECTooltip>
                    <ECTooltip title="Редактировать поле">
                        {' '}
                        <BaseButton
                            shape="circle"
                            size="small"
                            icon={
                                <div
                                    style={{
                                        fontSize: '10px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    JS
                                </div>
                            }
                            onClick={() => {
                                setIsModalVisible(true)
                                setViewType('short')
                            }}
                        />{' '}
                    </ECTooltip>
                </Col>
            </Row>
        </>
    )
}

export default OAShortFieldView
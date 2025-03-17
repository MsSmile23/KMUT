import { CloseCircleOutlined, PlayCircleOutlined } from '@ant-design/icons'
import { patchAccountById } from '@shared/api/Accounts/Models/patchAccountById/patchAccountById'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { selectClassByIndex, useClassesStore } from '@shared/stores/classes'
import { selectObjectByIndex, useObjectsStore } from '@shared/stores/objects'
import { BaseButton, ButtonClear, ButtonDeleteRow, Buttons, ButtonSave } from '@shared/ui/buttons'
import { CheckBox, Select } from '@shared/ui/forms'
import { DefaultModal2 } from '@shared/ui/modals'
import { ECTooltip } from '@shared/ui/tooltips'
import { Col, Form, Input, Row } from 'antd'
import { link } from 'fs'
import { FC, useEffect, useLayoutEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

const ACTION_TYPE_OPTIONS = [
    { value: 'create', label: 'Создать' },
    { value: 'update', label: 'Обновить' },
]
const TYPE_OPTIONS = [
    { value: 'rootObjects', label: 'С корневыми объектами' },
    { value: 'nonRootObjects', label: 'Без корневых объектов' },
]
interface IVTemplatesManager {
    onLoad?: (settings:any) => void
    settings?: {
        vtemplate_id: number
        class_id?: number
        object_id?: number
    }
    vTemplateSettings?: any
    defaultParameter?: boolean
}
const VTemplatesManager: FC<IVTemplatesManager> = ({
    onLoad,
    settings = { vtemplate_id: 0, class_id: 10331 },
    vTemplateSettings,
    defaultParameter
}) => {
    const accountData = useAccountStore(selectAccount)
    const accountSettings = accountData?.user?.settings
    const getObjectByIndex = useObjectsStore(selectObjectByIndex)
    const object = getObjectByIndex('id', settings?.object_id)
    const getClassByIndex = useClassesStore(selectClassByIndex)
    const currentClass = getClassByIndex('id', settings?.class_id)
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [form] = Form.useForm()
    const [chosenTemplateId, setChosenTemplateId] = useState<any>(null)
    const [actionType, setActionType] = useState<'create' | 'update'>(null)
    const [templates, setTemplates] = useState<any[]>([])

    //*При загрузке узнаем, какой шаблон нужен и отправляем его "наверх"

    const { forceUpdate } = useAccountStore.getState()
    const changeAccountSettingsCam = async () => {
        const newSettings = {
            ...accountData?.user?.settings,
            cam: templates,
        }
        const response = await patchAccountById(`${accountData?.user?.id}`, {
            settings: newSettings,
        })

        if (response?.success) {
            forceUpdate()
        }
    }

    const getDefaultTemplate = () => {
        let localTemplate: any = defaultParameter

        const localTemplates = accountSettings?.cam

        const vTempObjDefault = localTemplates?.find(
            (item) =>
                item?.vtemplate_id == settings?.vtemplate_id && item?.object_id == settings?.object_id && item?.default
        )
        const vTempObj = localTemplates?.find(
            (item) => item?.vtemplate_id == settings?.vtemplate_id && item?.object_id == settings?.object_id
        )
        const vTempClassDefault = localTemplates?.find(
            (item) =>
                item?.vtemplate_id == settings?.vtemplate_id && item?.class_id == settings?.class_id && item?.default
        )
        const vTempClass = localTemplates?.find(
            (item) => item?.vtemplate_id == settings?.vtemplate_id && item?.class_id == settings?.class_id
        )
        const vTemp = localTemplates?.find((item) => item?.vtemplate_id == settings?.vtemplate_id)

        const vTempDefault = vTempObjDefault ?? vTempObj ?? vTempClassDefault ?? vTempClass ?? vTemp

        if (vTempDefault) {
            setChosenTemplateId(vTempObjDefault?.id)
        }
        return vTempDefault ?? localTemplate
    }

    const closeModal = () => {
        setIsModalVisible(false)
        clearForm()
    }

    useLayoutEffect(() => {
        setTemplates(accountSettings?.cam ?? [])
        // onLoad (getDefaultTemplate())
    }, [])

    useEffect(() => {
        changeAccountSettingsCam()
    }, [templates])

    const clearForm = () => {
        form.setFieldsValue({
            name: null,
            type: null,
            linkTo: null,
            default: false,
            actionType: null,
        })
    }

    const onFinishSave = () => {
        setActionType(null)
        clearForm()
        closeModal()
    }

    const handleSubmitButton = () => {
        const values = form.getFieldsValue()
        const id = uuidv4()

        const linkTo: any = {
            vtemplate_id: settings.vtemplate_id,
            class_id: settings.class_id,
        }

        const localTemplates = [...templates]
        if (values?.default && values.type == 'obj') {
            localTemplates.forEach((item) => {
                if (
                    item.linkTo?.vtemplate_id == settings.vtemplate_id &&
                    item.linkTo?.classId == settings.class_id &&
                    item.linkTo?.object_id == settings.object_id
                ) {
                    item.default = false
                }
            })
        }

        if (values?.default && values.type == 'class') {
            localTemplates.forEach((item) => {
                if (item.linkTo?.vtemplate_id == settings.vtemplate_id && item.linkTo?.classId == settings.class_id) {
                    item.default = false
                }
            })
        }

        if (values.linkTo == 'obj') {
            linkTo.object_id = settings?.object_id
        }

        if (actionType == 'create') {
            setChosenTemplateId(id)

            const newTemplate = {
                name: values?.name,
                type: values?.type,
                settings: vTemplateSettings,
                default: values?.default,
                linkTo: linkTo,
                id: id,
            }

            localTemplates.push(newTemplate)
        }
        if (actionType == 'update') {
            localTemplates.forEach((item) => {
                if (item.id == chosenTemplateId) {
                    item.name = values?.name
                    item.type = values?.type
                    ;(item.default = values?.default((item.linkTo = linkTo))),
                        (item.settings = vTemplateSettings),
                        { ...item }
                }
            })
        }

        setTemplates(localTemplates)

        onFinishSave()
    }

    const actionTypeOnChangeHandler = (actionType) => {
        if (actionType === 'update' && chosenTemplateId) {
            const chosenTemplate = templates.find((item) => item.id == chosenTemplateId)

            form.setFieldsValue({
                name: chosenTemplate?.name,
                type: chosenTemplate?.type,
                linkTo: 'object_id' in chosenTemplate ? 'obj' : 'class',
                default: chosenTemplate?.default,
            })
        }
        setActionType(actionType)
    }

    const deleteButtonHandler = () => {
        const localTemplates = [...templates].filter((item) => item.id !== chosenTemplateId)
        setTemplates(localTemplates)

        setChosenTemplateId(null)
    }

    const onLoadButtonHandler = ()=>{
        const chosenTemplate = templates.find((item) => item.id == chosenTemplateId)
        onLoad(chosenTemplate?.settings ?? {})
    }

    return (
        <>
            <Row gutter={8} align={'middle'}>
                <Col>
                    {' '}
                    <ButtonSave color={'#007b00'} onClick={() => setIsModalVisible(true)} />
                </Col>
                <Col>
                    {/*!!Поменять на ECButtonPlay после пула Никиты */}

                    <ECTooltip title={'Загрузить'}>
                        <BaseButton
                            size="small"
                            shape="circle"
                            style={{ backgroundColor: chosenTemplateId ? '#188EFC' : 'grey', color: '#ffffff' }}
                            type="primary"
                            icon={<PlayCircleOutlined />}
                            disabled={!chosenTemplateId}
                        />
                    </ECTooltip>
                </Col>
                <Col span={5}>
                    <Select
                        style={{ width: '100%' }}
                        placeholder={'Шаблоны'}
                        value={chosenTemplateId}
                        onChange={(e) => {
                            setChosenTemplateId(e)
                        }}
                        customData={{
                            data: templates,

                            convert: { valueField: 'id', optionLabelProp: 'name' },
                        }}
                    />
                </Col>
                <Col>
                    {' '}
                    <ECTooltip title={'Отменить'}>
                        <BaseButton
                            onClick={getDefaultTemplate}
                            size="small"
                            shape="circle"
                            style={{ backgroundColor: chosenTemplateId ? 'darkorange' : 'grey', color: '#ffffff' }}
                            type="primary"
                            icon={<CloseCircleOutlined />}
                            disabled={!chosenTemplateId}
                        />
                    </ECTooltip>
                </Col>
                <Col>
                    {' '}
                    <ButtonDeleteRow withConfirm disabled={!chosenTemplateId} onClick={deleteButtonHandler} />
                </Col>
            </Row>
            <DefaultModal2
                showFooterButtons={false}
                destroyOnClose
                open={isModalVisible}
                onCancel={closeModal}
                title={'Шаблон'}
                width={'45%'}
            >
                <Form name="form" labelCol={{ span: 8 }} autoComplete="off" form={form}>
                    <Col span={8}>
                        <Form.Item name="actionType">
                            <Select
                                value={actionType}
                                options={ACTION_TYPE_OPTIONS}
                                onChange={(e) => actionTypeOnChangeHandler(e)}
                            />
                        </Form.Item>
                    </Col>
                    <Row>
                        <Col span={8}>
                            <Form.Item name={'name'} label={'Название'}>
                                <Input placeholder={'Название'} disabled={!actionType} />
                            </Form.Item>
                            <Form.Item name="linkTo" label={'Привязать'}>
                                <Select
                                    options={[
                                        { value: 'obj', label: 'Объект' },
                                        { value: 'class', label: 'Класс' },
                                    ]}
                                    disabled={!actionType}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="type" label={'Тип'}>
                                <Select options={TYPE_OPTIONS} disabled={!actionType} />
                            </Form.Item>
                            <Form.Item
                                name="default"
                                label={'По умолчанию'}
                                valuePropName="checked"
                                labelCol={{ span: 12, offset: 3 }}
                            >
                                <CheckBox disabled={!actionType} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Buttons.ButtonAdd
                        onClick={handleSubmitButton}
                        color="rgb(92, 184, 92)"
                        customText="Сохранить"
                        icon={null}
                    />
                </Form>
            </DefaultModal2>
        </>
    )
}

export default VTemplatesManager

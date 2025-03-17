/* eslint-disable max-len */
/* eslint-disable react/jsx-max-depth */
import { ICAMTemplatesToolbarProps } from './types'
import { CloseCircleOutlined, PlayCircleOutlined, SaveOutlined } from '@ant-design/icons'
import { SERVICES_ACCOUNTS } from '@shared/api/Accounts'
import { patchAccountById } from '@shared/api/Accounts/Models/patchAccountById/patchAccountById'
import { useTheme } from '@shared/hooks/useTheme'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { selectClassByIndex, useClassesStore } from '@shared/stores/classes'
import { generalStore } from '@shared/stores/general'
import { BaseButton, ButtonDeleteRow, Buttons } from '@shared/ui/buttons'
import { CheckBox, Select } from '@shared/ui/forms'
import { DefaultModal2 } from '@shared/ui/modals'
import { ECTooltip } from '@shared/ui/tooltips'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import { Col, Form, Input, Row } from 'antd'
import { FC, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

const ACTION_TYPE_OPTIONS = [
    { value: 'create', label: 'Создать' },
    { value: 'update', label: 'Обновить' },
]
const TYPE_OPTIONS = [
    { value: 'rootObjects', label: 'С корневыми объектами' },
    { value: 'nonRootObjects', label: 'Без корневых объектов' },
]

export const CAMTemplatesToolbar: FC<ICAMTemplatesToolbarProps> = (props) => {
    const {
        setTemplatesStatus,
        templatesStatus,
        setTemplateToState,
        currentStateToTemplate,
        vtemplateSettings,
        visualSettings,
    } = props
    const accountData = useAccountStore(selectAccount)
    const accountSettings = accountData?.user?.settings
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [form] = Form.useForm()
    const [chosenTemplateId, setChosenTemplateId] = useState<any>(null)
    const [actionType, setActionType] = useState<'create' | 'update'>(null)
    const [templates, setTemplates] = useState<any[]>([])
    const [templatesOptions, setTemplatesOptions] = useState<any[]>([])
    const getClassByIndex = useClassesStore(selectClassByIndex)
    const templateSettings = useMemo(() => {
        return {
            vtemplate_id: vtemplateSettings?.vtemplateId,
            class_id: vtemplateSettings?.classIds?.[0],
            object_id: vtemplateSettings?.objectId,
        }
    }, [vtemplateSettings])

    const theme = useTheme()
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode

    const interfaceView = generalStore((st) => st.interfaceView)
    const isShowcase = interfaceView === 'showcase'

    const color = isShowcase ? createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode) : '#000000'
    const background = isShowcase ? createColorForTheme(theme?.widget?.background, theme?.colors, themeMode) : '#ffffff'

    const forceUpdate = useAccountStore((st) => st.forceUpdate)
    const changeAccountSettingsCam = async (data) => {
        const newSettings = {
            ...accountData?.user?.settings,
            cam: data,
        }
        // const response = await patchAccountById(`${accountData?.user?.id}`, {
        //     settings: newSettings,
        // })
        const response = await SERVICES_ACCOUNTS.Models.patchAccountMyself({
            settings: newSettings,
        })

        if (response?.success) {
            forceUpdate()
        }
    }

    //*При загрузке узнаем, какой шаблон дефолтный, и отправляем его настройки  "наверх"

    const getDefaultTemplate = (firstLoad?: boolean) => {
        //*При первой загрузке делаем статус "загрузка"
        if (firstLoad) {
            setTemplatesStatus('loading')
        }
        const localTemplates = accountSettings?.cam
        const vTempObjDefault = localTemplates?.find(
            (item) =>
                item?.linkTo?.vtemplate_id == templateSettings?.vtemplate_id &&
                item?.linkTo?.object_id == templateSettings?.object_id &&
                item?.default
        )

        const vTempClassDefault = localTemplates?.find(
            (item) =>
                item?.linkTo?.vtemplate_id == templateSettings?.vtemplate_id &&
                item?.linkTo?.class_id == templateSettings?.class_id &&
                item?.default
        )
        const vTemp = localTemplates?.find(
            (item) => item?.linkTo?.vtemplate_id == templateSettings?.vtemplate_id && item?.default
        )

        const vTempDefault = vTempObjDefault ?? vTempClassDefault ?? vTemp

        if (vTempDefault) {
            setChosenTemplateId(vTempDefault?.id)
        }

        return vTempDefault
    }

    const closeModal = () => {
        setIsModalVisible(false)
        clearForm()
    }

    useLayoutEffect(() => {
        setTemplates(accountSettings?.cam ?? [])
        setTemplateToState(getDefaultTemplate()?.settings ?? currentStateToTemplate)
        setTemplatesStatus('finished')
    }, [])

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
            vtemplate_id: templateSettings.vtemplate_id,
            class_id: templateSettings.class_id,
        }

        let localTemplates = [...templates]

        //*При выборе дефолтного значения у шаблона убираем дефолт у остальных

        if (values.default) {
            let newTemplates = localTemplates
            const updateDefaultValue = (item) => ({
                ...item,
                default: false,
            })

            if (values.linkTo === 'obj') {
                newTemplates = localTemplates.map((item) => {
                    if (
                        item.linkTo?.vtemplate_id === templateSettings.vtemplate_id &&
                        item.linkTo?.class_id === templateSettings.class_id &&
                        item.linkTo?.object_id === templateSettings.object_id
                    ) {
                        return updateDefaultValue(item)
                    } else {
                        return item
                    }
                })
            }

            if (values.linkTo === 'class') {
                newTemplates = localTemplates.map((item) => {
                    if (
                        item.linkTo?.vtemplate_id === templateSettings.vtemplate_id &&
                        item.linkTo?.class_id === templateSettings.class_id
                    ) {
                        return updateDefaultValue(item)
                    } else {
                        return item
                    }
                })
            }
            localTemplates = newTemplates
        }

        if (values.linkTo == 'obj') {
            linkTo.object_id = templateSettings?.object_id
        }

        if (actionType == 'create') {
            setChosenTemplateId(id)

            const newTemplate = {
                name: values?.name,
                type: values?.type,
                settings: currentStateToTemplate,
                default: values?.default,
                linkTo: linkTo,
                id: id,
            }

            localTemplates.push(newTemplate)
            changeAccountSettingsCam(localTemplates)
            setTemplates(localTemplates)
        }

        if (actionType == 'update') {
            const upgradedTemplates = localTemplates.map((item) => {
                if (item.id == chosenTemplateId) {
                    return {
                        ...item,
                        name: values?.name,
                        type: values?.type,
                        default: values?.default,
                        linkTo: linkTo,
                        settings: currentStateToTemplate,
                    }
                } else {
                    return item
                }
            })

            changeAccountSettingsCam(upgradedTemplates)
            setTemplates(upgradedTemplates)
        }
        onFinishSave()
    }

    const actionTypeOnChangeHandler = (actionType) => {
        if (actionType === 'update' && chosenTemplateId) {
            const chosenTemplate = templates.find((item) => item.id == chosenTemplateId)

            form.setFieldsValue({
                name: chosenTemplate?.name,
                type: chosenTemplate?.type,
                linkTo: 'object_id' in chosenTemplate.linkTo ? 'obj' : 'class',
                default: chosenTemplate?.default,
            })
        }
        setActionType(actionType)
    }

    const deleteButtonHandler = () => {
        const localTemplates = [...templates].filter((item) => item.id !== chosenTemplateId)

        changeAccountSettingsCam(localTemplates)
        setTemplates(localTemplates)

        setChosenTemplateId(null)
    }

    const onLoadButtonHandler = () => {
        const chosenTemplate = templates.find((item) => item.id == chosenTemplateId)

        setTemplateToState(chosenTemplate?.settings ?? currentStateToTemplate)
    }

    useEffect(() => {
        const classesIds = templates.map((template) => template?.linkTo?.class_id)
        const uniqueClassesIds = [...new Set(classesIds)]

        const localOptions: any[] = []

        uniqueClassesIds.forEach((classId) => {
            const className = getClassByIndex('id', classId)?.name

            const localItem: any = {}

            localItem.title = className
            localItem.label = className

            const options = []

            templates
                .filter((temp) => temp.linkTo?.class_id == classId)
                .forEach((template) => {
                    options.push({
                        label: template.default ? <b>{template.name}</b> : template.name,
                        value: template.id,
                    })
                })
            localItem.options = options

            localOptions.push(localItem)
        })
        setTemplatesOptions(localOptions)
    }, [templates])

    const generateStyles = () => {
        return `
            .ant-modal-content{
                background-color: ${background ?? '#ffffff'} !important;
                color: ${color ?? '#000000'} !important;
            }
                .ant-modal-header {
                background-color: ${background ?? '#ffffff'} !important;
                color: ${color ?? '#000000'} !important;
                }

                .ant-modal-title {
                color: ${color ?? '#000000'} !important;
                }
                .ant-form-item .ant-form-item-label > label {
                    color: ${color ?? '#000000'} !important;
                }

                .ant-modal-close-x {
                color: ${themeMode == 'dark' && (color ?? '#000000')} !important;}
        `
    }

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'left',
                alignItems: 'center',
                width: '100%',
                height: '52px',
                // height: '6%',
                padding: 10,
                gap: 10,
                border: `${visualSettings?.layout?.borderWidth ?? 0}px solid ${
                    visualSettings?.layout?.borderColor ?? 'rgba(0, 0, 0, 0.1)'
                }`,
                boxShadow: `0 0 ${visualSettings?.layout?.boxShadowWidth ?? 2}px ${
                    visualSettings?.layout?.boxShadowColor ?? 'rgba(0, 0, 0, 0.1)'
                }`,
                background: background ?? 'transparent',
                borderRadius: `${visualSettings?.layout?.borderRadius ?? 8}px`,
            }}
        >
            {/* <ButtonSave color="#007b00" onClick={() => setIsModalVisible(true)} /> */}
            <ECTooltip title="Сохранить">
                <BaseButton
                    size="small"
                    shape="circle"
                    onClick={() => setIsModalVisible(true)}
                    icon={<SaveOutlined />}
                    style={{ color: color ?? '#000000', background: background ?? '#ffffff' }}
                />
            </ECTooltip>

            <ECTooltip title="Загрузить">
                <BaseButton
                    size="small"
                    shape="circle"
                    onClick={() => setIsModalVisible(true)}
                    icon={<PlayCircleOutlined />}
                    disabled={!chosenTemplateId}
                    // style={{ color: color ?? '#000000', background: background ?? '#ffffff' }}
                />
            </ECTooltip>
            {/* <ECButtonRowPlay 
                background={chosenTemplateId ? '#188EFC' : 'grey'}
                tooltipText="Загрузить"
                disabled={!chosenTemplateId}
                onClick={onLoadButtonHandler}
            /> */}
            <Select
                style={{ width: '100%' }}
                placeholder="Шаблоны"
                value={chosenTemplateId}
                onChange={(e) => {
                    setChosenTemplateId(e)
                }}
                // customData={{
                //     data: templates,
                //     convert: { valueField: 'id', optionLabelProp: 'name' },
                // }}
                options={templatesOptions}
            />
            <ECTooltip title="Отменить">
                <BaseButton
                    onClick={() => {
                        getDefaultTemplate()
                    }}
                    size="small"
                    shape="circle"
                    // style={{ backgroundColor: chosenTemplateId ? 'darkorange' : 'grey', color: '#ffffff' }}
                    // type="primary"
                    icon={<CloseCircleOutlined />}
                    disabled={!chosenTemplateId}
                    // style={{ color: color ?? '#000000', background: background ?? '#ffffff' }}
                />
            </ECTooltip>
            <ButtonDeleteRow
                withConfirm
                disabled={!chosenTemplateId}
                type="default"
                onClick={deleteButtonHandler}
                baseSettings
            />
            <div>
                <style>{generateStyles()}</style>
                <DefaultModal2
                    showFooterButtons={false}
                    destroyOnClose
                    open={isModalVisible}
                    onCancel={closeModal}
                    title="Шаблон"
                    width="45%"
                    // style={{ background: background ?? '#ffffff', color: color || '#000000' }}
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
                                <Form.Item name="name" label="Название">
                                    <Input placeholder="Название" disabled={!actionType} />
                                </Form.Item>
                                <Form.Item name="linkTo" label="Привязать">
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
                                <Form.Item name="type" label="Тип">
                                    <Select options={TYPE_OPTIONS} disabled={!actionType} />
                                </Form.Item>
                                <Form.Item
                                    name="default"
                                    label="По умолчанию"
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
            </div>
        </div>
    )
}
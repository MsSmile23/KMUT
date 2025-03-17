
/* eslint-disable max-len */
/* eslint-disable react/jsx-max-depth */
import { SaveOutlined } from '@ant-design/icons'
import { IFilterFormProps } from '@entities/objects/FilterForm/types'
import { defaultFormValues } from '@entities/objects/FilterForm/utils'
import { patchAccountMyself } from '@shared/api/Accounts/Models/patchAccountMyself/patchAccountMyself'
import { SERVICES_CONFIG } from '@shared/api/Config'
import { useTheme } from '@shared/hooks/useTheme'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { useConfigStore } from '@shared/stores/config'
import { generalStore } from '@shared/stores/general'
import { CONFIG_MNEMOS } from '@shared/types/config'
import { BaseButton, ButtonDeleteRow, Buttons } from '@shared/ui/buttons'
import { ECSelect } from '@shared/ui/forms'
import { DefaultModal2 } from '@shared/ui/modals'
import { ECTooltip } from '@shared/ui/tooltips'
import { jsonParseAsObject, responseErrorHandler } from '@shared/utils/common'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import { Col, Flex, Form, Input, Modal, Row } from 'antd'
import { SizeType } from 'antd/es/config-provider/SizeContext'
import { FC, useMemo, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

export type TLoadingStatus = 'idle' | 'loading' | 'finished'

export interface ICustomAccountTemplatesToolbarLayoutSettings {
    withBorder: boolean
    verticalGap: number
    horizontalGap: number
    boxShadowColor: string
    boxShadowWidth: number
    borderColor: string
    borderWidth: number
    borderRadius: number
    buttonSize: SizeType
}
export interface ICustomAccountTemplatesToolbar<T = IFilterFormProps> {
    accountTemplateData: T
    setAccountData: (data: T) => void
    source: 'config' | 'account'
    accountDataTemplateSettings: {
        widgetId: string
    }
    layoutSettings: Partial<ICustomAccountTemplatesToolbarLayoutSettings>
    setLoadingStatus: (status: TLoadingStatus) => void
    loadingStatus: TLoadingStatus
    isAbleToSave: boolean
    onSaveTemplateCallback?: (data: T) => void
}

interface ITemplateItem {
    id: string
    name: string
    settings: IFilterFormProps
}

export const CustomAccountTemplatesToolbar: FC<ICustomAccountTemplatesToolbar> = (props) => {
    const {
        accountTemplateData,
        setAccountData,
        accountDataTemplateSettings,
        layoutSettings,
        isAbleToSave,
        source = 'config',
        onSaveTemplateCallback
    } = props
    
    const interfaceView = generalStore((st) => st.interfaceView)
    // Account
    const { 
        widgetId = 'Без виджета' 
    } = accountDataTemplateSettings ?? {}
    const accountUserData = useAccountStore(selectAccount)
    const accountSettings = accountUserData?.user?.settings
    const accountFrontFilters = accountUserData?.user?.settings?.['front_filters']?.[widgetId]
    const forceUpdateAccount = useAccountStore((st) => st.forceUpdate)

    // Config
    const systemFrontFilters = useConfigStore(st => st.getConfigByMnemo('front_filters'))?.value
    const forceUpdateConfig = useConfigStore((st) => st.forceUpdate)

    // Theme
    const theme = useTheme()
    const themeMode = accountUserData?.user?.settings?.themeMode

    const isShowcase = interfaceView === 'showcase'

    const color = isShowcase 
        ? createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode) 
        : '#000000'
    const background = isShowcase 
        ? createColorForTheme(theme?.widget?.background, theme?.colors, themeMode) 
        : '#ffffff'
    ///////////////////////////////
        
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [chosenTemplateId, setChosenTemplateId] = useState<any>(null)
    
    const [form] = Form.useForm<{
        name: string
    }>()
    
    const currentFrontFilters = useMemo<ITemplateItem[]>(() => {
        let settings: string

        switch (source) {
            case 'config': {
                settings = systemFrontFilters ?? '[]'
                break
            }
            case 'account': {
                settings = accountFrontFilters ?? '[]'
                break
            }
            default: {
                settings = systemFrontFilters ?? '[]'
                break
            }
        }

        return jsonParseAsObject(settings)
    }, [
        source,
        systemFrontFilters,
        accountFrontFilters
    ])

    // console.log('currentFrontFilters', currentFrontFilters)

    

    const handleChangeTemplate = (id: string) => {
        if (id) {
            const currentTemplate = currentFrontFilters.find((item) => item.id === id)

            setChosenTemplateId(id)
            setAccountData(currentTemplate.settings)
        } else {
            setChosenTemplateId('')
            setAccountData(defaultFormValues)
        }
    }
    const deleteCurrentTemplate = () => {
        if (chosenTemplateId) {
            const payload = currentFrontFilters.filter((item) => item.id !== chosenTemplateId)
            
            updateSettings(payload)
            setChosenTemplateId('')
        }
    }
    const saveSettings = async () => {
        const id = uuidv4()
        const newTemplate = {
            id,
            name: form.getFieldValue('name') as string,
            settings: accountTemplateData,
        }

        const configPayload = [...currentFrontFilters, newTemplate]

        setChosenTemplateId(newTemplate.id)
        updateSettings(configPayload)

        if (onSaveTemplateCallback) {
            onSaveTemplateCallback(accountTemplateData)
        }
        closeModal()
    }


    const updateSettings = async (payload: ITemplateItem[]) => {
        const newAccountSettings = {
            ...accountSettings,
            ['front_filters']: {
                ...accountSettings?.['front_filters'], 
                [widgetId]: payload
            },
        }
        
        const response = source === 'account'
            ? await patchAccountMyself(
                {
                    settings: newAccountSettings,
                }
            )
            : currentFrontFilters
                ? await SERVICES_CONFIG.Models.patchConfigByMnemo(
                    CONFIG_MNEMOS.FRONT_FILTERS, {
                        mnemo: CONFIG_MNEMOS.FRONT_FILTERS,
                        value: JSON.stringify(payload),
                    })
                : await SERVICES_CONFIG.Models.postConfig({
                    mnemo: CONFIG_MNEMOS.FRONT_FILTERS,
                    value: JSON.stringify(payload),
                })
        
        if (response.success) {
            source === 'account' && forceUpdateAccount()
            source === 'config' && forceUpdateConfig()

            Modal.success({
                content: 'Настройки сохранены',
            })
        } else {
            responseErrorHandler({
                response,
                modal: Modal,
                errorText: 'Ошибка сохранения настроек',
            })
        }
    }

    const closeModal = () => {
        setIsModalVisible(false)
        form.setFieldValue('name', '')
    }

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

    const borderStyle: React.CSSProperties = layoutSettings?.withBorder 
        ? {
            border: `${layoutSettings?.borderWidth ?? 0}px solid ${
                layoutSettings?.borderColor ?? 'rgba(0, 0, 0, 0.1)'
            }`,
            boxShadow: `0 0 ${layoutSettings?.boxShadowWidth ?? 2}px ${
                layoutSettings?.boxShadowColor ?? 'rgba(0, 0, 0, 0.1)'
            }`,
            padding: 10,
            borderRadius: `${layoutSettings?.borderRadius ?? 8}px`,
        } : {

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
                gap: 10,
                padding: 10,
                background: background ?? 'transparent',
                ...borderStyle,
            }}
        >
            {isAbleToSave && (
                <ECTooltip title="Сохранить">
                    <BaseButton
                        size={layoutSettings?.buttonSize ?? 'small'}
                        shape="circle"
                        onClick={() => setIsModalVisible(true)}
                        icon={<SaveOutlined />}
                        style={{ color: color ?? '#000000', background: background ?? '#ffffff' }}
                    />
                </ECTooltip>
            )}
            <ECSelect
                style={{ width: '100%' }}
                placeholder="Шаблоны"
                value={chosenTemplateId}
                onChange={(e) => handleChangeTemplate(e)}
                options={currentFrontFilters.map((template) => ({
                    label: template.name,
                    value: template.id,
                }))}
            />
            {isAbleToSave && (
                <>
                    <ButtonDeleteRow
                        withConfirm
                        disabled={!chosenTemplateId}
                        type="default"
                        onClick={deleteCurrentTemplate}
                        baseSettings
                        size={layoutSettings?.buttonSize ?? 'small'}
                        style={{

                        }}
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
                        >
                            <Form 
                                name="form" 
                                labelCol={{ span: 8 }} 
                                autoComplete="off" 
                                form={form}
                                layout="vertical"
                            >
                                <Row gutter={10}>
                                    <Col span={12} >
                                        <Form.Item name="name" label="Название">
                                            <Input 
                                                placeholder="Название"
                                                allowClear
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Flex align="center" justify="center">
                                    <Buttons.ButtonAdd
                                        onClick={saveSettings}
                                        color="rgb(92, 184, 92)"
                                        customText="Сохранить"
                                        icon={null}
                                    />
                                </Flex>
                            </Form>
                        </DefaultModal2>
                    </div>
                </>
            )}
        </div>
    )
}
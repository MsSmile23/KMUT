import VtemplateMobileView from '@app/vtemplateMobile/VtemplateMobileView'
import { usePatchConfig } from '@containers/accounts/AccountsTableContainer/hooks'
import { SERVICES_CONFIG } from '@shared/api/Config'
import { getConfigByMnemo } from '@shared/api/Config/Models/getConfigByMnemo/getConfigByMnemo'
import { postConfig } from '@shared/api/Config/Models/postConfig/postConfig'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { useApi2 } from '@shared/hooks/useApi2'
import { usePreviewVtemplate } from '@shared/hooks/usePreviewVtemplate'
import { IApiReturn } from '@shared/lib/ApiSPA'
import { selectVTemplates, useVTemplatesStore } from '@shared/stores/vtemplates'
import { CONFIG_MNEMOS, IConfig } from '@shared/types/config'
import { ButtonLook, Buttons } from '@shared/ui/buttons'
import ECModal from '@shared/ui/ECUIKit/ECModal/ECModal'
import { Select } from '@shared/ui/forms'
import { responseErrorHandler } from '@shared/utils/common'
import { getURL } from '@shared/utils/nav'
import { Form, Input, Row, Switch, message, Modal } from 'antd'
import { FC, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { v4 as uuidv4 } from 'uuid';
interface IFormValues {
    name?: string
    url?: string
    vtemplate_id?: number
    id: number
    fullScreen?: boolean
}

interface IInitialValues {
    name?: string
    url?: string
    vtemplate_id?: string
    id: number
    fullScreen?: boolean
}
const ScreenForm: FC = () => {
    const [form] = Form.useForm()
    const vTemplates = useVTemplatesStore(selectVTemplates)
    const standartUserConfig = useApi2(() => getConfigByMnemo(CONFIG_MNEMOS.FRONT_SCREENS))
    const standartUserConfigCreating = useApi2(postConfig, { onmount: 'item' })
    const standartUserConfigUpdating = usePatchConfig(CONFIG_MNEMOS.FRONT_SCREENS)
    const navigate = useNavigate()
    const location = useLocation()
    const initialValues: IInitialValues = location.state?.initialValues
    const [ vtemplateId, setVtemplateId ] = useState<number>(null)

    const { openModal, vtemplate, handleOpen, closeModal } = usePreviewVtemplate(vTemplates)

    //Получаем список Общих макетов
    const vTemplatesList = useMemo(() => {
        return vTemplates
            .filter((item) => (item?.params.dataToolbar.purpose === 3) || (item?.params.dataToolbar.purpose === 4))
            .map((item) => {
                return {
                    label: `${item.id} ${item.name}`,
                    value: item.id,
                }
            })
    }, [vTemplates, standartUserConfig.data?.value])

    const responseHandler = (resp: IApiReturn<IConfig>, type: 'update' | 'create') => {
        if (resp.success) {
            message.success(`Экран успешно ${type === 'update' ? 'обновлен' : 'создан'}`)
            navigate(getURL(`${ROUTES.NAVIGATION}/${ROUTES.SCREENS}/${ROUTES_COMMON.LIST}`, 'manager'))
        } else {
            responseErrorHandler({
                response: resp,
                modal: Modal,
                errorText: `Ошибка при ${type === 'update' ? 'обновлении' : 'создании'} экрана`,
            })

        }
    }

    //При нажатии Сохранить
    const submitHandler = async (values: IFormValues) => {
        const data = standartUserConfig.data.value ? JSON.parse(standartUserConfig.data?.value) : []

        const isUrlExist = data.some((item) => item.url === values.url && item.url !== initialValues.url)

        if (isUrlExist) {
            return
        }

        const newData = {
            ...values,
            id: uuidv4(),
            isActive: true,
        }

        // Редактируем
        if (initialValues) {
            const index = data.findIndex((item) => item.id === initialValues.id)

            if (index !== -1) {
                data[index] = {
                    ...newData,
                    vtemplate_id: vTemplatesList.find((vTemplate) => vTemplate.value === values.vtemplate_id)?.value,
                }
            }
            //или записываем новое значение
        } else {
            data.push(newData)
        }

        if (standartUserConfig?.data?.value) {
            const resp = await SERVICES_CONFIG.Models.patchConfigByMnemo(CONFIG_MNEMOS.FRONT_SCREENS, {
                mnemo: CONFIG_MNEMOS.FRONT_SCREENS,
                value: JSON.stringify(data),
            })

            responseHandler(resp, 'update')
        } else {
            const resp = await SERVICES_CONFIG.Models.postConfig({
                mnemo: CONFIG_MNEMOS.FRONT_SCREENS,
                value: JSON.stringify(data),
            })

            responseHandler(resp, 'create')
        }
    }

    return (
        <>
            <ECModal
                open={openModal}
                onCancel={closeModal}
                showFooterButtons={false}
                tooltipText="Просмотр экрана"
                height="auto"
                width="auto"
                centered
            >
                <VtemplateMobileView
                    vtemplate={vtemplate}
                    // objectId={vtemplate?.params?.dataToolbar?.objectId}
                />
            </ECModal>
            <Form
                form={form}
                style={{ maxWidth: 600 }}
                onFinish={submitHandler}
                initialValues={initialValues}
                onValuesChange={(value) => {
                    if ('vtemplate_id' in value) {
                        setVtemplateId(value.vtemplate_id)
                    }
                }}
                layout="vertical"
            >
                <Row style={{ marginBottom: 15 }}>
                    <Buttons.ButtonSubmit
                        customText="Сохранить"
                        loading={standartUserConfigCreating.loading || standartUserConfigUpdating.loading}
                    />
                </Row>
                <Form.Item label="Название" name="name" rules={[{ required: true }]}>
                    <Input placeholder="Введите название" />
                </Form.Item>
                <Form.Item
                    label="URL"
                    name="url"
                    rules={[
                        { required: true, message: 'Пожалуйста, введите URL' },
                        {
                            validator: async (_, value) => {
                                const data = standartUserConfig.data.value 
                                    ? JSON.parse(standartUserConfig.data?.value) : []

                                const isUrlExist = data.some(
                                    (item) => item.url === value && item.url !== initialValues?.url
                                )

                                if (!value || !isUrlExist) {
                                    return Promise.resolve()
                                }

                                return Promise.reject('Такой URL уже существует')
                            },
                        },
                    ]}
                >
                    <Input placeholder="Введите URL" />
                </Form.Item>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Form.Item label="Макет" name="vtemplate_id" required style={{ width: '100%' }}>
                        <Select options={vTemplatesList} placeholder="Выберите макет" />
                    </Form.Item>
                    <ButtonLook 
                        disabled={!vtemplateId}
                        type="default"
                        onClick={() => handleOpen(vtemplateId)} 
                    />
                </div>
                <Form.Item label="Иконка" name="icon">
                    <Input placeholder="Иконка" />
                </Form.Item>
                <Form.Item label="Полный экран" name="fullScreen" valuePropName="checked">
                    <Switch />
                </Form.Item>
        
                
            </Form>
        </>
        
    )
}

export default ScreenForm
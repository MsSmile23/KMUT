import { usePatchConfig } from '@containers/accounts/AccountsTableContainer/hooks'
import HelpsForm from '@entities/helps/HelpsForm/HelpsForm'
import { IHelp } from '@entities/helps/types/types'
import { SERVICES_CONFIG } from '@shared/api/Config'
import { getConfigByMnemo } from '@shared/api/Config/Models/getConfigByMnemo/getConfigByMnemo'
import { postConfig } from '@shared/api/Config/Models/postConfig/postConfig'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { useApi2 } from '@shared/hooks/useApi2'
import { IApiReturn } from '@shared/lib/ApiSPA'
import { useConfigStore } from '@shared/stores/config'
import { selectVTemplates, useVTemplatesStore } from '@shared/stores/vtemplates'
import { CONFIG_MNEMOS, IConfig } from '@shared/types/config'
import { ECModal } from '@shared/ui/ECUIKit/ECModal/ECModal'
import { ButtonSettings, Buttons } from '@shared/ui/buttons'
import { Select } from '@shared/ui/forms'
import { jsonParseAsObject, responseErrorHandler } from '@shared/utils/common'
import { getURL } from '@shared/utils/nav'
import { Form, Input, Row, Switch, message, Modal } from 'antd'
import { FC, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { v4 as uuidv4 } from 'uuid';

interface IFormValues {
    name?: string
    url?: string
    vtemplate_id?: number
    id: string
    fullScreen?: boolean
}

interface IInitialValues {
    name?: string
    url?: string
    vtemplate_id?: string
    id: string
    fullScreen?: boolean
}

const PagesManagerForm: FC = () => {
    const [form] = Form.useForm()
    const vTemplates = useVTemplatesStore(selectVTemplates)
    const standartUserConfig = useApi2(() => getConfigByMnemo(CONFIG_MNEMOS.FRONT_PAGES))
    const standartUserConfigCreating = useApi2(postConfig, { onmount: 'item' })
    const standartUserConfigUpdating = usePatchConfig(CONFIG_MNEMOS.FRONT_PAGES)

    const navigate = useNavigate()
    const location = useLocation()
    const initialValues: IInitialValues = location.state?.initialValues

    const findConfig = useConfigStore((state) => state.getConfigByMnemo)
    const configHelps = findConfig(CONFIG_MNEMOS.PAGE_HELP)
    const pageHelps = (configHelps?.value) ? jsonParseAsObject(configHelps?.value) as IHelp[] : []

    const [openModal, setOpenModal] = useState<boolean>(false)

    //Получаем список Общих макетов
    const vTemplatesList = useMemo(() => {
        return  vTemplates
            .filter((item) => item?.params.dataToolbar.purpose === 1 || item?.params.dataToolbar.purpose === 3)
            .map((item) => {
                return {
                    label: `${item.id} ${item.name}`,
                    value: item.id
                }
            })
    }, [vTemplates, standartUserConfig.data?.value])

    // Получаем справку для текущего макета (если привязана)
    const currentPageHelp = pageHelps?.find((help) => help?.pageVtemplateId === initialValues?.id)

    const responseHandler = (resp: IApiReturn<IConfig>, type: 'update' | 'create') => {
        if (resp.success) {
            message.success(`Страница успешно ${type === 'update' ? 'обновлена' : 'создана'}`)
            navigate(getURL(
                `${ROUTES.NAVIGATION}/${ROUTES.PAGES}/${ROUTES_COMMON.LIST}`,
                'manager'
            ))
        } else {
            responseErrorHandler({
                response: resp,
                modal: Modal,
                errorText: `Ошибка при ${type === 'update' ? 'обновлении' : 'создании'} страницы`,
            })

        }
    }

    //При нажатии Сохранить
    const submitHandler = async (values: IFormValues) => {
        const data = standartUserConfig.data.value ? JSON.parse(standartUserConfig.data?.value) : []
    
        const isUrlExist = data.some(item => item.url === values.url && item.url !== initialValues.url)

        if (isUrlExist) {

            return
        }

        const newData = {
            ...values,
            id: uuidv4(),
            isActive: true
        }

        // Редактируем
        if (initialValues) {
            const index = data.findIndex(item => item.id === initialValues.id)

            if (index !== -1) {
                data[index] = {
                    ...newData,
                    vtemplate_id: vTemplatesList.find((vTemplate) => vTemplate.value === values.vtemplate_id)?.value
                }
            }
        //или записываем новое значение
        } else {
            data.push(newData)
        }

        if (standartUserConfig?.data?.value) {
            const resp = await SERVICES_CONFIG.Models.patchConfigByMnemo(CONFIG_MNEMOS.FRONT_PAGES, {
                mnemo: CONFIG_MNEMOS.FRONT_PAGES,
                value: JSON.stringify(data),
            })

            responseHandler(resp, 'update')
        } else {
            const resp = await SERVICES_CONFIG.Models.postConfig({
                mnemo: CONFIG_MNEMOS.FRONT_PAGES,
                value: JSON.stringify(data),
            })

            responseHandler(resp, 'create')
        }    
    }

    return (
        <>
            <Form 
                form={form} 
                style={{ maxWidth: 600 }} 
                onFinish={submitHandler} 
                initialValues={initialValues} 
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
                                    ? JSON.parse(standartUserConfig.data?.value) 
                                    : []

                                const isUrlExist = data
                                    .some(item => item.url === value && item.url !== initialValues?.url)

                                if (!value || !isUrlExist) {
                                    return Promise.resolve()
                                }

                                return Promise.reject('Такой URL уже существует')
                            }
                        }
                    ]}
                >
                    <Input placeholder="Введите URL" />
                </Form.Item>
                <Form.Item label="Макет" name="vtemplate_id" required>
                    <Select 
                        options={vTemplatesList} 
                        placeholder="Выберите макет"
                    />
                </Form.Item>
                <div style={{ display: 'flex', gap: 20 }} >
                    <Form.Item label="Полный экран" name="fullScreen" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                    <ButtonSettings
                        icon={false}
                        style={{ marginTop: 30 }}
                        type="primary"
                        onClick={() => setOpenModal(true)}
                    >
                        Справка
                    </ButtonSettings>
                </div>
            </Form>

            <ECModal
                open={openModal}
                onCancel={() => setOpenModal(false)}
                showFooterButtons={false}
                tooltipText="Справка"
                height="60vh"
                width="70vw"
                centered
            >
                <HelpsForm 
                    id={currentPageHelp?.id} 
                    closeModal={() => setOpenModal(false)} 
                    pageVtemplateId={initialValues?.id}
                />
            </ECModal>
        </>
    )
}

export default PagesManagerForm
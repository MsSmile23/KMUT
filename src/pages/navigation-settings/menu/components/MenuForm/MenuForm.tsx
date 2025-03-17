import { Forms } from '@shared/ui/forms'
import { Col, Form, Modal, Row } from 'antd'
import { FC, useEffect, useState } from 'react'
import MenuConstructor from '../MenuConstructor/MenuConstructor'
import { SaveOutlined } from '@ant-design/icons'
import { SERVICES_CONFIG } from '@shared/api/Config'
import { IApiReturn } from '@shared/lib/ApiSPA'
import { CONFIG_MNEMOS, IConfig } from '@shared/types/config'
import { MNEMO } from '../utils'
import CustomPreloader from '@shared/ui/preloader/CustomPreloader'
import { useNavigate } from 'react-router-dom'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { getURL } from '@shared/utils/nav'
import { Buttons } from '@shared/ui/buttons'
import { responseErrorHandler } from '@shared/utils/common'
// import { FloatButton } from '@shared/ui/buttons/FloatButton/FloatButton'

interface IMenuForm {
    id?: number
}

// const options = [
//     { value: 'main', label: 'Основное меню' },
//     { value: 'additional', label: 'Дополнительное меню' },
// ]

const options = [
    { value: 'main', label: 'Основное меню' },
    { value: 'additional', label: 'Дополнительное меню' },
    {
        label: <span>Мобильное</span>,
        title: 'mobile',
        options: [
            { value: 'mobile_bottom', label: 'Нижнее для МП' },
            { value: 'mobile_full', label: 'Полное для МП' },
        ],
    },
]


const MenuForm: FC<IMenuForm> = ({ id }) => {
    const [form] = Form.useForm()
    const [frontMenuConfig, setFrontMenuConfig] = useState<any[] | null>(null)
    const [isLoadingForm, setIsLoadingForm] = useState<boolean>(id ? true : false)
    const [menuTypeOptions, setMenuTypeOptions] = useState<{ value: string; label: string; disabled?: boolean }[]>([])
    const navigate = useNavigate()


    useEffect(() => {
        const localOptions: any[] = []

        options.forEach((opt) => {
            const option: any = { ...opt }

            option.disabled = frontMenuConfig?.find((item) => item.type == opt.value) ? true : false
            localOptions.push(option)
        })
        setMenuTypeOptions(localOptions)
    }, [frontMenuConfig])

    //*Функция обработки ответа при сохранении/обновлении формы

    const responseHandler = (resp: IApiReturn<IConfig>, type: 'update' | 'create') => {
        if (resp.success) {
            Modal.success({
                content: `Меню успешно ${type == 'create' ? 'создано' : 'обновлено'}`,
            })
            navigate(getURL(`${ROUTES.NAVIGATION}/${ROUTES.MENU}/${ROUTES_COMMON.LIST}`, 'manager'))
            // navigate(
            //     `/${ROUTES.MENU_CONSTRUCTOR}/${ROUTES_COMMON.LIST}`
            // )
        } else {
            responseErrorHandler({
                response: resp,
                modal: Modal,
                errorText: `Ошибка в ${type == 'create' ? 'создании' : 'обновлении'} меню`,
            })
        }
    }

    const submitButtonHandler = async () => {
        const values = form.getFieldsValue()

        const payloadId = id ? id : frontMenuConfig ? frontMenuConfig.length + 1 : 1

        const payload = {
            id: payloadId ?? 1,
            ...values,
        }

        //*В случае, если в конфиге нет менюшек, добавляем

        if (!frontMenuConfig) {
            const resp = await SERVICES_CONFIG.Models.postConfig({
                mnemo: CONFIG_MNEMOS.FRONT_MENU,
                value: JSON.stringify([payload]),
            })

            responseHandler(resp, 'create')
        }

        //*В случае, если есть конфиг с меню, обновляем или добавляем в уже существующий
        else {
            let localFrontMenuConfig = [...frontMenuConfig]

            if (id) {
                const filteredArray = localFrontMenuConfig.filter((item) => item.id !== id)

                if (filteredArray.length == 0) {
                    payload.id = 1
                }

                filteredArray.push(payload)
                localFrontMenuConfig = filteredArray
            } else {
                localFrontMenuConfig.push(payload)
            }

            const resp = await SERVICES_CONFIG.Models.patchConfigByMnemo(MNEMO, {
                mnemo: CONFIG_MNEMOS.FRONT_MENU,
                value: JSON.stringify(localFrontMenuConfig),
            })

            responseHandler(resp, id ? 'update' : 'create')
        }
    }

    useEffect(() => {
        SERVICES_CONFIG.Models.getConfigByMnemo(CONFIG_MNEMOS.FRONT_MENU).then((resp) => {
            if (resp?.data?.value !== undefined) {
                setFrontMenuConfig(JSON?.parse(resp?.data?.value))
            }
        })
    }, [])

    useEffect(() => {
        if (id) {
            const localMenuConstructor = frontMenuConfig?.find((item) => item.id == id)

            if (localMenuConstructor) {
                form.setFieldsValue({
                    name: localMenuConstructor.name,
                    mnemo: localMenuConstructor.mnemo,
                    type: localMenuConstructor.type,
                    active: localMenuConstructor.active,
                    menu: localMenuConstructor.menu,
                })
                setIsLoadingForm(false)
            }
        }
    }, [frontMenuConfig])

    return (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>
            {isLoadingForm ? (
                <CustomPreloader style={{ textAlign: 'center', width: '100%' }} size="large" />
            ) : (
                <Form name="form" labelCol={{ span: 8 }} autoComplete="off" form={form}>
                    <Row>
                        <Col span={10}>
                            <Form.Item
                                label="Название"
                                name="name"
                                rules={[{ required: true, message: 'Обязательное поле' }]}
                            >
                                <Forms.Input placeholder="Название" />
                            </Form.Item>

                            <Form.Item
                                label="Мнемоника"
                                name="mnemo"
                                rules={[{ required: true, message: 'Обязательное поле' }]}
                            >
                                <Forms.Input placeholder="Мнемоника" />
                            </Form.Item>
                        </Col>
                        <Col span={10}>
                            <Form.Item
                                label="Стереотип"
                                name="type"
                                // rules={[{ required: true, message: 'Обязательное поле' }]}
                            >
                                <Forms.Select placeholder="Тип" options={menuTypeOptions} />
                            </Form.Item>

                            <Form.Item label="Активность" name="active" valuePropName="checked">
                                <Forms.CheckBox />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="menu">
                        <MenuConstructor form={form} />
                    </Form.Item>
                    <Buttons.FloatButton
                        type="primary"
                        icon={<SaveOutlined />}
                        tooltip="Сохранить меню"
                        onClick={submitButtonHandler}
                    /> 
                </Form>
            )}
        </>
    )
}

export default MenuForm
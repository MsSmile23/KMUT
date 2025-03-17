/* eslint-disable react/jsx-max-depth */
import { SERVICES_ACCOUNTS } from '@shared/api/Accounts'
import { getAccounts } from '@shared/api/Accounts/Models/getAccounts/getAccounts'
import { getRoles } from '@shared/api/Roles/Models/getRoles/getRoles'
import { useApi } from '@shared/hooks/useApi'
import { IRole } from '@shared/types/roles'
import { Buttons } from '@shared/ui/buttons'
import { Input, Select } from '@shared/ui/forms'
import WrapperCard from '@shared/ui/wrappers/WrapperCard/WrapperCard'
import { Col, Form, Row, Input as AntdInput, message, Modal, Button, Switch } from 'antd'
import { Rule } from 'antd/es/form'
import { FC, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { checkPasswordValidation } from './utils'
import { useApi2 } from '@shared/hooks/useApi2'
import { getConfigByMnemo } from '@shared/api/Config/Models/getConfigByMnemo/getConfigByMnemo'
import { mnemo } from '../AccountsTableContainer/accountsTableData'
import { showAccountFormModalError } from './showAccountFormModalError'
import { selectVTemplates, useVTemplatesStore } from '@shared/stores/vtemplates'
import vtemplates from '@containers/vtemplates'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { getURL } from '@shared/utils/nav'
import { IInterfaceView, generalStore } from '@shared/stores/general'
import { responseErrorHandler } from '@shared/utils/common'
import { IGroupPolicy } from '@shared/types/group-policies'
import { getGroupPolicies } from '@shared/api/GroupPolicies/Models/getGroupPolicies/getGroupPolicies'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { getRoleById } from '@shared/api/Roles/Models/getRoleById/getRoleById'
import { DEFAULT_PASSWORD_REQUIREMENTS } from '@shared/config/const'
import { getAccountMyself } from '@shared/api/Accounts/Models/getAccountMyself/getAccountMyself'
import { selectRole, selectRoles, useRolesStore } from '@shared/stores/roles/useRolesStore'
import { ECTooltip } from '@shared/ui/tooltips'

interface IAccountFormContainer {
    id?: number
}

const basicFormItemRule: Rule = { required: true, message: 'Обязательное поле' }

const AccountFormContainer: FC<IAccountFormContainer> = ({ id }) => {
    const [form] = Form.useForm<any>()
    const roles = useRolesStore(selectRoles)
    const groupPolicies = useApi<IGroupPolicy[]>([], getGroupPolicies, { all: true })

    const accounts = useApi2(() => getAccounts({ all: true }))
    const interfaceView = generalStore(st => st.interfaceView)
    const [selectedAccount, setSelectedAccount] = useState<number>()
    const vTemplates = useVTemplatesStore(selectVTemplates)
    const standartUser = useApi2(() => getConfigByMnemo(mnemo))

    const [loading, setLoading] = useState(false)
    const [chosenVTemplates, setChosenVTemplates] = useState<number[]>([])
    const [password, setPassword] = useState<string | undefined>()
    const [passwordConfirm, setPasswordConfirm] = useState<string | undefined>()
    const getRoleById = useRolesStore(selectRole)
    const accountData = useAccountStore(selectAccount)

    const navigate = useNavigate()
    const submitHandler = async (values?: any) => {
        const payload: any = {
            login: values?.login,
            email: values?.email,
            role_id: values?.role,
            settings: {
                ...(accounts.data?.find((account) => account.id === selectedAccount)?.settings || {}),
                enabled: values?.settings?.enabled,
                maketsAllowed: values?.settings?.maketsAllowed?.length > 0
                    ? values?.settings?.maketsAllowed
                    : [],
                maketsOnlyAllowed: values?.settings?.maketsOnlyAllowed ?? false,
                maketsDefault: values?.settings?.maketsDefault ?? null

            },
            full_name: values.full_name,
            company_name: values.company_name,
            position: values.position,
            phone_number: values?.phone_number,
            groupPolicies: values?.groupPolicies
        }

        if (id) {
            if (values.password !== '') {
                payload.password = values?.password
            }
        } else {
            payload.password = values?.password
        }

        try {
            setLoading(true)

            const response = id
                ? id == accountData?.user?.id
                    ? await SERVICES_ACCOUNTS.Models.patchAccountMyself(payload)
                    : await SERVICES_ACCOUNTS.Models.patchAccountById(String(id), payload)
                : await SERVICES_ACCOUNTS.Models.postAccounts(payload)

            if (response.success) {
                message.success(`Аккаунт успешно ${id ? 'Редактирован' : 'Создан'}`)
                form.resetFields()
                navigate(getURL(
                    `${ROUTES.ACCOUNTS}/${ROUTES_COMMON.LIST}`,
                    interfaceView as Exclude<IInterfaceView, ''>
                    /* interfaceView !== ''
                        ? interfaceView
                        : 'showcase' */
                ))
                // useAccountStore.getState().forceUpdate()
                // navigate('/accounts/list')
            } else {
                // showAccountFormModalError((response?.error?.response?.data as any)?.errors)

                responseErrorHandler({
                    response: response,
                    modal: Modal,
                    errorText: `Ошибка при ${id ? 'редактировании' : 'создании'} аккаунта`,
                })
            }
        } catch {
            Modal.error({ title: 'Ошибка в сохранении аккаунта', centered: true })
        } finally {
            setLoading(false)
        }
    }
    const selectStandartUser = () => {
        const id = Number(standartUser.data?.value)

        if (id) {
            setSelectedAccount(id)
        }
    }


    useEffect(() => {
        if (id !== undefined) {
            SERVICES_ACCOUNTS.Models.getAccountById(String(id)).then((resp) => {
                if (resp.success) {
                    if (resp?.data !== undefined) {
                        setChosenVTemplates(resp.data.settings.maketsAllowed ?? [])
                        form.setFieldsValue({
                            login: resp.data.login,
                            email: resp.data.email,
                            role: resp.data.role_id,
                            settings: resp.data?.settings,
                            full_name: resp.data?.full_name,
                            company_name: resp.data?.company_name || '',
                            position: resp.data?.position || '',
                            phone_number: resp.data?.phone_number || '',
                            groupPolicies: resp.data?.groupPolicies?.map(gp => gp.id) ?? []
                        })
                    }
                }
            })
        }
    }, [id])

    useEffect(() => {
        if (!id && standartUser.data?.value !== undefined && selectedAccount == undefined) {
            selectStandartUser()
        }
    }, [standartUser])

    const [minLen, setMinLen] = useState(DEFAULT_PASSWORD_REQUIREMENTS.password_min_length)
    const selectedRoles = Form.useWatch('role', form)

    const { status: passwordStatus, message: passwordMessage } = useMemo(() => {
        return checkPasswordValidation(password, minLen)
    }, [password])



    useEffect(() => {
        const role = getRoleById(selectedRoles)

        if (role) {
            setMinLen(role?.password_min_length)
        }
    }, [selectedRoles])

    return (
        <Row justify="center">
            <Col span={24}>
                <Form
                    // style={{ padding: '10px' }}
                    name="accountForm"
                    autoComplete="off"
                    onFinish={submitHandler}
                    form={form}
                    layout="vertical"
                    initialValues={{
                        company_name: '',
                        position: '',
                        phone_number: '',
                    }}
                >
                    <WrapperCard
                        title="Обязательные поля"
                        styleMode="replace"
                        style={{ padding: '10px', marginBottom: '10px' }}
                    >
                        <Row gutter={[16, 16]}>
                            <Col span={8}>
                                <Form.Item
                                    label="Логин"
                                    name="login"
                                    rules={[
                                        {
                                            required: true,
                                            validator(_rule, value) {
                                                if (value.length < 6) {
                                                    return Promise.reject('Логин должен быть не менее 6 символов')
                                                }

                                                return Promise.resolve('')
                                            },
                                        },
                                    ]}
                                >
                                    <Input placeholder="Логин" />
                                </Form.Item>
                                <Form.Item label="ФИО" name="full_name" rules={[basicFormItemRule]}>
                                    <Input placeholder="ФИО" />
                                </Form.Item>

                                {chosenVTemplates?.length > 0 && (
                                    <Form.Item
                                        label="Разрешить только выбранные инфопанели"
                                        name={['settings', 'maketsOnlyAllowed']}
                                        valuePropName="checked"
                                    >
                                        <Switch />
                                    </Form.Item>
                                )}
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Роль" rules={[basicFormItemRule]} name="role">
                                    <Select
                                        className="list-input"
                                        placeholder="Выберите роль"
                                        customData={{
                                            data: roles,
                                            convert: { valueField: 'id', optionLabelProp: 'name' },
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item label="Почта" name="email" rules={[{ ...basicFormItemRule, type: 'email' }]}>
                                    <Input placeholder="Почта" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item required label="Групповые политики" name="groupPolicies">
                                    <Select
                                        mode="multiple"
                                        // className="list-input"
                                        placeholder="Групповые политики"
                                        customData={{
                                            data: groupPolicies?.data ?? [],
                                            convert: { valueField: 'id', optionLabelProp: 'name' },
                                        }}
                                    />
                                </Form.Item>
                                {!id && (
                                    <>
                                        <ECTooltip
                                            title={
                                                !selectedRoles ?
                                                    'Внимание! Для введения пароля необходимо выбрать роль'
                                                    : 'Введите пароль'
                                            }
                                        >
                                            <Form.Item
                                                label="Пароль"
                                                name="password"
                                                rules={[{ required: !id }]} //TODO минималка
                                                help={passwordMessage}
                                                validateStatus={passwordStatus}
                                            >
                                                <AntdInput.Password
                                                    disabled={!selectedRoles}
                                                    placeholder="Пароль"
                                                    value={password}
                                                    onChange={(ev) => setPassword(ev.target.value)}
                                                />
                                            </Form.Item>
                                        </ECTooltip>
                                        <ECTooltip
                                            title={
                                                !selectedRoles ?
                                                    'Внимание! Для введения пароля необходимо выбрать роль'
                                                    : 'Введите пароль'
                                            }
                                        >
                                            <Form.Item
                                                label="Подтверждение пароля"
                                                name="confirm"
                                                rules={[{ required: !id }]}
                                                help={password !== passwordConfirm ? 'Пароли не совпадают' : ''}
                                                validateStatus={password !== passwordConfirm ? 'error' : ''}
                                            >
                                                <AntdInput.Password
                                                    disabled={!selectedRoles}
                                                    placeholder="Пароль"
                                                    value={passwordConfirm}
                                                    onChange={(ev) => setPasswordConfirm(ev.target.value)}
                                                />
                                            </Form.Item>
                                        </ECTooltip>
                                    </>
                                )}
                            </Col>
                        </Row>
                    </WrapperCard>

                    <WrapperCard
                        title="Дополнительные поля"
                        styleMode="replace"
                        style={{ padding: '10px', marginBottom: '10px' }}
                    >
                        <Row gutter={[16, 16]}>
                            <Col span={8}>
                                <Form.Item label="Организация" name="company_name">
                                    <Input placeholder="Организация" />
                                </Form.Item>
                                <Form.Item label="Должность" name="position">
                                    <Input placeholder="Должность" />
                                </Form.Item>
                                <Form.Item label="Телефон" name="phone_number">
                                    <Input placeholder="Телефон" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                {id && (
                                    <>
                                        <ECTooltip
                                            title={
                                                !selectedRoles ?
                                                    'Внимание! Для введения пароля необходимо выбрать роль'
                                                    : 'Введите пароль'
                                            }
                                        >
                                            <Form.Item
                                                label="Пароль" //TODO минималка
                                                name="password"
                                                rules={[{ required: !id }]}
                                                help={passwordMessage}
                                                validateStatus={passwordStatus}
                                            >
                                                <AntdInput.Password
                                                    disabled={!selectedRoles}
                                                    placeholder="Пароль"
                                                    value={password}
                                                    onChange={(ev) => setPassword(ev.target.value)}
                                                />
                                            </Form.Item>
                                        </ECTooltip>
                                        <ECTooltip
                                            title={
                                                !selectedRoles ?
                                                    'Внимание! Для введения пароля необходимо выбрать роль'
                                                    : 'Введите пароль'
                                            }
                                        >
                                            <Form.Item
                                                label="Подтверждение пароля"
                                                name="confirm"
                                                rules={[{ required: !id }]}
                                                help={password !== passwordConfirm ? 'Пароли не совпадают' : ''}
                                                validateStatus={password !== passwordConfirm ? 'error' : ''}
                                            >
                                                <AntdInput.Password
                                                    disabled={!selectedRoles}
                                                    placeholder="Пароль"
                                                    value={passwordConfirm}
                                                    onChange={(ev) => setPasswordConfirm(ev.target.value)}
                                                />
                                            </Form.Item>
                                        </ECTooltip>
                                    </>
                                )}

                                <Form.Item label="Активность" name={['settings', 'enabled']} valuePropName="checked">
                                    <Switch />
                                </Form.Item>

                                {chosenVTemplates?.length > 0 && (
                                    <Form.Item
                                        label="Разрешить только выбранные инфопанели"
                                        name={['settings', 'maketsOnlyAllowed']}
                                        valuePropName="checked"
                                    >
                                        <Switch />
                                    </Form.Item>
                                )}
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Скопировать настройки пользователя">
                                    <Select
                                        options={accounts.data.map((acc) => ({ value: acc.id, label: acc.login }))}
                                        value={selectedAccount}
                                        onChange={setSelectedAccount}
                                    />
                                </Form.Item>
                                <Form.Item label=" ">
                                    <Button style={{ width: '100%' }} onClick={selectStandartUser}>
                                        По умолчанию
                                    </Button>
                                </Form.Item>

                                <Form.Item name={['settings', 'maketsAllowed']} label="Выбрать доступные инфопанели">
                                    <Select
                                        placeholder="Выберите инфопанели"
                                        mode="multiple"
                                        options={vTemplates.map((vt) => ({ value: vt.id, label: vt.name }))}
                                        value={chosenVTemplates}
                                        onChange={(e) => {
                                            setChosenVTemplates(e)
                                        }}
                                    />
                                </Form.Item>

                                {chosenVTemplates?.length > 0 && (
                                    <Form.Item name={['settings', 'maketsDefault']} label="Макет по умолчанию">
                                        <Select
                                            placeholder="Выберите макет"
                                            options={vTemplates
                                                .filter((vt) => chosenVTemplates.includes(vt.id))
                                                .map((vt) => ({ value: vt.id, label: vt.name }))}
                                        />
                                    </Form.Item>
                                )}
                            </Col>
                        </Row>
                    </WrapperCard>
                    <Col>
                        <Buttons.ButtonSubmit customText="Сохранить" color="green" disabled={loading} />
                    </Col>
                </Form>
            </Col>
        </Row>
    )
}

export default AccountFormContainer
/* eslint-disable react/jsx-max-depth */

import { Buttons } from '@shared/ui/buttons'
import { CheckBox, Forms, Label } from '@shared/ui/forms'
import WrapperCard from '@shared/ui/wrappers/WrapperCard/WrapperCard'
import { Col, Form, Row, Tooltip } from 'antd'
import { FC, useEffect, useMemo, useState } from 'react'
import { getPermissions } from '@shared/api/Permissions/Models/getPermissions/getPermissions'
import { useApi2 } from '@shared/hooks/useApi2'
import { useNavigate } from 'react-router-dom'
import { CRUD, CRUD_SECTION, INTERFACES_SECTION, INTERFACE_ELEMENTS, allowAllCheckboxOnclickHandler, prepareData, required_perms_mnemo, saveRoleButtonHandler, showModal } from '../utils'
import PermissionsTableFormContainer from './PermissionsTableFormContainer'
// import { ECTabs } from '@shared/ui/tabs'
import { dataVtemplateProps, paramsVtemplate } from '@shared/types/vtemplates'
import { SERVICES_VTEMPLATES } from '@shared/api/vtemplates'
import { ECLoader } from '@shared/ui/loadings'
import VtemplatesTableFormContainer from './VtemplatesTableFormContainer'
import MenuTableFormContainer from './MenuTableFormContainer'
import PagesTableFormContainer from './PagesTableFormContainer'
import { SaveOutlined } from '@ant-design/icons'
import ECTabs from '@shared/ui/ECUIKit/tabs/ECTabs'
import { Input } from 'antd/lib'
import { ECTooltip } from '@shared/ui/tooltips'

interface IRoleFormContainer {
    id?: number
}

const cantEditText = 'Чтобы редактировать ячейку снимите галочку с "Разрешить всё"'

const RoleFormContainer: FC<IRoleFormContainer> = ({ id }) => {
    const [form] = Form.useForm()
    const permissions = useApi2(getPermissions, { onmount: false })
    const [dataVtemplate, setDataVtemplate] = useState<dataVtemplateProps<paramsVtemplate>[]>(
        [] as dataVtemplateProps<paramsVtemplate>[]
    )
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('main')
    const [loading, setLoading] = useState(true)

    const globalAll = useMemo(() => (permissions?.data?.find(section => section.mnemo === 'global-all')
        ?.children[0]?.permissions?.find(el => el.name === 'do all')?.id
    ), [permissions.data])


    const [MOBILE_AND_WEB_PERMISSIONS, setMobileAndWebPermissions] = useState({
        web: {
            title: 'Доступ к WEB',
            name: 'web_login',
            id: null,
        },
        mobile: {
            title: 'Доступ к Mobile',
            name: 'mobile_login',
            id: null,
        },
    })

    const [GLOBAL_PERMISSIONS, setGlobalPermissions] = useState({
        all: {
            title: 'Разрешено всё',
            name: 'do_all',
            id: null,
        },
        get: {
            title: 'Получение',
            name: 'get_all',
            id: null,
        },
        create: {
            title: 'Создание',
            name: 'create_all',
            id: null,
        },
        update: {
            title: 'Обновление',
            name: 'update_all',
            id: null,
        },
        delete: {
            title: 'Удаление',
            name: 'delete_all',
            id: null,
        },
    })

    useEffect(() => {
        SERVICES_VTEMPLATES.Models.getVtemplates({ all: true })
            .then((res) => {
                setDataVtemplate(res.data)
            })
    }, [])

    useEffect(() => {
        setLoading(true)
        permissions.request()
            .then((response) => {
                const editResponse = []

                response?.data.forEach(group => {
                    group.children.forEach(el => editResponse.push(el))
                })
                const account = editResponse.find(permission => permission.mnemo === 'account')
                const webId = account.permissions.find(permission => permission.name === 'login web').id
                const mobileId = account.permissions.find(permission => permission.name === 'login mobile').id

                const global = editResponse.find(permission => permission.mnemo === 'all')
                const globalAll = global.permissions.find(permission => permission.name === 'do all').id
                const getAll = global.permissions.find(permission => permission.name === 'get all').id
                const createAll = global.permissions.find(permission => permission.name === 'create all').id
                const updateAll = global.permissions.find(permission => permission.name === 'update all').id
                const deleteAll = global.permissions.find(permission => permission.name === 'delete all').id

                setMobileAndWebPermissions(prevState => ({
                    web: {
                        ...prevState.web,
                        id: webId
                    },
                    mobile: {
                        ...prevState.mobile,
                        id: mobileId
                    }
                }))
                setGlobalPermissions(prevState => ({
                    all: {
                        ...prevState.all,
                        id: globalAll
                    },
                    get: {
                        ...prevState.get,
                        id: getAll
                    },
                    create: {
                        ...prevState.create,
                        id: createAll
                    },
                    update: {
                        ...prevState.update,
                        id: updateAll
                    },
                    delete: {
                        ...prevState.delete,
                        id: deleteAll
                    },
                }))
            })
            .then(() => setLoading(false))
    }, [id])

    const sortedData = useMemo(() => {
        const sortedData = []

        permissions?.data.forEach(group => {
            group.children.forEach(el => sortedData.push(el))
        })

        const accountPermId = sortedData.findIndex(perm => perm.mnemo == 'account')

        sortedData[accountPermId] = {
            ...sortedData[accountPermId],
            permissions: sortedData[accountPermId]?.permissions
                ?.filter(perm => perm.id !== MOBILE_AND_WEB_PERMISSIONS.web?.id
                    && perm.id !== MOBILE_AND_WEB_PERMISSIONS.mobile?.id)
        }

        return sortedData.filter(section => section.mnemo !== 'all')
    }, [permissions.data])

    useEffect(() => {
        prepareData(id, permissions.data, sortedData, form.getFieldsValue(),
            MOBILE_AND_WEB_PERMISSIONS, GLOBAL_PERMISSIONS)
            .then(response => {
                form.setFieldsValue(response)
            })

        form.getFieldsValue()
    }, [sortedData])

    // const initialValues = sortedData.reduce((acc, curr) => {
    //     if (required_perms_mnemo.includes(curr.mnemo)) {
    //         const permId = curr.permissions.find(el => el.name.includes('get')).id

    //         acc[`${curr.mnemo}_get&${permId}`] = true
    //     }

    //     return acc
    // }, {})


    const saveRole = () => {
        saveRoleButtonHandler(form.getFieldsValue(), id, navigate, permissions.data)
    }


    return (
        loading
            ? <ECLoader />
            :
            <Form
                name="form"
                autoComplete="off"
                form={form}
            >
                <Row gutter={8}>
                    <Col span={8}>
                        <Form.Item
                            label="Название" name="name"
                            rules={[{ required: true, message: 'Обязательное поле' }]}
                        >
                            <Forms.Input placeholder="Название" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    {' '}
                    <Col span={5}>
                        <WrapperCard
                            styleMode="extend"
                            bodyStyle={{ padding: '5px', height: '170px' }}
                            headStyle={{ margin: 0, backgroundColor: 'rgb(225, 225, 225)', fontSize: '14px' }}
                            title="Доступ"
                            size="small"
                        >
                            {/* <div style={{ background: 'grey' }}>
                            {' '}

                            <Text strong>Доступность</Text>
                        </div>
                        <Divider style={{ margin: 0 }} /> */}
                            {Object.keys(MOBILE_AND_WEB_PERMISSIONS).map((key) => {
                                const permissionName = MOBILE_AND_WEB_PERMISSIONS[key].name
                                const permissionId = MOBILE_AND_WEB_PERMISSIONS[key].id


                                return (
                                    <div
                                        key={permissionName}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        {MOBILE_AND_WEB_PERMISSIONS[key].title}
                                        <Form.Item
                                            style={{ margin: 0 }}
                                            key={`${permissionName}&${permissionId}`}
                                            name={`${permissionName}&${permissionId}`}
                                            valuePropName="checked"
                                        >
                                            {/*Временно, пока не введут доступ к веб */}

                                            <CheckBox
                                                onChange={(e) => {
                                                    const fieldValues = form.getFieldsValue();
                                                    const isChecked = e.target.checked;

                                                    fieldValues[`${permissionName}&${permissionId}`] = !isChecked

                                                    if (fieldValues[`global_do_all&${globalAll}`]) {
                                                        showModal(cantEditText);
                                                    } else {
                                                        fieldValues[`${permissionName}&${permissionId}`] = isChecked;
                                                    }

                                                    form.setFieldsValue(fieldValues);
                                                }}

                                            />
                                        </Form.Item>
                                    </div>
                                )
                            })}
                        </WrapperCard>
                    </Col>
                    <Col span={5}>
                        <WrapperCard
                            styleMode="extend"
                            bodyStyle={{ padding: '5px', height: '170px' }}
                            headStyle={{ margin: 0, backgroundColor: 'rgb(225, 225, 225)', fontSize: '14px' }}
                            title="Интерфейсы"
                            size="small"
                        >
                            {INTERFACES_SECTION.map((item) => {
                                return (
                                    <div
                                        key={`${item.name}_interfaces`}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        {item.title}
                                        <Form.Item
                                            style={{ margin: 0 }}
                                            key={`${item.name}_interfaces`}
                                            name={`${item.name}_interfaces`}
                                            valuePropName="checked"
                                        >
                                            <CheckBox
                                                onChange={(e) => {
                                                    const fieldValues = form.getFieldsValue();
                                                    const isChecked = e.target.checked

                                                    fieldValues[`${item.name}_interfaces`] = !isChecked

                                                    if (fieldValues[`global_do_all&${globalAll}`]) {
                                                        showModal(cantEditText);
                                                    } else {
                                                        fieldValues[`${item.name}_interfaces`] = isChecked
                                                    }

                                                    form.setFieldsValue(fieldValues);
                                                }}
                                                defaultChecked={false}
                                            />
                                        </Form.Item>
                                    </div>
                                )
                            })}
                        </WrapperCard>
                    </Col>
                    <Col span={5}>
                        <WrapperCard
                            styleMode="extend"
                            bodyStyle={{ padding: '5px', height: 'max-content', display: 'flex', flexWrap: 'wrap' }}
                            headStyle={{ margin: 0, backgroundColor: 'rgb(225, 225, 225)', fontSize: '14px' }}
                            title="Глобальные разрешения"
                            size="small"
                        >
                            <div style={{ width: 130, marginRight: 10 }}>
                                {Object.keys(GLOBAL_PERMISSIONS).map((key) => {
                                    const permissionName = GLOBAL_PERMISSIONS[key].name.split(' ').join('_')
                                    const permissionId = GLOBAL_PERMISSIONS[key].id

                                    return (
                                        <div
                                            key={permissionName}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                            }}
                                        >
                                            {GLOBAL_PERMISSIONS[key].title}
                                            <Form.Item
                                                style={{ margin: 0 }}
                                                key={`global_${permissionName}&${permissionId}`}
                                                name={`global_${permissionName}&${permissionId}`}
                                                valuePropName="checked"
                                            >
                                                <CheckBox
                                                    onChange={(e) => {
                                                        const formValues = form.getFieldsValue()
                                                        const isChecked = e.target.checked;

                                                        if (GLOBAL_PERMISSIONS[key].name == 'do_all') {

                                                            Object.keys(INTERFACE_ELEMENTS).forEach(key => {
                                                                formValues[
                                                                    `global_${INTERFACE_ELEMENTS[key].name}`
                                                                ] = isChecked
                                                            })

                                                            INTERFACES_SECTION.forEach(item => {
                                                                formValues[`${item.name}_interfaces`] = isChecked
                                                            })

                                                            CRUD_SECTION.forEach(item => {
                                                                formValues[`${item.name}`] = isChecked
                                                            })

                                                            for (const key of Object.keys(formValues)) {
                                                                const name = key?.split('_')[0]
                                                                const method = key?.split('_')[1]?.split('&')[0]

                                                                if ((key.includes('&') || key.includes('switch'))
                                                                    &&
                                                                    !(required_perms_mnemo.includes(name)
                                                                        && method == 'get')
                                                                ) {
                                                                    formValues[key] = isChecked
                                                                }
                                                            }
                                                            form.setFieldsValue(formValues)

                                                            return
                                                        }

                                                        if (formValues[`global_do_all&${globalAll}`]) {

                                                            showModal(cantEditText);
                                                            formValues[
                                                                `global_${permissionName}&${permissionId}`
                                                            ] = !isChecked
                                                            form.setFieldsValue(formValues)

                                                            return
                                                        }
                                                        console.log(`global_${permissionName}&${permissionId}`)

                                                        form.setFieldsValue(allowAllCheckboxOnclickHandler(
                                                            GLOBAL_PERMISSIONS[key].name.split('_')[0],
                                                            isChecked,
                                                            form.getFieldsValue())
                                                        )

                                                    }}
                                                />
                                            </Form.Item>
                                        </div>
                                    )
                                })}
                            </div>
                            <div style={{ width: 130 }}>
                                {Object.keys(INTERFACE_ELEMENTS).map((key) => {
                                    const permissionName = INTERFACE_ELEMENTS[key].name

                                    return (
                                        <div
                                            key={permissionName}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                            }}
                                        >
                                            {INTERFACE_ELEMENTS[key].title}
                                            <Form.Item
                                                style={{ margin: 0 }}
                                                key={`global_${permissionName}`}
                                                name={`global_${permissionName}`}
                                                valuePropName="checked"
                                            >
                                                <CheckBox
                                                    onChange={(e) => {
                                                        const formValues = form.getFieldsValue()
                                                        const globalPermission = formValues[
                                                            `global_do_all&${globalAll}`
                                                        ]

                                                        formValues[`global_${permissionName}`] = !e.target.checked

                                                        if (globalPermission) {
                                                            showModal(cantEditText)
                                                        } else {
                                                            formValues[`global_${permissionName}`] = e.target.checked

                                                            for (const key of Object.keys(formValues)) {
                                                                if (key.includes('switch') && !globalPermission) {
                                                                    formValues[key] = e.target.checked
                                                                }
                                                            }
                                                        }
                                                        form.setFieldsValue(formValues)
                                                    }}
                                                />
                                            </Form.Item>
                                        </div>
                                    )
                                })}
                            </div>
                        </WrapperCard>
                    </Col>
                    <Col span={5}>
                        <WrapperCard
                            styleMode="extend"
                            bodyStyle={{
                                padding: '5px',
                                display: 'flex',
                                height: '170px',
                                flexDirection: 'column'
                            }}
                            headStyle={{ margin: 0, backgroundColor: 'rgb(225, 225, 225)', fontSize: '14px' }}
                            title="Требования к паролю"
                            size="small"
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Label>Минимальная длина</Label>
                                <Form.Item
                                    style={{ margin: 0, width: 80, padding: 2 }}
                                    key="password_min_length"
                                    name="password_min_length"
                                    initialValue={12}
                                >
                                    <Input
                                        onKeyPress={(event) => {
                                            if (event.key === '-' || event.key === 'e') {
                                                event.preventDefault();
                                            }
                                        }}
                                        type="number"
                                        min={2}
                                        onPaste={(event) => {
                                            const clipboardData = event.clipboardData || window.clipboardData;
                                            const pastedData = clipboardData.getData('Text');

                                            if (pastedData.includes('-') || pastedData.includes('e')) {
                                                event.preventDefault();
                                            }
                                        }}
                                    />
                                </Form.Item>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <ECTooltip title="Менять пароль не чаще чем через указанное количество дней" >
                                    <span>Частота обновления</span>
                                </ECTooltip>
                                <Form.Item
                                    style={{ margin: 0, width: 80, padding: 2 }}
                                    tooltip="Менять пароль не чаще чем через указанное количество дней"
                                    key="password_change_freq_max_days"
                                    name="password_change_freq_max_days"
                                    initialValue={2}
                                >
                                    <Input
                                        onKeyPress={(event) => {
                                            if (event.key === '-' || event.key === 'e') {
                                                event.preventDefault();
                                            }
                                        }}
                                        type="number"
                                        min={0}
                                        onPaste={(event) => {
                                            const clipboardData = event.clipboardData || window.clipboardData;
                                            const pastedData = clipboardData.getData('Text');

                                            if (pastedData.includes('-') || pastedData.includes('e')) {
                                                event.preventDefault();
                                            }
                                        }}
                                    />
                                </Form.Item>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <ECTooltip title="Пароль действителен указанное количество дней" >
                                    <span>Действителен (дней)</span>
                                </ECTooltip>
                                <Form.Item
                                    style={{ margin: 0, width: 80, padding: 2 }}
                                    tooltip="Пароль действителен указанное количество дней"
                                    key="password_expiration_days"
                                    name="password_expiration_days"
                                    initialValue={90}
                                >
                                    <Input
                                        onKeyPress={(event) => {
                                            if (event.key === '-' || event.key === 'e') {
                                                event.preventDefault();
                                            }
                                        }}
                                        onPaste={(event) => {
                                            const clipboardData = event.clipboardData || window.clipboardData;
                                            const pastedData = clipboardData.getData('Text');

                                            if (pastedData.includes('-') || pastedData.includes('e')) {
                                                event.preventDefault();
                                            }
                                        }}
                                        type="number"
                                        min={0}
                                    />
                                </Form.Item>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <ECTooltip title="Пароль не должен совпадать с указанным количеством последних паролей">
                                    <span>Уникальность</span>
                                </ECTooltip>
                                <Form.Item
                                    style={{ margin: 0, width: 80, padding: 2 }}
                                    key="password_last_unique_count_min"
                                    name="password_last_unique_count_min"
                                    initialValue={2}
                                >
                                    <Input
                                        onKeyPress={(event) => {
                                            if (event.key === '-' || event.key === 'e') {
                                                event.preventDefault();
                                            }
                                        }}
                                        onPaste={(event) => {
                                            const clipboardData = event.clipboardData || window.clipboardData;
                                            const pastedData = clipboardData.getData('Text');

                                            if (pastedData.includes('-') || pastedData.includes('e')) {
                                                event.preventDefault();
                                            }
                                        }}
                                        type="number"
                                        min={0}
                                    />
                                </Form.Item>
                            </div>
                        </WrapperCard>
                    </Col>
                </Row>

                <ECTabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    renderTabsOnLoad={true}
                    items={[
                        {
                            key: 'main',
                            label: 'Основные',
                            children: (
                                <PermissionsTableFormContainer
                                    permissions={sortedData}
                                    form={form}
                                    permissionsGroup={permissions?.data}
                                />
                            )
                        },
                        {
                            key: 'templates',
                            label: 'Макеты и страницы',
                            children: (
                                <div style={{ width: '100%', display: 'flex', flexWrap: 'nowrap', gap: 20 }}>
                                    <VtemplatesTableFormContainer
                                        vtemplates={dataVtemplate}
                                        form={form}
                                    />
                                    <PagesTableFormContainer
                                        form={form}
                                    />
                                    <MenuTableFormContainer
                                        form={form}
                                    />
                                </div>
                            )
                        },
                    ]}
                />

                <Buttons.FloatButton
                    type="primary"
                    icon={<SaveOutlined />}
                    tooltip="Сохранить роль"
                    onClick={saveRole}
                />
            </Form>
    )
}

export default RoleFormContainer
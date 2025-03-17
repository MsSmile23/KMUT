import { getAccounts } from '@shared/api/Accounts/Models/getAccounts/getAccounts'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { ButtonAdd, ButtonDeleteRow, ButtonEditRow, ButtonCreatable } from '@shared/ui/buttons'
import { Form, Select, Space } from 'antd'
import { FC, ReactNode, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EditOutlined } from '@ant-design/icons'
import { useApi2 } from '@shared/hooks/useApi2'
import { IAccount } from '@shared/types/accounts';
import { columns, mnemo } from './accountsTableData';
import { deleteAccountById } from '@shared/api/Accounts/Models/deleteAccountById/deleteAccountById'
import { EditTable } from '@shared/ui/tables/ECTable2/EditTable/EditTable'
import { useAccountStore } from '@shared/stores/accounts'
import { postConfig } from '@shared/api/Config/Models/postConfig/postConfig'
import { getConfigByMnemo } from '@shared/api/Config/Models/getConfigByMnemo/getConfigByMnemo'
import { usePatchConfig } from './hooks'
import { ECTooltip } from '@shared/ui/tooltips/ECTooltip'
import { getURL } from '@shared/utils/nav'
import { IInterfaceView, generalStore } from '@shared/stores/general'

interface IAccountTableRow {
    key: any,
    login: IAccount['login'],
    id: IAccount['id'],
    email: IAccount['email'],
    role: IAccount['role']['name'],
    actions?: ReactNode
}

const AccountsTableContainer: FC = () => {
    const navigate = useNavigate()
    const interfaceView = generalStore(st => st.interfaceView)
    const currentAccountId = useAccountStore((st) => st.store.data?.user?.id)
    const { 
        data: accounts, 
        loading: accountsLoading,
        request: loadAccounts 
    } = useApi2(() => getAccounts({ all: true }), { autoUpdate: 60_000 })
    const deletedAccount = useApi2(deleteAccountById, { onmount: false })
    const standartUserConfigCreating = useApi2(postConfig, { onmount: 'item' })
    const standartUserConfigUpdating = usePatchConfig(mnemo)
    const standartUserConfig = useApi2(() => getConfigByMnemo(mnemo))

    const [ standartUserId, setStandartUserId ] = useState<number | undefined>()

    const changeStandartUser = async (value: number) => {
        standartUserConfig?.data?.value
            ? await standartUserConfigUpdating.request({ value: `${value}` })
            : await standartUserConfigCreating.request({ mnemo, value: `${value}` })

        setStandartUserId(value)
    }

    const value = standartUserConfig.data?.value
    
    useEffect(() => {
        if (value) {
            setStandartUserId(Number(value))
        }
    }, [value])

    const rows = useMemo(() => accounts?.map(acc => ({
        key: acc?.id,
        id: acc?.id,
        login: acc?.login,
        email: acc?.email,
        role: acc?.role?.name,
        actions:
            <Space>
                <ECTooltip title="Редактирование">
                    <ButtonEditRow
                        onClick={() => {
                            navigate(getURL(
                                `${ROUTES.ACCOUNTS}/${ROUTES_COMMON.UPDATE}/${acc?.id}`, 
                                interfaceView as Exclude<IInterfaceView, ''>
                            ))
                            // navigate(
                            //     `/${ROUTES.ACCOUNTS}/${ROUTES_COMMON.UPDATE}/${acc?.id}`
                            // )
                        }} type="link" icon={<EditOutlined />}
                    />
                </ECTooltip>

                {acc?.id !== currentAccountId && (
                    <ButtonDeleteRow 
                        withConfirm 
                        onClick={async () => {
                            if (acc?.id) {
                                await deletedAccount.request(`${acc.id}`)

                                loadAccounts()
                            }
                        }}
                        loading={deletedAccount.loading}
                    />
                )}
            </Space>
    } as IAccountTableRow)), [accounts, currentAccountId, deletedAccount.loading])
    
    return (
        <EditTable
            tableId="accounts-table"
            columns={columns.map((col) => ({ ...col, key: col?.dataIndex }))}
            rows={rows}
            loading={accountsLoading || deletedAccount.loading}
            buttons={{
                left: [
                    <>
                        {/* <ButtonAdd
                            key="button-add-class"
                            shape="circle"
                            text={false}
                            onClick={() => {
                                navigate(getURL(
                                    `${ROUTES.ACCOUNTS}/${ROUTES_COMMON.CREATE}`, 
                                interfaceView as Exclude<IInterfaceView, ''>
                                ))
                            // navigate(`/${ROUTES.ACCOUNTS}/${ROUTES_COMMON.CREATE}`)
                            }}
                        />      */}
                        <ButtonCreatable
                            key="button-add-class"
                            shape="circle"
                            entity="users"
                            buttonAdd={true}
                            text={false}
                            onClick={() => {
                                navigate(getURL(
                                    `${ROUTES.ACCOUNTS}/${ROUTES_COMMON.CREATE}`, 
                                interfaceView as Exclude<IInterfaceView, ''>
                                ))
                                // navigate(`/${ROUTES.ACCOUNTS}/${ROUTES_COMMON.CREATE}`)
                            }}
                        />
                    </>
                ],
                right: [
                    <Form key="standart-user" layout="inline">
                        <Form.Item label="Настройки по умолчанию от">
                            <Select
                                placeholder="Выбрать аккаунт"
                                loading={standartUserConfig.loading || standartUserConfigUpdating.loading}
                                options={accounts.map((a) => ({ value: a.id, label: a.login }))}
                                value={accounts.find(({ id }) => id === standartUserId)?.id}
                                onChange={changeStandartUser}
                                allowClear
                                style={{ minWidth: 200 }}
                            />
                        </Form.Item>
                        
                    </Form>
                ]
            }}
        />
    )
}

export default AccountsTableContainer
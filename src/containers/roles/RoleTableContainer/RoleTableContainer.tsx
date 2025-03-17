import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { ButtonAdd, ButtonDeleteRow, ButtonEditRow } from '@shared/ui/buttons'
import { Space } from 'antd'
import { FC, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { EditOutlined } from '@ant-design/icons'
import { useApi2 } from '@shared/hooks/useApi2'
import { EditTable } from '@shared/ui/tables/ECTable2/EditTable/EditTable'
import { ECTooltip } from '@shared/ui/tooltips/ECTooltip'
import { getURL } from '@shared/utils/nav'
import { getRoles } from '@shared/api/Roles/Models/getRoles/getRoles'
import { deleteRoleById } from '@shared/api/Roles/Models/deleteRoleById/deleteRoleById'
import { ROLES_TABLE_COLUMN } from '../utils'
import { selectCheckPermission, useAccountStore } from '@shared/stores/accounts'

const RoleTableContainer: FC = () => {
    const navigate = useNavigate()
    const checkPermissions = useAccountStore(selectCheckPermission)
    // const roles = useApi2(getRoles)

    const {
        data: roles,
        request: loadRoles,
        loading
    } = useApi2(() => getRoles({ all: true }), { autoUpdate: 60_000 })


    const rows = useMemo(
        () =>
            roles?.map((role) => ({
                key: String(role?.id),
                id: role?.id,
                name: role?.name,
                actions: (
                    <Space>
                        {
                            checkPermissions(['update roles']) &&
                            <ECTooltip title="Редактирование">
                                <ButtonEditRow
                                    onClick={() => {
                                        navigate(
                                            getURL(`${ROUTES.ROLES}/${ROUTES_COMMON.UPDATE}/${role?.id}`, 'manager')
                                        )
                                    }}
                                    type="link"
                                    icon={<EditOutlined />}
                                />
                            </ECTooltip>
                        }
                        {
                            checkPermissions(['delete roles']) &&
                            <ButtonDeleteRow
                                withConfirm
                                onClick={async () => {
                                    if (role?.id) {
                                        const response = await deleteRoleById(role.id)

                                        loadRoles()

                                        return response
                                    }
                                }}
                            />
                        }
                    </Space>
                ),
            })),
        [roles]
    )

    return (
        <EditTable
            tableId="roles-table"
            columns={ROLES_TABLE_COLUMN.map((col) => ({ ...col, key: col?.dataIndex }))}
            rows={rows}
            loading={loading}
            buttons={checkPermissions(['create roles']) && {
                left: [
                    <ButtonAdd
                        key="button-add-class"
                        shape="circle"
                        text={false}
                        onClick={() => {
                            navigate(getURL(`${ROUTES.ROLES}/${ROUTES_COMMON.CREATE}`, 'manager'))
                            // navigate(`/${ROUTES.ACCOUNTS}/${ROUTES_COMMON.CREATE}`)
                        }}
                    />,
                ],
            }}
        />
    )
}

export default RoleTableContainer
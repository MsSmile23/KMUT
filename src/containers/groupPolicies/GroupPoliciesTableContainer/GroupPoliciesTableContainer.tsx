import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { IGroupPolicy } from '@shared/types/group-policies'
import { ButtonAdd, ButtonDeleteRow, ButtonEditRow } from '@shared/ui/buttons'
import { EditTable } from '@shared/ui/tables/ECTable2/EditTable/EditTable'
import { getURL } from '@shared/utils/nav'
import { Col, message, Row } from 'antd'
import { FC, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { selectGroupPolicies, useGroupPoliciesStore } from '@shared/stores/groupPolicies/useGroupPoliciesStore'
import { StoreStates } from '@shared/types/storeStates'

const columns = [
    {
        key: 'id',
        dataIndex: 'id',
        title: 'ID',
        width: 100,
    },
    {
        key: 'name',
        dataIndex: 'name',
        title: 'Название',
        width: 450,
    },
    {
        key: 'actions',
        dataIndex: 'actions',
        title: 'Действия',
        width: 150,
    },
]

const GroupPoliciesTableContainer: FC = () => {
    const navigate = useNavigate()
    const groupPoliciesStore = useGroupPoliciesStore()
    const groupPolicies = useGroupPoliciesStore(selectGroupPolicies)

    const modalMessage = (type: 'error' | 'success', text: string, error?: any) => {
        message[type](`${error ? error : text}`)
    }

    const rows = useMemo(() => groupPolicies.map((item, i) => ({
        key: `${i}`,
        id: item.id,
        name: item.name,
        actions: (
            <div style={{ display: 'flex', gap: 15 }}>
                <ButtonEditRow
                    type="primary"
                    onClick={() => {
                        navigate(getURL(
                            `${ROUTES.GROUP_POLICIES}/${ROUTES_COMMON.UPDATE}/${item.id}`,
                            'manager'
                        ))
                    }}
                />
                <ButtonDeleteRow
                    withConfirm
                    type="primary"
                    onClick={() => handleDelete(item)}
                />
            </div>
        )
    })), [groupPolicies])

    const handleDelete = async (item: IGroupPolicy) => {
        const res = await groupPoliciesStore.deleteGroupPolicyById(item.id)

        if (!res?.success) {
            modalMessage('error', 'Произошла ошибка при удалении', res?.error)
        } 
    }

    return (
        <Row gutter={[12, 12]}>
            <Col span={24}>
                <EditTable
                    loading={groupPoliciesStore.store.state === StoreStates.LOADING}
                    pagination={{ pageSize: 10 }}
                    virtual={false}
                    bordered={true}
                    tableId="group_policies-table"
                    key="group_policies-table"
                    columns={columns}
                    rows={rows}
                    buttons={{
                        left: [
                            <ButtonAdd
                                key="button-add-class"
                                shape="circle"
                                text={false}
                                onClick={() => {
                                    navigate(getURL(
                                        `${ROUTES.GROUP_POLICIES}/${ROUTES_COMMON.CREATE}`,
                                        'manager'
                                    ))
                                }}
                            />
                        ]
                    }}
                />
            </Col>
        </Row>
    )
}

export default GroupPoliciesTableContainer
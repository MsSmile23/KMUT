import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { Space, message } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { ButtonAdd, ButtonDeleteRow, ButtonEditRow } from '@shared/ui/buttons'
import { SERVICES_STATE_MACHINES } from '@shared/api/State-machines'
import { EditTable } from '@shared/ui/tables/ECTable2/EditTable/EditTable'
import { IEditTableFilterSettings } from '@shared/ui/tables/ECTable2/EditTable/types'
import { ECTooltip } from '@shared/ui/tooltips'
import { getURL } from '@shared/utils/nav'

const columns: IEditTableFilterSettings[] = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id' 
    },
    {
        title: 'Название',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Аттрибуты',
        dataIndex: 'attributes',
        key: 'attributes',
    },
    {
        title: 'Классы',
        dataIndex: 'classes',
        key: 'classes',
    },
    {
        title: 'Действия',
        dataIndex: 'actions',
        key: 'actions',
        width: '20%', 
    },
]
const StateMachineAdminTable: FC = () => {
    const [rows, setRows] = useState<any[]>([])
    const navigate = useNavigate()
    const [ loading, setLoading ] = useState(false)

    useEffect(() => {
        setLoading(true)

        SERVICES_STATE_MACHINES.Models.getStateMachines({ all: true }).then((resp) => {
            if (resp?.success) {
                if (resp?.data !== undefined) {

                    const localRows = resp.data.map(machine => {
                        let attributes = ''
                        let classes = ''

                        if (machine.attributes.length > 0) {
                            machine.attributes.forEach((attr, index) => {
                                attributes += `${attr.name} ${index == machine.attributes.length - 1 ? '' : ', '}`
                            })
                        }

                        if (machine.classes.length > 0) {
                            machine.classes.forEach((cl, index) => {
                                classes += `${cl.name}${index == machine.classes.length - 1 ? '' : ', '}`
                            })
                        }

                        return ({
                            id: machine.id,
                            name: machine.name,
                            attributes: attributes,
                            classes: classes
                        })

                    })

                    setRows(localRows)
                    setLoading(false)
                }
            }
        })
    }, [])

    const deleteHandler = async (id: number) => {
        setLoading(true)

        try {
            const response = await SERVICES_STATE_MACHINES.Models.deleteStateMachineById(id)

            if (response.success && response.data.statusText === 'Deleted') {
                setRows((rows) => rows.filter((row) => row.id !== id))
            } else {
                throw Error
            }
        } catch {
            message.error('Не удалось удалить обработчик состояний')
        } finally {
            // setTableLoading(false)
            setLoading(false)
        }
    }

    return (

        <EditTable
            tableId="stateMachineTable"
            rows={rows.map(({ id, name, attributes, classes }) => ({
                id,
                name,
                attributes, 
                classes,
                key: 1000 + id,
                actions: (
                    <Space>
                        <ECTooltip title="Редактирование">
                            <ButtonEditRow
                                onClick={() => {
                                    navigate(getURL(
                                        `${ROUTES.STATE_MACHINES}/${ROUTES_COMMON.UPDATE}/${id}`, 
                                        'constructor'
                                    ))
                                    // navigate(`/${ROUTES.STATE_MACHINES}/${ROUTES_COMMON.UPDATE}/${id}`)
                                }}
                                type="link"
                                icon={<EditOutlined />}
                            />
                        </ECTooltip>

                        <ButtonDeleteRow
                            withConfirm
                            type="link"
                            icon={<DeleteOutlined />}
                            onClick={() => {
                                deleteHandler(id)
                            }}
                        />
                    </Space>
                ),
            }))}
            columns={columns}
            // pagination={
            //     localStorage.getItem('currentPage')
            //         ? { position: ['bottomRight'], defaultCurrent: Number(localStorage.getItem('currentPage')) }
            //         : { position: ['bottomRight'] }
            // }
            loading={loading}
            buttons={{ 
                left: [
                    <ButtonAdd
                        key="button-add-class"
                        shape="circle" 
                        text={false}
                        onClick={() => {
                            navigate(getURL(
                                `${ROUTES.STATE_MACHINES}/${ROUTES_COMMON.CREATE}`, 
                                'constructor'
                            ))
                            // navigate(`/${ROUTES.STATE_MACHINES}/${ROUTES_COMMON.CREATE}`)
                        }}
                    />
                ]
            }}
        />
        
    )
}

export default StateMachineAdminTable
import { CheckBox, Input } from '@shared/ui/forms'
import { Form } from 'antd'
import { Table } from 'antd/lib'
import { useMemo } from 'react'
import { EditTable } from '../ECTable2/EditTable/EditTable'

const columnsEditor = [
    {
        title: 'Название столбца',
        dataIndex: 'name',
        key: 'name',
        visible: true
    },
    {
        title: 'Доступно',
        dataIndex: 'available',
        key: 'available',
        align: 'center',
        width: 150,
        disableFilter: true,
        disableSort: true,
        visible: true
    },
    {
        title: 'По умолчанию',
        dataIndex: 'default',
        key: 'default',
        align: 'center',
        width: 150,
        disableFilter: true,
        disableSort: true,
        visible: true
    }
]

export const TableViewForm = ({ columns }) => {

    const rows = useMemo(() => {
        return columns
            ?.filter(column => column.dataIndex !== 'virtualColumn')
            ?.map(column => {
                return ({
                    key: column.key,
                    name: column.title,
                    available: (
                        <Form.Item
                            name={['editColumns', `${column.dataIndex}_available`]}
                            valuePropName="checked"
                            initialValue={true}
                        >
                            <CheckBox />
                        </Form.Item>
                    ),
                    default: (
                        <Form.Item
                            name={['editColumns', `${column.dataIndex}_default`]}
                            valuePropName="checked"
                            initialValue={true}
                        >
                            <CheckBox />
                        </Form.Item>
                    ),
                })
            })
    }, [columns])

    return (
        <>
            <div style={{ display: 'flex', alignItems: 'center', width: 500, justifyContent: 'space-between' }}>
                <p>Количество строк по умолчанию:</p>
                <Form.Item
                    labelAlign="left"
                    name="tableRowCount"
                    style={{ marginBottom: 0 }}
                >
                    <Input type="number" min={1} />
                </Form.Item>
            </div>
            <div>
                <h4>Кастомная настройка столбцов</h4>
                <EditTable
                    style={{ width: 500 }}
                    columns={columnsEditor}
                    dataSource={rows}
                    showHeader={false}
                    rowSelection={undefined}
                />
            </div>
        </>
    )
}
import { useGetObjects } from '@shared/hooks/useGetObjects'
import { selectObjects, useObjectsStore } from '@shared/stores/objects'
import { EditTable } from '@shared/ui/tables/ECTable2/EditTable/EditTable'
import { IEditTableFilterSettings } from '@shared/ui/tables/ECTable2/EditTable/types'
import { Col } from 'antd'
import { FC, useEffect, useState } from 'react'


const columns: IEditTableFilterSettings[] = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    {
        title: 'Название',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Имя класса',
        dataIndex: 'className',
        key: 'className',
    },
]

interface IObjectsTable {
    classesIds: number[]
    onChange?: any
    tableHeight?: number,
    objectIds?: React.Key[]
    
}
const ObjectsTable: FC<IObjectsTable> = ({ classesIds, onChange, tableHeight, objectIds  }) => {
    // const objects = useObjectsStore(selectObjects)
    const objects = useGetObjects()
    const [rows, setRows] = useState<any[]>([])
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys)

        if (onChange !== undefined) {
            onChange(newSelectedRowKeys)
        }
    }

    useEffect(() => {
        setSelectedRowKeys(objectIds)
    }, [objectIds])
    const [rowSelection, setRowSelection] = useState({
        selectedRowKeys,
        onChange: onSelectChange,
        preserveSelectedRowKeys: false,
    })

    useEffect(() => {
        setRowSelection({
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
            preserveSelectedRowKeys: false,
        })
    }, [selectedRowKeys])
    useEffect(() => {
        const classesObjects = objects.filter((obj) => classesIds.includes(obj.class_id))
        const localRows = classesObjects.map((obj) => {
            return { name: obj.name, key: obj.id, id: obj.id, className: obj?.class?.name }
        })

        setRows(localRows)
    }, [classesIds])

    return (
        <Col span={24}>
            <EditTable
                customHeight={tableHeight ? tableHeight : 800}
                rows={rows}
                columns={columns} 
                rowSelection={rowSelection}
            />
        </Col>
    )
}

export default ObjectsTable
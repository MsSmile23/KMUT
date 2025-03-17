import { Row, Col, Card } from 'antd'
import { FC, useEffect, useState } from 'react'
import ObjectsTable from '../ObjectsTable/ObjectsTable'
import { IAttribute } from '@shared/types/attributes'
import { IEditTableFilterSettings } from '@shared/ui/tables/ECTable2/EditTable/types'
import { EditTable } from '@shared/ui/tables/ECTable2/EditTable/EditTable'
import { selectObjects, useObjectsStore } from '@shared/stores/objects'
import { IObject } from '@shared/types/objects'
import { selectAttributes, useAttributesStore } from '@shared/stores/attributes'
import { useGetObjects } from '@shared/hooks/useGetObjects'

const columns: IEditTableFilterSettings[] = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    {
        title: 'Название',
        dataIndex: 'name',
        key: 'name',
    },
]

interface IObjectAttributes {
    classesIds: number[]
    stateAttributes: IAttribute[]
    onChange?: (value: number[]) => void
    value?: number[]
    ruleTemplatesObjectAttrs?: any[]
}
const ObjectAttributesTable: FC<IObjectAttributes> = ({ 
    classesIds,
    stateAttributes,
    onChange,
    value, 
    ruleTemplatesObjectAttrs }) => {
    const [chosenObjectsIds, setChosenObjectsIds] = useState<number[]>([])
    const [rows, setRows] = useState<any[]>([])
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
    // const objects = useObjectsStore(selectObjects)
    const objects = useGetObjects()
    const attributes = useAttributesStore(selectAttributes)
    const [objectIds, setObjectIds] = useState<React.Key[]>([])
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys)
    }
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
        const localRows = stateAttributes.map((attr) => {
            return { name: attr.name, key: attr.id, id: attr.id }
        })

        setRows(localRows)
    }, [stateAttributes])

    useEffect(() => {


        if (ruleTemplatesObjectAttrs !== undefined && ruleTemplatesObjectAttrs.length > 0) {

            const localKeys: React.Key[] = []
            const objectsIds: React.Key[] = []

            ruleTemplatesObjectAttrs.forEach(rl => {
                const attributeId = attributes.find(attr => attr.id == rl.attribute_id)?.id
                
                localKeys.push(attributeId)
                objectsIds.push(rl.object_id)
            })
            const set = new Set(localKeys)
            const finalKeys = Array.from(set)

            setObjectIds(objectsIds)
            setSelectedRowKeys(finalKeys)
            setChosenObjectsIds(objectsIds as number[])
        }

    }, [ruleTemplatesObjectAttrs])

    useEffect(() => {
        const chosenObjectAttributesIds: number[] = []

        const chosenObjects: IObject[] = objects.filter(obj => chosenObjectsIds.includes(obj.id))

        chosenObjects.forEach(obj => {
            obj.object_attributes.forEach(attr => {
                if (selectedRowKeys.includes(attr.attribute?.id)) {
                    chosenObjectAttributesIds.push(attr.id)
                }
            })
        })

        onChange(chosenObjectAttributesIds)

        

    }, [chosenObjectsIds, selectedRowKeys])

    return (
        <Row gutter={8}>
            <Col span={12}>
                <Card title="Объекты выбранных классов" style={{ height: '600px' }}>
                    <ObjectsTable 
                        objectIds={objectIds}
                        onChange={setChosenObjectsIds} 
                        classesIds={classesIds}
                    />
                </Card>
            </Col>
        
            <Col span={12}>
                <Card title="Атрибуты классов" style={{ height: '600px' }}>
                    <Col span={24}>
                        <EditTable customHeight={400} rows={rows} columns={columns} rowSelection={rowSelection} />
                    </Col>
                </Card>
            </Col>
        </Row>
    )
}

export default ObjectAttributesTable
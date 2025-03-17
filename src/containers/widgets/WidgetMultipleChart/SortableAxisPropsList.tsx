import { CloseOutlined } from '@ant-design/icons'
import { SortableList } from '@shared/ui/SortableList'
import { Select } from '@shared/ui/forms'
import { ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
import { InputNumber, Button, FormListFieldData, FormListOperation, Form, Input } from 'antd'
import { FC, useState, useEffect } from 'react'

interface ISortableItemProps {
    id: number
    formRow: FormListFieldData
}
export const SortableAxisPropsList: FC<{
    subFields: FormListFieldData[],
    subOpt: FormListOperation
}> = ({
    subFields, subOpt
}) => {
    const [items, setItems] = useState<{
        id: number
        formRow: FormListFieldData
    }[]>([])

    useEffect(() => {
        setItems(subFields.map((item, indx) => {
            return {
                id: indx, 
                formRow: item
            }
        }))
    }, [subFields])

    // console.log('subFields', subFields)
    // console.log('subOpt', subOpt)
    // console.log('items', items)

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
            }}
        >
            <SortableList<ISortableItemProps>
                items={items}
                onChange={setItems}
                renderItem={(subField) => {                    
                    return (
                        <SortableList.Item 
                            id={subField.id}
                            key={subField.id}
                        >
                            <Form.Item 
                                style={{ marginBottom: 0 }}
                            >
                                <SortableList.DragHandle 
                                    customDragHandlerStyle={{
                                        padding: '15px 10px',
                                        alignSelf: 'baseline',
                                        cursor: 'move', 
                                        marginRight: '10px',
                                        fill: 'transparent',
                                    }}
                                    svgStyle={{
                                        height: 24,
                                        width: 20,
                                        fill: '#ccc'
                                    }}
                                />
                            </Form.Item>
                            <Form.Item
                                name={[subField.formRow.name, 'axisName']} 
                                label="Название оси Y"
                                style={{ 
                                    marginBottom: '0px', 
                                    flex: 1,
                                }} 
                            >
                                <Input type="text" />
                            </Form.Item>
                            <Form.Item 
                                name={[subField.formRow.name, 'attributes']} 
                                label="Атрибуты"
                                style={{ 
                                    marginBottom: '0px', 
                                    flex: 1,
                                }} 
                            >
                                <Select />
                            </Form.Item>
                            <Form.Item 
                                name={[subField.formRow.name, 'unit']} 
                                label="Единица измерения"
                                style={{ 
                                    marginBottom: '0px', 
                                    flex: 1,
                                }} 
                            >
                                <Select />
                            </Form.Item>
                            <Form.Item 
                                name={[subField.formRow.name, 'minValue']} 
                                label="Min"
                                style={{ 
                                    marginBottom: '0px', 
                                    flex: 1,
                                }} 
                            >
                                <Select />
                            </Form.Item>
                            <Form.Item 
                                name={[subField.formRow.name, 'maxValue']} 
                                label="Max"
                                style={{ 
                                    marginBottom: '0px', 
                                    flex: 1,
                                }} 
                            >
                                <Select />
                            </Form.Item>
                            {items.length > 1 && (
                                <div
                                    onClick={() => {
                                        subOpt.remove(subField.formRow.name);
                                    }}
                                >
                                    <ECIconView 
                                        icon="CloseOutlined"
                                    />

                                </div>
                            )}
                        </SortableList.Item>
                    )
                }}
            />
            <Button 
                type="dashed" 
                onClick={() => subOpt.add()} 
                block
                style={{
                    maxWidth: 100
                }}
            >
                <ECIconView icon="PlusOutlined" />
            </Button>
        </div>
    )
}
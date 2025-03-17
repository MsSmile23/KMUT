import { ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView';
import { SortableList } from '@shared/ui/SortableList'
import { Button, Form, Input } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { FC, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';

interface ITableRows {
    id: string, 
    data: { id: string, inputValue: string}[]
}

export interface IWidgetStaticTable {
    numberOfColumns: number;
    rows: {
            [rowId: string]: {
                [inputId: string]: {
                    inputValue: string;
                }
            }
        },
    rowsData: ITableRows[]
}

interface IWidgetStaticTableFormProps {
    onChangeForm: <T>(data: T) => void
    settings: {
        vtemplate: {objectId: number},
        widget: IWidgetStaticTable
    }
}

const WidgetStaticTableForm: FC<IWidgetStaticTableFormProps> = (props) => {
    const { settings, onChangeForm } = props
    const [form] = useForm()

    const [stateForm, setStateForm] = useState<IWidgetStaticTable>(
        Object.keys(settings?.widget || {}).length ? settings?.widget : null)
    const [tableRows, setTableRows] = useState<ITableRows[]>(settings?.widget?.rowsData || [])
    const [columnsCount, setColumnsCount] = useState(+settings?.widget?.numberOfColumns || 0)

    useEffect(() => {
        onChangeForm({ ...stateForm, rowsData: tableRows })
    }, [stateForm, tableRows])

    const handleChangeForm = (value, allValues) => {
        const key = Object.keys(value)[0]

        if (key === 'numberOfColumns') {
            const newColumnsCount = Number(value[key])
            const currentColumnsCount = tableRows?.[0]?.data?.length || 0

            if (!newColumnsCount || newColumnsCount === 0) {
                setTableRows([])
            } else if (tableRows.length === 0) {
                const newRows = [{
                    id: uuidv4(),
                    data: new Array(newColumnsCount).fill(null).map(() => ({ id: uuidv4(), inputValue: '' }))
                }]
    
                setTableRows(newRows);
            } else if (newColumnsCount > currentColumnsCount) {
                setTableRows(prevRows =>
                    prevRows.map(row => ({
                        ...row,
                        data: [
                            ...row.data,
                            ...new Array(newColumnsCount - currentColumnsCount).fill(null).map(() => ({
                                id: uuidv4(),
                                inputValue: ''
                            }))
                        ]
                    }))
                );
            } else if (newColumnsCount < currentColumnsCount) {
                setTableRows(prev => prev.map((row) => ({
                    ...row, 
                    data: row.data.slice(0, newColumnsCount)
                })))
            }

            setColumnsCount(Number(value[key]))
        }

        if (key === 'rows') {
            const rowData = value[key]

            Object.keys(rowData).forEach(rowId => {
                setTableRows(prevRows =>
                    prevRows.map(row => {
                        if (row.id === rowId) {
                            const inputData = rowData[rowId]
                            const updatedInputs = row.data.map(input => {
                                const inputId = input.id

                                if (inputData[inputId]) {
                                    return { ...input, inputValue: inputData[inputId].inputValue }
                                }

                                return input
                            })

                            return { ...row, data: updatedInputs }
                        }

                        return row
                    })
                )
            })
        }

        setStateForm(prev => {
            return {
                ...prev,
                ...allValues
            }
        })
    }

    const handleAddRow = () => {
        const newRow = {
            id: uuidv4(),
            data: new Array(columnsCount).fill(null).map(() => ({ id: uuidv4(), inputValue: '' }))
        }
        
        setTableRows(prev => [...prev, newRow])
    }

    const handleRemoveRow = (rowId) => {
        setTableRows(prev => prev.filter(row => row.id !== rowId))
    }


    return (
        <Form
            form={form}
            layout="vertical"
            onValuesChange={handleChangeForm}
            initialValues={stateForm}
        >
            <Form.Item label="Количество столбцов" name="numberOfColumns" style={{ width: 180 }} >
                <Input type="number" min={0} placeholder="Введите количество" />
            </Form.Item>
            <div style={{ display: 'flex' }}>
                <SortableList 
                    items={tableRows} 
                    onChange={newItems => setTableRows(newItems)}
                    renderItem={(row) => (
                        <>
                            <div style={{ display: 'flex' }}>
                                <SortableList.Item 
                                    id={row.id} 
                                    customItemStyle={{ padding: 5 }}
                                >
                                    <SortableList.DragHandle
                                        customDragHandlerStyle={{
                                            padding: '5px 10px',
                                            alignSelf: 'center',
                                            cursor: 'move', 
                                            fill: 'transparent',
                                        }}
                                        svgStyle={{ height: 24, width: 20, fill: '#ccc' }}
                                    />
                                    <div style={{ display: 'flex', gap: 15 }}>
                                        {row?.data?.map(item => (
                                            <Form.Item 
                                                key={item.id} 
                                                name={['rows', row.id, item.id, 'inputValue']} 
                                                style={{ margin: 0, maxWidth: 180 }} 
                                            >
                                                <Input type="text" />
                                            </Form.Item>))}
                                    </div>
                                </SortableList.Item>
                                <Button
                                    size="small"
                                    onClick={() => handleRemoveRow(row.id)}
                                    style={{
                                        height: '100%',
                                        visibility: row.id === tableRows?.[0]?.id ? 'hidden' : 'visible'
                                    }}
                                >
                                    <ECIconView icon="CloseOutlined" />
                                </Button>
                            </div>
                            {row.id === tableRows?.at(-1)?.id &&
                                <Button
                                    size="small"
                                    type="primary"
                                    onClick={handleAddRow}
                                    style={{ height: '100%', width: '36px' }}
                                >
                                    <ECIconView icon="PlusCircleOutlined" />
                                </Button>}
                        </>
                    )}
                />
            </div>
        </Form>
    )
}

export default WidgetStaticTableForm
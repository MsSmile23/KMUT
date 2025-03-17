/* eslint-disable react/jsx-max-depth */
import { IClass } from '@shared/types/classes'
import { Button, Cascader, Col, Divider, Form, Input, Row, Select, Space, Table } from 'antd'
import React, { FC, useRef, useState } from 'react'
import { PlusCircleOutlined } from '@ant-design/icons'
import { createCascaderOptions } from './createCascaderOptions'
import { useApi2 } from '@shared/hooks/useApi2'
import { getRelations } from '@shared/api/Relations/Models/getRelations/getRelations'
import { getClasses } from '@shared/api/Classes/Models/getClasses/getClasses'
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
    SortableContext,
    arrayMove,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ButtonDeleteRow, ButtonEditRow } from '@shared/ui/buttons'
import { useUnformalStore } from './unformalFormStore'

const aggregation = {
    min: 'Минимальная',
    avg: 'Средняя',
    max: 'Максимальная',
}

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    'data-row-key': string;
  }
  
const RowSortable = (props: RowProps, disabled?: boolean) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: props['data-row-key'],
        disabled
    });
  
    const style: React.CSSProperties = {
        ...props.style,
        transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
        transition,
        cursor: disabled ? 'default' : 'move',
        ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
    };
  
    return <tr {...props} ref={setNodeRef} style={style} {...attributes} {...listeners} />;
};

/**
 * Неформализованный отчет
 * 
 */
export const ReportUnformalForm2: FC<{ classes: IClass[] }> = ({ classes }) => {
    const { name: reportName, update } = useUnformalStore()
    const [ columns, updateColumns ] = useUnformalStore((st) => [ st.columns, st.updateColumns ])

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                tolerance: 20,
                delay: 200
            },
        }),
    );

    const onDragEnd = ({ active, over }: DragEndEvent) => {
        if (active.id !== over?.id) {
            const activeIndex = columns.findIndex((i) => i.key === active.id);
            const overIndex = columns.findIndex((i) => i.key === over?.id);

            update({ columns: arrayMove(columns, activeIndex, overIndex) });
        }
    };

    const { templateOptions, templateColumns } = useUnformalStore()

    const [ editedColumn, setEditedColumn ] = useState<any>(undefined)
    
    const [ unformalForm ] = Form.useForm()
    const [ columnForm ] = Form.useForm()
    
    const attributeName = useRef('')

    const relations = useApi2(getRelations)
    const allClasses = useApi2(getClasses)
    const cascaderOptions = createCascaderOptions({
        selectedClasses: classes,
        allClasses: allClasses.data,
        relations: relations.data,
        parent: ''
    })

    const labelSpan = 3

    const chosenTemplate = unformalForm.getFieldValue('template')
    const currentColumnsSerialized = JSON.stringify(columns)
    const templateColumnsSerialized = JSON.stringify(templateColumns[chosenTemplate])
    const columnsWasEdited = currentColumnsSerialized !== templateColumnsSerialized
    const templateDisabled = Boolean(reportName) || (chosenTemplate && columnsWasEdited)

    const [ cascaderPath, setCascaderPath ] = useState<string[]>([])
    
    return (
        <>
            <Form form={unformalForm} labelAlign="right" labelCol={{ xs: labelSpan }}>
                <Form.Item label="Шаблон">
                    <Row gutter={4}>
                        <Col xs={20}>
                            <Form.Item name="template" noStyle>
                                <Select 
                                    options={templateOptions} 
                                    allowClear 
                                    placeholder="Выберите шаблон отчета"
                                    disabled={templateDisabled} 
                                    onChange={(value) => {
                                        updateColumns(templateColumns[value] || [])
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={4}>
                            <Button 
                                style={{ width: '100%' }}
                                onClick={() => {
                                    unformalForm.resetFields()
                                    updateColumns([])
                                    update({ name: '' })
                                }}
                            >
                                Очистить форму
                            </Button>
                        </Col>
                    </Row>
                </Form.Item>
                <Form.Item name="name" label="Название отчета">
                    <Input 
                        allowClear 
                        placeholder="Введите название нового отчета"
                        onChange={(ev) => update({ name: ev.target.value })}  
                    />
                </Form.Item>
                <Row style={{ marginTop: 10, marginBottom: 24 }} gutter={[0, 4]}>
                    <Col offset={labelSpan} xs={24 - labelSpan}>
                        <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
                            <SortableContext
                                items={columns.map((i) => i.key)}
                                strategy={verticalListSortingStrategy}
                            >
                                <Table
                                    components={{
                                        body: {
                                            row: (props: any) => <RowSortable {...props} disabled={false} /> 
                                        },
                                    }}
                                    rowKey="key"
                                    columns={[
                                        { key: 'name', dataIndex: 'name', title: 'Название столбца' },
                                        { key: 'attribute', dataIndex: 'attribute', title: 'Выбранный атрибут' },
                                        { key: 'aggregation', dataIndex: 'aggregation', title: 'Агрегация' },
                                        { key: 'actions', dataIndex: 'actions', title: 'Действия' },
                                    ]}
                                    dataSource={columns.map((row) => {
                                        return {
                                            ...row,
                                            aggregation: aggregation[row.aggregation],
                                            actions: (
                                                <Space>
                                                    <ButtonEditRow 
                                                        onClick={() => {
                                                            // eslint-disable-next-line max-len
                                                            setEditedColumn(columns.find(({ key }) => row.key === key))
                                                        }} 
                                                    />
                                                    <ButtonDeleteRow
                                                        onClick={() => {
                                                            updateColumns(columns.filter(({ key }) => key !== row.key))
                                                        }}  
                                                    />
                                                </Space>
                                            )
                                        }
                                    })}
                                    pagination={false}
                                    scroll={{ y: 400 }}
                                    rowSelection={{ selectedRowKeys: editedColumn?.key ? [editedColumn.key] : [] }}
                                    locale={{ emptyText: <div>Нет данных</div> }}
                                />
                            </SortableContext>
                        </DndContext>
                    </Col>
                    <Col offset={labelSpan} xs={21}>
                        <Button
                            icon={<PlusCircleOutlined />}
                            style={{ width: '100%' }} 
                            onClick={() => setEditedColumn({})}
                        />
                    </Col>
                </Row>
            </Form>
            <div style={{ display: editedColumn ? 'block' : 'none' }}>
                <Divider />
                <Form
                    form={columnForm}
                    labelAlign="right"
                    labelCol={{ xs: labelSpan }}
                    initialValues={{
                        name: editedColumn?.name,
                        aggregation: editedColumn?.aggregation,
                        attribute: editedColumn?.attributePath
                    }}
                    onValuesChange={(_, values) => {
                        if (values.attribute) {
                            setEditedColumn((column: any) => ({
                                ...column,
                                ...values,
                                attribute: attributeName.current,
                                attributePath: values.attribute,
                            }))
                        }
                    }}
                    onFinish={() => {
                        if (editedColumn.key) {
                            updateColumns(columns.map((row) => {
                                return row.key === editedColumn.key
                                    ? editedColumn
                                    : row
                            }))
                        } else {
                            updateColumns([...columns, { ...editedColumn, key: Date.now() }])
                        }

                        setEditedColumn(undefined)
                    }}  
                >
                    <Form.Item name="name" label="Название столбца" rules={[{ required: true }]}>
                        <Input 
                            allowClear 
                            placeholder="Введите название столбца" 
                        />
                    </Form.Item>
                    {/* временно выведен из формы, т.к. не отдает выбранный атрибут */}
                    {/* <Form.Item name="attribute" label="Атрибут" rules={[{ required: true }]}> */}
                    <Row align="middle" style={{ marginBottom: 24 }} gutter={8}>
                        <Col xs={labelSpan} style={{ textAlign: 'right' }}>Атрибут :</Col>
                        <Col xs={21}>
                            <Cascader
                                style={{ width: '100%' }}
                                allowClear
                                placement="bottomLeft"
                                value={cascaderPath}
                                onChange={(values) => {
                                    setCascaderPath(values)
                                }}
                                options={cascaderOptions}
                                placeholder="Выберите атрибут"
                                displayRender={(labels) => {
                                    const labelsAsString = labels
                                        .filter((label) => typeof label === 'string').join(' / ')

                                    attributeName.current = labelsAsString

                                    if (labels.length === 2) {
                                        const reactNodeLabel = (labels[0] as any)?.props?.children[0]
                                            
                                        // достаем название класса из label
                                        if (reactNodeLabel) {
                                            const classLabel = reactNodeLabel.split(' ').pop().replaceAll('"', '')

                                            attributeName.current = `${classLabel} / ${labels[1]}`
                                        }
                                    }

                                    return attributeName.current
                                }}
                            />
                        </Col>
                    </Row>
                    {/* </Form.Item> */}
                    <Form.Item name="aggregation" label="Агрегация" rules={[{ required: true }]}>
                        <Select 
                            allowClear
                            placeholder="Выберите тип агрегации"
                            options={Object.entries(aggregation).map(([ value, label ]) => {
                                return { value, label }
                            })} 
                        />
                    </Form.Item>
                    <Row>
                        <Col offset={labelSpan}>
                            <Form.Item noStyle>
                                <Button htmlType="submit">Сохранить настройки столбца</Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        </>
    )
}
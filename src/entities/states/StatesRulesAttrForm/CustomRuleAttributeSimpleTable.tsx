import {
    BooleanOperatorOptions,
    manageDepthTypeOptions,
    manageOperatorOptions,
} from '@entities/state/statesData/rulesAttributeFormData'
import { rulesAttributeTableProps } from '@entities/state/statesData/rulesAttributeTableData'
import OAttrFormField from '@entities/object-attributes/OAttrFormField/OAttrFormField'
import { IDataType } from '@shared/types/data-types'
import { Forms } from '@shared/ui/forms'
import { Col, Form, Input, Row, Table, TableProps } from 'antd'
import React, { useEffect, useState } from 'react'

interface IToolbar {
    right?: React.ReactNode
    left?: React.ReactNode
}

interface ISimpleTable extends TableProps<any> {
    toolbar?: IToolbar
    rows: any[]
    rowSelection?: any
    ellipsysWidth?: number | string
    chosenDataType: IDataType
    form?: any
    stateId?: number
    disabledForm?: boolean
}

const CustomRuleAttributeSimpleTable: React.FC<ISimpleTable> = ({
    rows,
    toolbar,
    rowSelection,
    chosenDataType,
    form,
    stateId,
    disabledForm,
    ...props
}) => {
    const [dataSource, setDataSource] = useState<any[]>([])

    useEffect(() => {
        rows.forEach(row => {
            form.setFieldsValue({
                [`right_operand-${row.pseudo_id}`]: row.right_operand,
                [`depth_type-${row.pseudo_id}`]: row.depth_type,
                [`depth_value-${row.pseudo_id}`]: row.depth_value,
                [`operator-${row.pseudo_id}`]: row.operator,
            })
        })
    }, [stateId])
    const createRows = () => {
        const newRows: any[] = rows.map((row) => {


            return {
                key: `attr-rule-${row.pseudo_id}`,
                delete: row.delete,
                operator: (
                    <Col span={24} style={{ margin: 5, padding: 0 }}>
                        <Form.Item
                            labelCol={{ span: 12 }}
                            label={rulesAttributeTableProps.operator.label}
                            labelAlign="left"
                            style={{ margin: 0, padding: 0 }}
                            name={`operator-${row?.pseudo_id}`}
                            rules={rulesAttributeTableProps.operator.rules}
                        >
                            <Forms.Select
                                options={
                                    // chosenDataType?.inner_type == 'boolean'
                                    //     ? BooleanOperatorOptions
                                    //     :
                                    manageOperatorOptions}
                                disabled={chosenDataType?.inner_type == 'boolean' ? true : disabledForm}
                            />
                        </Form.Item>
                    </Col>
                ),


                right_operand:
                        (
                            <Form.Item
                                label={' '}
                                labelCol={{ span: 2 }}
                                labelAlign="left"
                                style={{ margin: 0 }}
                                name={`right_operand-${row.pseudo_id}`}
                                // rules={rulesAttributeTableProps.depth_value.rules}
                            >
                                {chosenDataType?.inner_type == 'boolean' ?
                                    <Forms.Select
                                        options={BooleanOperatorOptions}
                                    />
                                    : <OAttrFormField dataType={chosenDataType?.mnemo} /> } 
                            </Form.Item>
                        ),
                depth_type: (
                    <Col span={24} style={{ margin: 5, padding: 0 }}>
                        <Form.Item
                            label={' '}
                            labelCol={{ span: 2 }}
                            labelAlign="left"
                            style={{ margin: 0, padding: 0 }}
                            name={`depth_type-${row.pseudo_id}`}
                            rules={rulesAttributeTableProps.operator.rules}
                        >
                            <Forms.Select
                                options={manageDepthTypeOptions}
                                disabled={disabledForm}
                            />
                        </Form.Item>
                    </Col>
                ),
                depth_value: (
                    <Col span={24} style={{ margin: 0 }}>
                        <Form.Item
                            labelCol={{ span: 14 }}
                            labelAlign="left"
                            style={{ margin: 0 }}
                            name={`depth_value-${row.pseudo_id}`}
                            rules={rulesAttributeTableProps.depth_value.rules}
                            label={rulesAttributeTableProps.depth_value.label}
                        >
                            <Input
                                style={{ margin: 0 }}
                                disabled={false}
                                placeholder="Введите значение"
                                type="number"
                            />
                        </Form.Item>
                    </Col>
                ),
              
            }
        })

        return newRows
    }

    useEffect(() => {
        setDataSource(createRows())
    }, [rows])

    return (
        <Row gutter={[45, 30]}>
            {toolbar && (
                <Col xs={24}>
                    <Row justify="space-between">
                        <Col>{toolbar.left}</Col>
                        <Col>{toolbar.right}</Col>
                    </Row>
                </Col>
            )}

            <Col span={24}>
                <Table
                    locale={{ emptyText: 'Нет данных' }}
                    dataSource={dataSource}
                    {...props}
                />
            </Col>
        </Row>
    )
}

export default CustomRuleAttributeSimpleTable
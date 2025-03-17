import React from 'react'
import { Col, Form, Input, Row, Select, Table, TableProps } from 'antd'
import styles from '../../SimpleTable.module.css'
import { effectsOperationsOptions, effectsTypeOptions } from
    '../../statesData/statesFormData'
import { statesProps, statesPropsNames } from
    '../../statesData/statesTableData'

interface IToolbar {
    right?: React.ReactNode
    left?: React.ReactNode
}

interface ISimpleTable extends TableProps<any> {
    toolbar?: IToolbar
    rows: any[],
    rowSelection?: any
    ellipsysWidth?: number | string


}


const CustomEffectsSimpleTable: React.FC<ISimpleTable> = ({
    rows, toolbar, rowSelection, ...props
}) => {


    const ellipsisRows = (rows || []).map((row, rowIndex) => {

        const fieldEffectsType = `${statesPropsNames.effects_type.name}-${row.indexKey}`;
        const fieldEffectsOperation = `${statesPropsNames.effects_operation.name}-${row.indexKey}`;
        const fieldEffectsAction = `${statesPropsNames.effects_action.name}-${row.indexKey}`;


        const entries = Object.entries(row).map(([ col, value ]: [any, any]) => {

            if (col !== 'key' && col != 'indexKey' && (typeof value === 'string' || typeof value === 'number')) {

                return col === 'operation' || col === 'type' ?   [

                    col,
                    <Col
                        span = {12} key={col.key}
                        style={{ margin: 5 }}

                    >
                        <Form.Item
                            labelAlign="left"
                            style={{ width: '10vw', margin: 0, padding: 0 }}
                            name={col === 'operation' ?
                                [statesProps.effects.name, rowIndex, fieldEffectsOperation] :
                                [statesProps.effects.name, rowIndex, fieldEffectsType]}
                            rules={statesPropsNames.effects_operation.rules}
                        >
                            <Select
                                maxTagCount="responsive"
                                options={col === 'operation' ?
                                    effectsOperationsOptions :
                                    effectsTypeOptions}
                                disabled={false}
                                placeholder="Выберете значение"
                                // onChange={handleChange}
                                value={value}
                            />
                        </Form.Item>
                    </Col>
                ] :
                    [
                        col,
                        <Col
                            span = {12} key={col.key}
                            style={{ minWidth: '5vw',
                                margin: 0
                            }}
                        >
                            <Form.Item
                                labelAlign="left"
                                style={{ width: '10vw', margin: 0 }}
                                name={[statesProps.effects.name, rowIndex, fieldEffectsAction]}
                                rules={statesPropsNames.effects_action.rules}
                            >
                                <Input
                                    disabled={true}
                                    placeholder="Поле действия"
                                />
                            </Form.Item>
                        </Col>
                    ]

            } else {
                return [ col, value ]
            }

        })

        return Object.fromEntries(entries)
    })

    return (
        <Row gutter={[0, 10]}>
            {toolbar && (
                <Col xs={24}>
                    <Row justify="space-between">
                        <Col>{toolbar.left}</Col>
                        <Col>{toolbar.right}</Col>
                    </Row>
                </Col>
            )}
            <Col xs={24}>

                <Table
                    rowClassName={styles?.narrow_table}
                    locale={{ emptyText: 'Нет данных' }}
                    dataSource={ellipsisRows}
                    rowSelection={rowSelection}
                    {...props}
                />

            </Col>
        </Row>
    )
}

export default CustomEffectsSimpleTable
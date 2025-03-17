import { SimpleTable } from '@shared/ui/tables'
import { Col, Row, TableProps } from 'antd'
import React from 'react'


interface IToolbar {
    right?: React.ReactNode
    left?: React.ReactNode
}

interface ISimpleTable extends TableProps<any> {
    toolbar?: IToolbar
    rows: any[],
}

const CustomRuleClassSimpleTable: React.FC<ISimpleTable> = ({ rows, toolbar, ...props }) => {



    
    return (
        <Row gutter={[60, 30]}>
            {toolbar && (
                <Col xs={24}>
                    <Row justify="space-between">
                        <Col>{toolbar.left}</Col>
                        <Col>{toolbar.right}</Col>
                    </Row>
                </Col>
            )}
            <Col style={{ width: '90vw' }}>
                <SimpleTable
                    locale={{ emptyText: 'Нет данных' }}
                    rows={rows}
                    {...props}
                />

            </Col>
        </Row>
    )
}

export default CustomRuleClassSimpleTable
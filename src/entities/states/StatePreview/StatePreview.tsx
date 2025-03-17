import { Card, Col, Row } from 'antd'
import { FC } from 'react'
import { StateLabel, StateTab, StateText } from '..'


export const StatePreview: FC<{ stateId: number }> = ({ stateId }) => {
    return (
        <Row gutter={[8, 8]}>
            <Col >
                <Card
                    bodyStyle={{
                        minHeight: '90px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }} 
                    title="Лейбл"

                >
                    <StateLabel showStateName stateId={stateId} />
                </Card>
            </Col>
            <Col >
                <Card
                    bodyStyle={{
                        minHeight: '90px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    title="Текст"
                >
                    <StateText showStateName stateId={stateId} />
                </Card>
            </Col>
            <Col >
                <Card
                    bodyStyle={{
                        minHeight: '90px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }} 
                    title="Вкладка"

                >
                    <StateTab showStateName id={stateId} />
                </Card>
            </Col>
        </Row>
    )
}
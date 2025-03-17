/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Card, Checkbox, Col, Input, Row } from 'antd';
import { FC, useEffect, useState } from 'react';

export const TestRenderChild: FC<{ data: any[] }> = ({ data }) => {
    const [ val, setVal ] = useState(false)

    useEffect(() => {
        console.log('useeffect data changed', data)
    }, [data])

    useEffect(() => {
        console.log('stringified data changed', data)
    }, [JSON.stringify(data)])

    console.log('data changed', data)

    return (
        <Row>
            <Col>
                child
                <input type="checkbox" checked={val} onChange={(ev) => setVal(ev.target.checked)} />
            </Col>
            <Col xs={24}>
                {data.map((item, i) => <Button key={i}>{item}</Button>)}
            </Col>
        </Row>
    )
}


export const TestRenderParent: React.FC = () => {
    const [ val, setVal ] = useState(false)

    return (
        <div style={{ padding: 12 }}>
            <div>
                parent
                <input type="checkbox" checked={val} onChange={(ev) => setVal(ev.target.checked)} />
            </div>
            <TestRenderChild data={[0]} />
        </div>
    )
}
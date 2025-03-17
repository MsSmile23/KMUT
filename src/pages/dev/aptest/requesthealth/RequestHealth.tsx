import { useHealthStore } from "@shared/stores/health/healthStore"
import { Row, Col, Space, Button, Tag } from "antd"
import { useEffect, useState } from "react"

export const RequestHealth = () => {
    const healthStore = useHealthStore()

    const [ status, setStatus ] = useState([])

    // useEffect(() => {
    //     console.log('healthStore.status', healthStore.status)

    //     setStatus((arr) => [...arr, healthStore.status])
    // }, [healthStore.data.length])

    return (
        <Row gutter={[12, 12]} align="middle" style={{ marginTop: 4 }}>
            <Col xs={24}>
                {/* <ObjectOAttrsWithHistory key={'123'} object={objects[0]} /> */}
                {/* <WidgetObjectsLinkedTableForm 
                    onChangeForm={sv} 
                    settings={{ widget: v }} 
                /> */}
                <Space>
                    <Button onClick={() => healthStore.request(0, 'Server not working')}>
                        Server not working
                    </Button>
                    <Button onClick={() => healthStore.request(0, 'Error custom message')}>
                        Error custom message
                    </Button>
                    <Button onClick={() => healthStore.request(1, 'Server is working')}>
                        Server is working
                    </Button>
                    <Button onClick={() => healthStore.request(1, 'Success custom message')}>
                        Success custom message
                    </Button>
                </Space>
            </Col>
{/*             <Col xs={24}>
                <Space direction='vertical'>
                    {[...healthStore.data].map((item, i) => (
                        <Tag key={i}>{i + 1} | {item.status} - {item.message} | {status[i]}</Tag>
                    ))}
                </Space>
            </Col> */}
        </Row>
    )
}
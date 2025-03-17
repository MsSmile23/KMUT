import {
    PieChartOutlined,
    UserOutlined
} from '@ant-design/icons';

import { Layout, Row } from 'antd';
import { FC, PropsWithChildren } from 'react';
const { Header, Content, Footer } = Layout;

export const CustomLayout: FC<PropsWithChildren> = ({ children }) => {
    return (
        <>
            <Header
                style={{
                    padding: 0, backgroundColor: '#ffffff', width: '100%',
                    position: 'fixed'
                }}
            >
                <Row>
                    <PieChartOutlined
                        style={{
                            color: 'black', fontSize: '32px',
                            marginTop: '15px', marginBottom: '20px', marginLeft: '20px',
                            marginRight: '20px'
                        }}
                    />
                    <UserOutlined
                        style={{
                            color: 'black', fontSize: '32px',
                            marginTop: '15px', marginBottom: '20px', marginLeft: '20px',
                            marginRight: '20px'
                        }}
                    />
                </Row>
            </Header>
            <Layout>
                <Layout className="site-layout" style={{ marginLeft: 200 }}>
                    <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
                        {
                        /*<div style={{ padding: 24, textAlign: 'center',  }}>
                            <p>Зона контента</p>
                             <Row>
                                {
                    
                                    // indicates very long content
                                    Array.from({ length: 21 }, (_, index) => (
                                        <Col span={8} key={index}>
                                            <Card style={{ minHeight: '220px' }} title="">
                                                <Space direction="vertical">
                         
                                                </Space>{' '}
                                            </Card>
                                        </Col>
                                    ))
                                }
                            </Row> 
                        </div>
                        */}
                        {children}
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Ant DesignD</Footer>
                </Layout>
            </Layout>
        </>
    )
}
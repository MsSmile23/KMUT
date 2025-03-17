import { Card, Col, Row } from 'antd'
import Title from 'antd/es/typography/Title'
import { FC } from 'react'
import { useDocumentTitle } from '@shared/hooks/useDocumentTitle'
import { ProfileOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { getURL } from '@shared/utils/nav'
import { ROUTES } from '@shared/config/paths'
const SYSTEM_ITEMS = [
    {
        name: 'Управление пакетами',
        icon: <ProfileOutlined />,
        mnemo: 'seeder-packs',
        background: 'rgb(181, 176, 176)',
    },
]
const List: FC = () => {
    useDocumentTitle('Система')
    const navigate = useNavigate()
    
    return (
        <>
            <Card>
                <Title level={3}>Система</Title>
            </Card>
            <Card style={{ marginTop: 20 }}>
                <Row gutter={8}>
                    {SYSTEM_ITEMS.map((item) => {
                        return (
                            <Col
                                onClick={() => {
                                    navigate(getURL(`${ROUTES.SYSTEM}/${item?.mnemo}`, 'constructor'))
                                    // navigate(`/${ROUTES.RELATIONS}/${ROUTES_COMMON.LIST}`)
                                }}
                                span={3}
                                key={item?.mnemo}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexDirection: 'column',
                                    padding: '10px',
                                    background: item?.background || 'rgb(181, 176, 176)',
                                    cursor: 'pointer',
                                    borderRadius: '5px',
                                }}
                            >
                                <span style={{ fontSize: '25px' }}>{item.icon}</span>
                                {item.name}
                            </Col>
                        )
                    })}
                </Row>
            </Card>
        </>
    )
}

export default List
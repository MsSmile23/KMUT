import { Col, Row, Skeleton } from 'antd'

export const LoadingRows: React.FC = () => {
    return (
        <Row gutter={[12, 12]}>
            <Col xs={8}>
                <Row gutter={[12, 12]}>
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Col key={'skt' + i} xs={24}>
                            <Skeleton.Button active block />
                        </Col>
                    ))}
                </Row>
            </Col>
        </Row>
    )
}
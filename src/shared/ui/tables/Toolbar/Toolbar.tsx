/* eslint-disable @typescript-eslint/no-explicit-any */
import { Col, Row } from 'antd'
import { FC, ReactNode } from 'react'

interface IToolbar {
    rightContent: ReactNode
    leftContent: ReactNode
}
export const Toolbar: FC<IToolbar> = ({ rightContent, leftContent }) => {
    return (
        <Row justify="space-between">
            <Col span={12}>{rightContent}</Col>
            <Col style={{ display: 'flex', justifyContent: 'flex-end' }} span={12}>{leftContent}</Col>
        </Row>
    )
}
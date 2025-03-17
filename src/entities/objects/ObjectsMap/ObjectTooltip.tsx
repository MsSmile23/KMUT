import { ECTooltip } from '@shared/ui/tooltips'
import { Col, Row } from 'antd'
import { FC } from 'react'
import { Tooltip } from 'react-leaflet'

interface IObjectTooltipProps {
    prefix?: string
    text?: string
    state?: string
}

export const ObjectTooltip: FC<IObjectTooltipProps> = ({ prefix, text, state }) => {
    return (
        <Tooltip direction="top" offset={[0, -5]}>
            <Row>
                <Col xs={24} style={{ textAlign: 'center' }}>
                    {prefix || ''} {text || ''}
                </Col>
                <Col xs={24} style={{ textAlign: 'center' }}>
                    {state}
                </Col>
            </Row>
        </Tooltip>
    )
}
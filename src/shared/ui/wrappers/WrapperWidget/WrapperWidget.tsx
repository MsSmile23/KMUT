import { FC } from 'react'
import WrapperCard from '../WrapperCard/WrapperCard'
import { CardProps, Col, Typography } from 'antd'

interface IWrapperWidget extends CardProps {
    height?: number
    title?: string
    titleMarginBottom?: number | string
    style?: React.CSSProperties
    titleStyle?: React.CSSProperties
    overflow?: React.CSSProperties['overflow']
}
const WrapperWidget: FC<IWrapperWidget> = ({ 
    height, title, titleMarginBottom, children, style, titleStyle, overflow 
}) => {
    return (
        <WrapperCard
            styleMode="extend"
            style={{ 
                ...style,
                boxShadow: 'rgba(0, 0, 0, 0.4) 0px 0px 8px', 
                height: height ? `${height}px` : 'auto', 
                overflow: overflow ?? 'hidden' 
            }}
            bodyStyle={{ padding: 5 }}
        >
            {title && (
                <Col style={{ ...titleStyle, marginBottom: titleMarginBottom ?? '10px', textAlign: 'center' }}>
                    <Typography.Text strong>{title}</Typography.Text>
                </Col>
            )}
            {children}
        </WrapperCard>
    )
}

export default WrapperWidget
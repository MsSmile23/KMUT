import { Col, Row } from 'antd'
import React from 'react'

type Props = {
    metricId?: number,
    title: string
    titleColor?: string
    buttons?: React.ReactNode[] | React.ReactNode
    color?: string
    children: React.ReactNode
}

/**
 * Компонент, который отвечает за разметку и цвет фона виджета метрики
 * @param metricId - id метрики
 * @param title - название метрики в набваре
 * @param titleColor - цвет заголовка (по умолчанию белый)
 * @param buttons - массив кнопок в навбаре
 * @param color - цвет фона (если передан, то игнорируем useRuleReactValue)
 * @param children - мемоизированный компонент
 */
const MetricDataCard: React.FC<Props> = ({ 
    title, 
    titleColor = 'white',
    buttons, 
    children, 
    color 
}) => {
    const ruleValue = {
        id: 0,
        description: 'Отсутствует описание',
        colors: '#000',
        sla_flg: false,
        active_flg: false,
        rule_react_type: {
            id: 0,
            name: 'Нет названия',
            created_at: '',
            updated_at: ''
        }
    }

    //const theme = useContext(PreloadTheme)
    //const rowBorderRadius = theme.chartStyles.general.borderRadius.inner

    return (
        <Row 
            style={{ 
                backgroundColor: color || ruleValue.colors, 
                padding: 4,
                //borderRadius: rowBorderRadius
            }}
        >
            <Col xs={24} style={{ padding: 8 }}>
                <Row justify="space-between" align="middle">
                    <Col style={{ fontSize: 14, color: titleColor }}>
                        {title}
                    </Col>
                    {buttons && (
                        <Col>
                            {Array.isArray(buttons) ? (
                                <Row gutter={[12, 12]}>
                                    {buttons.map((btn: React.ReactNode, i: number) => {
                                        return <Col key={`button-col-${i}`}>{btn}</Col>
                                    })}
                                </Row>
                            ) : buttons}
                        </Col>
                    )}
                </Row>
            </Col>
            <Col xs={24}>{children}</Col>
        </Row>
    )
}

export default MetricDataCard
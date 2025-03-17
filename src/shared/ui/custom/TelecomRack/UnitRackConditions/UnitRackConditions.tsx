import { Row, Col, Tag, Skeleton } from 'antd'
import { FC, useMemo } from 'react'
import '../TelecomRack.css'

interface IConditionValues {
    value: number | string,
    color: string
}
interface IUnitRackConditions {
    temperature?: IConditionValues
    humidity?: IConditionValues
    loading?: boolean
}

export const UnitRackConditions: FC<IUnitRackConditions> = ({ temperature, humidity, loading }) => {
    const conditions = useMemo(() => [{ 
        color: temperature.color, 
        text: `${temperature.value} °C`
    }, { 
        color: temperature.color, 
        text: `Вл. ${humidity.value}%` 
    }], [JSON.stringify(temperature), JSON.stringify(humidity)])

    return (
        <Row 
            gutter={[4, 4]} 
            justify="space-between" 
            className="rack-tag-row" 
            style={{ minWidth: 120 }}
        >
            {loading ? (<Skeleton.Button active size="small" block />) : conditions.map((tag, i) => (
                <Col key={`rack-tag-${i}`}>
                    <Tag 
                        className="rack-tag"
                        color={tag.color}
                    >
                        {tag.text}
                    </Tag>
                </Col>
            ))}
        </Row>
    )
}
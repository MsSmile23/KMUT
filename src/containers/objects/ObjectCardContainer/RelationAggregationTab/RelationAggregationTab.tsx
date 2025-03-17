import { FC, useEffect, useState } from 'react';
import { IObject, IObjectAttribute } from '@shared/types/objects';
import { useApi } from '@shared/hooks/useApi';
import { getObjects } from '@shared/api/Objects/Models/getObjects/getObjects';
import type { ColProps, RowProps } from 'antd';
import { Card, Col, Row, Table } from 'antd';
import AttributeHistoryChartContainer from '@containers/objects/AttributeHistoryChartContainer';

interface IRelationAggregationTabProps {
    objectId?: number
    rowStyle?: RowProps
    colStyle?: ColProps
    blocks?: {
        staticAttrs?: boolean
        historyAttrs?: boolean
        historyCharts?: boolean
    }
}

const RelationAggregationTab: FC<IRelationAggregationTabProps> = ({
    objectId,
    rowStyle,
    colStyle,
    blocks = {
        staticAttrs: true,
        historyAttrs: true,
        historyCharts: true
    }

}) => {

    const [ attrStatic, setAttrsStatic] = useState<IObjectAttribute[]>([])
    const [ objectAttrs, setObjectAttrs ] = useState<IObjectAttribute[]>([])

    const objects = useApi<IObject[]>([], getObjects, { all: true })

    useEffect(() => {
        if (!objectId) {
            console.warn('Не указан id объекта для компонента RelationAggregationTab')

            return
        }

        /**
         * Из информации об объекте взять ключ attributes это будет массив object_attributes
         * Он будет массивом объектов { id: 1, object_id: 2, attribute_id: 3, attribute_value: 'value' }
         */
        const tmpObject = objects.data.find((obj) => obj.id == objectId)
        const tmpObjectAttrs = tmpObject?.object_attributes || []

        setAttrsStatic(tmpObjectAttrs.filter((objAttr) => {
            const attr = objAttr.attribute

            return !attr.history_to_cache && !attr.history_to_db
        }))

        /**
         * Отфильтровать object_attributes по условие attribute_id должен быть в массиве filter_attr_ids
         * и получить массив meas_attributes. Это массив измеряемых атрибутов
         */
        setObjectAttrs(tmpObjectAttrs.filter((objAttr) => {
            const attr = objAttr.attribute

            return attr.history_to_cache || attr.history_to_db
        }))
    }, [objectId, objects.data])

    return (
        <>
            {blocks.staticAttrs || blocks.historyAttrs &&
                <Row className="RelationAggregationTab" gutter={[30, 30]} {...rowStyle} >
                    {blocks.staticAttrs &&
                        <Col key="obj-attrs-static" {...colStyle}>
                            <Card title="Свойства объекта">
                                <Table
                                    columns={[
                                        { key: 'name', dataIndex: 'name', title: 'Свойство' },
                                        { key: 'value', dataIndex: 'value', title: 'Значение' }
                                    ]}
                                    dataSource={attrStatic.map((row) => {
                                        return { key: row.id, name: row.attribute.name, value: row.attribute_value }
                                    }) as any[]}
                                    pagination={false}
                                    loading={objects.loading}
                                />
                            </Card>
                        </Col>}
                    {blocks.historyAttrs &&
                        <Col key="obj-attrs-dynamic" xs={12} {...colStyle}>
                            <Card title="Измеряемые свойства объекта">
                                <Table
                                    columns={[
                                        { key: 'name', dataIndex: 'name', title: 'Свойство' },
                                        { key: 'value', dataIndex: 'value', title: 'Значение' }
                                    ]}
                                    dataSource={objectAttrs.map((row) => {
                                        return { key: row.id, name: row.attribute.name, value: row.attribute_value }
                                    }) as any[]}
                                    pagination={false}
                                    loading={objects.loading}
                                />
                            </Card>
                        </Col>}
                </Row>}
            {blocks.historyCharts &&
                <Row className="RelationAggregationTab" gutter={[8, 8]} style={{ marginTop: 20 }} {...rowStyle}>
                    {objectAttrs.map((oa) => {
                        return (
                            <Col key={`obj-attr-${oa.id}`} xs={12} {...colStyle}>
                                <AttributeHistoryChartContainer id={`${oa.id}`} />
                            </Col>
                        )
                    })}
                </Row>}
        </>
    );
};

export default RelationAggregationTab;
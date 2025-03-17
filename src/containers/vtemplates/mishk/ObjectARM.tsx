import { ObjectOAttrsWithHistory } from '@containers/attributes/ObjectOAttrsWithHistory/ObjectOAttrsWithHistory'
import ObjectAdvancedTableWidget from '@containers/objects/ObjectAdvancedTableWidget/ObjectAdvancedTableWidget'
import OALinkedObjectsHistoryView from '@entities/objects/OALinkedObjectsHistoryView/OALinkedObjectsHistoryView'
import ObjectOAttrs from '@entities/objects/ObjectOAttrs/ObjectOAttrs'
import {
    AggregationMeasurementsResultsWidget,
    IProps,
} from '@entities/stats/AggregationMeasurementsResults/AggregationMeasurementsResultsWidget'
import { VTSettings } from '@shared/config/const'
import { IObject } from '@shared/types/objects'
import WrapperWidget from '@shared/ui/wrappers/WrapperWidget/WrapperWidget'
import { Row, Col } from 'antd'
import { FC } from 'react'

interface IObjectARM {
    object: IObject
}
const ObjectARM: FC<IObjectARM> = ({ object }) => {
    return (
        <Row gutter={16}>
            <Col span={8}>
                <WrapperWidget title="Школа" height={300}>
                    <ObjectOAttrs {...VTSettings.mishk.arm.ObjectAttributesWidget_1} />
                </WrapperWidget>
            </Col>

            <Col span={8}>
                <WrapperWidget title="Оборудование" height={300}>
                    <ObjectOAttrs objectId={object.id} {...VTSettings.mishk.arm.ObjectAttributesWidget_2} />
                </WrapperWidget>
            </Col>
            <Col span={8}>
                <WrapperWidget title="Таблица пользователей" height={300}>
                    <ObjectAdvancedTableWidget {...VTSettings.mishk.arm.ObjectAdvancedTableWidget} />
                </WrapperWidget>
            </Col>
            <Col span={8}>
                <WrapperWidget height={300} title="Активность пользователей, ч">
                    <AggregationMeasurementsResultsWidget
                        {...(VTSettings.mishk.arm.AggregationMeasurementsResultsWidget_1 as IProps)}
                        sourceObjectId={object.id}
                    />
                </WrapperWidget>
            </Col>
            <Col span={16}>
                <WrapperWidget height={300} title="График изменения статусов">
                    Виджет в разработке
                </WrapperWidget>
            </Col>

            <Col span={12}>
                <WrapperWidget height={510} title="Активность пользователей, ч">
                    <OALinkedObjectsHistoryView
                        objectId={object.id}
                        {...VTSettings.mishk.arm.OALinkedObjectsHistoryView}
                    />
                </WrapperWidget>
            </Col>
            <Col span={12}>
                <WrapperWidget height={510} title="Дополнительное измерение">
                    Виджет в разработке
                </WrapperWidget>
            </Col>

            <Col span={8}>
                <WrapperWidget height={400} title="Топ пользователей по времени, в ч.">
                    <AggregationMeasurementsResultsWidget
                        {...(VTSettings.mishk.arm.AggregationMeasurementsResultsWidget_2 as IProps)}
                        sourceObjectId={object.id}
                    />
                </WrapperWidget>
            </Col>

            <Col span={8}>
                <WrapperWidget height={400} title="Топ приложений">
                    <AggregationMeasurementsResultsWidget
                        {...(VTSettings.mishk.arm.AggregationMeasurementsResultsWidget_3 as IProps)}
                        sourceObjectId={object.id}
                    />
                </WrapperWidget>
            </Col>

            <Col span={8}>
                <WrapperWidget height={400} title="Топ интернет ресурсов">
                    <AggregationMeasurementsResultsWidget
                        {...(VTSettings.mishk.arm.AggregationMeasurementsResultsWidget_4 as IProps)}
                        sourceObjectId={object.id}
                    />
                </WrapperWidget>
            </Col>

            <Col span={24}>
                <WrapperWidget>
                    <ObjectAdvancedTableWidget
                        classesIds={[59]}
                        columns={['object__name', 191, 238, 243, 249, 191, 246]}
                        relationIds={[161, 185]}
                        height={500}
                    />
                </WrapperWidget>
            </Col>

            <Col span={24}>
                <WrapperWidget>
                    <ObjectOAttrsWithHistory object={object} />
                </WrapperWidget>
            </Col>
        </Row>
    )
}

export default ObjectARM
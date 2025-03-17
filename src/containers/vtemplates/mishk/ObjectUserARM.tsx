import { ObjectOAttrsWithHistory } from '@containers/attributes/ObjectOAttrsWithHistory/ObjectOAttrsWithHistory'
import ObjectParentsChildesWidget from '@containers/objects/ObjectParentsChildesWidget/ObjectParentsChildesWidget'
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

interface IObjectUserARM {
    object: IObject
}

const ObjectUserARM: FC<IObjectUserARM> = ({ object }) => {
    return (
        <Row gutter={16}>
            <Col span={8}>
                <WrapperWidget title="Школа" height={300}>
                    <ObjectOAttrs {...VTSettings.mishk.userARM.ObjectAttributesWidget_1} />
                </WrapperWidget>
            </Col>

            <Col span={8}>
                <WrapperWidget title="Пользователь" height={300}>
                    <ObjectOAttrs objectId={object.id} {...VTSettings.mishk.userARM.ObjectAttributesWidget_2} />
                </WrapperWidget>
            </Col>
            <Col span={8}>
                <WrapperWidget title="Иерархия" height={300}>
                    <Row justify="center" align="middle">
                        <ObjectParentsChildesWidget objectId={object.id} type="parent" parentRelationIds={[109, 105]} />
                    </Row>
                    {/* <ObjectOAttrs objectId={object.id} showLinks title="Атрибуты " height={300} /> */}
                </WrapperWidget>
            </Col>

            <Col span={24}>
                <WrapperWidget title="График проверки пользователя" height={300}>
                    <Row justify="center" align="middle">
                        {' '}
                        Виджет в разработке
                    </Row>
                    {/* <ObjectOAttrs objectId={object.id} showLinks title="Атрибуты " height={300} /> */}
                </WrapperWidget>
            </Col>

            <Col span={8}>
                <WrapperWidget height={400} title="Дневная активность пользователей">
                    <AggregationMeasurementsResultsWidget
                        {...(VTSettings.mishk.userARM.AggregationMeasurementsResultsWidget_1 as IProps)}
                        targetObjectId={object.id}
                    />
                </WrapperWidget>
            </Col>

            <Col span={8}>
                <WrapperWidget height={400} title="Топ приложений">
                    <AggregationMeasurementsResultsWidget
                        {...(VTSettings.mishk.userARM.AggregationMeasurementsResultsWidget_2 as IProps)}
                        targetObjectId={object.id}
                    />
                </WrapperWidget>
            </Col>

            <Col span={8}>
                <WrapperWidget height={400} title="Топ интернет ресурсов">
                    <AggregationMeasurementsResultsWidget
                        {...(VTSettings.mishk.userARM.AggregationMeasurementsResultsWidget_3 as IProps)}
                        targetObjectId={object.id}
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

export default ObjectUserARM
import ObjectCountContainer from '@containers/objects/ObjectCountContainer/ObjectCountContainer'
import BandUtilStatsWidget from '@containers/stats/BandUtilStatsWidget/BandUtilStatsWidget'
import WrapperWidget from '@shared/ui/wrappers/WrapperWidget/WrapperWidget'
import { Col, Row } from 'antd'
import { FC } from 'react'
import ObjectsCountByAttribute from '@containers/objects/ObjectsCountByAttribute/ObjectsCountByAttribute'
import { ObjectLinkedShares } from '@entities/statuses/ObjectLinkedShares/ObjectLinkedShares'
import { AggregationMeasurementsResultsWidget } from '@entities/stats/AggregationMeasurementsResults/AggregationMeasurementsResultsWidget'
import { fnsThemeConfig } from '@app/themes/fnsTheme/fnsThemeConfig'
import ValuesHistoryAggregationWidget2 from '@entities/stats/ValuesHistoryAggregationWidget/ValuesHistoryAggregationWidget2'

const fns = fnsThemeConfig

const countWidgets = [
    fns.main.torm,
    fns.main.inspection,
    fns.main.equipment,
    fns.main.bandCommon
]
const utilWidgets = [fns.main.speedometer, fns.main.cylinder]
const aggregationMeasurements = [
    fns.main.topResources,
    fns.main.topDuration
]

export const MainShowcaseFNS: FC = () => {
    return (
        <Row gutter={14}>
            <Col span={8}>
                <Row justify="center" gutter={8}>
                    {countWidgets.map((widget, i) => (
                        <Col key={`widget-count-${i}`} span={12}>
                            <WrapperWidget>
                                <ObjectCountContainer {...widget} />
                            </WrapperWidget>
                        </Col>
                    ))}
                </Row>
                <WrapperWidget title="Объекты по типам">
                    <ObjectsCountByAttribute {...fns.main.objectsByTypes} />
                </WrapperWidget>
                <WrapperWidget height={450} title="Статусы оборудования">
                    <ObjectLinkedShares 
                        {...fnsThemeConfig.main.equipmentStatus} 
                        height={400} 
                        legendSettings={{
                            units: '',
                            typeValues: 'both',
                            isEnabled: true,
                            showNames: true,
                            orientation: 'bottom',
                            type: 'vertical',
                            width: 200
                        }} 
                    />
                </WrapperWidget>
                <WrapperWidget title="Объекты по ОС">
                    <ObjectsCountByAttribute {...fns.main.operationSystems} />
                </WrapperWidget>
            </Col>
            <Col span={16}>
                <WrapperWidget>
                    <Row gutter={[12, 12]} align="middle" style={{ padding: '20px', width: '100%' }}>
                        {utilWidgets.map((widget, i) => (
                            <BandUtilStatsWidget key={i} {...widget} />
                        ))}
                    </Row>
                </WrapperWidget>
               
                <Col xs={24} key="widget-fns.main.traffic">
                    <WrapperWidget>
                        <ValuesHistoryAggregationWidget2 {...fns.main.traffic} />
                    </WrapperWidget>
                </Col>

                <Row justify="center" gutter={8}>
                    {aggregationMeasurements.map((widget, i) => (
                        <Col key={`widget-aggr-${i}`} span={12}>
                            <WrapperWidget title={widget.title}>
                                <AggregationMeasurementsResultsWidget {...widget} />
                            </WrapperWidget>
                        </Col>
                    ))}
                </Row>
            </Col>
        </Row>
    )
}
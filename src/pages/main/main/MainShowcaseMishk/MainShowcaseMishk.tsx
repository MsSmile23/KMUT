/* eslint-disable react/jsx-max-depth */
import ObjectCountContainer, { IObjectCountContainer }
    from '@containers/objects/ObjectCountContainer/ObjectCountContainer'
import ObjectsCountByAttribute, { IObjectsCountByAttribute }
    from '@containers/objects/ObjectsCountByAttribute/ObjectsCountByAttribute'
import BandUtilStatsWidget from '@containers/stats/BandUtilStatsWidget/BandUtilStatsWidget'
import ObjectCableTable from '@entities/objects/ObjectCableTable/ObjectCableTable'
import { AggregationMeasurementsResultsWidget, IProps } from
    '@entities/stats/AggregationMeasurementsResults/AggregationMeasurementsResultsWidget'
import ValuesHistoryAggregationWidget from 
    '@entities/stats/ValuesHistoryAggregationWidget/ValuesHistoryAggregationWidget'
import { IStatusProps, ObjectLinkedShares } from '@entities/statuses/ObjectLinkedShares/ObjectLinkedShares'
import { variants } from '@pages/dev/aptest/valueshistory/variants'
import { VTSettings } from '@shared/config/const'
import { useDocumentTitle } from '@shared/hooks/useDocumentTitle'



import WrapperWidget from '@shared/ui/wrappers/WrapperWidget/WrapperWidget'
import { Col, Row } from 'antd'
import { FC } from 'react'

const MainShowcaseMishk: FC = () => {
    useDocumentTitle('Мониторинг')
    
    const foundVariant1 = variants.find((v) => v.id === 1)

    return (
        <Row gutter={16}>
            <Col span={8}>
                <Row justify="center" gutter={8}>
                    <Col span={12}>
                        <WrapperWidget>
                            <ObjectCountContainer
                                {...VTSettings.mishk.main.ObjectCountContainer_1 as IObjectCountContainer}
                            />
                        </WrapperWidget>
                    </Col>
                    <Col span={12}>
                        <WrapperWidget>
                            <ObjectCountContainer
                                {...VTSettings.mishk.main.ObjectCountContainer_2 as IObjectCountContainer}
 
                            />
                        </WrapperWidget>
                    </Col>
                    <Col span={12}>
                        <WrapperWidget>
                            <ObjectCountContainer
                                {...VTSettings.mishk.main.ObjectCountContainer_3 as IObjectCountContainer}
                            />
                        </WrapperWidget>
                    </Col>
                    <Col span={12}>
                        <WrapperWidget>
                            <ObjectCountContainer
                                {...VTSettings.mishk.main.ObjectCountContainer_4 as IObjectCountContainer}
                            />
                        </WrapperWidget>
                    </Col>
                </Row>
               
                <WrapperWidget title="Объекты">
                    <ObjectsCountByAttribute
                        {...VTSettings.mishk.main.ObjectsCountByAttribute_1 as IObjectsCountByAttribute}
                       
                    />
                </WrapperWidget>
                <WrapperWidget title="Типы операционных систем">
                    <ObjectsCountByAttribute
                        {...VTSettings.mishk.main.ObjectsCountByAttribute_2 as IObjectsCountByAttribute}
                        
                    />
                </WrapperWidget>
                
            </Col>
            <Col span={16}>
                <WrapperWidget>
                    <Row gutter={[12, 12]} align="middle" style={{ padding: '20px', width: '100%' }}>
                        <BandUtilStatsWidget  
                            {...VTSettings.mishk.main.BandUtilStatsWidget_1}
                        />
                        <BandUtilStatsWidget 
                            {...VTSettings.mishk.main.BandUtilStatsWidget_2}
                        />
                    </Row>
                </WrapperWidget>

                <Row gutter={[12, 12]}>
                    <Col span={12}>
                        <WrapperWidget height={600} title="Длительность использования приложений (ч)">
                            <AggregationMeasurementsResultsWidget 
                                {...VTSettings.mishk.main.AggregationMeasurementsResultsWidget1 as IProps}
                                
                            />
                        </WrapperWidget>
                    </Col>
                    <Col span={12}>
                        <WrapperWidget height={600} title="Топ посещаемых интернет ресурсов">
                            <AggregationMeasurementsResultsWidget 
                                {...VTSettings.mishk.main.AggregationMeasurementsResultsWidget2 as IProps}
                            />
                        </WrapperWidget>

                    </Col>
                </Row>
            </Col>
            <Col span={8}>
                <WrapperWidget title="Статус заявок">
                    <ObjectsCountByAttribute
                        {...VTSettings.mishk.main.ObjectsCountByAttribute_3 as IObjectsCountByAttribute}
                    />
                </WrapperWidget>
            </Col>
            <Col span={16}>
                <WrapperWidget>
                    <ValuesHistoryAggregationWidget 
                        {...foundVariant1.props as any}
                        fakeResponse={foundVariant1.response}
                    />
                </WrapperWidget>
            </Col>

            <Col span={14}>
                <WrapperWidget title="Статусы услуг по объектам" height={515}>
                    <ObjectLinkedShares 
                        {...VTSettings.mishk.main.StatusWrapper_1 as IStatusProps}
                    />
                </WrapperWidget>
            </Col>

            <Col span={10}>
                <Row gutter={16}>
                    <Col span={12}>
                        {' '}
                        <WrapperWidget title="Статусы услуг по объектам" height={250}>
                            <ObjectLinkedShares   
                                {...VTSettings.mishk.main.StatusWrapper_2 as IStatusProps} 
                            />
                        </WrapperWidget>
                    </Col>
                    <Col span={12}>
                        {' '}
                        <WrapperWidget title="Статусы услуг по объектам" height={250} titleMarginBottom={0}>
                            <ObjectLinkedShares
                                {...VTSettings.mishk.main.StatusWrapper_3 as IStatusProps} 
                            />
                        </WrapperWidget>
                    </Col>
                    <Col span={12}>
                        {' '}
                        <WrapperWidget title="Статусы услуг по объектам" height={250}>
                            <ObjectLinkedShares   
                                {...VTSettings.mishk.main.StatusWrapper_2 as IStatusProps}
                            />
                        </WrapperWidget>
                    </Col>
                    <Col span={12}>
                        {' '}
                        <WrapperWidget title="Статусы услуг по объектам" height={250}>
                            <ObjectLinkedShares   
                                {...VTSettings.mishk.main.StatusWrapper_2 as IStatusProps}
                            />
                        </WrapperWidget>
                    </Col>

                </Row>
            </Col>
            <Col span={24}>
                <WrapperWidget title="Кабельный журнал" height={250}>
                    <ObjectCableTable
                        cableClasses={[10022]}
                        relationsCablePort={[10026]}
                        relationsPortDevice={[10027, 10028]}
                    />
                </WrapperWidget>
            </Col>

        </Row>
    )
}

export default MainShowcaseMishk
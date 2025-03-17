import ObjectCountContainer from '@containers/objects/ObjectCountContainer/ObjectCountContainer'

import BandUtilStatsWidget from '@containers/stats/BandUtilStatsWidget/BandUtilStatsWidget'
import { ObjectLinkedShares } from '@entities/statuses/ObjectLinkedShares/ObjectLinkedShares'
import { VTSettings } from '@shared/config/const'
import WrapperWidget from '@shared/ui/wrappers/WrapperWidget/WrapperWidget'
import { Row, Col } from 'antd'
import { FC } from 'react'

const MainDefault: FC = () => {
    return (
        <Row gutter={16}>
            <Col span={8}>
                <WrapperWidget height={225}>
                    <ObjectCountContainer
                        filters={{ mnemo: 'class_id', value: [] }}
                        title="Общее количество объектов"
                        color="#007BFF"
                        icon="HomeOutlined"
                        textSize="12"
                    />
                </WrapperWidget>
                <WrapperWidget height={225} title="Общая пропускная способность">
                    Виджет в разработке
                </WrapperWidget>
            </Col>

            <Col span={16}>
                <WrapperWidget>
                    <Row gutter={[12, 12]} align="middle" style={{ padding: '20px', width: '100%' }}>
                        <BandUtilStatsWidget {...VTSettings.mishk.main.BandUtilStatsWidget_1} />
                        <BandUtilStatsWidget {...VTSettings.mishk.main.BandUtilStatsWidget_2} />
                    </Row>
                </WrapperWidget>
            </Col>

            <Col span={14}>
                <WrapperWidget title="Статусы услуг по объектам" height={515}>
                    <ObjectLinkedShares representationType="pieChart" countInRow={2} height={250} pieSize="60%" />
                </WrapperWidget>
            </Col>

            <Col span={10}>
                <Row gutter={16}>
                    <Col span={12}>
                        {' '}
                        <WrapperWidget title="Статусы услуг по объектам" height={250}>
                            <ObjectLinkedShares representationType="pieChart" isSingle height={150} />
                        </WrapperWidget>
                    </Col>
                    <Col span={12}>
                        {' '}
                        <WrapperWidget title="Статусы услуг по объектам" height={250} titleMarginBottom={0}>
                            <ObjectLinkedShares
                                representationType="pieChart"
                                isSingle
                                height={200}
                                legendSettings={{
                                    units: '',
                                    typeValues: 'both',
                                    isEnabled: true,
                                    showNames: true,
                                    orientation: 'bottom',
                                    type: 'vertical',
                                    width: 150,
                                }}
                                pieSize="50%"
                            />
                        </WrapperWidget>
                    </Col>
                    <Col span={12}>
                        {' '}
                        <WrapperWidget title="Статусы услуг по объектам" height={250}>
                            <ObjectLinkedShares representationType="pieChart" isSingle height={150} />
                        </WrapperWidget>
                    </Col>
                    <Col span={12}>
                        {' '}
                        <WrapperWidget title="Статусы услуг по объектам" height={250}>
                            <ObjectLinkedShares representationType="pieChart" isSingle height={150} />
                        </WrapperWidget>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default MainDefault
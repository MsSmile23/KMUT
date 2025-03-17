import { ObjectLinkedShares } from '@entities/statuses/ObjectLinkedShares/ObjectLinkedShares'
import { IObject } from '@shared/types/objects'
import WrapperWidget from '@shared/ui/wrappers/WrapperWidget/WrapperWidget'
import { Col, Row } from 'antd'
import { FC } from 'react'
import ObjectAdvancedTableWidget from '@containers/objects/ObjectAdvancedTableWidget/ObjectAdvancedTableWidget'
import { fnsThemeConfig } from '@app/themes/fnsTheme/fnsThemeConfig'
import { ObjectsOverImage } from '@entities/stats/ObjectsOverImage/ObjectsOverImage'
import { ILegendSettings } from '@shared/ui/charts/highcharts/wrappers/pie/PieChartWrapper'
import ObjectsStatusLabels from '@entities/objects/ObjectsStatusLabels/ObjectsStatusLabels'
import ObjectOAttrs from '@entities/objects/ObjectOAttrs/ObjectOAttrs'

const legendSettings: ILegendSettings = {
    units: '',
    typeValues: 'both',
    isEnabled: true,
    showNames: true,
    orientation: 'bottom',
    type: 'vertical',
    width: 200,
}

export const ObjectTorm: FC<{ object: IObject }> = ({ object }) => {
    return (
        <Row gutter={12}>
            <Col xs={8}>
                <WrapperWidget title="Атрибуты объекта">
                    <ObjectOAttrs objectId={object.id} {...fnsThemeConfig.torm.attributes} />
                </WrapperWidget>
            </Col>
            <Col xs={16}>
                <WrapperWidget title="Статусы каналов">
                    <ObjectsStatusLabels object_id={object.id} {...fnsThemeConfig.torm.channelStatuses} />
                </WrapperWidget>
            </Col>
            <Col xs={8}>
                <WrapperWidget title="Диаграмма статусов">
                    <ObjectLinkedShares
                        {...fnsThemeConfig.torm.pieStatus}
                        parentObject={object}
                        legendSettings={legendSettings}
                    />
                </WrapperWidget>
            </Col>
            <Col xs={8}>
                <WrapperWidget title="Статусы АРМ">
                    <ObjectLinkedShares
                        {...fnsThemeConfig.torm.historyArm}
                        parentObject={object}
                        legendSettings={legendSettings}
                    />
                </WrapperWidget>
            </Col>
            <Col xs={8}>
                <WrapperWidget title="Статусы Зонд">
                    <ObjectLinkedShares
                        {...fnsThemeConfig.torm.historyZond}
                        parentObject={object}
                        legendSettings={legendSettings}
                    />
                </WrapperWidget>
            </Col>
            <Col xs={24}>
                <WrapperWidget title="Таблица связанного оборудования">
                    <ObjectAdvancedTableWidget {...fnsThemeConfig.torm.linkedEquipmentTable} parentObject={object} />
                </WrapperWidget>
            </Col>
            <Col xs={24}>
                <WrapperWidget title="Статусы дочерних объектов">
                    <ObjectsStatusLabels object_id={object.id} {...fnsThemeConfig.torm.childObjectsStatuses} />
                </WrapperWidget>
            </Col>
            <Col span={24}>
                <WrapperWidget>
                    <ObjectsOverImage 
                        linkedObjectsSearchProps={{ parentObjectId: object.id }} 
                        {...fnsThemeConfig.inspection.subjectScheme} 
                    />
                </WrapperWidget>
            </Col>
        </Row>
    )
}
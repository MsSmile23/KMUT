import ObjectCableTable from '@entities/objects/ObjectCableTable/ObjectCableTable'
import { ObjectLinkedShares } from '@entities/statuses/ObjectLinkedShares/ObjectLinkedShares'
import { VTSettings } from '@shared/config/const'
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

const fns = VTSettings.fns

const legendSettings: ILegendSettings = {
    units: '',
    typeValues: 'both',
    isEnabled: true,
    showNames: true,
    orientation: 'bottom',
    type: 'vertical',
    width: 200,
}

export const ObjectInspection: FC<{ object: IObject }> = ({ object }) => {
    const objectsStatusLabelsProps = {
        object_id: object.id,
        classes_id: [41],
        childClsIds: [41],
        labelWidth: '45%',
    }

    return (
        <Row gutter={12}>
            <Col xs={8}>
                <WrapperWidget title="Атрибуты объекта">
                    <ObjectOAttrs objectId={object.id} {...fns.inspection.attributes} />
                </WrapperWidget>
            </Col>
            <Col xs={16}>
                <WrapperWidget title="Статусы каналов">
                    <ObjectsStatusLabels {...objectsStatusLabelsProps} />
                </WrapperWidget>
            </Col>
            <Col xs={8}>
                <WrapperWidget title="Диаграмма статусов">
                    <ObjectLinkedShares
                        {...fnsThemeConfig.inspection.pieStatus}
                        parentObject={object}
                        legendSettings={legendSettings}
                    />
                </WrapperWidget>
            </Col>
            <Col xs={8}>
                <WrapperWidget title="Статусы АРМ">
                    <ObjectLinkedShares
                        {...fnsThemeConfig.inspection.historyArm}
                        parentObject={object}
                        legendSettings={legendSettings}
                    />
                </WrapperWidget>
            </Col>
            <Col xs={8}>
                <WrapperWidget title="Статусы Зонд">
                    <ObjectLinkedShares
                        {...fnsThemeConfig.inspection.historyZond}
                        parentObject={object}
                        legendSettings={legendSettings}
                    />
                </WrapperWidget>
            </Col>
            <Col xs={24}>
                <WrapperWidget title="Кабельный журнал">
                    <ObjectCableTable
                        {...fnsThemeConfig.inspection.cableTable}
                        columnsAttributesIds={[10101]}
                        parentObject={object}
                    />
                </WrapperWidget>
            </Col>
            <Col xs={24}>
                <WrapperWidget title="Оборудование объекта">
                    <ObjectAdvancedTableWidget {...fnsThemeConfig.inspection.objectEquipment} parentObject={object} />
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
import { forumThemeConfig } from '@app/themes/forumTheme/forumThemeConfig'
import ObjectAttributesAndChildStates, {
    IObjectAttributesAndChildStates,
} from '@containers/objects/ObjectAttributesAndChildStates/ObjectAttributesAndChildStates'
import { IObject } from '@shared/types/objects'
import WrapperWidget from '@shared/ui/wrappers/WrapperWidget/WrapperWidget'
import { Row, Col } from 'antd'
import { FC } from 'react'
import { findChildObjectsByBaseClasses } from '@shared/utils/objects'
import { ObjectLinkedGroupedStates } from '@entities/objects/ObjectLinkedGroupedStates/ObjectLinkedGroupedStates'
import { ObjectsInOutHistory } from '@entities/objects/ObjectsInOutHistory/ObjectsInOutHistory'

interface IObjectBuild {
    object: IObject
}

const ObjectBuild: FC<IObjectBuild> = ({ object }) => {
    const objectAttributesAndChildStatesProps = {
        objectAttributesWidgetProps: {
            oaAtrrWidgetProps: {
                attributesIds: forumThemeConfig.build.deviceStatuses.attributes.attributeIds,
            },
        },
        objectStatusLabelsProps: {
            statusLabelsProps: {
                classes_id: forumThemeConfig.build.deviceStatuses.stateLabels.classes_id,
            },
        },
        statusChartProps: {
            title: 'Состояние оборудования',
            chartProps: forumThemeConfig.build.deviceStatuses.chart,
        },
    } as IObjectAttributesAndChildStates['sections']

    const deviceObjectsIds = findChildObjectsByBaseClasses({
        childClassIds: [
            ...forumThemeConfig.classesGroups.floors,
            ...forumThemeConfig.classesGroups.rooms,
            ...forumThemeConfig.classesGroups.racks,
            ...forumThemeConfig.classesGroups.units,
        ],
        currentObj: object,
        targetClassIds: forumThemeConfig.classesGroups.devices,
    })

    return (
        <Row gutter={16}>
            <Col span={12} className="gutter-row">
                <WrapperWidget
                    // title="Состояние оборудования"
                    height={forumThemeConfig.build.deviceStatuses.chart.height}
                    titleStyle={{ fontSize: '16px' }}
                    // overflow="auto"
                >
                    <ObjectAttributesAndChildStates object={object} sections={objectAttributesAndChildStatesProps} />
                </WrapperWidget>
            </Col>
            <Col span={12} className="gutter-row">
                <WrapperWidget
                    title="Здоровье сервисов"
                    // height={600}
                    height={forumThemeConfig.build.favorHealth.height}
                    titleStyle={{ fontSize: '16px' }}
                >
                    <ObjectLinkedGroupedStates
                        objectId={object.id}
                        classesIds={{
                            parents: forumThemeConfig.classesGroups.favor,
                            nodes: forumThemeConfig.classesGroups.services,
                            leafs: forumThemeConfig.classesGroups.devices,
                        }}
                        height={forumThemeConfig.build.favorHealth.height - 50}
                    />
                </WrapperWidget>
            </Col>
            <Col span={24} className="gutter-row">
                <WrapperWidget
                    // title="Динамика одиночных инцидентов"
                    // titleStyle={{ fontSize: '16px' }}
                    height={forumThemeConfig.build.clientIncidentsDynamics.height}
                >
                    <ObjectsInOutHistory
                        object={object}
                        sourceClass={forumThemeConfig.build.clientIncidentsDynamics.sourceClassId}
                        objectIds={[...new Set(deviceObjectsIds)]}
                    />
                </WrapperWidget>
            </Col>
        </Row>
    )
}

export default ObjectBuild
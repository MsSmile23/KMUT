/* eslint-disable react/jsx-max-depth */
import { IObject } from '@shared/types/objects'
import { Card, Col, Row, Typography } from 'antd'
import { FC, PropsWithChildren } from 'react'
import { UnitRackWidget } from '../UnitRackWidget/UnitRackWidget'
import { IClass } from '@shared/types/classes'
import { useObjectsStore } from '@shared/stores/objects'
import { findChildObjectsWithPaths } from '@shared/utils/objects'
import { ButtonSettings } from '@shared/ui/buttons'
import { findChildsByBaseClasses } from '@shared/utils/classes'
import { useRelationsStore, selectRelations } from '@shared/stores/relations'
import { forumThemeConfig } from '@app/themes/forumTheme/forumThemeConfig'
import { IStateLAbelProps } from '@entities/states/StateLabels/StateLabel'
import { IObjectLinkedObjectsRackViewProps } from '@entities/objects/ObjectLinkedObjectsRackView/ObjectLinkedObjectsRackView'
import { groupByPath } from '@entities/objects/ObjectLinkedObjectsRackView/utils'

interface ITelecommunicationRackWidget {
    object: IObject
    childClassIds: Array<IClass['id']>
    targetClassIds: number[]
    renderedClassesIds?: number[]
    unitPlacementClassId?: number
    deviceUnitRelationIds: number[]
    attributesBind?: IObjectLinkedObjectsRackViewProps['attributesBind']
    stateLabelProps?: Omit<IStateLAbelProps, 'stateId'>
}

const ShadowCard: FC<PropsWithChildren> = ({ children }) => {
    return (
        <Card
            style={{ boxShadow: 'rgba(0, 0, 0, 0.4) 0px 0px 8px' }} 
            bodyStyle={{ padding: 8, }}
        >
            {children}
        </Card>
    )
}


/**
 * Виджет "Телекоммуникационная стойка"
 * @param objectId - ключ родительского объекта, например, здания
 * @param childClassIds - классы по которым осуществляем разбивку (например, этаж и помещение)
 * @param targetClassIds- целевые классы (например, стойки)
 * @param renderedClassIds - классы для отображения в группе
 */
export const TelecommunicationRackWidget: FC<ITelecommunicationRackWidget> = ({
    object,
    childClassIds,
    targetClassIds,
    renderedClassesIds,
}) => {
    const relations = useRelationsStore(selectRelations)
    const findObject = useObjectsStore((st) => st.getObjectById)

    const racks = findChildObjectsWithPaths({ 
        targetClassIds, 
        childClassIds: findChildsByBaseClasses({
            relations,
            classIds: childClassIds,
            package_area: 'SUBJECT'
        }), 
        currentObj: object,
        visibleClasses: renderedClassesIds 
    })?.objectsWithPath

    const sections = groupByPath({ data: racks, find: findObject })

    const deviceUnitProps = {
        relationIds: forumThemeConfig.classesGroups.relationIds,
        sizeAttributeId: undefined,
        unitPlacements: forumThemeConfig.classesGroups.unitPlacements
    }

    return (
        <Row gutter={[12, 12]}>
            {Object.entries(sections).map(([ key, section ]) => {
                return (
                    <Col xs={24} key={key}>
                        <Row gutter={[12, 12]}>
                            <Col xs={24}>
                                <ShadowCard>
                                    <Row justify="space-between" align="middle">
                                        <Col>
                                            <Typography.Text style={{ fontSize: 16, fontWeight: 700 }}>
                                                {section.name}
                                            </Typography.Text>
                                        </Col>
                                        <Col>
                                            <ButtonSettings shape="circle" />
                                        </Col>
                                    </Row>
                                </ShadowCard>
                            </Col>
                            <Col xs={24}>
                                <Row>
                                    {section.objects.map((rack) => {
                                        return (
                                            <Col key={`rack-${rack.id}`}>
                                                <ShadowCard>
                                                    <UnitRackWidget
                                                        object={rack}
                                                        unit={{ 
                                                            orderAttributeId: 10089, 
                                                            rackRelationId: 10037 
                                                        }}
                                                        rackSizeId={10071}
                                                        deviceUnit={deviceUnitProps}
                                                    />
                                                </ShadowCard>
                                            </Col>
                                        )
                                    })}
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                )
            })}
        </Row>
    )
}
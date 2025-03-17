import { UnitRackWidget } from '@containers/objects/UnitRackWidget/UnitRackWidget'
import ObjectCableTable from '@entities/objects/ObjectCableTable/ObjectCableTable'
import { IObject } from '@shared/types/objects'
import WrapperWidget from '@shared/ui/wrappers/WrapperWidget/WrapperWidget'
import { Row, Col } from 'antd'
import { FC } from 'react'
import {
    cableClasses,
    forumThemeConfig,
    relationsCablePort,
    relationsPortDevice,
} from '@app/themes/forumTheme/forumThemeConfig'
import { useParams } from 'react-router-dom'
import { selectObjects, useObjectsStore } from '@shared/stores/objects'
import ObjectOAttrs from '@entities/objects/ObjectOAttrs/ObjectOAttrs'
import { ObjectLinkedObjectsRackView } from '@entities/objects/ObjectLinkedObjectsRackView/ObjectLinkedObjectsRackView'
import { useGetObjects } from '@shared/hooks/useGetObjects'

interface IObjectStand {
    object: IObject
}

const ObjectStand: FC<IObjectStand> = ({ object }) => {
    const params = useParams()
    // const objects = useObjectsStore(selectObjects)
    const objects = useGetObjects()

    const resultObject = object || objects.find((obj) => `${obj.id}` === params?.id)

    return (
        <>
            <Row gutter={16}>
                <Col span={12}>
                    <WrapperWidget height={525} title=" Атрибуты Объекта">
                        <ObjectOAttrs objectId={object.id} showLinks height={350} />
                    </WrapperWidget>
                </Col>
                <Col span={12}>
                    <WrapperWidget title="Стойка">
                        <ObjectLinkedObjectsRackView   
                            type="single"                           
                            object={object}
                            unitRackRelationId={10037}
                            unitPlacementClassId={10097}
                            childClassIds={[]}
                            targetClassIds={[]}
                            visibleClassIds={[]}
                            deviceUnitRelationIds={forumThemeConfig.classesGroups.relationIds}
                            attributesBind={{
                                unitOrder: 10089,
                                rackSize: 10071,
                                maxPower: 10112,
                                currentPower: 10107,
                                temperature: 10111,
                                humidity: 10113,
                            }}
                        />
                    </WrapperWidget>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={24}>
                    <WrapperWidget title="Кабельный журнал" style={{ textAlign: 'center' }} height={400}>
                        <ObjectCableTable
                            parentObject={resultObject}
                            cableClasses={cableClasses}
                            relationsCablePort={relationsCablePort}
                            relationsPortDevice={relationsPortDevice}
                            height={350}
                        />
                    </WrapperWidget>
                </Col>
            </Row>
        </>
    )
}

export default ObjectStand
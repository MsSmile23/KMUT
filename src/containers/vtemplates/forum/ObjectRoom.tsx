import ObjectCableTable from '@entities/objects/ObjectCableTable/ObjectCableTable'
import ObjectOAttrs from '@entities/objects/ObjectOAttrs/ObjectOAttrs'
import { IObject } from '@shared/types/objects'
import WrapperWidget from '@shared/ui/wrappers/WrapperWidget/WrapperWidget'
import { Row, Col } from 'antd'
import { FC } from 'react'

interface IObjectRoom {
    object: IObject
}
const ObjectRoom: FC<IObjectRoom> = ({ object }) => {
    return (
        <Row gutter={16}>
            <Col span={8}>
                <WrapperWidget height={400} title=" Атрибуты Объекта">
                    <ObjectOAttrs objectId={object.id} showLinks height={350} />
                </WrapperWidget>
                <Col span={16}>
                    <WrapperWidget title="Кабельный журнал" style={{ textAlign: 'center' }} height={400}>
                        <ObjectCableTable
                            cableClasses={[10022]}
                            relationsCablePort={[10026]}
                            relationsPortDevice={[10027, 10028]}
                            height={350}
                        />
                    </WrapperWidget>
                </Col>
            </Col>
        </Row>
    )
}

export default ObjectRoom
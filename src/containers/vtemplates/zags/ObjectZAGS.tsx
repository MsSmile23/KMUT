import ObjectOAttrs from '@entities/objects/ObjectOAttrs/ObjectOAttrs'
import { IObject } from '@shared/types/objects'
import WrapperWidget from '@shared/ui/wrappers/WrapperWidget/WrapperWidget'
import { Row, Col } from 'antd'
import { FC } from 'react'

interface IObjectZAGS {
    object: IObject
}

const ObjectZAGS: FC<IObjectZAGS> = ({ object }) => {
    return (
        <Row gutter={16}>
            <Col span={8}>
                <WrapperWidget height={300} title=" Атрибуты Объекта">
                    <ObjectOAttrs objectId={object.id} showLinks height={250} />
                </WrapperWidget>
            </Col>
        </Row>
    )
}

export default ObjectZAGS
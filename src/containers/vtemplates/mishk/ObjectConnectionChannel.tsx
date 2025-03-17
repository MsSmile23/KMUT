import { ObjectOAttrsWithHistory } from '@containers/attributes/ObjectOAttrsWithHistory/ObjectOAttrsWithHistory'
import ObjectOAttrs from '@entities/objects/ObjectOAttrs/ObjectOAttrs'
import { IObject } from '@shared/types/objects'
import WrapperWidget from '@shared/ui/wrappers/WrapperWidget/WrapperWidget'
import { Row, Col } from 'antd'
import { FC } from 'react'

interface IObjectConnectionChannel {
    object: IObject
}

const ObjectConnectionChannel: FC<IObjectConnectionChannel> = ({ object }) => {
    return (
        <Row gutter={16}>
            <Col span={24}>
                <WrapperWidget height={300}>
                    <ObjectOAttrs objectId={object.id} showLinks title="Атрибуты " height={250} />
                </WrapperWidget>
            </Col>

            <Col span={24}>
                <WrapperWidget>
                    <ObjectOAttrsWithHistory object={object} />
                </WrapperWidget>
            </Col>
        </Row>
    )
}

export default ObjectConnectionChannel
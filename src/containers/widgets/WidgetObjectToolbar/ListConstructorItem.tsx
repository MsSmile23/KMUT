import { ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
import { SortableList } from '@shared/ui/SortableList'
import { Buttons } from '@shared/ui/buttons'
import { Col, Row } from 'antd'
import { FUNCTIONAL_TO_LABEL, TYPE_TO_LABEL } from './utils'


const ListConstructorItem = ({ item, onEdit, onDelete }) => {
    return (
        <SortableList.Item
            id={item.id}
            customItemStyle={{ padding: 0, borderRadius: '8px' }}
        >
            <Row align="middle" justify="space-between" style={{ width: '100%' }}>
                <Col span={3} style={{ marginLeft: '10px' }}>
                    {TYPE_TO_LABEL[item.type]}
                </Col>
                {item.type === 'button' &&
                 <>
                     <Col span={3} style={{ marginLeft: '10px' }}>
                         {item.name}
                     </Col>
                     <Col span={3} style={{ marginLeft: '10px' }}>
                         {item.description}
                     </Col>
                     <Col span={3} style={{ marginLeft: '10px' }}>
                         <ECIconView icon={item.icon} />
                     </Col>
                     <Col span={3} style={{ marginLeft: '10px' }}>
                         {FUNCTIONAL_TO_LABEL[item.functional]}
                     </Col>
                 </>}
                
                <Row gutter={4} justify="space-between">
                    <Col>
                        {' '}
                        <Buttons.ButtonEditRow
                            onClick={() => onEdit(item)}
                        />
                    </Col>

                    <Col>
                        {' '}
                        <Buttons.ButtonDeleteRow
                            onClick={() => onDelete(item.id)}
                        />
                    </Col>
                </Row>
            </Row>
            <SortableList.DragHandle
                customDragHandlerStyle={{
                    padding: '15px 10px',
                    alignSelf: 'baseline',
                    marginTop: '5px',
                }}
            />
        </SortableList.Item>
    )
}

export default ListConstructorItem
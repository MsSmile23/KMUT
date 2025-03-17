import AttributesFormContainer from '@containers/attributes/AttributesFormContainer/AttributesFormContainer'
import { getAttributes } from '@shared/api/Attribute/Models/getAttributes/getAttributes'
import { useApi } from '@shared/hooks/useApi'

import { IAttribute } from '@shared/types/attributes'
import { DefaultModal2 } from '@shared/ui/modals/DefaultModal2/DefaultModal2'
import { Row, Col, Divider, Form } from 'antd'
import { FC } from 'react'


interface IModalAddAttribute {
    modal: any,
    setLinkedAttributes?: any // deprecated
    editableAttrId?: number | undefined
    setAttrEditId?: any // deprecated
    onCancel?: () => void
    onSave?: (attribute: IAttribute) => void
}
const ModalAddAttribute: FC<IModalAddAttribute> = ({ 
    modal,  
    editableAttrId, 
    onCancel, 
    onSave 
}) => {
    // const modal = useOpen()
    const attributes = useApi<IAttribute[]>([], getAttributes, { all: true });
    const [ form ] = Form.useForm()
    
    return (
    
        <DefaultModal2
            title={editableAttrId ? 'Редактирование атрибута' : 'Создание атрибута'}
            open={modal.isOpen}
            onCancel={() => {
                modal.close()
                form?.resetFields()
                attributes.request({ all: true })
                onCancel?.()
            }}
            destroyOnClose
            footer={null}
        >
            <Row gutter={[0, 12]}>
                <Col xs={24}>
                    <Divider style={{ margin: 0 }} />
                </Col>
                <Col xs={24}>
                    <AttributesFormContainer
                        id={editableAttrId} 
                        form={form}
                        onSubmit={(attribute) => {
                            onSave(attribute)
                            form?.resetFields()
                            modal.close()
                        }}
                    />
                </Col>
            </Row>
        </DefaultModal2>)
}

export default ModalAddAttribute
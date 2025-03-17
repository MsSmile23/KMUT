import { ECUploadFile } from '@shared/ui/ECUIKit/forms'
import { Col, Form,  Row } from 'antd'


const MassActionsObjectsImportForm = ({ form }) => {

    return (
        <Row gutter={[16, 16]}>
            <Col span={8}>
                <Form.Item
                    label="Загрузка файла"
                    name={['uploadedFile']}
                >
                    <ECUploadFile
                        setFieldValue={form.setFieldValue}
                        fieldName="uploadedFile"
                        mediaFileId={form.getFieldValue('uploadedFile')}
                        getFieldValue={form.getFieldValue}
                    />
                </Form.Item>
            </Col>
        </Row>
    )
}

export default MassActionsObjectsImportForm
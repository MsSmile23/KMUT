import { Col, Collapse, Divider, Form, Row } from 'antd'
import { FC } from 'react'
import { IAttribute } from '@shared/types/attributes'
import { IDataType } from '@shared/types/data-types'
import OAttrFormFieldView from '@entities/object-attributes/OAttrFormFieldView/OAttrFormFieldView'

export interface IAttrData extends IAttribute {
    currentAmount: number
    minAmount: number
    maxAmount: number
}
interface IObjectAttributesForm {
    attributes: IAttrData[]
    dataTypes: IDataType[]
    setAttrData?: React.Dispatch<React.SetStateAction<IAttrData[]>>
    form?: any
    objectId?: number
}
const OAttrFormForView: FC<IObjectAttributesForm> = ({
    attributes, dataTypes, form, objectId }) => {


    let attributesForRender = attributes?.map((attributeObject) => {
        const dataType = dataTypes.find((item) => item.id === attributeObject.data_type_id);
        const inner_type = dataType?.inner_type ?? 'integer'

        attributeObject.data_type = dataType;
        const results = []

        for (let i = 1; i <= attributeObject.currentAmount; i++) {
            const fieldProps = {
                rules: [
                    {
                        required: i <= attributeObject.minAmount && inner_type !== 'boolean',
                        message: 'Обязательное поле',
                    },
                ],
                inner_type: inner_type,
                initialValue: attributeObject.initial_value || attributeObject.static_feature || null,
                valuePropName: inner_type === 'boolean' ? 'checked' : undefined,
                name: attributeObject.id + '-' + i,
                isDeletable: attributeObject.currentAmount > 1 && i > 1,
                isNextAddable: i < attributeObject.maxAmount,
                isLast: i == attributeObject.currentAmount,
                isButtons:
                    attributeObject.currentAmount > 1 ||
                    (i < attributeObject.maxAmount && i == attributeObject.currentAmount),
            }

            results.push(fieldProps)
        }

        return { ...attributeObject, fields: results }
    })

    const attributesForRenderReadonly = attributesForRender.filter(attributeObject => attributeObject.readonly
        || attributeObject.static_feature)

    attributesForRender = attributesForRender.filter(attributeObject => !attributeObject.readonly )

    const drawAttributes = (attributes) => {
        return (
            <Row key={Math.random()} gutter={[8, 8]}>
                {attributes
                    .map((attributeObject, index) => (
                        <Col
                            span={attributeObject.data_type.mnemo === 'schedule' ? 24 : 12}
                            key={attributeObject.id + index + '_col'}
                        >
                            {attributeObject.fields.map((attributeField) => (
                                <Row
                                    align="middle" key={attributeField.name}
                                    gutter={[8, 8]}
                                    style={{ marginBottom: '10px' }}
                                >
                                    <Col
                                        span={10}
                                        style={{
                                            ...(attributeObject.data_type.mnemo === 'schedule' ?
                                                { marginRight: '2.5%' } : {}) }}
                                    >
                                        {attributeObject.name}
                                    </Col>
                                    <Col
                                        span={14}
                                        style={{ ...(attributeObject.data_type.mnemo === 'schedule' ?
                                            { marginRight: '' } : {}) }}
                                    >
                                        <Form.Item
                                            rules={attributeField.rules}
                                            label=" "
                                            labelCol={{ offset: 0, span: 0 }}
                                            initialValue={attributeField.initialValue}
                                            style={{ margin: 0, width: '100%' }}
                                            colon={false}
                                            name={attributeField.name}
                                            valuePropName={attributeField.inner_type == 'boolean' ?
                                                'checked' : 'value'}
                                        >
                                            <OAttrFormFieldView
                                                attribute={attributeObject}
                                                viewTypeId={attributeObject.view_type_id}
                                                dataType={attributeField.inner_type}
                                                disabled={true}
                                                form={form}
                                                objectId={objectId}
                                            />

                                        </Form.Item>
                                    </Col>
                                </Row>
                            ))}
                            {attributeObject.name === 'Расписание' &&
                                <Divider orientation="center" type="horizontal" />}
                        </Col>
                    ))}
            </Row>
        )
    }

    return (
        <>
            {drawAttributes(attributesForRender) }
            {attributesForRenderReadonly.length > 0 &&
             <Collapse
                 key={Date()}
                 size="small"
                 style={{ fontSize: '12px' }}
                 defaultActiveKey={['2']}
                 items={[{ key: '2', label: 'Нередактируемые атрибуты',
                     children:
                <>
                    {drawAttributes(attributesForRenderReadonly) }
                </>
                 }]}
             />}

        </>

    )
}

export default OAttrFormForView
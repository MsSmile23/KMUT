import { Buttons } from '@shared/ui/buttons'
import { ECSelect, Forms } from '@shared/ui/forms'
import { Col, Form, Row } from 'antd'

const AttributeFormViewTypes = ({
    handleAddViewType,
    attributesProps,
    viewTypes,
    additionalViewTypes,
    createOptions,
    handleViewTypeChange,
    createPlaceholder,
    handleViewTypeDelete
}) => {
    return (
        <>
            <Buttons.ButtonAddRow
                size="small"
                onClick={() => handleAddViewType('top')}
            />
            <Form.Item
                label="Представление по умолчанию:"
                name={attributesProps.viewType.name}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
            >
                <ECSelect
                    style={{ width: 'max-content' }}
                    dropdownStyle={{ width: 'fit-content' }}
                    options={createOptions(viewTypes.data)}
                    disabled={true}
                />
            </Form.Item>
            <p>Дополнительные представления:</p>
            {additionalViewTypes?.map((vt) => (
                <Row
                    gutter={4}
                    key={vt.index}
                    style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}
                >
                    <Col>
                        <Forms.Select
                            key={vt.index}
                            style={{ width: '300px' }}
                            onChange={(e) => handleViewTypeChange(vt.index,
                                viewTypes.data?.find(el => el.id === e).id
                            )}
                            value={vt.name}
                            dropdownStyle={{ width: 'fit-content' }}
                            options={createOptions(viewTypes.data)?.filter(option =>
                                !(additionalViewTypes)?.some(el => el.id === option.value)
                            )}
                            placeholder={createPlaceholder(viewTypes.loading)}
                        />
                    </Col>
                    <Col>
                        <Buttons.ButtonEditRow
                            onClick={() => { ' ' }}
                            disabled
                        />
                    </Col>
                    <Col>
                        <Buttons.ButtonDeleteRow
                            onClick={() => handleViewTypeDelete(vt.index)}
                        />
                    </Col>
                </Row>
            ))}

            <Buttons.ButtonAddRow
                size="small"
                onClick={() => handleAddViewType('bottom')}
            />
        </>
    )
}

export default AttributeFormViewTypes
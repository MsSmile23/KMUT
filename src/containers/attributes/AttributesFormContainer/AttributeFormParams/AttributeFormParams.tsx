import { ECSelect, Forms } from '@shared/ui/forms'
import { Col, Form, Row } from 'antd'

const syntaxOptions = [
    { value: 'null', label: 'Нет' },
    { value: 'json', label: 'JSON' },
    { value: 'postprocessing', label: 'Постпроцессинг' },
]

const formLayoutOptions = [
    { value: 'null', label: 'По умолчанию' },
    { value: '1', label: '1 колонка' },
    { value: '2', label: '2 колонки' },
]


const AttributeFormParams = ({ rowStyles, colStyles }) => {

    return (
        <Row {...rowStyles}>
            <Col {...colStyles}> 
                <Form.Item
                    name={['params', 'syntax']}
                    label={<Forms.Label>Синтаксис</Forms.Label>} 
                >
                    <ECSelect
                        options={syntaxOptions}
                    />
                </Form.Item>
            </Col>
            <Col {...colStyles}> 
                <Form.Item
                    name={['params', 'formLayout', 'cols']}
                    label={<Forms.Label>Ширина в форме</Forms.Label>} 
                >
                    <ECSelect
                        options={formLayoutOptions}
                    />
                </Form.Item>
            </Col>
        </Row>
    )
}

export default AttributeFormParams
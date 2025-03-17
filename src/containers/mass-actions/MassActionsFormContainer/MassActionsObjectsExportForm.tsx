import { ClassesCascader } from '@entities/classes/ClassesCascader/ClassesCascader'
import { ECSelect } from '@shared/ui/forms'
import { Col, Form, Row, Switch } from 'antd'
import { useMemo } from 'react'
import { ECColorfulText } from '@shared/ui/text/ECColorfulText/ECColorfulText'
import { warning,  getAttributeOptions, getRelationsOptions } from './utils'
import { getObjectsAsSelectOptions } from '@shared/lib/MLKit/MLKit'

type TFormFields = {
    object_selector: number[],
    classes_selector: number[],
    attributes_selector: number[],
    relations_selector: number[],
    output_atribute: boolean,
    output_relations: boolean,
    output_comments: boolean,
    output_styles: boolean,
    output_object_name: boolean,
}

const MassActionsObjectsExportForm = ({ form }) => {

    const valuesForm: TFormFields = Form.useWatch<TFormFields>([], form)

    const optionsState = useMemo(() => ({
        attributesOptions: getAttributeOptions(valuesForm?.object_selector, valuesForm?.classes_selector),
        relationsOptions: getRelationsOptions(valuesForm?.object_selector, valuesForm?.classes_selector),
        objectsOptions: getObjectsAsSelectOptions(valuesForm?.classes_selector)
    }), [valuesForm?.classes_selector, valuesForm?.object_selector]);

    return (
        <Row gutter={[16, 16]}>
            <Col span={8}>
                <Form.Item
                    label="Выгружать имена объектов?"
                    name="output_object_name"
                    valuePropName="checked"
                    initialValue={true}
                >
                    <Switch />
                </Form.Item>
                <Form.Item
                    label="Выбор классов"
                    name={['classes_selector']}
                >
                    <ClassesCascader placeholder="Все классы" />
                </Form.Item>
                <Form.Item
                    label="Выбор объектов"
                    name={['object_selector']}
                >
                    <ECSelect
                        options={optionsState.objectsOptions}
                        placeholder="Все объекты"
                        mode="multiple"
                    />
                </Form.Item>
            </Col>
            {!(valuesForm?.classes_selector?.length > 0 || valuesForm?.object_selector?.length > 0)
                ? <ECColorfulText
                    textColor="red"
                    backgroundColor="none"
                    content={warning}
                    // eslint-disable-next-line react/jsx-closing-bracket-location
                />
                :
                <>
                    <Col span={8}>
                        <Form.Item
                            label="Не выгружать атрибуты?"
                            name={['output_atribute']}
                            valuePropName="checked"
                            initialValue={false}
                        >
                            <Switch />
                        </Form.Item>
                        {!valuesForm?.output_atribute && 
                            <Form.Item
                                label="Выбор атрибутов"
                                name={['selected_atribute']} 
                            >
                                <ECSelect
                                    options={optionsState.attributesOptions}
                                    placeholder="Выберите атрибуты"
                                    mode="multiple"
                                />
                            </Form.Item>}
                        <Form.Item
                            label="Не выгружать комментарии?"
                            name="output_comments"
                            valuePropName="checked"
                            initialValue={true}
                        >
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="Не выгружать связанные объекты?"
                            name={['output_relations']}
                            valuePropName="checked"
                            initialValue={false}
                        >
                            <Switch />
                        </Form.Item>
                        {!valuesForm?.output_relations &&
                            <Form.Item
                                label="Выбор связанных объектов"
                                name={['selected_relations']} 
                            >
                                <ECSelect
                                    options={optionsState.relationsOptions}
                                    placeholder="Выберите связи"
                                    mode="multiple"
                                />
                            </Form.Item>}
                        <Form.Item
                            label="Не выгружать стили?"
                            name="output_styles"
                            valuePropName="checked"
                            initialValue={true}
                        >
                            <Switch />
                        </Form.Item>
                    </Col>
                </>}
        </Row>
    )
}

export default MassActionsObjectsExportForm
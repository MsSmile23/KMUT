/* eslint-disable max-len */
import { FC, useState } from 'react';
import { IWidgetObjectLinkedObjectsRackViewForm } from './types';
import { Col, Collapse, Form, Row } from 'antd';
import { Forms } from '@shared/ui/forms';
import { createOptions, createRelationOptions, rackAttributesFormItemsProps, rackGroupingOptions } from './data';
import { useRelationsStore } from '@shared/stores/relations';
import { ClassesCascader } from '@entities/classes/ClassesCascader/ClassesCascader';
import { selectAttributes, useAttributesStore } from '@shared/stores/attributes';

/**
 * Форма для создания виджета отображения сгруппированных и одиночных стоек
 * 
 * @param onChangeForm - функция для обновления пропсов виджета (самого виджета или превью виджета)
 * @param settings - объект с настройками виджета
 * @param settings.widget.objectId - id объекта, на основе которого формируются данные (например, здание или стойка)
 * @param settings.widget - см. interface IObjectLinkedObjectsRackViewProps
 */
const WidgetObjectLinkedObjectsRackViewForm: FC<IWidgetObjectLinkedObjectsRackViewForm> = ({
    onChangeForm,
    settings: { widget }
}) => {
    const [ form ] = Form.useForm()

    const [ unitClassIds, setUnitClassIds ] = useState<number[]>([])
    const [ rackClassIds, setRackClassIds ] = useState<number[]>([])

    const relations = useRelationsStore((st) => st.store.data)
    const unitRackRelationOptions = createRelationOptions(relations, unitClassIds, rackClassIds)
    const attributes = useAttributesStore(selectAttributes)
    const unitsDirectionOptionы = [
        { label: 'Обратное', value: 'reverse' },
        { label: 'Прямое', value: 'direct' },
    ]

    return (
        <Form
            form={form}
            onValuesChange={(_v, values) => {
                const updatedValues = {
                    ...values,
                    unitPlacementClassId: values?.unitPlacementClassId?.[0]
                }

                onChangeForm(updatedValues)
            }}
            labelCol={{ xs: 24 }}
            labelAlign="left"
            initialValues={widget}
        >
            <Row align="top" gutter={8}>
                <Col span={8}> 
                    <Collapse
                        style={{ marginTop: 10 }} 
                        items={[{ 
                            key: '1', 
                            label: 'Связи между стойками, юнитами и устройствами',
                            children: (
                                <>
                                    <Form.Item label="Класс юнита">
                                        <ClassesCascader value={unitClassIds} onChange={setUnitClassIds} />
                                    </Form.Item>
                                    <Form.Item label="Класс стойки">
                                        <ClassesCascader value={rackClassIds} onChange={setRackClassIds} />
                                    </Form.Item>
                                    <Form.Item name="unitRackRelationId" label="Связь между стойкой и юнитом">
                                        <Forms.Select
                                            options={unitRackRelationOptions}
                                            disabled={rackClassIds.length === 0 && unitClassIds.length === 0} 
                                        />
                                    </Form.Item>
                                </>
                            )
                        }]}
                    />
                </Col>
                <Col span={8}>   
                    <Collapse
                        style={{ marginTop: 10 }} 
                        items={[{
                            key: '1',
                            label: 'Отображение стоек и группировка',
                            children: (
                                <>
                                    <Form.Item name="type" label="Группировка стоек">
                                        <Forms.Select options={rackGroupingOptions} />
                                    </Form.Item>
                                    <Form.Item name="childClassIds" label="Классы, по которым необходимо вывести стойки">
                                        <ClassesCascader />
                                    </Form.Item>
                                    <Form.Item name="targetClassIds" label="Классы стоек">
                                        <ClassesCascader />
                                    </Form.Item>
                                    <Form.Item 
                                        name="visibleClassIds" 
                                        label="Классы, которые будут отображаться в названии группы"
                                    >
                                        <ClassesCascader />
                                    </Form.Item>
                                    <Form.Item 
                                        name="unitPlacementClassId" 
                                        label="Классы, отвечающие на какой стороне стойки размещено устройство"
                                    >
                                        <ClassesCascader />
                                    </Form.Item>
                                </>
                            )
                        }]}
                    />
                </Col>
                <Col span={8}>   
                    <Collapse 
                        style={{ marginTop: 10 }}
                        items={[{
                            key: '1',
                            label: 'Выбор атрибутов для отображения параметров стойки',
                            children: rackAttributesFormItemsProps.map(({ name, label }) => (
                                <Form.Item key={name} name={['attributesBind', name]} label={label}>
                                    <Forms.Select options={createOptions(attributes, 'id')} />
                                </Form.Item>
                            ))
                        }]}
                    />
                </Col>
            
          
                {/* <Collapse
                items={[{ 
                    key: '1', 
                    label: 'Связи между стойками, юнитами и устройствами',
                    children: (
                        <>
                            <Form.Item label="Класс юнита">
                                <ClassesCascader value={unitClassIds} onChange={setUnitClassIds} />
                            </Form.Item>
                            <Form.Item label="Класс стойки">
                                <ClassesCascader value={rackClassIds} onChange={setRackClassIds} />
                            </Form.Item>
                            <Form.Item name="unitRackRelationId" label="Связь между стойкой и юнитом">
                                <Forms.Select
                                    options={unitRackRelationOptions}
                                    disabled={rackClassIds.length === 0 && unitClassIds.length === 0} 
                                />
                            </Form.Item>
                        </>
                    )
                }]}
            />
            <Collapse
                style={{ marginTop: 10 }} 
                items={[{
                    key: '1',
                    label: 'Отображение стоек и группировка',
                    children: (
                        <>
                            <Form.Item name="type" label="Группировка стоек">
                                <Forms.Select options={rackGroupingOptions} />
                            </Form.Item>
                            <Form.Item name="childClassIds" label="Классы, по которым необходимо вывести стойки">
                                <ClassesCascader />
                            </Form.Item>
                            <Form.Item name="targetClassIds" label="Классы стоек">
                                <ClassesCascader />
                            </Form.Item>
                            <Form.Item 
                                name="visibleClassIds" 
                                label="Классы, которые будут отображаться в названии группы"
                            >
                                <ClassesCascader />
                            </Form.Item>
                            <Form.Item 
                                name="unitPlacementClassId" 
                                label="Классы, отвечающие на какой стороне стойки размещено устройство"
                            >
                                <ClassesCascader />
                            </Form.Item>
                        </>
                    )
                }]} 
            />
            <Collapse 
                style={{ marginTop: 10 }}
                items={[{
                    key: '1',
                    label: 'Выбор атрибутов для отображения параметров стойки',
                    children: rackAttributesFormItemsProps.map(({ name, label }) => (
                        <Form.Item key={name} name={['attributesBind', name]} label={label}>
                            <Forms.Select options={createOptions(attributes, 'id')} />
                        </Form.Item>
                    ))
                }]}
            /> */}
                <Col span={8}>
                    <Form.Item name="unitsDirection" label="Направление отображения юнитов">
                        <Forms.Select options={unitsDirectionOptionы} placeholder="Выберите направление" />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name="deviceUnitRelationIds" label="Связи устройств со стойкой">
                        <Forms.Select mode="multiple" options={relations.map(({ id, name }) => ({ value: id, label: `${name} [${id}]` }))} placeholder="Выберите связи" />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    )
}

export default WidgetObjectLinkedObjectsRackViewForm
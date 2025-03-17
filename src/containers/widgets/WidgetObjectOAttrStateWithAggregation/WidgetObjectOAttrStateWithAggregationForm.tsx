import { IObjectOAttrStateWithAggregationProps } from '@containers/object-attributes/ObjectOAttrStateWithAggregation/ObjectOAttrStateWithAggregation'
import { FC, useEffect, useMemo, useState } from 'react'
import { Checkbox, Col, Card, Divider, Form, Row } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { Input, Select } from '@shared/ui/forms'
import { selectObjectByIndex, useObjectsStore } from '@shared/stores/objects'
import { IObjectAttribute } from '@shared/types/objects'
import { selectClassByIndex, selectClasses, useClassesStore } from '@shared/stores/classes'
import { findChildsByBaseClasses } from '@shared/utils/classes'
import { selectRelations, useRelationsStore } from '@shared/stores/relations'
import { TWidgetFormSettings } from '@shared/types/widgets'
import { PACKAGE_AREA } from '@shared/config/entities/package'

export type IWidgetObjectOAttrStateWithAggregation = Omit<IObjectOAttrStateWithAggregationProps, 'objectAttribute'> & {
    objectAttribute: IObjectAttribute['id']
    stateText?: string
    attrName?: string
    attrValue?: string
    attrValueUnit?: string
    targetClass?: number
    linkedClass?: number
    linkedClassObjects?: number[]
    currentName?: string
    valNextLine?: boolean
    noAttributeTitle?: string
};

type IWidgetObjectOAttrStateWithAggregationFormState = TWidgetFormSettings<IWidgetObjectOAttrStateWithAggregation>;

const optionsAggregations = [
    {
        label: 'Текущее',
        value: 'current'
    },
    {
        label: 'Максимальное',
        value: 'max'
    },
    {
        label: 'Минимальное',
        value: 'min'
    },
    {
        label: 'Среднее',
        value: 'average'
    }
]

const WidgetObjectOAttrStateWithAggregationForm: FC<IWidgetObjectOAttrStateWithAggregationFormState> = (props) => {
    
    const { settings, onChangeForm } = props
    const { widget, vtemplate, baseSettings } = settings
    const storeClasses = useClassesStore(selectClasses)
    const getObjectByIndex = useObjectsStore(selectObjectByIndex)
    const [form] = useForm()
    
    const initialValuesForm: IWidgetObjectOAttrStateWithAggregation = {
        objectAttribute: widget?.objectAttribute ?? undefined,
        value: {
            enabled: widget?.value?.enabled ?? false,
            aggregation: widget?.value?.aggregation ?? 'current',
        },
        maxWidth: widget?.maxWidth ?? false,
        customStyle: {
            alignItems: 'center',
            padding: '0px',
            margin: '0px',
            border: 'none'
        },
        stateText: widget?.stateText ?? null,
        attrName: widget?.attrName ?? null,
        attrValue: widget?.attrValue ?? null,
        attrValueUnit: widget?.attrValueUnit ?? null,
        targetClass: widget?.targetClass,
        linkedClass: widget?.linkedClass,
        linkedClassObjects: widget?.linkedClassObjects ?? [],
        currentName: widget?.currentName ?? '',
        valNextLine: widget?.valNextLine,
        noAttributeTitle: widget?.noAttributeTitle
    }
    const relations = useRelationsStore(selectRelations)
    const getClassByIndex = useClassesStore(selectClassByIndex)

    useEffect(() => {
        form.setFieldsValue({
            objectAttribute: widget?.objectAttribute || undefined,
            enabled: widget?.value?.enabled,
            aggregation: widget?.value?.aggregation || 'current',
            maxWidth: widget?.maxWidth,
            stateText: widget?.stateText,
            attrName: widget?.attrName,
            attrValue: widget?.attrValue,
            attrValueUnit: widget?.attrValueUnit,
            targetClass: widget?.targetClass,
            linkedClass: widget?.linkedClass,
            linkedClassObjects: widget?.linkedClassObjects,
            currentName: widget?.currentName,
            noAttributeTitle: widget?.noAttributeTitle
        })
    }, [settings.widget])

    const [stateForm, setStateForm] = useState<IWidgetObjectOAttrStateWithAggregation>(initialValuesForm)

    useEffect(() => {
        onChangeForm<IWidgetObjectOAttrStateWithAggregation>(stateForm)
    }, [stateForm])

    const currentObjectId = vtemplate?.objectId 

    const getObject = useObjectsStore(selectObjectByIndex)
    const currentObject = getObject('id', currentObjectId)

    const attributesList = useMemo(() => {
        if (stateForm.targetClass) {
            const currentClass = getClassByIndex('id', stateForm.targetClass) 

            return currentClass?.attributes
                ?.map((attr) => {
                    return {
                        value: attr.id,
                        label: attr.name
                    }
                })
                .sort((a, b) => a.label.localeCompare(b.label))
        }

        //Если переданы классы - фильтруем атрибуты
        if (vtemplate.classes.length > 0 || baseSettings?.classes.length > 0) {
            const targetCls = vtemplate.classes.length > 0 ? vtemplate.classes : baseSettings?.classes

            const filteredClasses = storeClasses.filter((cl) => targetCls.includes(cl.id))
            const classesAttributes = filteredClasses
                .flatMap((cl) => cl.attributes)
                .filter((attribute) => attribute.history_to_cache === true || attribute.history_to_db === true)

            const classesAttributesList = classesAttributes.reduce((acc, attr) => {
                if (!acc.some(item => item.value === attr.id)) {
                    acc.push({
                        value: attr.id,
                        label: attr.name
                    })
                }

                return acc
            }, [])

            return classesAttributesList.sort((a, b) => a.label.localeCompare(b.label))
        }

        // Все атрибуты классов
        const allClassesAttributesList = storeClasses
            .flatMap((cl) => cl.attributes)
            .filter((attribute) => attribute.history_to_cache === true || attribute.history_to_db === true)
            .reduce((acc, attr) => {
                if (!acc.some(item => item.value === attr.id)) {
                    acc.push({
                        value: attr.id,
                        label: attr.name
                    })
                }

                return acc
            }, [])

        return allClassesAttributesList.sort((a, b) => a.label.localeCompare(b.label))
    }, [
        stateForm.targetClass,
        baseSettings?.classes,
        vtemplate?.classes
    ])

    //Записываем значения при изменении
    const onValuesChange = (value, onChangeForm) => {
        const key = Object.keys(value)[0]

        if (key === 'enabled' || key === 'aggregation') {
            setStateForm((prev) => {
                return {
                    ...prev,
                    value: {
                        ...prev.value,
                        [key]: onChangeForm[key],
                    },
                }
            })
        } else {
            setStateForm((prev) => {

                return {
                    ...prev,
                    [key]: onChangeForm[key],
                }
            })
        }

        
    }

    const getExampleString = () => {
        const array = [
            {
                enabled: form.getFieldValue('stateText'),
                value: 'stateText',
                label: 'статус'
            },
            {
                enabled: form.getFieldValue('attrName'),
                value: 'attrName',
                label: 'название измерения',
            },
            {
                enabled: form.getFieldValue('attrValue'),
                value: 'attrValue',
                label: 'результат измерения',
            },
            {
                enabled: form.getFieldValue('attrValueUnit'),
                value: 'attrValueUnit',
                label: 'ед. изм.',
            },
        ].filter(item => item.enabled)

        return array.reduce((acc, item, idx) => {
            const beforeItem = {
                stateText: '',
                attrName: ' - ',
                attrValue: ' - ',
                attrValueUnit: ' ',
            }
            const isFirstLabel = (i: number, label: string) => {
                return i === 0 
                    ? label[0].toUpperCase() + label.slice(1)
                    : label
            }

            if (item.enabled) {
                switch (array.length) {
                    case 1: {
                        acc = acc + isFirstLabel(idx, item.label)
                        break
                    }
                    default: {
                        acc = acc + beforeItem[item.value] + isFirstLabel(idx, item.label)
                        break
                    }
                }
            }
            
            return acc
        }, '')
    }
    
    const childrenClasses = useMemo(() => {

        const childrenClasses = findChildsByBaseClasses({
            relations, 
            classIds: [currentObject?.class_id],
            package_area: 'SUBJECT'
        })

        return childrenClasses.map(cls => getClassByIndex('id', cls))

    }, [vtemplate?.objectId])

    const filterOption = (input, option, ) => {
        return (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
    }
    const storeClassesList = storeClasses
        .reduce((acc, item) => {
            if (!item.is_abstract && item.package_id === PACKAGE_AREA.SUBJECT) {
                acc.push({
                    value: item?.id,
                    label: item?.name
                })
            }

            return acc
        }, [])
        .sort((a, b) => a?.label.localeCompare(b?.label))

    const linkedObjectsOptions = useMemo(() => {
        let localLinkedObjects = []

        if (stateForm?.linkedClass) {
            localLinkedObjects = getObjectByIndex('class_id', stateForm?.linkedClass)
        }

        return localLinkedObjects
    }, [stateForm?.linkedClass])

    const attrNamesList = useMemo(() => { 
        const currentClass = stateForm?.targetClass ?? currentObject?.class_id
        const attrs = getClassByIndex('id', currentClass)?.attributes ?? []

        const list = attrs.reduce((acc, attr) => {
            acc[0].options.push({
                value: attr?.id,
                label: attr?.name
            })

            return acc
        }, [{
            label: 'Атрибуты объекта',
            title: 'Атрибуты объекта',
            options: []
        }])

        list[0].options.sort((a, b) => a.label.localeCompare(b.label))
        list?.unshift({
            label: 'Свойства объекта',
            title: 'Свойства объекта',
            options: [
                {
                    value: 'id',
                    label: 'ID объекта',
                },
                {
                    value: 'name',
                    label: 'Название'
                },
                {
                    value: 'codename',
                    label: 'Код'
                },
            ]
        })
        
        return list
    }, [
        vtemplate?.objectId
    ])

    return (
        <Form
            form={form}
            layout="vertical"
            style={{ maxWidth: '100%', padding: '0px 20px' }}
            initialValues={initialValuesForm}
            onValuesChange={onValuesChange}
        >
            <Row style={{ width: '100%' }} gutter={24}>
                <Col span={5}>
                    <Card
                        size="small"
                        key="noAttributeTitle"
                        title="Надпись при отсутствии данных"
                        bordered={false}
                        style={{ boxShadow: 'none' }}
                    >
                        <Form.Item 
                            name="noAttributeTitle"
                        >
                            <Input
                                type="text"
                            />
                        </Form.Item>
                    </Card>
                </Col>
            </Row>
            <Row style={{ width: '100%' }} gutter={24}>
                <Col span={7}>
                    <Card
                        size="small"
                        key="targetClass"
                        title="Классы дочерних объектов"
                        bordered={false}
                        style={{ boxShadow: 'none' }}
                    >
                        <Form.Item 
                            name="targetClass"
                        >
                            <Select
                                options={childrenClasses.map((item) => ({ 
                                    value: item.id, 
                                    label: item.name 
                                }))}
                                placeholder="Выбран объект макета"
                                // mode="multiple"
                                maxTagCount="responsive"
                            />
                        </Form.Item>
                    </Card>
                </Col>
                <Col style={{ padding: 0 }}>
                    <Divider style={{ margin: 0, height: '100%' }} type="vertical" />
                </Col>
                <Col span={7}>
                    <Card
                        size="small"
                        key="linkedClass"
                        title="Класс связанных объектов"
                        bordered={false}
                        style={{ boxShadow: 'none' }}
                    >
                        <Form.Item 
                            name="linkedClass"
                        >
                            <Select
                                placeholder="Выберите класс объекта"
                                options={storeClassesList}
                                allowClear
                                autoClearSearchValue={true}
                                showSearch
                                filterOption={filterOption}
                            />
                        </Form.Item>
                    </Card>
                </Col>
                {stateForm.linkedClass && (
                    <>
                        <Col style={{ padding: 0 }}>
                            <Divider style={{ margin: 0, height: '100%' }} type="vertical" />
                        </Col>
                        <Col span={7}>
                            <Card
                                size="small"
                                key="linkedClassObjects"
                                title="Связанный объект"
                                bordered={false}
                                style={{ boxShadow: 'none' }}
                            >
                                <Form.Item 
                                    name="linkedClassObjects"
                                >
                                    <Select
                                        placeholder="Выберите объекты"
                                        options={linkedObjectsOptions?.map((item) => {
                                            return {
                                                value: item?.id,
                                                label: item?.name,
                                            }
                                        })}
                                        allowClear
                                        showSearch
                                        autoClearSearchValue={false}
                                        filterOption={filterOption}
                                        mode="multiple"
                                    />
                                </Form.Item>
                            </Card>
                        </Col>
                    </>
                )}
            </Row>
            <Col style={{ padding: 0 }}>
                <Divider style={{ margin: 0, height: '100%' }} type="horizontal" />
            </Col>
            <Row style={{ width: '100%' }} gutter={24}>
                <Col span={4}>  
                    <Card
                        size="small"
                        key="objectAttribute"
                        title="Атрибут объекта"
                        bordered={false}
                        style={{ boxShadow: 'none' }}
                    >
                        <Form.Item 
                            name="objectAttribute"
                        >
                            <Select
                                options={attributesList}
                                placeholder="Выберите атрибут объекта"
                            />
                        </Form.Item>
                    </Card> 
                </Col>           
                <Col style={{ padding: 0 }}>
                    <Divider style={{ margin: 0, height: '100%' }} type="vertical" />
                </Col>
                <Col span={4}>  
                    <Card
                        size="small"
                        key="aggregation"
                        title="Агрегация"
                        bordered={false}
                        style={{ boxShadow: 'none' }}
                    >
                        <Form.Item 
                            name="aggregation"
                        >
                            <Select
                                options={optionsAggregations}
                                placeholder="Выберите значение агрегации"
                                autoClearSearchValue={false}
                            />
                        </Form.Item>
                    </Card>
                </Col> 
                <Col style={{ padding: 0 }}>
                    <Divider style={{ margin: 0, height: '100%' }} type="vertical" />
                </Col>
                <Col span={5}>
                    <Form.Item 
                        name="enabled" 
                        valuePropName="checked"
                    >
                        <Checkbox>
                            Отображение значения
                        </Checkbox>
                    </Form.Item>
                    <Form.Item 
                        name="attrName" 
                        valuePropName="checked"
                    >
                        <Checkbox>
                            Название измерения
                        </Checkbox>
                    </Form.Item>
                    <Form.Item 
                        name="currentName" 
                    >
                        <Select 
                            placeholder="Выберите название"
                            options={attrNamesList}
                            allowClear
                            showSearch
                            autoClearSearchValue={false}
                            filterOption={filterOption}
                            maxTagCount="responsive"
                        />
                    </Form.Item>
                    <Form.Item 
                        name="valNextLine" 
                        valuePropName="checked"
                    >
                        <Checkbox>
                             Перенести значение на новую строку
                        </Checkbox>
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item 
                        name="maxWidth" 
                        valuePropName="checked"
                    >
                        <Checkbox>
                            Отображение на всю ширину
                        </Checkbox>
                    </Form.Item>
                    <Form.Item 
                        name="attrValue" 
                        valuePropName="checked" 
                    >
                        <Checkbox>
                            Результат измерения
                        </Checkbox>
                    </Form.Item>
                </Col>
                <Col span={4}>
                    <Form.Item 
                        name="stateText" 
                        valuePropName="checked" 
                    >
                        <Checkbox>
                            Текст статуса
                        </Checkbox>
                    </Form.Item>
                    <Form.Item 
                        name="attrValueUnit" 
                        valuePropName="checked"
                    >
                        <Checkbox>
                            Единицы измерения
                        </Checkbox>
                    </Form.Item>
                </Col>
            </Row>    
            <Row>{getExampleString()}</Row>
        </Form>

    )
}

export default WidgetObjectOAttrStateWithAggregationForm
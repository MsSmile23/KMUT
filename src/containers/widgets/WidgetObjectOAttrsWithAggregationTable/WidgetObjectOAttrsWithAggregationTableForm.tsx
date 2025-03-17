import { IObjectOAttrsWithAggregationTableProps } from '@containers/object-attributes/ObjectOAttrsWithAggregationTable/ObjectOAttrsWithAggregationTable'
import { selectObjectByIndex, selectObjects, useObjectsStore } from '@shared/stores/objects'
import { IObject } from '@shared/types/objects'
import { RangePickerWithPresets, Select } from '@shared/ui/forms'
import { Form } from 'antd'
import { useForm } from 'antd/es/form/Form'
import dayjs, { Dayjs } from 'dayjs'
import { FC, useEffect, useMemo, useState } from 'react'
import { TWidgetFormSettings } from '../widget-types'
import { selectClassByIndex, useClassesStore } from '@shared/stores/classes'
import { findChildsByBaseClasses } from '@shared/utils/classes'
import { selectRelations, useRelationsStore } from '@shared/stores/relations'
import { useGetObjects } from '@shared/hooks/useGetObjects'

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

const optionsViewType = [
    {
        label: 'Таблица',
        value: 'table'
    }
]

const linkedMetricsModeList = [
    {
        label: 'Объект и дочерние объекты',
        value: 'OBJECT_AND_CHILD'
    },
    {
        label: 'Дочерние объекты',
        value: 'CHILD'
    },
]

export interface WidgetObjectOAttrsWithAggregationTableForm extends 
    Omit<IObjectOAttrsWithAggregationTableProps, 'period'> {
        // [timestamp, timestamp]
        period: [number, number]
}
export interface WidgetObjectOAttrsWithAggregationTableFormState extends IObjectOAttrsWithAggregationTableProps {}

const WidgetObjectOAttrsWithAggregationTableForm: FC<TWidgetFormSettings<
WidgetObjectOAttrsWithAggregationTableForm
>> = (props) => {

    const { settings, onChangeForm } = props
    const { vtemplate, widget } = settings
    const getObjectByIndex = useObjectsStore(selectObjectByIndex)
    const getClassByIndex = useClassesStore(selectClassByIndex)
    const relations = useRelationsStore(selectRelations)
    const initialValuesForm: WidgetObjectOAttrsWithAggregationTableFormState = {
        objectId: vtemplate?.objectId ?? {} as IObject['id'],
        linkedMetrics: {
            mode: widget?.linkedMetrics?.mode,
            targetClassIds: widget?.linkedMetrics?.targetClassIds ?? [],
            attrIds: widget?.linkedMetrics?.attrIds ?? []
        },
        aggregations: widget?.aggregations ?? ['current'],
        viewType: widget?.viewType ?? 'table',
        attributes: widget?.attributes ?? [],
        period: widget?.period?.map(p => {
            return p 
                ? dayjs(p * 1000)
                : null
        }) as [Dayjs, Dayjs] ?? [null, null]
        /* [
            dayjs().subtract(48 * 60 * 60, 'second'), 
            dayjs()
        ], */
    }

    const [form] = useForm()

    // const objects = useObjectsStore(selectObjects)
    const objects = useGetObjects()
    const currentObject = getObjectByIndex('id', vtemplate?.objectId)
    const currentClass = getClassByIndex('id', currentObject?.class_id)
    
    const objectList = objects?.map((item) => {
        return {
            value: item?.id,
            label: item?.name
        }
    })

    const [stateForm, setStateForm] = useState<WidgetObjectOAttrsWithAggregationTableFormState>(initialValuesForm) 
    
    const childrenClasses = useMemo(() => {

        const childrenClasses = findChildsByBaseClasses({
            relations, 
            classIds: [currentObject?.class_id],
            package_area: 'SUBJECT'
        })

        return childrenClasses.map(cls => getClassByIndex('id', cls))

    }, [vtemplate?.objectId])

    const targetClasses = useMemo(() => {
        return stateForm?.linkedMetrics?.targetClassIds
    }, [
        stateForm?.linkedMetrics?.targetClassIds
    ])
    // const attributesList = attributes?.map((attr) => {
    const attributesList = useMemo(() => {
        return stateForm?.linkedMetrics?.targetClassIds?.length > 0
            ? childrenClasses.reduce((acc, chdCls) => {
                chdCls.attributes?.forEach((attr) => {
                    if (stateForm?.linkedMetrics?.targetClassIds?.includes(chdCls?.id)) {
                        const attrIdx = acc.findIndex(it => it.value === attr?.id)
        
                        if (attrIdx < 0) {
                            acc.push({
                                value: attr?.id,
                                label: attr?.name
                            })
                        }
                    }
                })
                
                return acc
            }, [])
            : currentClass.attributes?.map((attr) => {
                return {
                    value: attr?.id,
                    label: attr?.name
                }
            })
    }, [
        targetClasses
    ])

    useEffect(() => {
        onChangeForm<IObjectOAttrsWithAggregationTableProps>(stateForm)
    }, [stateForm])

    const onValuesChange = (_, onChangeForm) => {
        if ('objectId' in onChangeForm) {
            setStateForm((prev) => {
                return {
                    ...prev,
                    ['objectId']: getObjectByIndex('id', onChangeForm['objectId'])?.id
                }
            })
        }

        if ('linkedMetrics' in onChangeForm) {
            if ('mode' in onChangeForm['linkedMetrics']) {
                setStateForm((prev) => {
                    return {
                        ...prev,
                        linkedMetrics: {
                            ...prev.linkedMetrics,
                            mode: onChangeForm['linkedMetrics']['mode']
                        }
                    }
                })
            }

            if ('targetClassIds' in onChangeForm['linkedMetrics']) {
                setStateForm((prev) => {
                    return {
                        ...prev,
                        linkedMetrics: {
                            ...prev.linkedMetrics,
                            targetClassIds: onChangeForm['linkedMetrics']['targetClassIds']
                        }
                    }
                })
            }

            if ('attributeIds' in onChangeForm['linkedMetrics']) {
                setStateForm((prev) => {
                    return {
                        ...prev,
                        linkedMetrics: {
                            ...prev.linkedMetrics,
                            attributeIds: onChangeForm['linkedMetrics']['attributeIds']
                        }
                    }
                })
            }
        }

        if ('attributes' in onChangeForm) {
            setStateForm((prev) => {
                return {
                    ...prev,
                    ['attributes']: onChangeForm['attributes']
                }
            })
        }

        if ('aggregations' in onChangeForm) {
            setStateForm((prev) => {
                return {
                    ...prev,
                    ['aggregations']: onChangeForm['aggregations']
                }
            })
        }

        if ('viewType' in onChangeForm) {
            setStateForm((prev) => {
                return {
                    ...prev,
                    ['viewType']: onChangeForm['viewType']
                }
            })
        }
        
        if ('period' in onChangeForm) {
            setStateForm((prev) => {
                return {
                    ...prev,
                    ['period']: onChangeForm['period']?.map(p => p ? p?.unix() : null)
                }
            })
        }
    }

    const maxWidth = '400px'

    return (
        <Form
            form={form}
            layout="vertical"
            style={{ maxWidth: '100%' }}
            initialValues={initialValuesForm}
            onValuesChange={onValuesChange}
        >
            <div
                style={{
                    display: 'flex',
                    gap: 24
                }}
            >
                <Form.Item 
                    name="objectId"
                    label="Объект для отображения"
                    // style={{ maxWidth }}
                    style={{ width: maxWidth, marginBottom: 0 }}
                >
                    <Select
                        options={objectList}
                        placeholder="Выберите объект"
                    />
                </Form.Item>
                <Form.Item 
                    // style={{ width: maxWidth, marginBottom: 0 }}
                    style={{ maxWidth }}
                    name="attributes"
                    label="Атрибуты объекта для отображения"
                >
                    <Select
                        options={attributesList}
                        placeholder="Выберите атрибуты"
                        mode="multiple"
                        autoClearSearchValue={false}
                    />
                </Form.Item>
            </div>
            <Form.Item
                label=""
            >
                <Form.List name="linkedMetrics">
                    {() => (
                        <div
                            style={{
                                display: 'flex',
                                gap: 24
                            }}
                        >
                            <Form.Item 
                                name="mode"
                                label="Режим отображения метрик"
                                style={{ width: maxWidth, marginBottom: 0 }}
                            >
                                <Select
                                    options={linkedMetricsModeList}
                                    placeholder="Выберите режим отображения метрик"
                                />
                            </Form.Item>
                            {stateForm.linkedMetrics.mode && (
                                <>
                                    <Form.Item 
                                        name="targetClassIds"
                                        label="Классы дочерних объектов выбранного объекта"
                                        style={{ maxWidth, marginBottom: 0 }}
                                    >
                                        <Select
                                            options={childrenClasses.map((item) => ({ 
                                                value: item.id, 
                                                label: item.name 
                                            }))}
                                            placeholder="Выберите классы дочерних объектов"
                                            mode="multiple"
                                        />
                                    </Form.Item>
                                    <Form.Item 
                                        name="attributeIds"
                                        label="Атрибуты дочерних объектов"
                                        style={{ maxWidth, marginBottom: 0 }}
                                    >
                                        <Select
                                            options={attributesList}
                                            placeholder="Выберите атрибуты"
                                        />
                                    </Form.Item>   
                                </>
                            )}
                        </div>
                    )}
                </Form.List>
                
            </Form.Item>
            <Form.Item 
                style={{ maxWidth }}
                name="aggregations"
                label="Значения агрегации метрик"
            >
                <Select
                    options={optionsAggregations}
                    mode="multiple"
                    placeholder="Выберите значение агрегации"
                    autoClearSearchValue={false}
                />
            </Form.Item>
            <Form.Item 
                style={{ maxWidth }}
                name="viewType"
                label="Тип представления"
            >
                <Select
                    allowClear={false}
                    options={optionsViewType}
                    placeholder="Выберите тип представления"
                />
            </Form.Item>
            <Form.Item 
                name="period" 
                style={{ marginBottom: 0 }}
            >
                <RangePickerWithPresets 
                    withPresets
                    initial={[null, null]}
                    style={{ 
                        picker: { maxWidth },
                        preset: { width: 250 }
                    }}
                />
            </Form.Item>
        </Form>
    )
}

export default WidgetObjectOAttrsWithAggregationTableForm
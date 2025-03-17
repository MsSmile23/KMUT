/* eslint-disable react/jsx-max-depth */
import { FC, useEffect, useState } from 'react'
import { IGetFormState, TWidgetSettings } from '../widget-types'
import { IWidgetMultipleChartFormProps } from './WidgetMultipleChartForm'
import { ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
import { Button, Form } from 'antd'
import { NamePath } from 'rc-field-form/es/interface'
import {
    DndContext, closestCenter, PointerSensor, useSensor,
    useSensors, DragEndEvent, KeyboardSensor
} from '@dnd-kit/core'
import {
    arrayMove, SortableContext, sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { SortableAxisPropsItem } from './SortableAxisPropsItem'
import { debounce } from 'lodash';
import { jsonParseAsObject } from '@shared/utils/common'
// import { IObjectAttribute } from '@shared/types/objects'
import { v4 as uuidv4 } from 'uuid';
import { IAttribute } from '@shared/types/attributes'
import { ECSelect, Input } from '@shared/ui/forms'
import { OpUnitType } from 'dayjs'

export interface IMultipleChartFormPart {
    axisID: string
    axisName: string
    unit: string
    attributeIds: number[]
    minValue: number
    // minValue: number | string
    maxValue: number
    // maxValue: number | string
}
export interface IOptionsList {
    value: number
    label: string
}
export interface IGroupedOptionsList {
    label: string
    title: number
    options: IOptionsList[]
}
export interface IOptionsListSettings {
    // attributes: IGroupedOptionsList[]
    attributes: IOptionsList[]
    units: IOptionsList[]
    minValues: IOptionsList[]
    maxValues: IOptionsList[]
}
export interface IHeaderOptionItem {
    label: string
    styles: React.CSSProperties
}

export type IHeaderOptions = Record<
    Exclude<
        keyof IMultipleChartFormPart,
        'axisID' | 'minValue' | 'maxValue'
    >, IHeaderOptionItem>

interface IDefaultOption {
    value: OpUnitType | string
    label: string
}

const headerOptions: IHeaderOptions = {
    axisName: {
        label: 'Название оси',
        styles: {
            marginBottom: 0,
            flex: 1,
        }
    },
    attributeIds: {
        label: 'Атрибуты',
        styles: {
            marginBottom: 0,
            flex: 1,
        }
    },
    unit: {
        label: 'Единица измерения',
        styles: {
            marginBottom: 0,
            width: '100px',
        }
    },
    // minValue: {
    //     label: 'Минимальное значение',
    //     styles: {
    //         marginBottom: 0, 
    //         width: '100px',
    //     }
    // },
    // maxValue: {
    //     label: 'Максимальное значение',
    //     styles: {
    //         marginBottom: 0, 
    //         width: '100px',
    //     }
    // },
}

const defaultPeriodOptions: IDefaultOption[] = [
    {
        value: 'h',
        label: '1 час'
    },
    {
        value: '3h',
        label: '3 часа'
    },
    {
        value: '6h',
        label: '6 часов'
    },
    {
        value: '12h',
        label: '12 часов'
    },
    {
        value: 'day',
        label: '1 день'
    },
    {
        value: '2day',
        label: '2 дня'
    },
    {
        value: '3day',
        label: '3 дня'
    },
    {
        value: 'week',
        label: '1 неделя'
    },
    {
        value: '2weeks',
        label: '2 недели'
    },
]

export interface IMultipleChartForm extends TWidgetSettings<IWidgetMultipleChartFormProps['multipleHistoryForm']> {
    getFormState: IGetFormState<
        IWidgetMultipleChartFormProps[keyof IWidgetMultipleChartFormProps],
        keyof IWidgetMultipleChartFormProps
    >
    attrsFromBaseForm: IAttribute[]
    // attrsFromBaseForm: IObjectAttribute[]
    baseMultipleHistoryForm: IWidgetMultipleChartFormProps['baseMultipleHistoryForm']
}

export const MultipleChartForm: FC<IMultipleChartForm> = ({ 
    settings, getFormState, attrsFromBaseForm, baseMultipleHistoryForm 
}) => {
    // const { widget } = settings

    const initialValuesFormItem: IMultipleChartFormPart = {
        axisID: uuidv4(),
        axisName: undefined,
        unit: undefined,
        attributeIds: [],
        minValue: undefined,
        maxValue: undefined,
    }

    const initialValuesForm: IMultipleChartFormPart[] = settings?.widget ?? [initialValuesFormItem]
    const initialCommonValuesForm: IMultipleChartForm['baseMultipleHistoryForm'] =  {
        limit: baseMultipleHistoryForm?.limit ?? undefined,
        legendWidth: baseMultipleHistoryForm?.legendWidth ?? 200,
        defaultPeriod: baseMultipleHistoryForm?.defaultPeriod,
    }
    const [baseForm] = Form.useForm()
    const [multipleForm] = Form.useForm()
    const axisProps = Form.useWatch('axisProps', multipleForm) as IMultipleChartFormPart[]

    // console.log('axisProps', axisProps)
    // console.log('settings?.widget', settings?.widget)
    // console.log('form', form.getFieldsValue())
    // console.log('attrsFromBaseForm', attrsFromBaseForm)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    )

    const handleDragEnd = (event: DragEndEvent): void => {
        const { active, over } = event

        if (active?.id !== over?.id) {
            const oldIndex = axisProps.findIndex((axis) => axis?.axisID === active?.id)
            const newIndex = axisProps.findIndex((axis) => axis?.axisID === over?.id)
            const result = arrayMove(axisProps, oldIndex, newIndex) as IMultipleChartFormPart[]

            multipleForm.setFieldValue('axisProps', result)
            getFormState(result, 'multipleHistoryForm')
        }
    }
    const [optionsList, setOptionsList] = useState<IOptionsListSettings[]>([])

    useEffect(() => {
        getFormState(multipleForm.getFieldValue('axisProps'), 'multipleHistoryForm')
    }, [])

    useEffect(() => {
        if (axisProps) {
            // console.log('attrsFromBaseForm', attrsFromBaseForm)
            // console.log('axisProps', axisProps)

            const chosenAttrs = axisProps.reduce((acc, axis) => {
                return [...acc, ...axis.attributeIds]
            }, [])
            const freeAttrs = attrsFromBaseForm.filter((attribute) => !chosenAttrs.includes(attribute.id))
            // const freeAttrs = attrsFromBaseForm.filter((oa) => !chosenAttrs.includes(oa.attribute.id))
            // if (optionsListSettings?.namesWithObject) {
            //     list?.unshift({
            //         label: 'Свойства объекта',
            //         title: 'Свойства объекта',
            //         options: [
            //             {
            //                 value: 'id',
            //                 label: 'ID объекта',
            //             },
            //             {
            //                 value: 'name',
            //                 label: 'Название'
            //             },
            //             {
            //                 value: 'codename',
            //                 label: 'Код'
            //             },
            //         ]
            //     })
            // }
            const newList: IOptionsListSettings[] = axisProps.map((axis) => {
                const currentAxisOptionsList = attrsFromBaseForm.reduce((acc, attribute) => {
                    if (axis.attributeIds.includes(attribute.id) ||
                        freeAttrs.findIndex(freeAttr => freeAttr.id == attribute.id) >= 0) {
                        const params = attribute?.view_type?.params &&
                            jsonParseAsObject(attribute.view_type.params)
                        const valueConverter = params?.value_converter
                        const listItem = {
                            attributes: attribute.name,
                            units: attribute.unit,
                            minValues: valueConverter
                                ? valueConverter.find(value => value?.source == params?.min)?.converted
                                : params?.min,
                            maxValues: valueConverter
                                ? valueConverter.find(value => value?.source == params?.max)?.converted
                                : params?.max,
                        }

                        Object.keys(acc).forEach((key) => {
                            if (listItem[key]) {
                                // const currentKey = listItem[key]
                                const currentKey = key === 'attributes'
                                    ? attribute.id
                                    : listItem[key]
                                // : `${key}-${listItem[key]}`
                                // : `${key}-${oa.attribute.id}`

                                const idx = acc[key].findIndex(item => item.value === currentKey)

                                if (idx < 0) {
                                    const optionObject = {
                                        value: currentKey,
                                        label: listItem[key]
                                    }

                                    if (key === 'units') {
                                        if (axis.attributeIds.includes(attribute.id)) {
                                            acc[key].push(optionObject)
                                        }
                                    } else {
                                        acc[key].push(optionObject)
                                    }
                                }
                            }
                        })
                        /* if (axis.attributeIds.includes(oa.attribute.id) || 
                        freeAttrs.findIndex(freeOA => freeOA.attribute.id == oa.attribute.id) >= 0) {
                        const params = oa.attribute?.view_type?.params && 
                            jsonParseAsObject(oa.attribute.view_type.params)
                        const valueConverter = params?.value_converter
                        const listItem = {
                            attributes: oa.attribute.name,
                            units: oa.attribute.unit,
                            minValues: valueConverter 
                                ? valueConverter.find(value => value?.source == params?.min)?.converted
                                : params?.min,
                            maxValues: valueConverter 
                                ? valueConverter.find(value => value?.source == params?.max)?.converted
                                : params?.max,
                        }
                        
                        Object.keys(acc).forEach((key) => {
                            if (listItem[key]) {
                                // const currentKey = listItem[key]
                                const currentKey = key === 'attributes' 
                                    ? oa.attribute.id  
                                    : listItem[key]
                                    // : `${key}-${listItem[key]}`
                                    // : `${key}-${oa.attribute.id}`

                                const idx = acc[key].findIndex(item => item.value === currentKey)
                                
                                if (idx < 0) {
                                    const optionObject = {
                                        value: currentKey,
                                        label: listItem[key]
                                    }

                                    if (key === 'units') {
                                        if (axis.attributeIds.includes(oa.attribute.id)) {
                                            acc[key].push(optionObject)
                                        }
                                    } else {
                                        acc[key].push(optionObject)
                                    }
                                }
                            }
                        }) */

                        /* const valueIdx = acc.findIndex(item => item.label == value[type])
    
                        if (currentItem.attributeIds.length > 0) {
                            if (currentItem.attributeIds.includes(attr.id)) {
                                if (value[type] && valueIdx < 0) {
                                    acc.push({
                                        value: value[type],
                                        label: value[type]
                                    })
                                }
                            }
                        } else {
                            if (value[type] && valueIdx < 0) {
                                acc.push({
                                    value: value[type],
                                    label: value[type]
                                })
                            }
                        } */
                    }

                    return acc
                }, {
                    attributes: [],
                    units: [],
                    minValues: [],
                    maxValues: [],
                } as IOptionsListSettings)

                return currentAxisOptionsList
            })

            const list = newList.map(list => {
                const newAttrList = list.attributes.reduce((acc, attrList) => {
                    const attr = attrsFromBaseForm.find(a => a.id == attrList.value)

                    const groupIdx = acc.findIndex(item => item.title === attr?.view_type_id)
                    // const groupIdx = acc.findIndex(item => item.title === (attr?.view_type
                    //     ? attr?.view_type_id
                    //     : 0)
                    // )

                    // console.log('attr', attr)

                    if (groupIdx < 0) {
                        const group = {
                            label: attr?.view_type
                                ? attr?.view_type.name
                                : 'Без вьютайпа',
                            title: attr?.view_type
                                ? attr?.view_type_id
                                : 0,
                            options: [{
                                label: attr?.name,
                                value: attr?.id
                            }]
                        }

                        acc.push(group)

                    } else {
                        const optionsIdx = acc[groupIdx].options.findIndex(item => item.value == attr?.id)

                        if (optionsIdx < 0) {
                            acc[groupIdx].options.push({
                                label: attr?.name,
                                value: attr?.id
                            })
                        }
                    }

                    return acc
                }, [] as {
                    label: string
                    title: number
                    options: {
                        value: number
                        label: string
                    }[]
                }[])

                return {
                    ...list,
                    attributes: newAttrList
                }
            })

            const sortedList = list.map(item => {
                return {
                    ...item,
                    attributes: item.attributes
                        .map(attrList => {
                            return {
                                ...attrList,
                                options: attrList.options.sort((a, b) => a.label.localeCompare(b.label))
                            }
                        })
                        .sort((a, b) => a.title - b.title)
                }
            })
            // console.log('sortedList', sortedList)

            // console.log('newList', newList)
            setOptionsList(sortedList)
            // setOptionsList(newList)
        }
    }, [axisProps, attrsFromBaseForm])
    // console.log('axisProps', axisProps)
    // console.log('attrsFromBaseForm', attrsFromBaseForm)
    // console.log('optionsList', optionsList)

    return (
        <>
            {/* <div>Настройки отображения измерений на осях мультиграфика</div> */}
            <div
                style={{
                    padding: 10,
                    border: '1px solid #d9d9d9',
                }}
            >
                <div><b>Общие настройки мультиграфика</b></div>
                <div
                    style={{
                        padding: 10,
                        border: '1px solid #d9d9d9',
                    }}
                >
                    <Form
                        form={baseForm}
                        name="baseMultipleHistoryForm"
                        layout="vertical"
                        initialValues={initialCommonValuesForm}
                        onValuesChange={(_value, values,) => {
                            // console.log('_value', _value)
                            getFormState(values, 'baseMultipleHistoryForm')
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                gap: 10
                            }}
                        >
                            <Form.Item
                                name="limit"
                                label="Лимит запрашиваемых точек"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom: 0
                                }}
                                // rules={[{ min: 0, max: 2000 }]}
                            >
                                <Input
                                    placeholder="Без лимита"
                                    type="number"
                                    allowClear={true}
                                />
                            </Form.Item>
                            <Form.Item
                                name="defaultPeriod"
                                label="Отображаемый период"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom: 0,
                                }}
                            >
                                <ECSelect 
                                    options={defaultPeriodOptions}
                                    allowClear
                                />
                            </Form.Item>
                            <Form.Item
                                name="legendWidth"
                                label="Ширина легенды"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom: 0
                                }}
                            >
                                <Input
                                    type="number"
                                    allowClear={true}
                                />
                            </Form.Item>
                        </div>
                    </Form>
                </div>
                <div><b>Настройки отображения измерений на осях мультиграфика</b></div>
                <div
                    style={{
                        display: 'flex',
                        // width: '100%',
                        padding: `0px 
                            ${axisProps?.length > 1 ? '38px' : '10px'} 
                            0px 
                            10px`,
                        gap: 10,
                        lineHeight: '22px',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 24,
                        }}
                    >
                        <ECIconView
                            icon="DragOutlined"
                            style={{ fontSize: 20 }}
                        />
                    </div>
                    {Object.entries(headerOptions).map(([key, option]) => {
                        return (
                            <div
                                key={key}
                                style={{
                                    ...option.styles,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'start',
                                }}
                            >
                                {option.label}
                            </div>
                        )
                    })}
                </div>
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        boxSizing: 'border-box',
                    }}
                >
                    <Form
                        form={multipleForm}
                        name="multipleHistoryForm"
                        layout="vertical"
                        initialValues={{ axisProps: initialValuesForm }}
                        onValuesChange={(_value, values,) => {
                            const isInput = _value?.axisProps.findIndex((axis) => axis?.axisName) > -1

                            // console.log('isInput', isInput) 

                            if (isInput) {
                                debounce(() => {
                                    // console.log('debounced', _value) 
                                    getFormState(values?.axisProps, 'multipleHistoryForm')
                                }, 300)

                            }
                            // console.log('_value', _value)
                            getFormState(values?.axisProps, 'multipleHistoryForm')
                        }}
                    >
                        <Form.List
                            name="axisProps"
                        >
                            {(fields, { add, remove }, { errors }) => (
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '12px',
                                    }}
                                >
                                    <DndContext
                                        sensors={sensors}
                                        collisionDetection={closestCenter}
                                        onDragEnd={handleDragEnd}
                                    >
                                        <SortableContext
                                            items={axisProps?.map((v) => v?.axisID) ?? []}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            {fields.map((field, index) => {
                                                const currentItem: IMultipleChartFormPart = multipleForm
                                                    .getFieldValue('axisProps' as NamePath)[index]

                                                return (
                                                    <SortableAxisPropsItem
                                                        key={currentItem?.axisID}
                                                        field={field}
                                                        index={index}
                                                        currentItem={currentItem}
                                                        // customClearFields={customClearFields}
                                                        length={fields.length}
                                                        remove={remove}
                                                        styles={{}}
                                                        headerOptions={headerOptions}
                                                        optionsListSettings={optionsList[index]}
                                                        isSingle={false}
                                                    />
                                                )
                                            })}
                                        </SortableContext>
                                    </DndContext>
                                    <Form.Item style={{ marginBottom: 0 }}>
                                        <Button
                                            onClick={() => add({
                                                axisID: uuidv4(),
                                                // axisID: getNewID(),
                                                // axisID: 'axis-' + axisProps?.length,
                                                axisName: '',
                                                unit: '',
                                                attributeIds: [],
                                                minValue: undefined,
                                                maxValue: undefined,
                                            })}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                background: 'while',
                                                color: 'black',
                                                // ...styles?.button,
                                            }}
                                        >
                                            <ECIconView icon="PlusCircleOutlined" />
                                        </Button>
                                        <Form.ErrorList errors={errors} />
                                    </Form.Item>
                                </div>
                            )}
                        </Form.List>
                    </Form>
                </div>
            </div>
        </>
    )
}
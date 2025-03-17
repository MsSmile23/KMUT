/* eslint-disable max-len */
import { FC, useEffect, useMemo, useState } from 'react'
import { Form, Switch } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { selectObjectByIndex, useObjectsStore } from '@shared/stores/objects'
import { ITargetObjectsAndOAttrsForm, ITargetObjectsAndOAttrsFormProps, TargetObjectsAndOAttrsForm } from './TargetObjectsAndOAttrsForm'
import { Input, Select } from '@shared/ui/forms'
import { ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
import { SortableList } from '@shared/ui/SortableList'
import { IGetFormState, TWidgetSettings } from '../widget-types'
import { selectClassByIndex, selectClasses, useClassesStore } from '@shared/stores/classes'
import { PACKAGE_AREA } from '@shared/config/entities/package'
interface IObjectLinkedSharesFormProps extends TWidgetSettings<IWidgetObjectOAttrsWithHistoryFormProps> {
    getFormState: IGetFormState<IWidgetObjectOAttrsWithHistoryFormProps, 'baseHistoryForm'>
}

export type IFormMnemo = 'own' | 'linked' | 'other'
export interface IDynamicFormPart {
    OASettings: ITargetObjectsAndOAttrsForm[]
    enabled: boolean
}
export interface IDraggableItem {
    id: string
    label: string
    mnemo: IFormMnemo
    formProps: ITargetObjectsAndOAttrsFormProps<IFormMnemo>
}
export interface IMiniChartProps {
    height?: number
    showLabel?: boolean
    showTitle?: boolean
    fontSize?: number
}

export interface IVerticalAndHorizontalHistogramProps {
    renderWithTransparentColumn?: boolean,
    customUnit?: string | false,
    step?: number,
    width?: number,
    height?: number,
    pointWidth?: number
}

export interface IScatterPlotProps {
    width?: number,
    height?: number,
}

export interface IRepresentationProps {
    default: any
    verticalHistogram: IVerticalAndHorizontalHistogramProps
    horizontalHistogram: any
    scatterPlot: IScatterPlotProps
    miniChart: IMiniChartProps
}
export type IDynamicFormParts = Record<IFormMnemo, IDynamicFormPart>
export interface IWidgetObjectOAttrsWithHistoryFormProps extends IDynamicFormParts {
    items: IDraggableItem[]
    countInARow?: number
    limit?: number
    historyDataType: 'history' | 'current'
    representationType: 'default' | 'verticalHistogram' | 'horizontalHistogram' | 'miniChart' | 'scatterPlot'
    representationProps?: Record<
        IWidgetObjectOAttrsWithHistoryFormProps['representationType'],
        IRepresentationProps[IWidgetObjectOAttrsWithHistoryFormProps['representationType']]
    >
    miniChartHeight?: number
    linkedObjectsClass?: number
    linkedObjects?: number[]
    skeletonItemCount?: number
    noAttributeTitle?: string
}
export type IDynamicFormPartsLabels = IFormMnemo[]
const chartsInRowSelectOptions = [
    {
        value: 1,
        label: 1
    },
    {
        value: 2,
        label: 2
    },
    {
        value: 3,
        label: 3
    },
    {
        value: 4,
        label: 4
    },
]

const representationOptions = [
    {
        label: 'По умолчанию',
        value: 'default',
    },
    {
        label: 'Вертикальная гистограмма "Диски"',
        value: 'verticalHistogram',
    },
    {
        label: 'Горизонтальная гистограмма "Прогресс бар"',
        value: 'horizontalHistogram',
    },
    {
        label: 'Мини-график',
        value: 'miniChart',
    },
    {
        label: 'График-точек',
        value: 'scatterPlot',
    }
]

export const ObjectOAttrsWithHistoryForm: FC<IObjectLinkedSharesFormProps> = ({
    settings, getFormState
}) => {
    const { widget, vtemplate, baseSettings } = settings
    const { countInARow, own, linked, other, items, historyDataType, limit, skeletonItemCount, noAttributeTitle,
        representationType, miniChartHeight, representationProps, linkedObjects, linkedObjectsClass } = widget ?? {}

    // console.log('baseWidget', widget)
    const [form] = useForm()

    const currentObjectId = vtemplate?.objectId

    const getObjectByIndex = useObjectsStore(selectObjectByIndex)
    const getClassByIndex = useClassesStore(selectClassByIndex)
    const storeClasses = useClassesStore(selectClasses)
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
  
    const object = getObjectByIndex('id', currentObjectId)
    const currentClass = getClassByIndex('id', object?.class_id)
    
    const initialTargetFormItem: ITargetObjectsAndOAttrsForm = {
        fieldId: 'field0',
        classId: null,
        targetClassIds: [],
        linkedClassIds: [],
        objectId: null,
        attributeIds: [],
        showAttrValue: null,
        forceShow: false
    }

    const initialItems: IDraggableItem[] = [
        {
            id: 'own-form',
            mnemo: 'own',
            label: 'Измерения текущего объекта',
            formProps: {
                // objectsWithAttrs: own?.OASettings ??
                objectsWithAttrs: own?.OASettings.map(settings => {
                    return {
                        ...settings,
                        objectId: currentObjectId,
                    }
                }) ?? 
                    [{ 
                        ...initialTargetFormItem,
                        fieldId: 'own0',
                        // attributeIds: [10138],
                        attributeIds: currentClass?.attributes.reduce((acc, attribute) => {
                            if (attribute.history_to_cache ||
                                attribute.history_to_db) {
                                
                                acc.push(attribute.id)
                            }
            
                            return acc
                            
                        }, []) ??
                        [],
                        objectId: currentObjectId,                
                    }],
                mnemo: 'own',                
                styles: {
                    button: {
                        cursor: 'pointer'
                    }
                },
                optionsListAll: {
                    namesWithObject: true
                },
                // object,
                objectId: currentObjectId,
                isSingle: true,
                showForm: ['attribute'],
            }
        },
        {
            id: 'linked-form',
            mnemo: 'linked',
            label: 'Измерения связанных объектов',
            formProps: {
                objectsWithAttrs: linked?.OASettings ?? 
                    [{
                        ...initialTargetFormItem,
                        fieldId: 'linked0',
                    }],
                mnemo: 'linked',
                styles: {
                    button: {
                        cursor: 'pointer'
                    }
                },
                optionsListAll: {
                    namesWithObject: true
                },
                showForm: ['targetClassIds', 'linkedClassIds', 'object', 'attribute'],
                // object,
                objectId: currentObjectId,
            }
        },
        {
            id: 'other-form',
            mnemo: 'other',
            label: 'Измерения набора объектов',
            formProps: {
                objectsWithAttrs: other?.OASettings ??
                    [{ 
                        ...initialTargetFormItem,
                        fieldId: 'other0',
                    }],
                mnemo: 'other',
                styles: {
                    button: {
                        cursor: 'pointer'
                    }
                },
                optionsListAll: {
                    namesWithObject: true
                },
                showForm: ['class', 'object', 'attribute'],
            }
        }
    ]
    const initialRepresentationProps: IWidgetObjectOAttrsWithHistoryFormProps['representationProps'] = {
        default: '',
        horizontalHistogram: '',
        verticalHistogram: '',
        miniChart: {
            height: 200,
            showLabel: true,
            showTitle: true,
            fontSize: 60,
        },
        scatterPlot: {
            height: 300,
            width: null
        }
    }
    const initialValuesForm: IWidgetObjectOAttrsWithHistoryFormProps = {
        historyDataType: historyDataType ?? 'history',
        // representationType: representationType ?? 'miniChart',
        representationType: representationType ?? 'default',
        items: items ?? initialItems,
        // countInARow: countInARow ?? 3,
        countInARow: countInARow ?? 2,
        limit: limit,
        representationProps: representationProps ?? initialRepresentationProps,
        miniChartHeight: miniChartHeight,
        linkedObjectsClass: linkedObjectsClass,
        linkedObjects: linkedObjects ?? [],
        skeletonItemCount: skeletonItemCount ?? 4,
        noAttributeTitle: noAttributeTitle,
        own: {
            // Если приходит сверху объект, то он включен по умолчанию
            enabled: own?.enabled ?? Boolean(vtemplate?.objectId),
            // Атрибуты истории этого объекта, если имеются
            OASettings: own?.OASettings ?? initialItems.find(i => i.mnemo === 'own')
                ?.formProps?.objectsWithAttrs,
        },
        linked: {
            enabled: linked?.enabled ?? false,
            OASettings: linked?.OASettings ?? initialItems.find(i => i.mnemo === 'linked')
                ?.formProps?.objectsWithAttrs,
        },
        other: {
            enabled: other?.enabled ?? false,
            OASettings: other?.OASettings ?? initialItems.find(i => i.mnemo === 'other')
                ?.formProps?.objectsWithAttrs,
        },
    }

    const [stateForm, setStateForm] = useState<IWidgetObjectOAttrsWithHistoryFormProps>(initialValuesForm) 
    const [ collapsed, setCollapsed ] = useState<Record<IFormMnemo, boolean>>({
        // Если приходит сверху объект, то он включен по умолчанию
        own: !initialValuesForm?.own?.enabled,
        linked: !initialValuesForm?.linked?.enabled ?? true,
        other: !initialValuesForm?.other?.enabled ?? true
    })

    useEffect(() => {
        getFormState(stateForm, 'baseHistoryForm')
    }, [stateForm])

    const onValuesChange = (value, onChangeForm) => {
        const key = Object.keys(value)[0]
  
        setStateForm((prev) => {
            return {
                ...prev,
                [key]: onChangeForm[key]
            }
        })
    }

    // console.log('form', form.getFieldsValue())
    // console.log('stateForm', stateForm)

    const handleSwitch = (
        checked: boolean, 
        key: IFormMnemo
    ) => {
        // Если блок скрыт и включается свитч, то блок раскрывается
        if (checked && collapsed[key]) {
            setCollapsed((prev) => {
                return {
                    ...prev,
                    [key]: false
                }
            })
        }
        setStateForm((prev) => {
            return {
                ...prev,
                [key]: {
                    ...prev[key],
                    enabled: checked
                }
            }
        })    
    }
    const handleCollapse = (key: IFormMnemo) => {
        setCollapsed((prev) => {
            return {
                ...prev,
                [key]: !prev[key]
            }
        })
    }

    const getFormValues = (value: any, mnemo: IFormMnemo) => {
        setStateForm((prev) => {
            return {
                ...prev,
                [mnemo]: {
                    ...prev[mnemo],
                    OASettings: value?.objectsWithAttrs,
                }
            }
        })
    }

    const sortForms = (items: IDraggableItem[]) => {
        setStateForm(prev => {
            return { 
                ...prev, 
                items 
            }
        })
    }

    const currenRepresentation = representationOptions
        .find(option => option.value === stateForm.representationType)?.label
    
    const linkedObjectsOptionsList = useMemo(() => {
        return getObjectByIndex('class_id', stateForm?.linkedObjectsClass)
            .map((item) => {
                return {
                    value: item?.id,
                    label: item?.name,
                }
            })
            .sort((a, b) => a.label.localeCompare(b.label))
    }, [stateForm?.linkedObjectsClass])
    
    const filterOption = (input, option, ) => {
        return (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
    }

    return (
        <>
            <Form
                form={form}
                layout="vertical"
                style={{ maxWidth: '100%' }}
                initialValues={initialValuesForm}
                onValuesChange={onValuesChange}
            >
                {/* Общие настройки */}
                <div><b>Общие настройки</b></div>
                <div
                    style={{
                        display: 'flex',
                        // justifyContent: 'end',
                        gap: '24px',
                        width: 'calc(100% - 20)',
                        padding: 10,
                        border: '1px solid #d9d9d9',
                        boxSizing: 'border-box', 
                        marginBottom: '24px'
                    }}
                >
                    <Form.Item 
                        name="representationType" 
                        label="Тип представления"
                        style={{ 
                            display: 'flex', 
                            // alignItems: 'center', 
                            // maxWidth: '100px', 
                            // marginRight: '24px', 
                            marginBottom: 0 
                        }}
                    >
                        <Select
                            // style={{ maxWidth: 70 }}
                            placeholder="Тип представления"
                            options={representationOptions}
                            allowClear={false}
                        />
                    </Form.Item>
                    {stateForm.representationType !== 'default' && (
                        <Form.Item 
                            name="historyDataType" 
                            label="Отображение данных"
                            style={{ 
                                display: 'flex', 
                                // alignItems: 'center', 
                                // maxWidth: '100px', 
                                // marginRight: '24px', 
                                marginBottom: 0 
                            }}
                        >
                            <Select
                                // style={{ maxWidth: 70 }}
                                placeholder="По умолчанию"
                                options={[
                                    {
                                        label: 'По умолчанию (исторические)',
                                        value: 'history',
                                    },
                                    {
                                        label: 'Только текущие',
                                        value: 'current',
                                    }
                                ]}
                                allowClear={false}
                            />
                        </Form.Item>)}
                    {((stateForm.representationType === 'default' && stateForm.historyDataType === 'history' ) || 
                        (stateForm.representationType === 'miniChart' /* && stateForm.historyDataType === 'current' */)) && (
                        <Form.Item 
                            name="countInARow" 
                            label="В ряду"
                            style={{ 
                                display: 'flex', 
                                // alignItems: 'center', 
                                maxWidth: '100px', 
                                // marginRight: '24px', 
                                marginBottom: 0 
                            }}
                        >
                            <Select
                                style={{ maxWidth: 70 }}
                                placeholder="Количество графиков в ряду"
                                options={chartsInRowSelectOptions}
                                allowClear={false}
                            />
                        </Form.Item>)}
                    <Form.Item
                        name="limit"
                        label="Лимит запрашиваемых точек"
                        style={{
                            display: 'flex',
                            marginBottom: 0
                        }}
                    >
                        <Input
                            placeholder="Без лимита"
                            type="number"
                            allowClear={true}
                        />
                    </Form.Item>
                    <Form.Item
                        name="skeletonItemCount"
                        label="Размер скелетона"
                        style={{
                            maxWidth: '150px',
                            marginBottom: 0
                        }}
                        rules={[{ min: 1, max: 4 }]}
                    >
                        <Input
                            placeholder="Без лимита"
                            type="number"
                            allowClear={true}
                        />
                    </Form.Item>
                    <Form.Item
                        name="linkedObjectsClass"
                        label="Классы, имеющие связь с дочерними объектами"
                        style={{ 
                            flex: 1,
                            marginBottom: 0,  
                        }}
                    >
                        <Select
                            placeholder="Выберите класс объекта"
                            options={storeClasses}
                            allowClear
                            autoClearSearchValue={true}
                            showSearch
                            filterOption={filterOption}
                        />
                    </Form.Item>
                    <Form.Item
                        name="linkedObjects"
                        label="Объекты связанных классов"
                        style={{
                            flex: 1,
                            marginBottom: 0,
                        }}
                    >
                        <Select
                            placeholder="Выберите объекты"
                            options={linkedObjectsOptionsList}
                            allowClear
                            showSearch
                            autoClearSearchValue={false}
                            filterOption={filterOption}
                            mode="multiple"
                            maxTagCount="responsive"
                        />
                    </Form.Item>
                    <Form.Item 
                        label="Надпись при отсутствии данных"
                        name="noAttributeTitle"
                    >
                        <Input
                            type="text"
                        />
                    </Form.Item>
                </div>
                {stateForm.representationType !== 'default' && (
                    <>
                        <div>Настройки типа представления <b>"{currenRepresentation}"</b></div>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '24px',
                                width: 'calc(100% - 20)',
                                padding: 10,
                                border: '1px solid #d9d9d9',
                                boxSizing: 'border-box', 
                                marginBottom: '24px'
                            }}
                        >
                            {stateForm.representationType === 'verticalHistogram' && (
                                <>
                                    <div
                                        style={{
                                            display: 'flex',
                                            gap: '24px',
                                        }}
                                    >
                                        <Form.Item 
                                            name={['representationProps', 'verticalHistogram', 'renderWithTransparentColumn']}
                                            label="Прозрачные плитки"
                                            valuePropName="checked"
                                            style={{ 
                                                flex: 1,
                                                // display: 'flex', 
                                                // alignItems: 'center',
                                                marginBottom: 0 
                                            }}
                                        >
                                            <Switch checked={true} />
                                        </Form.Item>
                                        <Form.Item 
                                            name={['representationProps', 'verticalHistogram', 'onlyActiveColor']}
                                            label="Цвет только значения"
                                            valuePropName="checked"
                                            style={{ 
                                                flex: 1,
                                                // display: 'flex', 
                                                // alignItems: 'center',
                                                marginBottom: 0 
                                            }}
                                            initialValue={false}
                                        >
                                            <Switch checked={false} />
                                        </Form.Item>
                                        <Form.Item 
                                            name={['representationProps', 'verticalHistogram', 'step']}
                                            label="Шаг"
                                            style={{ 
                                                flex: 1,
                                                // display: 'flex', 
                                                // alignItems: 'center',
                                                marginBottom: 0 
                                            }}
                                            rules={[{ min: 1, max: 100 }]}
                                        >
                                            <Input
                                                type="number"
                                                placeholder="10"
                                                allowClear={false}
                                            />
                                        </Form.Item>
                                        <Form.Item 
                                            name={['representationProps', 'verticalHistogram', 'customUnit']}
                                            label="Единица измерения"
                                            style={{ 
                                                flex: 1,
                                                // display: 'flex', 
                                                // alignItems: 'center',
                                                marginBottom: 0 
                                            }}
                                        >
                                            <Input
                                                allowClear={false}
                                            />
                                        </Form.Item>
                                        <Form.Item 
                                            name={['representationProps', 'verticalHistogram', 'width']}
                                            label="Ширина графика"
                                            style={{ 
                                                flex: 1,
                                                // display: 'flex', 
                                                // alignItems: 'center',
                                                marginBottom: 0 
                                            }}
                                            rules={[{ min: 0, max: 2000 }]}
                                        >
                                            <Input
                                                type="number"
                                                allowClear={true}
                                            />
                                        </Form.Item>
                                        <Form.Item 
                                            name={['representationProps', 'verticalHistogram', 'height']}
                                            label="Высота графика"
                                            style={{ 
                                                flex: 1,
                                                // display: 'flex', 
                                                // alignItems: 'center',
                                                marginBottom: 0 
                                            }}
                                            rules={[{ min: 0, max: 2000 }]}
                                        >
                                            <Input
                                                type="number"
                                                allowClear={true}
                                            />
                                        </Form.Item>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            gap: '24px',
                                        }}
                                    >
                                        <Form.Item 
                                            name={['representationProps', 'verticalHistogram', 'pointWidth']}
                                            label="Ширина дисков"
                                            style={{ 
                                                flex: 1,
                                                // display: 'flex', 
                                                // alignItems: 'center',
                                                marginBottom: 0 
                                            }}
                                            rules={[{ min: 0, max: 1000 }]}
                                        >
                                            <Input
                                                type="number"
                                                allowClear={true}
                                            />
                                        </Form.Item>
                                        <Form.Item 
                                            name={['representationProps', 'verticalHistogram', 'fontSize']}
                                            label="Размер шрифта"
                                            style={{ 
                                                flex: 1,
                                                // display: 'flex', 
                                                // alignItems: 'center',
                                                marginBottom: 0 
                                            }}
                                            rules={[{ min: 0, max: 100 }]}
                                        >
                                            <Input
                                                type="number"
                                                placeholder="Введите размер шрифта"
                                                allowClear={true}
                                            />
                                        </Form.Item>
                                        <Form.Item 
                                            label="Префикс в названии столбца"
                                            name={['representationProps', 'verticalHistogram', 'prefix']}
                                            style={{ 
                                                flex: 1,
                                                // display: 'flex', 
                                                // alignItems: 'center',
                                                marginBottom: 0, 
                                            }}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item 
                                            label="Постфикс в названии столбца дисков"
                                            name={['representationProps', 'verticalHistogram', 'postfix']}
                                            style={{ 
                                                flex: 1,
                                                // display: 'flex', 
                                                // alignItems: 'center',
                                                marginBottom: 0, 
                                            }}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </div>
                                </>
                            )}
                            {stateForm.representationType === 'horizontalHistogram' && (
                                <div
                                    style={{
                                        display: 'flex',
                                        gap: '24px',
                                    }}
                                >
                                    <Form.Item 
                                        name={['representationProps', 'horizontalHistogram', 'renderWithTransparentColumn']}
                                        label="Прозрачные плитки"
                                        valuePropName="checked"
                                        style={{ 
                                            display: 'flex', 
                                            alignItems: 'center',
                                            marginBottom: 0 
                                        }}
                                        initialValue={true}
                                    >
                                        <Switch checked={true} />
                                    </Form.Item>
                                    <Form.Item 
                                        name={['representationProps', 'horizontalHistogram', 'onlyActiveColor']}
                                        label="Цвет только значения"
                                        valuePropName="checked"
                                        style={{ 
                                            display: 'flex', 
                                            alignItems: 'center',
                                            marginBottom: 0 
                                        }}
                                        initialValue={false}
                                    >
                                        <Switch checked={false} />
                                    </Form.Item>
                                    <Form.Item 
                                        name={['representationProps', 'horizontalHistogram', 'step']}
                                        label="Шаг"
                                        style={{ 
                                            display: 'flex', 
                                            alignItems: 'center',
                                            marginBottom: 0 
                                        }}
                                        rules={[{ min: 1, max: 100 }]}
                                    >
                                        <Input
                                            type="number"
                                            placeholder="10"
                                            allowClear={false}
                                        />
                                    </Form.Item>
                                    <Form.Item 
                                        name={['representationProps', 'horizontalHistogram', 'customUnit']}
                                        label="Единица измерения"
                                        style={{ 
                                            display: 'flex', 
                                            alignItems: 'center',
                                            marginBottom: 0 
                                        }}
                                    >
                                        <Input
                                            allowClear={false}
                                        />
                                    </Form.Item>
                                    <Form.Item 
                                        name={['representationProps', 'horizontalHistogram', 'width']}
                                        label="Ширина графика"
                                        style={{ 
                                            display: 'flex', 
                                            alignItems: 'center',
                                            marginBottom: 0 
                                        }}
                                        rules={[{ min: 0, max: 2000 }]}
                                    >
                                        <Input
                                            type="number"
                                            allowClear={true}
                                        />
                                    </Form.Item>
                                    <Form.Item 
                                        name={['representationProps', 'horizontalHistogram', 'height']}
                                        label="Высота графика"
                                        style={{ 
                                            display: 'flex', 
                                            alignItems: 'center',
                                            marginBottom: 0 
                                        }}
                                        rules={[{ min: 0, max: 2000 }]}
                                    >
                                        <Input
                                            type="number"
                                            allowClear={true}
                                        />
                                    </Form.Item>
                                    <Form.Item 
                                        name={['representationProps', 'horizontalHistogram', 'pointWidth']}
                                        label="Высота дисков"
                                        style={{ 
                                            display: 'flex', 
                                            alignItems: 'center',
                                            marginBottom: 0 
                                        }}
                                        rules={[{ min: 0, max: 1000 }]}
                                    >
                                        <Input
                                            type="number"
                                            allowClear={true}
                                        />
                                    </Form.Item>
                                    <Form.Item 
                                        name={['representationProps', 'horizontalHistogram', 'fontSize']}
                                        label="Размер шрифта"
                                        style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            marginBottom: 0 
                                        }}
                                        rules={[{ min: 0, max: 100 }]}
                                    >
                                        <Input
                                            type="number"
                                            placeholder="Введите размер шрифта"
                                            allowClear={true}
                                        />
                                    </Form.Item>
                                </div>
                            )}
                            {stateForm.representationType === 'miniChart' && (
                                <div
                                    style={{
                                        display: 'flex',
                                        gap: '24px',
                                    }}
                                >
                                    <Form.Item 
                                        name={['representationProps', 'miniChart', 'height']}
                                        label="Высота мини-графика"
                                        style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            // maxWidth: '100px', 
                                            // marginRight: '24px', 
                                            marginBottom: 0 
                                        }}
                                        rules={[{ min: 0, max: 600 }]}
                                    >
                                        <Input
                                            type="number"
                                            // style={{ maxWidth: 300 }}
                                            placeholder="Высота мини-графика"
                                            allowClear={false}
                                        />
                                    </Form.Item>
                                    <Form.Item 
                                        name={['representationProps', 'miniChart', 'showLabel']}
                                        label="Показать значение"
                                        valuePropName="checked"
                                        style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            // maxWidth: '100px', 
                                            // marginRight: '24px', 
                                            marginBottom: 0 
                                        }}
                                        
                                    >
                                        <Switch />
                                    </Form.Item>
                                    <Form.Item 
                                        name={['representationProps', 'miniChart', 'showTitle']}
                                        label="Показать название"
                                        valuePropName="checked"
                                        style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            // maxWidth: '100px', 
                                            // marginRight: '24px', 
                                            marginBottom: 0 
                                        }}
                                        
                                    >
                                        <Switch />
                                    </Form.Item>
                                    {stateForm.representationProps.miniChart.showLabel && (
                                        <Form.Item 
                                            name={['representationProps', 'miniChart', 'fontSize']}
                                            label="Размер шрифта значения"
                                            style={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                // maxWidth: '100px', 
                                                // marginRight: '24px', 
                                                marginBottom: 0 
                                            }}
                                            // rules={[{ min: 10, max: 100 }]}
                                        >
                                            <Input
                                                type="number"
                                                placeholder="Высота мини-графика"
                                                allowClear={false}
                                            />
                                        </Form.Item>)}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </Form>
            <div>
                <div><b>Настройки измерений. Переместите блоки для изменения порядка отображения</b></div>
                <SortableList 
                    items={stateForm?.items ?? initialItems}
                    onChange={sortForms}
                    listStyle={{
                        gap: '24px',
                        border: '1px solid #d9d9d9',
                        padding: 10,
                    }}
                    renderItem={(item) => {
                        return (
                            <SortableList.Item
                                id={item.id}
                                customItemStyle={{ 
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '10px',
                                    width: 'calc(100% - 20)',
                                    padding: `0 10px ${collapsed?.[item.mnemo] ? '0px' : '10px'} 10px `,
                                    border: '1px solid #d9d9d9',
                                    boxSizing: 'border-box',
                                    backgroundColor: 'transparent ',
                                    boxShadow: '0px 0px 0px 0px',
                                }}
                            >
                                <div
                                    style={{ 
                                        display: 'flex',
                                        flexDirection: 'row',
                                        width: '100%',
                                        alignItems: 'center',
                                    }}
                                >
                                    <SortableList.DragHandle
                                        customDragHandlerStyle={{
                                            padding: '15px 10px',
                                            alignSelf: 'baseline',
                                            cursor: 'move', 
                                            marginRight: '10px',
                                            fill: 'transparent',
                                        }}
                                        svgStyle={{
                                            height: 24,
                                            width: 20,
                                            fill: '#ccc'
                                        }}
                                    />
                                    <Switch 
                                        checked={stateForm?.[item.mnemo]?.enabled}
                                        onClick={(checked) => handleSwitch(checked, item.mnemo)}
                                    />
                                    <div 
                                        style={{ 
                                            display: 'flex',
                                            flex: 1,
                                            alignItems: 'center',
                                            marginLeft: 16, 
                                        }}
                                    >
                                        {item.label}
                                    </div>
                                    <div
                                        onClick={() => handleCollapse(item.mnemo)}
                                    >
                                        <ECIconView 
                                            icon={collapsed?.[item.mnemo] 
                                                ? 'DownOutlined' 
                                                : 'UpOutlined'} 
                                            style={{ 
                                                cursor: 'pointer', 
                                                fontSize: 12 
                                            }} 
                                        />
                                    </div>
                                </div>
                                <div 
                                    style={{ 
                                        display: collapsed?.[item.mnemo] ? 'none' : 'block',
                                        width: '100%'
                                    }}
                                >
                                    {stateForm?.[item.mnemo]?.enabled && ( 
                                        <TargetObjectsAndOAttrsForm 
                                            {...item?.formProps}
                                            objectsWithAttrs={stateForm?.[item.mnemo]?.OASettings.map(settings => ({
                                                ...settings,
                                                objectId: settings.fieldId.includes('own')
                                                    ? currentObjectId
                                                    : settings.objectId
                                            }))}
                                            getFormValues={getFormValues}
                                            baseClasses={vtemplate?.classes?.length > 0 
                                                ? vtemplate?.classes
                                                : baseSettings?.classes}
                                        />)} 
                                </div>                            
                            </SortableList.Item>
                        )
                    }}
                />
            </div>
        </>
    )
}
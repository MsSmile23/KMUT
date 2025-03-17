import { FC, Fragment, useEffect, useMemo, useState } from 'react'
import { TWidgetSettings } from '../widget-types'
import { Form } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { selectObjectByIndex, useObjectsStore } from '@shared/stores/objects'
import { selectClasses, selectGetClassById, useClassesStore } from '@shared/stores/classes'
import { PACKAGE_AREA } from '@shared/config/entities/package'
import { TargetLinkingClassesForm } from '@containers/classes/TargetLinkingClassesForm/TargetLinkingClassesForm'
import { Select, Switch } from '@shared/ui/forms'
import { IWidgetObjectLinkedSharesFormProps } from './WidgetObjectLinkedSharesForm'
import { objectLinkedSharesFormInitValues } from './utils'
import { RepresentationForms } from '@containers/widgets/WidgetObjectLinkedShares/RepresentationForms'
import { initialViewPropsValues } from '@containers/widgets/WidgetObjectLinkedShares/initialViewProps'
import { representationTypesOptions } from '@containers/widgets/WidgetObjectLinkedShares/representationTypesOptions'
import { IClass } from '@shared/types/classes'
import { ClassesCascader } from '@entities/classes/ClassesCascader/ClassesCascader'



interface IObjectLinkedSharesFormProps extends TWidgetSettings<IWidgetObjectLinkedSharesFormProps> {
    getFormState: (form: IWidgetObjectLinkedSharesFormProps) => void
}

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
    {
        value: 5,
        label: 5
    },
]
/**
    * Общие параметры 
    * @param entityType - отображение текущей долей сущности (объектов или их атрибутов)
    * @param groupingType - тип группировки (если не задано, отображаются все на одном графике)
    * @param countInRow - количество графиков в ряду (доступно, только если выбрана группировка groupingType)
    
    * Параметры отображения графика
    * @param chartTitle - название графика (используется в составе многосекционного виджета)
    * @param chartRatio - размер графика в процентах относительно контейнера
    * @param legendRatio - размер легенды в процентах относительно контейнера
    * @param height - высота контейнера
    * @param width - ширина контейнера (пока не используется)
    * 
    * Параметры отображения долей определенного объекта
    * @param parentClass - класс родительского объекта
    * @param parentObjectId - id - родительского объекта
    * @param objectId - id текущего объекта, взятого из втемплейта
    * @param objectAttributeIds - массив атрибутов для отображения (если поле пустое, отображаются все атрибуты)
    * 
    * @param dividingCriteria - критерий разбивки (пока не используется)
    * 
    * Параметры отображения долей целевых классов через связующие классы
    * @param classes - массив пар целевых и связующих классов (используется для заполнения формы)
    * @param ids - смёрдженный массив пар целевых и связующих классов (используется для получения дочерних объектов)
*/

export const ObjectLinkedSharesForm: FC<IObjectLinkedSharesFormProps> = ({ settings, getFormState }) => {
    const { widget, vtemplate } = settings
    const {
        dividingCriteria, 
        groupingType, 
        parentClass, 
        ids,
        parentObjectId,
        classes, 
        entityType, 
        objectAttributeIds, 
        countInRow, 
        groupingClass, 
        representationType,
        viewProps,
        dividingCriteriaProps, showFilters, linkedObjects, linkedObjectsClasses
    } = widget
    const [form] = useForm()
    
    const getObjectByIndex = useObjectsStore(selectObjectByIndex)
    const classById = useClassesStore(selectGetClassById)
    const currentObjectId = vtemplate?.objectId
    
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
  
    const getClassById = (classes: number[]) => {
        const classesById: IClass[] = []

        classes?.forEach((cl) => {
            const classFull = classById(cl)

            if (classFull) { classesById.push(classFull) }
        })

        return classesById
    }

    const initialViewProps = initialViewPropsValues(representationType)
    const initialValuesForm: IWidgetObjectLinkedSharesFormProps<typeof representationType> = {
        ids: ids ?? objectLinkedSharesFormInitValues.ids,
        classes: classes ?? objectLinkedSharesFormInitValues.classes,
        parentClass: parentClass ?? objectLinkedSharesFormInitValues.parentClass,
        parentObjectId: parentObjectId ?? objectLinkedSharesFormInitValues.parentObjectId,
        objectId: currentObjectId ?? objectLinkedSharesFormInitValues.objectId,
        objectAttributeIds: objectAttributeIds ?? objectLinkedSharesFormInitValues.objectAttributeIds,
        groupingClass: groupingClass ?? objectLinkedSharesFormInitValues.groupingClass,
        countInRow: countInRow ?? objectLinkedSharesFormInitValues.countInRow,
        entityType: entityType ?? objectLinkedSharesFormInitValues.entityType,
        groupingType: groupingType ?? objectLinkedSharesFormInitValues.groupingType,
        dividingCriteria: ['states', 'attributes'].includes(dividingCriteria) 
            ? dividingCriteria 
            : objectLinkedSharesFormInitValues.dividingCriteria,
        representationType: representationType ?? objectLinkedSharesFormInitValues.representationType,
        // eslint-disable-next-line max-len
        viewProps: Object.keys(initialViewProps).reduce((acc, key) => {
            acc[key] = viewProps && key in viewProps 
                ? viewProps[key]
                : initialViewProps[key]

            return acc
        }, {}), 
        /* viewProps: viewProps ?
            Object.keys(viewProps).length == 0 ? initialViewPropsValues(representationType) : viewProps
            : {}, */
        dividingCriteriaProps: dividingCriteriaProps ?? objectLinkedSharesFormInitValues.dividingCriteriaProps,
        showFilters: showFilters ?? false, 
        linkedObjects: linkedObjects ?? objectLinkedSharesFormInitValues?.linkedObjects,
        linkedObjectsClasses: linkedObjectsClasses ?? objectLinkedSharesFormInitValues?.linkedObjectsClasses
    }

    // eslint-disable-next-line max-len
    const [stateForm, setStateForm] = useState<IWidgetObjectLinkedSharesFormProps<typeof representationType>>(initialValuesForm) 

    useEffect(() => {
        getFormState(stateForm)
    }, [stateForm])

    const onValuesChange = (value, onChangeForm) => {
        const key = Object.keys(value)[0]

        if (key === 'representationType') {
            return setStateForm((prev) => {
                return {
                    ...prev,
                    [key]: onChangeForm[key],
                    viewProps: initialViewPropsValues(onChangeForm[key])
                }
            })
        }

        if (key === 'viewProps') {
            const currentViewProps = stateForm.viewProps
            const currentViewPropsKeyList = Object.keys(currentViewProps)
            
            const newViewProps = currentViewPropsKeyList.reduce((viewProps, viewPropKey) => {

                viewProps[viewPropKey] = viewPropKey in value.viewProps
                    ? value.viewProps[viewPropKey]
                    : currentViewProps[viewPropKey];
                
                return viewProps;
            }, {})
            
            const key = Object.keys(value.viewProps)[0]

            if (!currentViewProps[key]) {
                newViewProps[key] = value.viewProps[key]
            }

            return setStateForm((prev) => {

                return {
                    ...prev,
                    viewProps: newViewProps
                }
            })
        }

        const newValue = ['chartRatio', 'legendRatio'].includes[key]
            ?   value?.[1] < 1 
                ? 1
                :   value?.[1] > 99
                    ? 99
                    : value?.[1]
            :   onChangeForm[key]

        setStateForm((prev) => {
            return {
                ...prev,
                [key]: newValue
            }
        })

    }

    const filterOption = (input, option, ) => {
        return (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
    }

    const getFormValues = (values) => {
        setStateForm((prev) => {
            return {
                ...prev,
                classes: values.classes,
                ids: values.classes.reduce((acc, item) => { 
                    if  (item?.target) {
                        acc?.target.push(...item.target)
                    } 

                    if  (item?.linking) {
                        item?.linking && acc?.linking.push(...item.linking)
                    }
            
                    return acc
                }, {
                    target: [],
                    linking: []
                })
            }
        })
    }

    const targetClassesFull = widget?.classes?.flatMap((cl) => getClassById(cl.target)) || []

    //Получаем атрибуты целевых классов
    const attributesByTargetOptions = targetClassesFull?.flatMap((cl) => cl.attributes)
        ?.map(({ id, name }) => ({ label: name, value: id }))
        ?.filter((item, index, array) =>
            array.findIndex((element) => element.value === item.value) === index)
        ?.sort((a, b) => a.label.localeCompare(b.label))


    const linkedObjectsOptions = useMemo(() => {
        let localLinkedObjects = []

        if (stateForm?.linkedObjectsClasses) {
            localLinkedObjects = getObjectByIndex('class_id', stateForm?.linkedObjectsClasses)
        }

        return localLinkedObjects
    }, [stateForm?.linkedObjectsClasses])

    return (
        <Fragment>
            <div>Общие настройки</div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'end',
                    gap: '24px',
                    width: 'calc(100% - 20)',
                    flexDirection: 'column',
                    padding: 10,
                    border: '1px solid #d9d9d9',
                    boxSizing: 'border-box',
                    marginBottom: '24px',
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={initialValuesForm}
                    onValuesChange={onValuesChange}
                    name="objectLinkedShares"
                >
                    <div
                        style={{
                            display: 'flex',
                            width: '100%',
                            gap: 24,
                        }}
                    >
                        <Form.Item
                            name="entityType"
                            label="Показывать доли объектов или их атрибутов"
                            style={{
                                flex: 1,
                                marginBottom: 10,
                            }}
                        >
                            <Select
                                // style={{ maxWidth: 300 }}
                                options={[
                                    {
                                        value: 'objects',
                                        label: 'Объекты',
                                    },
                                    {
                                        value: 'object_attributes',
                                        label: 'Атрибуты объекта',
                                    },
                                ]}
                                autoClearSearchValue={false}
                                filterOption={filterOption}
                            />
                        </Form.Item>
                        <Form.Item
                            name="groupingType"
                            label="Группировать по"
                            style={{
                                flex: 1,
                                marginBottom: 10,
                            }}
                        >
                            <Select
                                // style={{ maxWidth: 300 }}
                                placeholder="Без группировки"
                                options={[
                                    {
                                        value: 'class',
                                        label: 'Классы',
                                    },
                                    /* {
                                    value: 'state',
                                    label: 'Статусы'
                                }, */
                                ]}
                                autoClearSearchValue={false}
                                filterOption={filterOption}
                                allowClear
                            />
                        </Form.Item>
                        {stateForm.groupingType === 'class' && (
                            <Form.Item
                                name="groupingClass"
                                label="Группировочный класс"
                                style={{
                                    flex: 1,
                                    marginBottom: 10,
                                }}
                            >
                                <Select
                                    placeholder="Выберите группировочный класс"
                                    options={storeClasses}
                                    allowClear
                                    autoClearSearchValue={true}
                                    showSearch
                                    filterOption={filterOption}
                                />
                            </Form.Item>
                        )}
                        {stateForm.groupingType && (
                            <Form.Item
                                name="countInRow"
                                label="В ряду"
                                style={{
                                    flex: 0.2,
                                    marginBottom: 10,
                                }}
                            >
                                <Select
                                    style={{ maxWidth: 70 }}
                                    placeholder="Количество графиков в ряду"
                                    options={chartsInRowSelectOptions}
                                    autoClearSearchValue={false}
                                    filterOption={filterOption}
                                />
                            </Form.Item>
                        )}
                        <Form.Item
                            name="dividingCriteria"
                            label="Критерий разбивки"
                            style={{
                                flex: 0.5,
                                marginBottom: 10,
                            }}
                        >
                            <Select
                                // style={{ maxWidth: 300 }}
                                placeholder="Критерий разбивки"
                                options={[
                                    {
                                        value: 'states',
                                        label: 'Статусы',
                                    },
                                    {
                                        value: 'attributes',
                                        label: 'Атрибуты',
                                    },
                                ]}
                                allowClear={false}
                                // autoClearSearchValue={false}
                                filterOption={filterOption}
                            />
                        </Form.Item>
                        {stateForm.dividingCriteria === 'attributes' && (
                            <Form.Item
                                name={['dividingCriteriaProps', 'attribute_id']}
                                label="Атрибуты"
                                style={{
                                    flex: 0.5,
                                    marginBottom: 10,
                                }}
                            >
                                <Select
                                    // style={{ maxWidth: 300 }}
                                    placeholder="Выберите атрибут"
                                    options={attributesByTargetOptions}
                                    autoClearSearchValue={false}
                                    filterOption={filterOption}
                                />
                            </Form.Item>
                        )}
                    </div>
                    <div>Отображение долей всех классов оборудования на конкретном объекте</div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 24,
                            padding: 10,
                            border: '1px solid #d9d9d9',
                            marginBottom: 10,
                        }}
                    >
                        <Form.Item
                            name="parentClass"
                            label="Класс родительского объекта"
                            style={{
                                flex: 1,
                                marginBottom: 0,
                            }}
                        >
                            <Select
                                // style={{ maxWidth: 300 }}
                                placeholder="Выберите класс объекта"
                                options={storeClasses}
                                allowClear
                                autoClearSearchValue={true}
                                showSearch
                                filterOption={filterOption}
                            />
                        </Form.Item>
                        <Form.Item
                            name="parentObjectId"
                            label="Родительский объект"
                            style={{
                                flex: 1,
                                marginBottom: 0,
                            }}
                        >
                            <Select
                                placeholder="Выберите объект"
                                options={getObjectByIndex('class_id', stateForm.parentClass).map((item) => {
                                    return {
                                        value: item?.id,
                                        label: item?.name,
                                    }
                                })}
                                allowClear
                                showSearch
                                autoClearSearchValue={false}
                                filterOption={filterOption}
                            />
                        </Form.Item>
                        {stateForm.entityType === 'object_attributes' && (
                            <Form.Item
                                name="objectAttributeIds"
                                label="Атрибуты объекта"
                                style={{
                                    flex: 1,
                                    marginBottom: 0,
                                }}
                            >
                                <Select
                                    placeholder="Выберите атрибуты"
                                    mode="multiple"
                                    options={
                                        getObjectByIndex('id', stateForm.parentObjectId)?.object_attributes?.reduce(
                                            (acc, item) => {
                                                if (item.attribute.history_to_cache || item.attribute.history_to_db) {
                                                    acc.push({
                                                        value: item?.attribute.id,
                                                        label: item?.attribute.name,
                                                    })
                                                }

                                                return acc
                                            },
                                            []
                                        ) ?? []
                                    }
                                    allowClear
                                    showSearch
                                    autoClearSearchValue={false}
                                    filterOption={filterOption}
                                    maxTagCount="responsive"
                                />
                            </Form.Item>
                        )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        Дополнительная фильтрация
                        <Form.Item
                            valuePropName="checked"
                            name="showFilters"
                            style={{
                                flex: 1,
                                marginBottom: 0,
                                marginLeft: '5px',
                            }}
                        >
                            <Switch />
                        </Form.Item>
                    </div>
                    {stateForm.showFilters && (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 24,
                                padding: 10,
                                border: '1px solid #d9d9d9',
                                marginBottom: 10,
                            }}
                        >
                            <Form.Item
                                name="linkedObjectsClasses"
                                label="Класс связанных объектов"
                                style={{
                                    flex: 1,
                                    marginBottom: 0,
                                }}
                            >
                                <Select
                                // style={{ maxWidth: 300 }}
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
                                label="Связанные объекты"
                                style={{
                                    flex: 1,
                                    marginBottom: 0,
                                }}
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
                            {stateForm.entityType === 'object_attributes' && (
                                <Form.Item
                                    name="objectAttributeIds"
                                    label="Атрибуты объекта"
                                    style={{
                                        flex: 1,
                                        marginBottom: 0,
                                    }}
                                >
                                    <Select
                                        placeholder="Выберите атрибуты"
                                        mode="multiple"
                                        options={
                                            getObjectByIndex('id', stateForm.parentObjectId)?.object_attributes?.reduce(
                                                (acc, item) => {
                                                    if (
                                                        item.attribute.history_to_cache ||
                                                        item.attribute.history_to_db
                                                    ) {
                                                        acc.push({
                                                            value: item?.attribute.id,
                                                            label: item?.attribute.name,
                                                        })
                                                    }

                                                    return acc
                                                },
                                                []
                                            ) ?? []
                                        }
                                        allowClear
                                        showSearch
                                        autoClearSearchValue={false}
                                        filterOption={filterOption}
                                        maxTagCount="responsive"
                                    />
                                </Form.Item>
                            )}
                        </div>
                    )}
                </Form>
                <div style={{ textAlign: 'center', margin: '10px auto' }}>ИЛИ</div>
                <div>Отображение долей определенных классов оборудования</div>
                <TargetLinkingClassesForm
                    classes={stateForm.classes}
                    getFormValues={getFormValues}
                    labels={{
                        linking: 'Связующие классы',
                        target: 'Целевые классы',
                    }}
                    styles={{
                        formItem: {
                            flexDirection: 'row',
                        },
                        targetCascader: {
                            flex: 1,
                        },
                        linkingCascader: {
                            flex: 1,
                        },
                    }}
                />
            </div>
            <Form
                form={form}
                layout="vertical"
                initialValues={initialValuesForm}
                onValuesChange={onValuesChange}
                name="objectLinkedSharesViewForm"
            >
                <div>Настройки представлений</div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'end',
                        gap: '24px',
                        width: 'calc(100% - 20)',
                        padding: 10,
                        border: '1px solid #d9d9d9',
                        boxSizing: 'border-box',
                        flexDirection: 'column',
                        marginBottom: '24px',
                    }}
                >
                    <div style={{ width: '300px' }}>
                        <Form.Item
                            name="representationType"
                            label="Тип представления"
                            style={{
                                flex: 1,
                                marginBottom: 10,
                            }}
                        >
                            <Select placeholder="Выберите тип представления" options={representationTypesOptions} />
                        </Form.Item>
                    </div>
                    <RepresentationForms stateForm={stateForm} />
                </div>
            </Form>
        </Fragment>
    )
}
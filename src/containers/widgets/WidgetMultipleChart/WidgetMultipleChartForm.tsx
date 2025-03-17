import { FC, useEffect, useState } from 'react'
import { IGetFormState, TWidgetFormSettings } from '../widget-types'
import { IWidgetObjectOAttrsWithHistoryFormProps, ObjectOAttrsWithHistoryForm } from '../WidgetObjectOAttrsWithHistory/ObjectOAttrsWithHistoryForm'
import { IMultipleChartFormPart, MultipleChartForm } from './MultipleChartForm'
// import { Tabs } from 'antd'
// import { findChildObjectsWithPaths } from '@shared/utils/objects'
import { selectObjectByIndex, useObjectsStore } from '@shared/stores/objects'
import { IObjectAttribute } from '@shared/types/objects'
import { selectClassByIndex, useClassesStore } from '@shared/stores/classes'
import { OpUnitType } from 'dayjs'
export interface IWidgetMultipleChartFormProps {
    baseHistoryForm: IWidgetObjectOAttrsWithHistoryFormProps
    multipleHistoryForm: IMultipleChartFormPart[]
    baseMultipleHistoryForm: {
        limit?: number
        legendWidth?: number
        defaultPeriod?: OpUnitType | string
    }
    attrsFromBaseForm: IObjectAttribute[]
}
const WidgetMultipleChartForm: FC<TWidgetFormSettings<
    IWidgetMultipleChartFormProps
>> = (props) => {
    const { settings, onChangeForm } = props
    const { widget, vtemplate, baseSettings } = settings ?? {}
    const { baseHistoryForm, multipleHistoryForm, attrsFromBaseForm, baseMultipleHistoryForm } = widget ?? {}
    const getObjectByIndex = useObjectsStore(selectObjectByIndex)
    const getCLassByIndex = useClassesStore(selectClassByIndex)
    // console.log('form widget', widget)

    // console.log('baseSettings', baseSettings)
    
    const getAttrsFromBaseForm = (): IObjectAttribute[] => {
        // const object = getObjectByIndex('id', vtemplate?.objectId)
        const attrs = Object.keys(baseHistoryForm ?? {}).reduce((acc, key) => {
            if (baseHistoryForm && ['own', 'linked', 'other'].includes(key) ) {
                if (baseHistoryForm[key]?.enabled) {
                    baseHistoryForm[key]?.OASettings.forEach(props => {
                        const index = baseHistoryForm.items.findIndex(item => item.mnemo === key)

                        // Если есть targetClassIds, то нужно пройтись по дочерним объектами и добавить их 
                        if (baseHistoryForm.items[index]?.formProps?.showForm?.includes('targetClassIds')) {
                            if (props?.targetClassIds?.length > 0) {
                            // при указании целевых классов, если выбран объект, то показываем его
                                // console.log('props', props)
                                
                                // if (props?.objectId) {
                                //     const currentObject = getObjectByIndex('id', props?.objectId)
                                    
                                //     currentObject?.object_attributes?.forEach(oa => {
                                //         if ((oa.attribute.history_to_cache || oa.attribute.history_to_db) 
                                //         && (oa.attribute?.view_type?.type === 'chart' || !oa.attribute?.view_type)) {
                                //             const idx = acc.findIndex(a => a.id === oa.id)

                                //             if (idx < 0) {
                                //                 acc.push(oa)
                                //             }
                                //         }
                                //     })
                                // если не выбран ни один, то показываем атрибуты всех связанных объектов 
                                // } else {
                                
                                props?.targetClassIds.forEach(targetClassId => {
                                    const targetClass = getCLassByIndex('id', targetClassId)
                                    
                                    targetClass?.attributes?.forEach(attr => {
                                        if ((attr.history_to_cache || attr.history_to_db) 
                                            && (attr.view_type?.type === 'chart' 
                                            || !attr.view_type)) {
                                            const idx = acc.findIndex(a => a.id === attr.id)
    
                                            if (idx < 0) {
                                                acc.push(attr)
                                            }
                                        }
                                    })

                                })
                                /* const children = findChildObjectsWithPaths({
                                    currentObj: object,
                                    targetClassIds: props?.targetClassIds,
                                    childClassIds: props?.linkedClassIds,
                                }).objectsWithPath
    
                                console.log('children', children)
                                children.forEach(child => {
                                    const currentObject = getObjectByIndex('id', child?.id)

                                    currentObject?.object_attributes?.forEach(oa => {
                                        if ((oa.attribute.history_to_cache || oa.attribute.history_to_db) 
                                        && (oa.attribute?.view_type?.type === 'chart' || 
                                        !oa.attribute?.view_type)) {
                                            const idx = acc.findIndex(a => a.id === oa.id)

                                            if (idx < 0) {
                                                acc.push(oa)
                                            }
                                        }
                                    })
                                }) */
                                // }
        
                            }
                        // иначе добавляем сам объект
                        } else {
                            if (['own', 'linked'].includes(key)) {
                                const currentObject = getObjectByIndex('id', vtemplate.objectId)

                                // проверяем, назначены ли для отображения макета какие то классы
                                if (baseSettings.classes && baseSettings.classes.length > 0) {
                                    baseSettings.classes.forEach(cls => {
                                        const currenClass = getCLassByIndex('id', cls)
                                        
                                        currenClass?.attributes?.forEach(attr => {
                                            if (
                                                (attr.history_to_cache || attr.history_to_db) && 
                                                (attr.view_type?.type === 'chart' || !attr.view_type)
                                            ) {
                                                const idx = acc.findIndex(a => a.id === attr.id)
        
                                                if (idx < 0) {
                                                    if (currentObject.class_id === cls) {
                                                        // Если выбраны атрибуты в базовой форме, то проверяем
                                                        if (props?.attributeIds.length > 0) {
                                                            if (props?.attributeIds.includes(attr.id)) {
                                                                acc.push(attr)
                                                            }
                                                        // Если нет, по пропускаем проверку
                                                        } else {
                                                            acc.push(attr)
                                                        }
                                                    } else {
                                                        acc.push(attr)
                                                    }
                                                }
                                            }
                                        })
                                    })
                                } else {
                                    const currenClass = getCLassByIndex('id', currentObject?.class_id)
    
                                    // console.log('props', key, props)
                                    // console.log('cls attributes', currenClass?.attributes)
                                    currenClass?.attributes?.forEach(attr => {
                                        if (
                                            props?.attributeIds.includes(attr.id) &&
                                            (attr.history_to_cache || attr.history_to_db) && 
                                            (attr.view_type?.type === 'chart' || !attr.view_type)
                                        ) {
                                            const idx = acc.findIndex(a => a.id === attr.id)
    
                                            if (idx < 0) {
                                                acc.push(attr)
                                            }
                                        }
                                    })

                                }
                                /* currentObject?.object_attributes?.forEach(oa => {
                                    if ((oa.attribute.history_to_cache || oa.attribute.history_to_db) 
                                    && (oa.attribute?.view_type?.type === 'chart' || !oa.attribute?.view_type)) {
                                        const idx = acc.findIndex(a => a.id === oa.id)

                                        if (idx < 0) {
                                            acc.push(oa)
                                        }
                                    }
                                }) */
                            } else {
                                if (props.classId) {
                                    const currenClass = getCLassByIndex('id', props.classId)

                                    currenClass?.attributes?.forEach(attr => {
                                        if ((attr.history_to_cache || attr.history_to_db) 
                                            && (attr.view_type?.type === 'chart' 
                                            || !attr.view_type)) {
                                            const idx = acc.findIndex(a => a.id === attr.id)
    
                                            if (idx < 0) {
                                                acc.push(attr)
                                            }
                                        }
                                    })
                                }
                            }
                        }
                    })
                }
            }

            return acc
        }, [])
        // }, {
        //     attrs: [] as IAttribute[],
        //     objectAttrs: [] as IObjectAttribute[]
        // })
        
        // console.log('baseHistoryForm', compState.baseHistoryForm)
        // console.log('attrs', attrs)
        setCompState(prev => ({
            ...prev,
            attrsFromBaseForm: attrs
        }))

        return attrs
    }

    const [compState, setCompState] = useState<IWidgetMultipleChartFormProps>({
        baseHistoryForm: baseHistoryForm,
        multipleHistoryForm: multipleHistoryForm,
        attrsFromBaseForm: attrsFromBaseForm,
        baseMultipleHistoryForm: baseMultipleHistoryForm
    })

    // console.log('form widget', widget)
    // console.log('vtemplate?.id', vtemplate?.objectId)

    
   

    const getFormState: IGetFormState<
        IWidgetMultipleChartFormProps[keyof IWidgetMultipleChartFormProps], 
        keyof IWidgetMultipleChartFormProps
    > = (form, formName) => {
        // console.log('form of', formName, form)
        // formName === 'multipleHistoryForm' && console.log('getFormState', form)
        setCompState(prev => ({
            ...prev,
            [formName]: form
        }))
    }

    useEffect(() => {
        setCompState(prev => ({
            ...prev,
            attrsFromBaseForm: getAttrsFromBaseForm()
        }))
    }, [baseHistoryForm, multipleHistoryForm])

    useEffect(() => {
        onChangeForm<IWidgetMultipleChartFormProps>(compState)
    }, [compState])

    return (
        <div
            style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '10px' 
            }}
        >
            <ObjectOAttrsWithHistoryForm 
                settings={{
                    ...settings,
                    widget: widget?.baseHistoryForm,
                }}
                getFormState={getFormState}
            />
            <MultipleChartForm 
                settings={{
                    ...settings,
                    widget: widget?.multipleHistoryForm,
                }}
                baseMultipleHistoryForm ={widget?.baseMultipleHistoryForm}
                getFormState={getFormState}
                attrsFromBaseForm={compState.attrsFromBaseForm}
            />
        </div>      
    )
    // return (
    //     <Tabs
    //         items={items}
    //     />       
    // )
}

export default WidgetMultipleChartForm
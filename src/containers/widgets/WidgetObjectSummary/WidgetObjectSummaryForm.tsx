import { FC, useEffect, useState } from 'react'
import { TWidgetFormSettings } from '../widget-types'
import { Form, Input, Tabs } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { Select } from 'antd'
import { IObjectAttributesAndChildStates, TSections } from '@containers/objects/ObjectAttributesAndChildStates/ObjectAttributesAndChildStates'
import { DndGroupList } from '@containers/objects/ObjectTree/TreeGrouping/DndGroupList'
import { IFormProps } from '@containers/objects/ObjectTree/treeTypes'
import { IWidgetObjectLinkedSharesFormProps } from '../WidgetObjectLinkedShares/WidgetObjectLinkedSharesForm'
import { representationTypeList } from '../WidgetObjectOAttrState/WidgetObjectOAttrStateForm'
import { Switch } from '@shared/ui/forms'
import { ObjectLinkedSharesForm } from '../WidgetObjectLinkedShares/ObjectLinkedSharesForm'
import { IObjectsStatusLabelsProps } from '@entities/objects/ObjectsStatusLabels/ObjectsStatusLabels'
import { objectLinkedSharesFormInitValues } from '../WidgetObjectLinkedShares/utils'
import OAForm from '../WidgetObjectOAttrs/OAForm'
import { TStateFormType } from '../WidgetObjectOAttrs/WidgetObjectOAttrsForm'
import { IObjectOAttrStateProps } from '@containers/objects/ObjectOAttrState/ObjectOAttrState'
import OAttrStateForm from '../WidgetObjectOAttrState/OAttrStateForm'

export interface IWidgetObjectSummaryFormProps {
    baseForm: {
        // objectId: number
        sectionsToShow: IObjectAttributesAndChildStates['sectionsToShow']
        allObjects: boolean
        autoDetectObjectId: boolean
        titleStateDevice?: string
        labelsCount?: number
        labelsContainerHeight?: number
        height?: number
        width?: number
    }
    objectLinkedShares?: IWidgetObjectLinkedSharesFormProps
    // attributesInfo?: 
    services?: IObjectsStatusLabelsProps
    heightOAttrs?: number
    objectOAttrs?: TStateFormType
    maxWidth?: boolean,
    representationType?: any,
    objectOAStates?:   IObjectOAttrStateProps
}

const sectionsList: {
    value: TSections
    label: string
}[] = [
    {
        value: 'objectLinkedShares',
        label: 'Оборудование',
    },
    {
        value: 'objectOAttrs',
        label: 'Основные атрибуты',
    },
    {
        value: 'objectOAttrState',
        label: 'Услуги',
    }
]

const WidgetObjectSummaryForm: FC<TWidgetFormSettings<IWidgetObjectSummaryFormProps>> = (props) => {

    const { settings, onChangeForm } = props
    const { widget, vtemplate } = settings
    const { baseForm, 
        objectLinkedShares, 
        services,
        heightOAttrs,
        objectOAttrs, 
        maxWidth, 
        representationType,
        objectOAStates } = widget
    const { allObjects, autoDetectObjectId, sectionsToShow, height, width, titleStateDevice } = baseForm || {}
    const [form] = useForm()

    const initialValuesForm: IWidgetObjectSummaryFormProps = {
        baseForm: {
            allObjects: allObjects ?? false,
            autoDetectObjectId: autoDetectObjectId ?? false,
            sectionsToShow: sectionsToShow ?? ['objectLinkedShares', 'objectOAttrState'],
            height: height ?? 300,
            width: width ?? 250,
            titleStateDevice: titleStateDevice ?? undefined,
        },
        objectLinkedShares: objectLinkedShares ?? objectLinkedSharesFormInitValues,
        services: services,
        heightOAttrs: heightOAttrs,
        maxWidth: maxWidth ?? false,
        representationType: representationType

        // attributesInfo: attributesInfo,
    }

    const [stateForm, setStateForm] = useState<IWidgetObjectSummaryFormProps>(initialValuesForm) 
    
    useEffect(() => {

        onChangeForm<IWidgetObjectSummaryFormProps>(stateForm)
    }, [stateForm])

    const onValuesChange = (value, onChangeForm) => {

        const key = Object.keys(value)[0]
        
        if (['allObjects', 'autoDetectObjectId'].includes(key) && onChangeForm[key]) {
            setStateForm((prev) => {
                return {
                    ...prev,
                    baseForm: {
                        ...prev.baseForm,
                        objectId: undefined
                    }
                }
            })
        } else if (key === 'heightOAttrs') {
            setStateForm((prev) => {
                return {
                    ...prev,
                    [key]: onChangeForm[key]
                }
            })
        }
        else if (key === 'representationType') {
            setStateForm((prev) => {
                return {
                    ...prev,
                    [key]: onChangeForm[key]
                }
            })
        }
        else if (key === 'maxWidth') {
            setStateForm((prev) => {
                return {
                    ...prev,
                    [key]: onChangeForm[key]
                }
            })
        }
        else {
            setStateForm((prev) => {
                return {
                    ...prev,
                    baseForm: {
                        ...prev.baseForm,
                        [key]: onChangeForm[key]
                    }
                }
            })
        }
    }

    
    const filterOption = (input, option, ) => {
        return (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
    }

    const setOrder = (order: IFormProps[]) => {
        const newOrder = order.map(item => item.id) as IWidgetObjectSummaryFormProps['baseForm']['sectionsToShow']

        setStateForm(state => {
            return {
                ...state,
                baseForm: {
                    ...state.baseForm,
                    sectionsToShow: newOrder
                }
            }
        })
    }

    const getFormState = (state: IWidgetObjectLinkedSharesFormProps) => {
        setStateForm(prev => {
            return {
                ...prev,
                objectLinkedShares: state
            }
        })
    }
    const getFormState2 = (state: TStateFormType) => {
        setStateForm(prev => {
            return {
                ...prev,
                objectOAttrs: state
            }
        })
    }
    const getFormState3 = (state: IObjectOAttrStateProps) => {
        setStateForm(prev => {
            return {
                ...prev,
                objectOAStates: state
            }
        })
    }
    
    const serviceForm = (
        <>
            <Form.Item 
                name="representationType"
                label="Представление"
            >
                <Select
                    options={representationTypeList}
                    placeholder="Выберите тип представления"
                />
            </Form.Item>
   
            <Form.Item name="maxWidth" label="Отображение на всю ширину" valuePropName="checked">
                <Switch />
            </Form.Item>
            <Form.Item
                name="labelsContainerHeight"
                label="Высота контейнера для плашек"
            >
                <Input type="number" />
            </Form.Item>
            <Form.Item name="labelsCount" label="Количество отображаемых плашек"><Input type="number" /></Form.Item>
        </>

    )

    // const attrsForm = (
    //     <Form.Item 
    //         name="heightOAttrs"
    //         label="Высота виджета"
    //         style={{ width: 400 }}
    //     >
    //         <Input type="number" />
    //     </Form.Item>
    // )
   
    const tabItems = stateForm.baseForm.sectionsToShow.map(item => { 
        const name = sectionsList.find(section => section.value === item)?.label
        const formItem = () => {
            switch (item) {
                case 'objectLinkedShares': {
                    return (
                        <ObjectLinkedSharesForm 
                            settings={{
                                widget: {
                                    ...objectLinkedShares,
                                    ...{
                                        viewProps: { 
                                            ...objectLinkedShares?.viewProps,
                                            height: objectLinkedShares?.viewProps.height ?? baseForm?.height,
                                            showObjectsTable: objectLinkedShares?.viewProps?.showObjectsTable ?? false
                                        }
                                    }
                                },
                                vtemplate,
                                view: {}
                            }}
                            getFormState={getFormState}
                        />
                    )
                }
                case 'objectOAttrState' : {
                    return (
                      
                        <OAttrStateForm
                            settings={{
                                widget: { ...objectOAStates }, vtemplate
                            }}
                            onChangeForm={getFormState3}
                        />
                    )
                }
                case 'objectOAttrs' : {
                    return      (
                        <OAForm
                            settings={{
                                widget: { ...objectOAttrs }, vtemplate
                            }}
                            onChangeForm={getFormState2}
                        />
                    )
                    // attrsForm
              
                }
                default: {
                    return <>aasfasf</>
                }
            }
        }

        return {
            key: item, 
            label: name,
            children: (
                <>
                    {formItem()}
                </>
            )
            
        }})    

    return (
        <Form.Provider>
            <Form
                name="form"
                form={form}
                layout="vertical"
                initialValues={initialValuesForm}
                onValuesChange={onValuesChange}
            >
                <Form.Item 
                    // style={{ maxWidth: 300 }}
                    name="sectionsToShow"
                    label="Выберите секции"
                    initialValue={stateForm.baseForm.sectionsToShow}
                >
                    <Select
                        options={sectionsList}
                        placeholder="Выберите секции"
                        mode="multiple"
                        allowClear
                        filterOption={filterOption}
                        maxTagCount="responsive"
                    />
                </Form.Item>
                <div
                    style={{
                        display: (stateForm.baseForm.sectionsToShow.length === 0 || undefined || null) 
                            ? 'none' 
                            : 'initial',
                    }}
                >
                    <span 
                        style={{ 
                            textAlign: 'center' 
                        }}
                    >
                        Порядок отображения секций слева направо
                    </span>
                    <DndGroupList
                        strategy="horizontal"
                        dragOrder={stateForm.baseForm.sectionsToShow.reduce((acc, sectionName) => {
                            const section = sectionsList.find(item => item.value === sectionName)
                            
                            acc.push({
                                id: section.value,
                                name: section.label
                            })
                            
                            return acc
                        }, [])}
                        setOrder={setOrder}
                        customDNDStyles={{
                            paddingLeft: 0
                        }}
                    />
                </div>
             
            </Form>
            <Tabs 
                items={tabItems}
            />
        </Form.Provider>
        
    )
}

export default WidgetObjectSummaryForm
/* eslint-disable react/jsx-max-depth */
import { FC, useEffect, useState } from 'react'
import { TWidgetFormSettings } from '../widget-types'
import { Button, Checkbox, Form } from 'antd'
import { ITargetLinkingClassesForm } from '@containers/classes/TargetLinkingClassesForm/TargetLinkingClassesForm'
import { useForm, useWatch } from 'antd/es/form/Form'
import { Input, Select } from '@shared/ui/forms'
import { selectClassByIndex, selectClasses, useClassesStore } from '@shared/stores/classes'
import { PACKAGE_AREA } from '@shared/config/entities/package'
import { selectObjectByIndex, useObjectsStore } from '@shared/stores/objects'
import { ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
import { ClassesCascader } from '@entities/classes/ClassesCascader/ClassesCascader'
import { OpUnitType } from 'dayjs'
import { CAM_VisualSettingsForm } from './CAM_VisualSettingsForm'
import { ICenterAnalysisMetricsProps } from './CenterAnalysisMetrics/cam.types'
import { defaultVisualSettings } from './CenterAnalysisMetrics/cam.utils'

interface IOption {
    label: string
    value: number
}
interface IOptionsList {
    label: string
    title: string    
    options: IOption[]
}
export interface IWidgetCenterAnalysisMetricsFormProps {
    rootClasses: number[]
    rootObjects: number[]
    classes: ITargetLinkingClassesForm[]
    height?: number
    chartHeight?: number
    legendPosition?: 'bottom' | 'top' | 'left' | 'right'
    defaultPeriod?: OpUnitType | string
    defaultExpand?: boolean
    visual: ICenterAnalysisMetricsProps['camVisualSettings']
}

interface IDefaultOption {
    value: OpUnitType | string
    label: string
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

const WidgetCenterAnalysisMetricsForm: FC<TWidgetFormSettings<
    IWidgetCenterAnalysisMetricsFormProps
>> = (props) => {
    const { settings, onChangeForm } = props
    const { widget } = settings
    const { classes, rootClasses, rootObjects, height, 
        chartHeight, legendPosition, defaultPeriod, defaultExpand, visual } = widget ?? {}
    // console.log('settings', settings)
    const [form] = useForm()
    const currentRootClasses = useWatch('rootClasses', form)
    const initialFormValues: IWidgetCenterAnalysisMetricsFormProps = {
        rootClasses: rootClasses ?? [],
        rootObjects: rootObjects ?? [],
        classes: classes ?? [{
            target: [],
            linking: []
        }],
        height: height,
        chartHeight: chartHeight ?? 400,
        legendPosition: legendPosition ?? 'bottom',
        defaultPeriod: defaultPeriod,
        defaultExpand: defaultExpand,
        visual: Object.entries(defaultVisualSettings).reduce((res, groupItem) => {
            const [key, value] = groupItem

            if (!res[key]) {
                res[key] = {} as keyof ICenterAnalysisMetricsProps['camVisualSettings'];
            }

            Object.keys(defaultVisualSettings[key]).forEach(item => {
                res[key][item] = visual?.[key]?.[item] ?? value?.[item]
            })

            return res
        }, {} as ICenterAnalysisMetricsProps['camVisualSettings'])
    }

    const [options, setOptions] = useState<{
        class: IOption[]
        object:  IOptionsList[]
    }>({
        class: [],
        object: []
    })

    // console.log('currentRootClasses', currentRootClasses)
    const storeClasses = useClassesStore(selectClasses)
    const getClassByIndex = useClassesStore(selectClassByIndex)
    const getObjectByIndex = useObjectsStore(selectObjectByIndex)

    const getClassesOptions = () => {
        return storeClasses
            .reduce((acc, cls) => {
                const idx = acc.findIndex(accItem => accItem.value === cls.id)
        
                if (idx < 0 && cls.package_id === PACKAGE_AREA.SUBJECT) {
                    acc.push({
                        label: cls.name,
                        value: cls.id
                    })
                }
        
                return acc
            }, [] as IOption[])
            .sort((a, b) => a.label.localeCompare(b.label)) ?? []
    } 

    useEffect(() => {
        setOptions(prev => ({ 
            ...prev, 
            class: getClassesOptions(),
        })) 
    }, [])

    useEffect(() => {
        setOptions(prev => ({ 
            ...prev, 
            object: getObjectOptions()
        })) 
    }, [currentRootClasses])    

    const getObjectOptions = () => {
        const currentClasses = form.getFieldValue('rootClasses') ?? []

        const newObjectOptions = currentClasses
            ?.reduce((acc, cls) => {
                const currClass = getClassByIndex('id', cls)
                const currObjects = getObjectByIndex('class_id', cls)

                const groupIdx = acc.findIndex(accItem => accItem.title === currClass?.id)

                if (groupIdx < 0) {
                    acc.push({
                        title: currClass?.id,
                        label: currClass?.name,
                        options: []
                    })
                }

                
                currObjects.forEach(obj => {
                    const newGroupIdx = groupIdx < 0 ? acc.length - 1 : groupIdx
                    const idx = acc[newGroupIdx].options.findIndex(accItem => accItem.value === obj.id)
        
                    if (idx < 0) {
                        acc[newGroupIdx].options.push({
                            label: obj.name,
                            value: obj.id
                        })
                    }

                })

                return acc
            }, [] as IOptionsList[])
            .map(group => {
                const newOptions = group.options.sort((a, b) => a.label.localeCompare(b.label))

                return {
                    ...group,
                    options: newOptions
                }
            })
            .sort((a, b) => {                
                return a.label.localeCompare(b.label) 
            }) ?? []

        return newObjectOptions ?? []
    }

    const formChange = (v, vs) => {
        onChangeForm<IWidgetCenterAnalysisMetricsFormProps>(vs)

        return v
    }

    const visualFormChange = (v, vs) => {
        const key = Object.keys(v)[0]
        const currentForm = form.getFieldsValue()

        const newVs = {
            ...vs,
            [key]: {
                ...vs[key],
                ...v[key]
            }
        }
        
        const newCurrentForm = {
            ...currentForm,
            visual: newVs
        }
        
        form.setFieldValue('visual', newVs)

        formChange(v, newCurrentForm)

        return v
    }
    
    return (
        <div>
            <Form
                form={form}
                layout="vertical"
                initialValues={initialFormValues}
                onValuesChange={formChange}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        // border: '1px solid #d9d9d9',
                        gap: 10,
                        padding: 10
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            flex: 1,
                        }}
                    >
                        <b>Общие настройки</b>
                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                border: '1px solid #d9d9d9',
                                padding: 10,
                                gap: 10,
                                marginBottom: 10,
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    marginBottom: 0,
                                    width: '100%'
                                }}
                            >
                                <div
                                    style={{
                                        maxWidth: 450
                                    }}
                                >
                                    Раскрывать дерево при первоначальной загрузке
                                </div>
                                <Form.Item
                                    name="defaultExpand"
                                    // label="Раскрывать дерево при первоначальной загрузке"
                                    style={{
                                        marginBottom: 0,
                                    }}
                                    valuePropName="checked"
                                >
                                    <Checkbox />
                                </Form.Item>
                            </div>
                            <Form.Item
                                name="height"
                                label="Высота виджета"
                                style={{
                                    marginBottom: 0,
                                    // minWidth: '135px',
                                    flex: '1 1 210px' 
                                }}
                            >
                                <Input
                                    placeholder="Отображать на всю высоту"
                                    type="number"
                                    step={1}
                                />
                            </Form.Item>
                            <Form.Item
                                name="chartHeight"
                                label="Высота графиков"
                                style={{
                                    marginBottom: 0,
                                    // minWidth: '135px',
                                    // flex: 1
                                    flex: '1 1 135px',
                                }}
                            >
                                <Input
                                    type="number"
                                    step={1}
                                />
                            </Form.Item>
                            <Form.Item
                                name="legendPosition"
                                label="Положение легенды"
                                style={{
                                    marginBottom: 0,
                                    flex: '1 1 155px',
                                    // minWidth: '155px',
                                    // flex: 1
                                }}
                            >
                                <Select 
                                    // placeholder="Выберите корневые объекты"
                                    options={[{
                                        label: 'Слева',
                                        value: 'left'
                                    }, {
                                        label: 'Снизу',
                                        value: 'bottom'
                                    }, {
                                        label: 'Сверху',
                                        value: 'top'
                                    }, {
                                        label: 'Справа',
                                        value: 'right'
                                    }]}
                                    allowClear
                                />
                            </Form.Item>
                            <Form.Item
                                name="defaultPeriod"
                                label="Отображаемый период"
                                style={{
                                    marginBottom: 0,
                                    // flex: '1 1 155px',
                                    // minWidth: '155px',
                                    // flex: 1
                                }}
                            >
                                <Select 
                                    // placeholder="Выберите корневые объекты"
                                    options={defaultPeriodOptions}
                                    allowClear
                                />
                            </Form.Item>
                        </div>
                        <b>Настройки отображения панелей</b>
                        <div
                            style={{
                                border: '1px solid #d9d9d9',
                                padding: 10,
                            }}
                        >
                            <Form.Item name="visual" style={{ margin: 0 }}>
                                <CAM_VisualSettingsForm 
                                    values={form.getFieldValue('visual')}
                                    // values={visualSettings}
                                    onChange={visualFormChange}
                                />

                            </Form.Item>
                        </div>
                        
                    </div>
                    <div
                        style={{
                            // width: '50%',
                            flex: 1,
                        }}
                    >
                        <b>Настройки корневых объектов</b>
                        <div
                            style={{
                                // width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                border: '1px solid #d9d9d9',
                                padding: 10,
                                gap: 10,
                                marginBottom: 10
                            }}
                        >
                            <Form.Item
                                name="rootClasses"
                                label="Корневые классы"
                                style={{
                                    marginBottom: 0
                                }}
                                onReset={() => form.setFieldsValue({ 
                                    rootClasses: [],
                                    rootObjects: []
                                })}
                            >
                                <Select 
                                    mode="multiple"
                                    // placeholder="Выберите корневые классы"
                                    options={options.class}
                                    maxTagCount="responsive"
                                    allowClear
                                />
                            </Form.Item>
                            <Form.Item
                                name="rootObjects"
                                label="Корневые объекты"
                                style={{
                                    marginBottom: 0
                                }}
                            >
                                <Select 
                                    // placeholder="Выберите корневые объекты"
                                    options={options.object}
                                    mode="multiple"
                                    maxTagCount="responsive"
                                    allowClear
                                />
                            </Form.Item>
                        </div>
                        <b>Настройки связанных классов</b>
                        <Form.List
                            name="classes"
                        >
                            {(fields, { add, remove }, { errors }) => (
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '12px',
                                    }}
                                >
                                    {fields.map((field, index) => {
                                        return (
                                            <div
                                                key={`group-${field.key}`}
                                                style={{
                                                    position: 'relative',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '12px',
                                                    padding: 10,
                                                    border: '1px solid #d9d9d9'
                                                }}
                                            >
                                                {fields.length > 1 && (
                                                    <div
                                                        onClick={() => {
                                                            remove(field.name)
                                                        }}
                                                        style={{
                                                            position: 'absolute',
                                                            right: 5,
                                                            top: 0,
                                                            zIndex: 1000,
                                                        }}
                                                    >
                                                        <ECIconView 
                                                            icon="CloseOutlined" 
                                                            style={{ 
                                                                cursor: 'pointer', 
                                                                fontSize: 12 
                                                            }}  
                                                        />
                                                    </div>
                                                )}
                                                <Form.Item
                                                    key={`${field.key}-target-${index}`}
                                                    label="Целевые классы"
                                                    name={[field.name, 'target']}
                                                    style={{
                                                        marginBottom: 0,
                                                    }}
                                                >
                                                    <ClassesCascader />
                                                </Form.Item>
                                                <Form.Item
                                                    key={`${field.key}-linking-${index}`}
                                                    label="Связующие классы"
                                                    name={[field.name, 'linking']}
                                                    style={{ 
                                                        marginBottom: 12,
                                                    }}
                                                >
                                                    <ClassesCascader />
                                                </Form.Item>
                                            </div>
                                        )})}
                                    <Form.Item
                                        style={{
                                            marginBottom: 0
                                        }}
                                    >
                                        <Button
                                            onClick={() => add({
                                                target: [],
                                                linking: [],
                                            })}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                background: 'while',
                                                color: 'black',
                                            }}
                                        >
                                            <ECIconView icon="PlusCircleOutlined" />
                                        </Button>
                                        <Form.ErrorList errors={errors} />
                                    </Form.Item>
                                </div>
                            )}
                        </Form.List>
                    </div>
                </div>
            </Form>        
        </div>
    )
}

export default WidgetCenterAnalysisMetricsForm
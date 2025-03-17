/* eslint-disable react/jsx-max-depth */
import { Form, Input } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { FC, useEffect } from 'react'
import { defaultVisualSettings } from './CenterAnalysisMetrics/cam.utils'
import { ICenterAnalysisMetricsProps } from './CenterAnalysisMetrics/cam.types'
import ECColorPicker from '@shared/ui/ECUIKit/forms/ECColorPicker/ECColorPicker'
import { ECSelect } from '@shared/ui/forms'

interface IProps {
    values?: ICenterAnalysisMetricsProps['camVisualSettings']
    onChange?: (v: any, vs: any) => any
}

export const CAM_VisualSettingsForm: FC<IProps> = ({ values, onChange }) => {
    const [form] = useForm()
    
    useEffect(() => {
        const newFormValues = Object.entries(defaultVisualSettings).reduce((res, groupItem) => {
            const [key, value] = groupItem
    
            if (!res[key]) {
                res[key] = {} as keyof ICenterAnalysisMetricsProps['camVisualSettings'];
            }
    
            Object.keys(defaultVisualSettings[key]).forEach(item => {
                res[key][item] = values?.[key]?.[item] ?? value?.[item]
            })
    
            return res
        }, {} as ICenterAnalysisMetricsProps['camVisualSettings'])

        form.setFieldsValue(newFormValues)
        
    }, [values])

    const formChange = (v, vs) => {
        if (onChange) {
            onChange(v, vs)
        }
    }

    return (
        <Form
            layout="vertical"
            form={form}
            // initialValues={initialValues}
            onValuesChange={formChange}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <b>Общий макет</b>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        border: '1px solid #d9d9d9',
                        padding: 10,
                    }}
                >
                    
                    <b style={{ margin: 0 }}>Отступы между панелями</b>
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            flexDirection: 'row',
                            gap: 10,
                            marginBottom: 10
                        }}
                    >
                        <Form.Item 
                            name={['layout', 'verticalGap']} 
                            label="Вертикальный"
                            style={{ 
                                margin: 0, 
                                maxWidth: 120
                            }}
                        >
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item 
                            name={['layout', 'horizontalGap']} 
                            label="Горизонтальный"
                            style={{ 
                                margin: 0, 
                                maxWidth: 120
                            }}
                        >
                            <Input type="number" />
                        </Form.Item>
                    </div>
                    <b style={{ margin: 0 }}>Границы блоков</b>
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            flexDirection: 'row',
                            gap: 10,
                            marginBottom: 10
                        }}
                    >
                        <Form.Item 
                            name={['layout', 'borderWidth']}
                            label="Толщина границы"
                            style={{ 
                                margin: 0, 
                                maxWidth: 140
                            }}
                        >
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item 
                            name={['layout', 'borderRadius']} 
                            label="Радиус закругления"
                            style={{ 
                                margin: 0, 
                                maxWidth: 160
                            }}
                        >
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item 
                            name={['layout', 'borderColor']} 
                            label="Цвет границы"
                            style={{ 
                                margin: 0, 
                                flex: 1
                                // maxWidth: 100
                            }}
                        >
                            <ECColorPicker />
                        </Form.Item>
                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                flexDirection: 'row',
                                gap: 10,
                                marginBottom: 10
                            }}
                        >
                            <Form.Item 
                                name={['layout', 'boxShadowWidth']} 
                                label="Ширина тени"
                                style={{ 
                                    margin: 0, 
                                    maxWidth: 110
                                }}
                            >
                                <Input type="number" />
                            </Form.Item>
                            <Form.Item 
                                name={['layout', 'boxShadowColor']} 
                                label="Цвет тени"
                                style={{ 
                                    margin: 0, 
                                    maxWidth: 100
                                }}
                            >
                                <ECColorPicker />
                            </Form.Item>
                        </div>
                        
                    </div>
                    {/* <b style={{ margin: 0 }}>Остальные настройки</b>
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            flexDirection: 'row',
                            gap: 10,
                            marginBottom: 10
                        }}
                    >
                        <Form.Item 
                            name={['layout', 'backgroundColor']} 
                            label="Цвет фона"
                            style={{ 
                                margin: 0, 
                                maxWidth: 100
                            }}
                        >
                            <ECColorPicker />
                        </Form.Item>
                    </div> */}
                </div>
                <b>Дерево объектов</b>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        border: '1px solid #d9d9d9',
                        padding: 10
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            flexDirection: 'row',
                            gap: 10,
                            marginBottom: 10
                        }}
                    >
                        <Form.Item
                            label="Ширина дерева объектов"
                            name={['tree', 'width']}
                            style={{
                                margin: 0,
                                maxWidth: 200
                            }}
                        >
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item
                            label="Единица измерения ширины дерева объектов"
                            name={['tree', 'widthUnit']}
                            style={{
                                margin: 0,
                                // maxWidth: 200
                            }}
                        >
                            <ECSelect 
                                allowClear={false}
                                options={[{
                                    value: 'px',
                                    label: 'px',
                                }, {
                                    value: '%',
                                    label: '%',
                                }]}
                                style={{
                                    margin: 0,
                                    maxWidth: 60
                                }}
                            />
                        </Form.Item>
                    </div>
                </div>
                <b>Зона графиков</b>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        border: '1px solid #d9d9d9',
                        padding: 10
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            flexDirection: 'row',
                            gap: 10,
                            marginBottom: 10
                        }}
                    >
                        <Form.Item
                            label="Отступ от границы зоны"
                            name={['chart', 'padding']}
                            style={{
                                margin: 0,
                                maxWidth: 200
                            }}
                        >
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item
                            label="Отступ между зонами графиков"
                            name={['chart', 'zonesGap']}
                            style={{
                                margin: 0,
                                maxWidth: 250
                            }}
                        >
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item
                            label="Отступ между графиками"
                            name={['chart', 'graphGap']}
                            style={{
                                margin: 0,
                                maxWidth: 250
                            }}
                        >
                            <Input type="number" />
                        </Form.Item>
                    </div>
                </div>
            </div>
        </Form>
    )
}
/* eslint-disable max-len */
import { FC } from 'react'
import { IWidgetObjectLinkedSharesFormProps } from './WidgetObjectLinkedSharesForm'
import { ECTooltip } from '@shared/ui/tooltips'
import { Select, Input, Switch } from '@shared/ui/forms'
import { ColorPicker, Form } from 'antd'

// eslint-disable-next-line max-len
export const RepresentationForms: FC<{stateForm: IWidgetObjectLinkedSharesFormProps}> = ({ stateForm }) => {

    if (stateForm.representationType === 'pieChart') {
    
        const viewProps: IWidgetObjectLinkedSharesFormProps<typeof stateForm.representationType>['viewProps'] = stateForm.viewProps

        return (
            <>
                <div 
                    style={{
                        display: 'flex',
                        width: '100%',
                        gap: 24
                    }}
                >
                    <Form.Item 
                        name={['viewProps', 'chartTitle']}
                        label="Название графика"
                        // initialValue={viewProps.chartTitle}
                        style={{
                            flex: 1,
                            marginBottom: 10,
                        }}
                    >
                
                        <Input type="text" />
                    </Form.Item>
                    <Form.Item 
                        name={['viewProps', 'showShortName']}
                        label="Вывод короткого наименования"
                        // initialValue={viewProps.legendRatio}
                        style={{ 
                            flex: 0.3,
                            marginBottom: 10,
                        }}
                        valuePropName="checked"
                    >
                            
                        <Switch />
                    </Form.Item>
                    <Form.Item 
                        name={['viewProps', 'showCategoryTitle']}
                        label="Показывать название категории"
                        // initialValue={viewProps.legendRatio}
                        style={{ 
                            flex: 0.3,
                            marginBottom: 10,
                        }}
                        valuePropName="checked"
                    >
                            
                        <Switch />
                    </Form.Item>
                    <ECTooltip
                        trigger={['focus']}
                        title="Введите количество знаков после запятой"
                        align={{
                            offset: [0, 24]
                        }}
                    >
                        <Form.Item 
                            name={['viewProps', 'roundDigits']}
                            label="Округление"
                            // initialValue={viewProps.height}
                            style={{
                                flex: 0.15,
                                marginBottom: 10,
                            }}
                        >
                            <Input type="number" />
                        </Form.Item>
                    </ECTooltip>
                    <ECTooltip
                        trigger={['focus']}
                        title="Введите высоту графика"
                        align={{
                            offset: [0, 24]
                        }}
                    >
                        <Form.Item 
                            name={['viewProps', 'height']}
                            label="Высота виджета"
                            // initialValue={viewProps.height}
                            style={{
                                flex: 0.3,
                                marginBottom: 10,
                            }}
                        >
                            <Input type="number" />
                        </Form.Item>
                    </ECTooltip>
                </div>

                <div 
                    style={{
                        display: 'flex',
                        width: '100%',
                        gap: 24
                    }}
                >

                    <Form.Item 
                        name={['viewProps', 'legendEnabled']}
                        valuePropName="checked"
                        label="Легенда"
                        // initialValue={viewProps.legendEnabled}
                        style={{
                            marginBottom: 10,
                        }}
                    >
                        <Switch />
                    </Form.Item>
                    <ECTooltip
                        trigger={['focus']}
                        title={`Введите число от 1 до ${
                            viewProps.legendEnabled
                                ? ['right', 'left'].includes(viewProps?.orientation)
                                    ? 100
                                    : viewProps.legendRatio 
                                        ? 100 - viewProps.legendRatio 
                                        : 99
                                : 100}`}
                        align={{
                            offset: [0, 24]
                        }}
                    >
                        <Form.Item 
                            name={['viewProps', 'chartRatio']}
                            label="Высота графика, %"
                            // initialValue={viewProps.chartRatio}
                            style={{
                                flex: 0.3,
                                marginBottom: 10,
                            }}
                        >
                    
                            <Input type="number" />
                        </Form.Item>
                    </ECTooltip>
                    {viewProps.legendEnabled && (
                        <>
                            <ECTooltip
                                trigger={['focus']}
                                title={`Введите число от 1 до ${
                                    ['right', 'left'].includes(viewProps?.orientation)
                                        ? 100
                                        : viewProps.chartRatio 
                                            ? 100 - viewProps.chartRatio 
                                            : 99}`}
                                align={{
                                    offset: [0, 24]
                                }}
                            >
                                <Form.Item 
                                    name={['viewProps', 'legendRatio']}
                                    label="Высота легенды? %"
                                    // initialValue={viewProps.legendRatio}
                                    style={{ 
                                        flex: 0.3,
                                        marginBottom: 10,
                                    }}
                                >
                            
                                    <Input type="number" />
                                </Form.Item>
                            </ECTooltip>
                            <Form.Item 
                                name={['viewProps', 'showNames']}
                                valuePropName="checked"
                                label="Названия"
                                // initialValue={viewProps.legendEnabled}
                                style={{
                                    width: 70,
                                    marginBottom: 10,
                                }}
                            >
                                <Switch />
                            </Form.Item>
                            <Form.Item 
                                name={['viewProps', 'orientation']}
                                label="Положение легенды"
                                style={{
                                    // width: 70,
                                    marginBottom: 10,
                                }}
                            >
                                <Select 
                                    placeholder="Выберите тип значения"
                                    options={[
                                        {
                                            label: 'Слева',
                                            value: 'left'
                                        }, {
                                            label: 'Справа',
                                            value: 'right'
                                        }, {
                                            label: 'Снизу',
                                            value: 'bottom'
                                        }, {
                                            label: 'Сверху',
                                            value: 'top'
                                        }
                                    ]}
                                />
                            </Form.Item>
                            <Form.Item 
                                name={['viewProps', 'showObjectsTable']}
                                valuePropName="checked"
                                label="Вывод таблицы объектов"
                                // initialValue={viewProps.legendEnabled}
                                style={{
                                    width: 200,
                                    marginBottom: 10,
                                }}
                            >
                                <Switch />
                            </Form.Item>
                        </>
                    )}
                </div>
            </>
        )
    }

    if (stateForm.representationType === 'treemap') {

        const viewProps: IWidgetObjectLinkedSharesFormProps<typeof stateForm.representationType>['viewProps'] = stateForm.viewProps

        return (
            <div 
                style={{
                    display: 'flex',
                    width: '100%',
                    gap: 24
                }}
            >
                <ECTooltip
                    trigger={['focus']}
                    title="Введите высоту графика"
                    align={{
                        offset: [0, 24]
                    }}
                >
                    <Form.Item 
                        name={['viewProps', 'height']}
                        label="Высота виджета"
                        style={{
                            flex: 0.3,
                            marginBottom: 10,
                        }}
                    >
                        <Input type="number" value={viewProps.height} />
                    </Form.Item>
                </ECTooltip>
                <Form.Item 
                    name={['viewProps', 'valueDisplayType']}
                    label="Тип отображения значений"
                    // initialValue={viewProps.valueDisplayType}
                    style={{ 
                        flex: 0.4,
                        marginBottom: 10,
                    }}
                >
                    <Select 
                        placeholder="Выберите тип значения"
                        options={[{
                            label: 'Изначальное значение 1',
                            value: 'absolute'
                        },
                        {
                            label: 'Значенение в процентах 1%',
                            value: 'percent'
                        },
                        {
                            label: 'В изначальное + в процентах 1 (1%)',
                            value: 'combine'
                        }
                        ]}
                    />
                </Form.Item>
            </div>
        )
    }

    if (stateForm.representationType === 'progressBar') {

        const viewProps: IWidgetObjectLinkedSharesFormProps<typeof stateForm.representationType>['viewProps'] = stateForm.viewProps

        return (
            <div 
                style={{
                    display: 'flex',
                    width: '100%',
                    gap: 24
                }}
            >
                <Form.Item 
                    name={['viewProps', 'height']}
                    label="Высота виджета"
                    // initialValue={viewProps.height}
                    style={{
                        flex: 0.2,
                        marginBottom: 10,
                    }}
                >
                    <Input type="number" />
                </Form.Item>
                <Form.Item 
                    name={['viewProps', 'iconColor']}
                    label="Цвет иконок"
                    // initialValue={viewProps.iconColor}
                    style={{
                        flex: 0.1,
                        marginBottom: 10,
                    }}
                    getValueFromEvent={(color) => {
                        return '#' + color.toHex();
                    }}
                >
                    <ColorPicker format="hex" defaultFormat="hex" showText />
                </Form.Item>
                <Form.Item 
                    name={['viewProps', 'rightFromTitleView']}
                    label="Тип значения (Справа от заголовка)"
                    // initialValue={viewProps.rightFromTitleView}
                    style={{ 
                        flex: 0.4,
                        marginBottom: 10,
                    }}
                >
                    <Select 
                        placeholder="Выберите тип значения"
                        options={[{
                            label: 'Изначальное значение',
                            value: 'absolute'
                        },
                        {
                            label: 'Процентное значение',
                            value: 'percent'
                        }
                        ]}
                    />
                </Form.Item>
                <Form.Item 
                    name={['viewProps', 'rightFromProgressBarView']}
                    label="Тип значения (Справа от прогресс-бара)"
                    // initialValue={viewProps.rightFromProgressBarView}
                    style={{ 
                        flex: 0.4,
                        marginBottom: 10,
                    }}
                >
                    <Select 
                        placeholder="Выберите тип значения"
                        options={[{
                            label: 'Изначальное значение',
                            value: 'absolute'
                        },
                        {
                            label: 'Процентное значение',
                            value: 'percent'
                        }
                        ]}
                    />
                </Form.Item>
                {/* <Form.Item 
                    name={['viewProps', 'precentType']}
                    label="Отображение процентов"
                    style={{ 
                        flex: 0.4,
                        marginBottom: 10,
                    }}
                    initialValue="calculated"
                >
                    <Select 
                        placeholder="Выберите тип значения"
                        options={[{
                            label: 'Изначальное значение',
                            value: 'absolute'
                        },
                        {
                            label: 'Вычисленное значение в процентах',
                            value: 'calculated'
                        }
                        ]}
                    />
                </Form.Item> */}
            </div>
        )
    }

    
    if (stateForm.representationType === 'statePorts') {

        const viewProps: IWidgetObjectLinkedSharesFormProps<typeof stateForm.representationType>['viewProps'] = stateForm.viewProps

        return (
            <Form.Item 
                name={['viewProps', 'directionViewPorts']}
                label="Направление отображения портов"
                // initialValue={viewProps.directionViewPorts}
                style={{ 
                    flex: 0.4,
                    marginBottom: 10,
                }}
            >
                <Select 
                    placeholder="Выберите направление"
                    options={[{
                        label: 'Горизонтально',
                        value: 'horizontal'
                    },
                    {
                        label: 'Вертикально',
                        value: 'vertical'
                    }
                    ]}
                />
            </Form.Item>
        )
    }

    if (stateForm.representationType === 'verticalHistogram') {
        return (
            <div
                style={{
                    display: 'flex',
                    width: '100%',
                    gap: 24,
                }}
            >
                <Form.Item
                    name={['viewProps', 'height']}
                    label="Высота виджета"
                    // initialValue={viewProps.height}
                    style={{
                        flex: 0.2,
                        marginBottom: 10,
                    }}
                >
                    <Input type="number" />
                </Form.Item>
                <Form.Item
                    name={['viewProps', 'legendItemWidth']}
                    label="Длина заголовка в легенде"
                    // initialValue={viewProps.height}
                    style={{
                        flex: 0.2,
                        marginBottom: 10,
                    }}
                >
                    <Input type="number" />
                </Form.Item>
                <Form.Item
                    name={['viewProps', 'legendOffset']}
                    label="Отступ легенды от левого края"
                    // initialValue={viewProps.height}
                    style={{
                        flex: 0.2,
                        marginBottom: 10,
                    }}
                >
                    <Input type="number" />
                </Form.Item>
                <Form.Item
                    name={['viewProps', 'maxValue']}
                    label="Граница значений в графике"
                    // initialValue={viewProps.height}
                    style={{
                        flex: 0.2,
                        marginBottom: 10,
                    }}
                >
                    <Input type="number" min= {1} />
                </Form.Item>
                <Form.Item
                    name={['viewProps', 'showPercents']}
                    valuePropName="checked"
                    label="Отображать проценты"
                    // initialValue={viewProps.height}
                    style={{
                        flex: 0.2,
                        marginBottom: 10,
                    }}
                >
                    <Switch  />
                </Form.Item>
            </div>
        )
    }

    return null
}
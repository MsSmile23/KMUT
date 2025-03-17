import { styleParamsType } from '@containers/widgets/widget-types';
import { CheckBox, Input } from '@shared/ui/forms';
import { ColorPicker, ConfigProvider, Form } from 'antd';
import { FC, useEffect } from 'react';


const buttonWidth = 60;

interface SettingVisualTab {
    onChange: <T>(key: string, value: T) => void
    value: styleParamsType
    isTitleShow: boolean
}

const SettingVisualTab: FC<SettingVisualTab> = (props) => {

    const { onChange, value, isTitleShow = false } = props
    const [form] = Form.useForm();

    // useEffect(() => {
    //     if (value) {
    //         form.setFieldsValue(value)
    //     }

    //     console.log('test', value)
    // }, [])

    // useEffect(()=>{
    //     console.log('ФОрма поменялась', form.getFieldsValue())
    // },[form.getFieldsValue()])

    return (
        <ConfigProvider
            button={{
                style: { width: buttonWidth, margin: 4 },
            }}
        >
            <Form
                form={form}
                initialValues={value}
                onValuesChange={(changedValues, _) => {
                    if ('borderColor' in changedValues) {
                        onChange<string>('borderColor', changedValues?.['borderColor']?.toHexString())
                    } else {
                        const key = Object.keys(changedValues)

                        onChange<number>(key[0], Number(changedValues?.[key[0]]))
                    }
                }}
            >
            
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 70,
                        width: 400,
                        height: 400,
                        border: `${Number(value?.borderThickness)}px solid ${value?.borderColor}`,
                        borderTopLeftRadius: Number(value?.borderRadiusTopLeft),
                        borderTopRightRadius: Number(value?.borderRadiusTopRight),
                        borderBottomLeftRadius: Number(value?.borderRadiusBottomLeft),
                        borderBottomRightRadius: Number(value?.borderRadiusBottomRight),
                        padding: 70,
                        position: 'relative',
                        marginBottom: 20
                    }}
                >
                    <div style={{ position: 'absolute', top: 5, left: 5 }}>Границы зоны</div>
                    {isTitleShow &&
                    <div
                        style={{
                            display: 'flex',
                            width: 400,
                            height: 70,
                        }}
                    >
                        <Form.Item
                            noStyle
                            name="paddingOutTitleLeft"
                        >
                            <Input
                                type="number"
                                style={{
                                    width: buttonWidth,
                                    position: 'absolute',
                                    left: 0,
                                    top: '15%',
                                    transform: 'translate(10%,+30%)'
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            noStyle
                            name="paddingOutTitleTop"
                        >
                            <Input
                                type="number"
                                style={{
                                    width: buttonWidth,
                                    position: 'absolute',
                                    top: 18,
                                    left: 0,
                                    right: 0,
                                    marginLeft: 'auto',
                                    marginRight: 'auto'
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            noStyle
                            name="paddingOutTitleRight"
                        >
                            <Input
                                type="number"
                                style={{
                                    width: buttonWidth,
                                    position: 'absolute',
                                    right: 10,
                                    top: '15%',
                                    transform: 'translate(10%,+30%)'
                                }}
                            />
                        </Form.Item>

                        <div
                            style={{ 
                                flex: 1, 
                                display: 'flex', 
                                border: '1px solid black', 
                                justifyContent: 'center', 
                                alignItems: 'center'
                            }}
                        >
                            <div>Заголовок</div>
                        </div>
                    </div>}
                    <Form.Item
                        noStyle
                        name="paddingOutWidgetLeft"
                    >
                        <Input
                            type="number"
                            style={{
                                width: buttonWidth,
                                position: 'absolute',
                                left: 0,
                                top: isTitleShow ? '60%' : '47%',
                                transform: 'translate(10%,0%)'
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        noStyle
                        name="paddingOutWidgetTop"
                    >
                        <Input
                            type="number"
                            style={{
                                width: buttonWidth,
                                position: 'absolute',
                                top: isTitleShow ? 158 : 18,
                                left: 0,
                                right: 0,
                                marginLeft: 'auto',
                                marginRight: 'auto'
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        noStyle
                        name="paddingOutWidgetBottom"
                    >
                        <Input
                            type="number"
                            style={{
                                width: buttonWidth,
                                position: 'absolute',
                                bottom: 18,
                                left: 0,
                                right: 0,
                                marginLeft: 'auto',
                                marginRight: 'auto'
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        noStyle
                        name="paddingOutWidgetRight"
                    >
                        <Input
                            type="number"
                            style={{
                                width: buttonWidth,
                                position: 'absolute',
                                right: 10,
                                top: isTitleShow ? '60%' : '47%',
                                transform: 'translate(10%,0%)'
                            }}
                        />
                    </Form.Item>

                    <div
                        style={{ 
                            flex: 1, 
                            display: 'flex', 
                            border: '1px solid black', 
                            padding: 70, 
                            position: 'relative'
                        }}
                    >
                        <div style={{ position: 'absolute', top: 5, left: 5 }}>Границы виджета</div>
                        <Form.Item
                            noStyle
                            name="paddingInWidgetLeft"
                        >
                            <Input
                                type="number"
                                style={{
                                    width: buttonWidth,
                                    position: 'absolute',
                                    left: 0,
                                    top: '50%',
                                    transform: 'translate(10%,-50%)'
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            noStyle
                            name="paddingInWidgetTop"
                        >
                            <Input
                                type="number"
                                style={{
                                    width: buttonWidth,
                                    position: 'absolute',
                                    top: 18,
                                    left: 0,
                                    right: 0,
                                    marginLeft: 'auto',
                                    marginRight: 'auto'
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            noStyle
                            name="paddingInWidgetBottom"
                        >
                            <Input
                                type="number"
                                style={{
                                    width: buttonWidth,
                                    position: 'absolute',
                                    bottom: 18,
                                    left: 0,
                                    right: 0,
                                    marginLeft: 'auto',
                                    marginRight: 'auto'
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            noStyle
                            name="paddingInWidgetRight"
                        >
                            <Input
                                type="number"
                                style={{
                                    width: buttonWidth,
                                    position: 'absolute',
                                    right: 10,
                                    top: '50%',
                                    transform: 'translate(10%,-50%)'
                                }}
                            />
                        </Form.Item>

                        <div
                            style={{ 
                                flex: 1, 
                                display: 'flex', 
                                border: '1px solid black', 
                                justifyContent: 'center', 
                                alignItems: 'center'
                            }}
                        >
                            <div>Контент</div>
                        </div>
                    </div>
                </div>

                <Form.Item
                    name="borderThickness"
                    label="Толщина границ"

                >
                    <Input type="number" style={{ width: buttonWidth }} />
                </Form.Item>
                <Form.Item
                    name="borderColor"
                    label="Цвет границы"
                >
                    <ColorPicker />
                </Form.Item>

                <div style={{ marginBottom: 10 }}>Закругление границ:</div>
                <div style={{ width: 150, display: 'flex', flexDirection: 'revert', gap: 10 }}>
                    <div style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: 10 }}>
                        <Form.Item
                            noStyle
                            name="borderRadiusTopLeft"
                        >
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item
                            noStyle
                            name="borderRadiusBottomLeft"
                        >
                            <Input type="number" />
                        </Form.Item>
                    </div>
                    <div style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: 10 }}>
                        <Form.Item
                            noStyle
                            name="borderRadiusTopRight"
                        >
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item
                            noStyle
                            name="borderRadiusBottomRight"
                        >
                            <Input type="number" />
                        </Form.Item>
                    </div>
                </div>
                <Form.Item name="widgetBorderEnable" valuePropName="checked">
                    <CheckBox>Отключить границы зоны</CheckBox>
                </Form.Item>
            </Form>
        </ConfigProvider>
    )
}

export default SettingVisualTab
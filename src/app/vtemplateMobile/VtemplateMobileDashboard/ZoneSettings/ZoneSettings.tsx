import { useVtemplateStore } from '@shared/stores/vtemplate'
import { CheckBox } from '@shared/ui/forms'
import { ColorPicker, Form, Input } from 'antd'
import { FC } from 'react'

const buttonWidth = 60;

const ZoneSettings: FC = () => {
    const { setZoneSettings, zone } = useVtemplateStore()

    const value = zone.wrapper?.style?.styleParams

    return (
        <Form
            initialValues={value}
            onValuesChange={(changedValues, _) => {
                if ('borderColor' in changedValues) {
                    setZoneSettings({ ...value, borderColor: changedValues?.['borderColor']?.toHexString() })
                } else if ('backgroundColor' in changedValues) {
                    setZoneSettings({ ...value, backgroundColor: changedValues?.['backgroundColor']?.toHexString() })
                } else {
                    const key = Object.keys(changedValues)

                    setZoneSettings({ ...value, [key[0]]: Number(changedValues?.[key[0]]) })
                }
            }}
            style={{ display: 'flex', columnGap: 20 }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 70,
                    width: 170,
                    height: 170,
                    border: `${Number(value?.borderThickness || 0)}px solid ${value?.borderColor}`,
                    borderTopLeftRadius: Number(value?.borderRadiusTopLeft) || 0,
                    borderTopRightRadius: Number(value?.borderRadiusTopRight) || 0,
                    borderBottomLeftRadius: Number(value?.borderRadiusBottomLeft) || 0,
                    borderBottomRightRadius: Number(value?.borderRadiusBottomRight) || 0,
                    padding: 70,
                    position: 'relative',
                    backgroundColor: value?.backgroundColor //'#f0f0f0', 
                }}
            >
                <div style={{ position: 'absolute', top: 5, left: 5 }}>Границы зоны</div>
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
                            top: '50%',
                            transform: 'translate(10%,-50%)'
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
                        position: 'relative',
                        background: '#fff'
                    }}
                >
                    <div style={{ position: 'absolute', top: 5, left: 5 }}>Границы виджета</div>
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
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
                <Form.Item
                    name="backgroundColor"
                    label="Цвет зоны"
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
                            <Input type="number"  />
                        </Form.Item>
                    </div>
                </div>
                <Form.Item name="widgetBorderEnable" valuePropName="checked">
                    <CheckBox>Отключить границы зоны (тень)</CheckBox>
                </Form.Item>
            </div>
        </Form>
    )
}

export default ZoneSettings
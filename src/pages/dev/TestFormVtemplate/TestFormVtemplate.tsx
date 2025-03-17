import { Widget } from "@containers/widgets"
import { WIDGETS, WIDGET_TYPES } from "@containers/widgets/widget-const"
import { TWidget } from "@containers/widgets/widget-types"
import { FC, useMemo, useState } from "react"

interface TestFormVtemplateProps {
    object_id?: number
    mnemo: TWidget['mnemo']
    height?: string | number
}

const TestFormVtemplate: FC<TestFormVtemplateProps> = ({ object_id, mnemo, height }) => {

    const [settingsFormWidget, setSettingsFormWidget] = useState<any>({})

    const arrSelectWidgets2 = useMemo(() => {
        return WIDGETS.some((item) => item.mnemo === mnemo)
    }, [mnemo])

    const settings: any = {
        settings: {
            widget: settingsFormWidget,
            vtemplate: {
                objectId: object_id
            }
        }
    }

    const onChangeSettingsWidgetForm = <T,>(data: T) => {
        if (object_id) {
            setSettingsFormWidget((prev) => {
                return {
                    ...prev,
                    ...data
                }
            })
        } else {
            setSettingsFormWidget(data)
        }
    }

    return (
        <div style={{ padding: 10 }}>
            {arrSelectWidgets2 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ /* maxWidth: 700,  */width: '100%' }}>
                    <h3 style={{ marginBottom: 10, fontWeight: 'bold', }}>Настройки</h3>
                    <div
                        style={{
                            border: '1px solid #bfbfbf',
                            borderRadius: 5,
                            // display: 'flex',
                            /*overflowY: auto;*/
                            padding: 10,
                            width: '100%',
                            boxSizing: 'border-box',
                            overflowY: 'auto',
                        }}
                    >
                        <Widget
                            settings={{
                                widget: settings.settings.widget,
                                vtemplate: settings.settings.vtemplate,
                                view: {}
                            }}
                            widgetMnemo={mnemo || ''}
                            widgetType={WIDGET_TYPES.WIDGET_TYPE_FORM}
                            onChangeForm={onChangeSettingsWidgetForm}
                        />
                    </div>
                </div>

                <div>
                    <h3 style={{ marginBottom: 10, fontWeight: 'bold', }}>Превью</h3>
                    <div
                        style={{
                            border: '1px solid #bfbfbf',
                            borderRadius: 5,
                            display: 'flex',
                            /*overflowY: auto;*/
                            height: height ?? 400,
                            width: '100%',
                            boxSizing: 'border-box',
                            overflowY: 'auto'
                        }}
                    >
                        {/* {
                            Object.keys(settingsFormWidget?.object || {})?.length || settingsFormWidget.objectId
                                ? ( */}
                                    <Widget
                                         settings={{
                                            widget: settings.settings.widget,
                                            vtemplate: settings.settings.vtemplate,
                                            view: {}
                                        }}
                                        widgetMnemo={mnemo}
                                        widgetType={WIDGET_TYPES.WIDGET_TYPE_PREVIEW}
                                    />
                                {/* )
                                : (
                                    <div
                                        style={{
                                            display: 'flex',
                                            flex: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            fontSize: 16
                                        }}
                                    >
                                        Выберите объект
                                    </div>
                                )
                        } */}
                    </div>

                </div>
            </div>
            )
        :(
            <div>Виджет не найден</div>
        )}
            
        </div>
    )
}

export default TestFormVtemplate
/* eslint-disable react/jsx-max-depth */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Select } from '@shared/ui/forms'
import { Col, Row, Tabs, TabsProps } from 'antd'
import { FC, memo, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { SettingsLabelTab } from './components/SettingsLabelTab'
import { SettingVisualTab } from './components/SettingsVisualTab'
import { WIDGETS, WIDGET_TYPES } from '../widget-const'
import Widget from '../Widget'
import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';
import { WrapperWidget } from '../WrapperWidget'
import { ButtonSettings } from '@shared/ui/buttons'
import { AppstoreAddOutlined, ArrowsAltOutlined, ShrinkOutlined } from '@ant-design/icons';
import { labelParamsType, styleParamsType, widgetType, wrapperTypeGetForm } from '../widget-types'
import './style.css'
import { ECTooltip } from '@shared/ui/tooltips'
import { useTheme } from '@shared/hooks/useTheme'

interface WidgetFormBaseProps {
    onChangeWidget: (mnemo: string) => void
    widgetMnemo: string,
    widget: widgetType
    width?: number,
    save?: (params: wrapperTypeGetForm, mnemo: string) => void
    exportWidget?: (widget: widgetType) => void
    fullscreen?: boolean
}

const initialParams: styleParamsType = {
    paddingOutWidgetTop: 0,
    paddingOutWidgetRight: 0,
    paddingOutWidgetLeft: 0,
    paddingOutWidgetBottom: 0,

    paddingInWidgetTop: 0,
    paddingInWidgetRight: 0,
    paddingInWidgetLeft: 0,
    paddingInWidgetBottom: 0,

    borderThickness: 0,

    borderColor: '#000',

    borderRadiusTopLeft: 0,
    borderRadiusTopRight: 0,
    borderRadiusBottomLeft: 0,
    borderRadiusBottomRight: 0,

    paddingOutTitleTop: 0,
    paddingOutTitleLeft: 5,
    paddingOutTitleRight: 5,
}

const initialLabels = {
    title_position: 'left',
    title_show: false,
    title_color: '#000000',
    title_text: ''
}

const WidgetFormBase: FC<WidgetFormBaseProps> = (props) => {

    const { onChangeWidget, widgetMnemo, widget, width = 200, save, exportWidget, fullscreen = false } = props
    const [height, setHeight] = useState<{ block_1: string | number, block_2: string | number }>({
        block_1: '100%',
        block_2: 50
    });

    const theme = useTheme()

    const [labelParams, setLabelParams] = useState<labelParamsType>(initialLabels)

    const [styleParams, setStyleParams] = useState<styleParamsType>(initialParams)

    const [settingsFormWidget, setSettingsFormWidget] = useState<any>({})

    const [baseDecoration, setBaseDecoration] = useState<any>(null)


    useLayoutEffect(() => {

        const localBaseDecoration: any = {}

        Object.keys(initialParams).forEach((key) => {
            localBaseDecoration[key] = theme?.baseDecoration?.[key] || initialParams[key]
        })

        if (theme?.baseDecoration?.borderRadius) {
            localBaseDecoration.borderRadiusTopLeft = theme?.baseDecoration?.borderRadius
            localBaseDecoration.borderRadiusTopRight = theme?.baseDecoration?.borderRadius
            localBaseDecoration.borderRadiusBottomLeft = theme?.baseDecoration?.borderRadius
            localBaseDecoration.borderRadiusBottomRight = theme?.baseDecoration?.borderRadius
        }

        setBaseDecoration(localBaseDecoration)
        



    }, [theme?.baseDecoration])

    useEffect(() => {
        if (widget?.widgetMnemo) {
            onChangeWidget(widget.widgetMnemo)
        }


        if (widget?.wrapper) {
            setLabelParams(widget?.wrapper?.style?.labelParams || initialLabels)
            setStyleParams(widget?.wrapper?.style?.styleParams || baseDecoration || initialParams)
        }

    }, [widget])

    useEffect(() => {
        if (
            Object.keys(widget?.settings?.widget || {})?.length
            && !!widget?.widgetMnemo
            && !!widgetMnemo && widget?.widgetMnemo !== widgetMnemo
        ) {
            setSettingsFormWidget({})
        } else {
            setSettingsFormWidget(widget?.settings?.widget)
        }
    }, [widget, widgetMnemo])

    const handleChangeLabelParams = <T, >(key: string, value: T) => {
        setLabelParams((prev) => {
            return {
                ...prev,
                [key]: value
            }
        })
    }

    const handleChangeStyleParams = <T, >(key: string, value: T) => {
        setStyleParams((prev) => {
            return {
                ...prev,
                [key]: value
            }
        })
    }

    const onChangeSettingsWidgetForm = <T, >(data: T) => {
        setSettingsFormWidget({ ...settingsFormWidget, ...data })
    }

    const settings: wrapperTypeGetForm = {
        style: {
            labelParams,
            styleParams
        },
        settings: {
            widget: settingsFormWidget,
            vtemplate: {
                ...widget.settings.vtemplate
            },
            baseSettings: widget.settings?.baseSettings
        }
    }

    const saveWidget = () => {
        save(settings, widgetMnemo)
    }

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Заголовок',
            children: (
                <SettingsLabelTab
                    onChange={handleChangeLabelParams}
                    values={labelParams}
                />
            )
        },
        {
            key: '2',
            label: 'Оформление',
            children:
                <SettingVisualTab
                    onChange={handleChangeStyleParams}
                    value={styleParams}
                    isTitleShow={labelParams?.title_show}
                />,
        },
        {
            key: '3',
            label: 'Настройки',
            children:
                <Widget
                    settings={{
                        widget: settings.settings.widget,
                        vtemplate: settings.settings.vtemplate,
                        baseSettings: widget.settings?.baseSettings
                    }}
                    widgetMnemo={widgetMnemo || ''}
                    widgetType={WIDGET_TYPES.WIDGET_TYPE_FORM}
                    onChangeForm={onChangeSettingsWidgetForm}
                />,
        },
        {
            key: '4',
            label: 'Представление',
            children: 'Компонент находится в разработке',
        }
    ];

    const arrSelectWidgets2 = useMemo(() => {
        return WIDGETS
            .map((item) => {
                return {
                    label: item.name,
                    value: item.mnemo
                }
            })
            .sort((a, b) => a.label.localeCompare(b.label))
    }, [])

    const onToggleHeight = (num: string) => {
        if (num === '2') {
            setHeight((prev) => {
                if (prev.block_2 === 50) {
                    return {
                        block_1: '50%',
                        block_2: '50%'
                    }
                }
                else {
                    return {
                        block_1: '100%',
                        block_2: 50
                    }
                }
            })
        }
    };

    const fullScreenPreview = (e) => {
        e.stopPropagation()
        setHeight((prev) => {
            if (prev.block_2 === 50 || prev.block_2 === '50%') {
                return {
                    block_1: 50,
                    block_2: '100%'
                }
            }

            if (prev.block_2 === '100%') {
                return {
                    block_1: '50%',
                    block_2: '50%'
                }
            }
        })
    }


    return (
        <div
            className="widgetBaseForm"
        >
            {!fullscreen && 
            <Row justify="space-between" align="middle">
                <Col>
                    <Select
                        placeholder="Выберите виджет"
                        value={widgetMnemo || undefined}
                        onChange={(value) => onChangeWidget(value)}
                        options={arrSelectWidgets2}
                        style={{ minWidth: 300, maxWidth: 500, width: '100%' }}
                    />
                </Col>
                <Col>
                    <div>
                        <ECTooltip title="Экспортировать виджет">
                            <ButtonSettings
                                shape="circle"
                                size="small"
                                onClick={() => exportWidget(widget)}
                                icon={false}
                            >
                                <AppstoreAddOutlined />
                            </ButtonSettings>
                        </ECTooltip>
                    </div>
                </Col>
            </Row>}
            

            <div style={{ width: 100, marginTop: 20, marginBottom: 20 }}>
                <ButtonSettings
                    icon={false}
                    type="primary"
                    disabled={!widgetMnemo}
                    onClick={saveWidget}
                >
                    Сохранить
                </ButtonSettings>
            </div>

            {!!widgetMnemo && (
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        border: '1px solid #f0f0f0',
                        borderTopRightRadius: 10,
                        borderTopLeftRadius: 10,
                        borderBottomRightRadius: 10,
                        borderBottomLeftRadius: 10,
                        // marginTop: 20,
                        height: 500,
                        overflow: 'hidden'
                    }}
                >
                    {/* Блок 1 */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: height.block_1,
                            transition: 'height 0.3s ease-in-out',
                            overflow: 'hidden'
                        }}
                    >
                        <div
                            onClick={() => onToggleHeight('1')}
                            style={{
                                backgroundColor: '#f0f0f0',
                                height: 50,
                                borderTopRightRadius: 10,
                                borderTopLeftRadius: 10,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                paddingLeft: 10,
                                flexShrink: 0
                            }}
                        >
                            <div>Настройки виджета</div>
                        </div>

                        <div style={{ marginTop: 10, padding: 10, overflowY: 'auto' }}>
                            <Tabs
                                type="card"
                                items={items}
                            />
                        </div>
                    </div>

                    {/* Блок 2 preview */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: height.block_2,
                            transition: 'height 0.3s ease-in-out',
                        }}
                    >
                        <div
                            onClick={() => height.block_2 === '100%' ? {} : onToggleHeight('2')}
                            style={{
                                backgroundColor: '#f0f0f0',
                                cursor: 'pointer',
                                height: 50,
                                borderBottomRightRadius: typeof height.block_2 === 'number' ? 10 : 0,
                                borderBottomLeftRadius: typeof height.block_2 === 'number' ? 10 : 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                paddingLeft: 10,
                                flexShrink: 0,
                                overflow: 'hidden',
                                zIndex: 999
                            }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'row', gap: 20 }}>
                                <div>Превью</div>
                                <div
                                    onClick={(e) => fullScreenPreview(e)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <ECTooltip
                                        placement="top"
                                        title={height.block_2 === '100%' ? 'Свернуть' : 'Развернуть'}
                                    >
                                        {height.block_2 === '100%'
                                            ? (<ShrinkOutlined />)
                                            : (<ArrowsAltOutlined />)}
                                    </ECTooltip>
                                </div>
                            </div>
                        </div>
                        {/* content */}
                        <div
                            style={{
                                height: '100%',
                                display: 'flex',
                                flex: 1,
                                overflowY: 'auto',
                                paddingLeft: 10,
                                paddingRight: 10,
                                paddingTop: typeof height.block_2 === 'number' ? 0 : 10
                            }}
                        >
                            <ResponsiveGridLayout
                                className="layout"
                                style={{
                                    background: 'rgb(245, 245, 245)',
                                    borderRadius: 10,
                                    overflow: 'hidden',
                                    minHeight: 300,
                                    flex: 1
                                }}
                                breakpoints={{ lg: 1200, md: 966, sm: 768, xs: 480, xxs: 0 }}
                                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                                rowHeight={100}
                                autoSize={true}
                                width={width}
                                isDraggable={false}
                                isResizable={false}
                            >
                                <div
                                    key="1"
                                    data-grid={{
                                        w: widget?.layout?.w,
                                        h: widget?.layout?.h,
                                        x: 0,
                                        y: 0
                                    }}
                                    style={{
                                        border: '1px solid grey',
                                        borderRadius: 5,
                                        display: 'flex',
                                        /*overflowY: auto;*/
                                        height: '100%',
                                        width: '100%',
                                        boxSizing: 'border-box',
                                        overflowY: 'auto'
                                    }}
                                >
                                    <WrapperWidget
                                        settings={settings}
                                    >
                                        <Widget
                                            settings={settings?.settings}
                                            widgetMnemo={widgetMnemo}
                                            widgetType={WIDGET_TYPES.WIDGET_TYPE_PREVIEW}
                                        />
                                    </WrapperWidget>
                                </div>
                            </ResponsiveGridLayout>
                        </div>
                    </div>

                </div>
            )}

        </div>
    )
}

export default memo(WidgetFormBase)
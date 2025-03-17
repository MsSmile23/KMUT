/* eslint-disable react-refresh/only-export-components */
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { Layout, Responsive as ResponsiveGridLayout } from 'react-grid-layout'
import { withSize } from 'react-sizeme'
import { v4 as uuidv4 } from 'uuid'
import { DefaultModal2 } from '@shared/ui/modals'
import TabBar from './TabBar'
import SettingsBarTemplate from './SettingsBarTemplate'
import { WrapperWidget } from '@containers/widgets/WrapperWidget'
import { Widget, WidgetFormBase } from '@containers/widgets'
import { WIDGET_TYPES } from '@containers/widgets/widget-const'
import { widgetType, wrapperType, wrapperTypeGetForm } from '@containers/widgets/widget-types'
import {
    TBuilderData,
    TInitialDataSettingVTType,
    layoutType,
} from '@containers/vtemplates/VtemplateFormContainer/types/types'
import { exportJson, readJsonFile } from '@containers/vtemplates/VtemplateFormContainer/services'
import { message } from 'antd'
import JSZip from 'jszip'
import FileSaver from 'file-saver'
import { initialDataLayout } from './data'
import { IObject } from '@shared/types/objects'
import { getLayouts } from './services'
import './style.css'
import { TPage } from '@shared/types/common'
import { useTheme } from '@shared/hooks/useTheme'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'

/**
 * @param size {width} - размер всего компонента, не прокидывается из вне(но можно), получаем динамически
 * @param editable - разрешить или запретить перетаскивание блоков и в целом любые действия с ними
 * @param onChange - динамически получать данные лаяута
 * @param objectId - ID объекта для добавления его в виджеты
 * @param dataResponse - готовые данные для отрисовки виджетов
 */

interface VtemplateDashboardViewProps {
    size: { width: number }
    editable?: boolean
    onChange?: (layout: layoutType) => void
    objectId?: IObject['id']
    dataResponse?: layoutType
    baseSettings?: TInitialDataSettingVTType
    isInterfaceShowcase?: boolean
    showSettingsInfo?: (widget?: widgetType) => void
    page?: TPage
    classes?: number[]
    builderData?: TBuilderData
}

const VtemplateDashboardView: FC<VtemplateDashboardViewProps> = (props) => {
    const {
        size: { width },
        editable = true,
        onChange,
        dataResponse,
        objectId,
        baseSettings,
        isInterfaceShowcase,
        showSettingsInfo,
        page,
        classes = [],
        builderData,
    } = props

    const [messageApi, contextHolder] = message.useMessage()
    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode

    const [dataLayout, setDataLayout] = useState<layoutType>(initialDataLayout)
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [selectWidget, setSelectWidget] = useState<string>('')
    const [widgetIdSettings, setWidgetIdSettings] = useState<string>('')

    const error = (message?: string) => {
        messageApi.open({
            type: 'error',
            content: message ? message : 'Ошибка сохранения',
        })
    }

    useEffect(() => {
        if (Object.keys(dataResponse || {})?.length) {
            setDataLayout(dataResponse)
        }
    }, [dataResponse])

    const [isRGLLoaded, setRGLLoaded] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setRGLLoaded(true)
        }, 100)
    }, [dataLayout])

    useEffect(() => {
        setDataLayout((prevDataLayout) => ({
            ...prevDataLayout,
            widgets: prevDataLayout?.widgets?.map((wid) => {
                return {
                    ...wid,
                    settings: {
                        ...wid.settings,
                        vtemplate: {
                            ...wid?.settings?.vtemplate,
                            objectId,
                            page,
                            classes,
                            builderData,
                            builderView: isInterfaceShowcase === false && !undefined ? true : false,
                        },
                        baseSettings: {
                            ...wid?.settings?.baseSettings,
                            ...baseSettings,
                        },
                        widget: {
                            ...wid?.settings?.widget,
                            widgetId: wid?.id,
                        },
                    },
                }
            }),
        }))
    }, [objectId, baseSettings, builderData, isInterfaceShowcase])

    useEffect(() => {
        setDataLayout((prev) => ({ ...prev, edit: editable }))
    }, [editable])

    //Закрыть модалку
    const closeModal = () => {
        setOpenModal(false)
    }

    const onChangeSelectWidget = (mnemo: string) => {
        setSelectWidget(mnemo)
    }

    useEffect(() => {
        if (onChange) {
            onChange(dataLayout)
        }
    }, [dataLayout, onChange])

    // Добавить новую карточку
    const addCard = () => {
        const id = uuidv4()

        setDataLayout((prevDataLayout) => ({
            ...prevDataLayout,
            widgets: prevDataLayout?.widgets?.concat({
                id,
                layout: {
                    x: (prevDataLayout?.widgets?.length * 2) % (prevDataLayout?.cols || 12),
                    y: Infinity,
                    w: 10,
                    h: 15,
                },
                widgetMnemo: '',
                wrapper: {} as wrapperType,
                settings: {
                    widget: {
                        widgetId: id,
                    },
                    view: {},
                    vtemplate: {
                        objectId,
                        page,
                        classes,
                        builderData,
                        builderView: isInterfaceShowcase === false && !undefined ? true : false,
                    },
                    baseSettings,
                },
            }),
        }))
    }

    //export RGL зоны целиком
    const exportRGL = () => {
        exportJson('RGL зона', dataLayout)
    }

    //export всех виджетов зоны в zip
    const exportRGLWidgetsZip = () => {
        const zip = new JSZip()

        dataLayout.widgets.forEach((item, index) => {
            const name = item.widgetMnemo ? item.widgetMnemo.split('.').pop() : `Пустой виджет - ${index + 1}`

            zip.file(`${name}.json`, JSON.stringify(item))
        })

        zip.generateAsync({ type: 'blob' }).then(function(content) {
            FileSaver.saveAs(content, 'Виджеты.zip')
        })
    }

    //экспорт одного виджета из формы
    const exportWidget = (widget: widgetType) => {
        const name = widget.widgetMnemo ? widget.widgetMnemo.split('.').pop() : 'Пустой виджет'

        exportJson(name, widget)
    }

    //Проверка на валидность json
    const isValidRgl = (obj: any): obj is layoutType => {
        return obj.widgets !== undefined && Array.isArray(obj.widgets)
    }

    //Проверка на валидность json виджета
    const isValidWidget = (obj: any): obj is widgetType => {
        return obj.layout !== undefined
    }

    //Импорт RGL зоны целиком
    const importRGL = async (file: Blob) => {
        const result: layoutType = await readJsonFile(file)

        if (isValidRgl(result)) {
            setDataLayout(result)
        } else {
            error('Невалидный шаблон')
        }
    }

    //Импоритровать виджеты
    const onChangeFileWidgetImport = useCallback(async (file: Blob) => {
        const parseFile: widgetType = await readJsonFile(file)

        if (isValidWidget(parseFile)) {
            setDataLayout((prev) => {
                const id = String(new Date().getTime())
                const tmp = prev.widgets.concat([
                    {
                        ...parseFile,
                        id,
                    },
                ])

                return {
                    ...prev,
                    widgets: tmp,
                }
            })
        }
    }, [])

    //Получение обновленных данных виджета при перемещении
    const handleLayoutChange = useCallback(
        (layout: Layout[], layouts: { [x: string]: Layout[] }) => {
            if (editable) {
                setDataLayout((prevData) => ({
                    ...prevData,
                    allZones: layouts,
                    widgets: layout.map((onLayout: { i: string; x: any; y: any; w: any; h: any }) => {
                        const tmp = prevData?.widgets?.find((widget) => widget.id === onLayout.i)

                        return {
                            ...tmp,
                            layout: {
                                x: onLayout.x,
                                y: onLayout.y,
                                w: onLayout.w,
                                h: onLayout.h,
                            },
                            settings: {
                                ...tmp?.settings,
                                widget: {
                                    ...tmp?.settings?.widget,
                                },
                            },
                        }
                    }),
                }))
            }
        },
        [setDataLayout, editable]
    )

    const onBreakpointChange = useCallback(
        (breakpoint: string, cols: number) => {
            setDataLayout((prevData) => ({
                ...prevData,
                breakpoint: breakpoint,
                cols: cols,
            }))
        },
        [setDataLayout]
    )

    // Удалить карточку
    const deleteCard = (id: any) => {
        setDataLayout((prev) => ({ ...prev, widgets: [...prev.widgets.filter((i: any) => i.id !== id)] }))
    }

    const openSettings = (e: any, id: string) => {
        setWidgetIdSettings(id)
        setOpenModal(true)

        const tmp = dataLayout?.widgets?.find((item: any) => item?.id === id)

        if (tmp && tmp?.widgetMnemo) {
            setSelectWidget(tmp?.widgetMnemo)
        } else {
            setSelectWidget('')
        }
    }

    const openingWidget: widgetType = useMemo(() => {
        return dataLayout?.widgets?.find((item) => item.id === widgetIdSettings) || ({} as widgetType)
    }, [dataLayout, widgetIdSettings])

    //Сохранение настроек формы виджета
    const saveWidgetModal = (params: wrapperTypeGetForm, mnemo: string) => {
        const tmp = dataLayout?.widgets?.map((item: widgetType) => {
            return item.id === widgetIdSettings
                ? {
                    ...item,
                    widgetMnemo: mnemo || '',
                    wrapper: {
                        style: params?.style,
                    },
                    settings: {
                        widget: params?.settings.widget,
                        view: {},
                        vtemplate: params?.settings.vtemplate,
                        baseSettings: params?.settings.baseSettings,
                    },
                }
                : item
        })

        setDataLayout((prev) => {
            return {
                ...prev,
                widgets: tmp,
            }
        })
        closeModal()
    }

    const widgetBoxShadow = useMemo(() => {
        const shadowWidth = `0px 0px ${theme?.widget?.shadowWidth || '8'}px`
        const shadowColor =
            createColorForTheme(theme?.widget?.shadowColor, theme?.colors, themeMode) || 'rgba(0, 0, 0, 0.4)'

        return shadowWidth + ' ' + shadowColor
    }, [themeMode, theme])

    return (
        <div>
            {contextHolder}
            {editable && !isInterfaceShowcase && (
                <TabBar
                    addCard={addCard}
                    exportRGL={exportRGL}
                    importRGL={importRGL}
                    exportRGLWidgetsZip={exportRGLWidgetsZip}
                    onChangeFileWidgetImport={onChangeFileWidgetImport}
                />
            )}
            <div style={{ height: '100%', overflow: baseSettings?.wideTemplate  ? '' : 'hidden', zIndex: 999 }}>
                <ResponsiveGridLayout
                    className="layout"
                    style={{
                        background: 'transparent',
                        borderRadius: 10,
                        // overflow: baseSettings?.wideTemplate ? 'auto' : 'hidden',
                        minHeight: isNaN(Number(baseSettings?.layotHeight)) ? 130 : Number(baseSettings?.layotHeight),
                        width: isNaN(Number(baseSettings?.layotWidth)) ? '' : Number(baseSettings?.layotWidth),
                        flex: 1,
                        // overflowX: 'auto',
                        // overflow: 'hidden',
                        overflow: baseSettings?.wideTemplate  ? '' : 'hidden'
                    }}
                    layouts={getLayouts(dataLayout)}
                    breakpoints={{ lg: 1200, md: 966, sm: 768, xs: 480, xxs: 0 }}
                    cols={{ lg: 24, md: 24, sm: 24, xs: 8, xxs: 4 }}
                    rowHeight={10}
                    autoSize={true}
                    width={baseSettings?.wideTemplate 
                        ? baseSettings?.wideTemplateWidth 
                            ? Number(baseSettings?.wideTemplateWidth) : width 
                        : width}
                    isDraggable={editable}
                    isResizable={editable}
                    onLayoutChange={handleLayoutChange}
                    onBreakpointChange={onBreakpointChange}
                >
                    {dataLayout?.widgets?.map((widget) => {
                        return (
                            <div
                                data-grid={{ ...widget.layout }}
                                key={widget?.id}
                                style={{
                                    display: 'flex',
                                    border: editable ? '1px solid grey' : 'none',
                                    borderRadius: widget?.wrapper?.style?.styleParams?.widgetBorderEnable ? 0 : '10px',
                                    boxShadow: widget?.wrapper?.style?.styleParams?.widgetBorderEnable
                                        ? 'none'
                                        : widgetBoxShadow ?? '0px 0px 8px rgba(0, 0, 0, 0.4)',
                                    backgroundColor: 'transparent',
                                    overflow: 'auto',
                                }}
                            >
                                {editable && (
                                    <SettingsBarTemplate
                                        widget={widget}
                                        openSettings={openSettings}
                                        deleteCard={deleteCard}
                                        isInterfaceShowcase={isInterfaceShowcase}
                                        showSettingsInfo={showSettingsInfo}
                                        baseSettings = {baseSettings}
                                    />
                                )}
                                <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
                                    {isRGLLoaded && (
                                        <WrapperWidget settings={widget?.wrapper}>
                                            <Widget
                                                settings={widget?.settings}
                                                widgetMnemo={widget?.widgetMnemo || ''}
                                                widgetType={WIDGET_TYPES.WIDGET_TYPE_SHOW}
                                            />
                                        </WrapperWidget>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </ResponsiveGridLayout>
                <DefaultModal2
                    open={openModal}
                    onCancel={closeModal}
                    // onOk={onSaveModal}
                    showFooterButtons={false}
                    tooltipText="Настройки дашборда"
                    height="90vh"
                    width="90vw"
                    centered
                >
                    <WidgetFormBase
                        onChangeWidget={onChangeSelectWidget}
                        widgetMnemo={selectWidget}
                        widget={openingWidget}
                        width={width}
                        save={saveWidgetModal}
                        exportWidget={exportWidget}
                    />
                </DefaultModal2>
            </div>
        </div>
    )
}

export default withSize({ refreshMode: 'debounce', refreshRate: 60 })(VtemplateDashboardView)
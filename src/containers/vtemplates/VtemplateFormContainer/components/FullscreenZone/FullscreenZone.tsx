/* eslint-disable react/jsx-max-depth */
import { Widget, WidgetFormBase } from '@containers/widgets'
import { WIDGETS, WIDGET_TYPES } from '@containers/widgets/widget-const'
import { Select } from '@shared/ui/forms'
import { FC, memo, PropsWithChildren, useEffect, useMemo, useState } from 'react'
import { TBuilderData, TInitialDataSettingVTType } from '../../types/types'
import SettingsBarTemplate from '@app/vtemplate/VtemplateDashboardView/SettingsBarTemplate'
import { DefaultModal2 } from '@shared/ui/modals'
import { v4 as uuidv4 } from 'uuid';
import { widgetType, wrapperType } from '@containers/widgets/widget-types'
import { WrapperWidget } from '@containers/widgets/WrapperWidget'
import { TPage } from '@shared/types/common'
import CustomPreloader from '@shared/ui/preloader/CustomPreloader'
import { isEqual } from 'lodash'

interface FullscreenZoneProps {
    objectId?: number,
    baseSettings?: TInitialDataSettingVTType,
    save?: (any) => void,
    editable?: boolean,
    dataResponse?: widgetType | undefined,
    isInterfaceShowcase?: boolean,
    showSettingsInfo?: (widget?: widgetType) => void,
    page?: TPage,
    builderData?: TBuilderData,
}

const FullscreenZone: FC<FullscreenZoneProps> = memo(({ 
    objectId, 
    baseSettings, 
    save, 
    editable = true, 
    dataResponse,
    isInterfaceShowcase,
    showSettingsInfo,
    page,
    builderData
}) => {
    const [widgetMnemo, setWidgetMnemo] = useState<string>('')
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [dataWidget, setDataWidget] = useState<widgetType>({} as widgetType)
    const [changeMnemo, setChangeMnemo] = useState<boolean>(false)
    const [isRGLLoaded, setRGLLoaded] = useState(false)

    const id = uuidv4()

    //Дефолтные настройки виджета
    const settings = {
        id: id,
        layout: {
            x: Infinity,
            y: Infinity,
            w: 3,
            h: 3
        },
        wrapper: {} as wrapperType,
        settings: {
            widget: {
                widgetId: id
            },
            view: {},
            vtemplate: { 
                objectId,
                page,
                builderData,
                builderView: isInterfaceShowcase === false && !undefined ? true : false
            },
            baseSettings,
        },
        widgetMnemo: widgetMnemo
    }

    //Список виджетов
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

    //Получаем данные при редактировании либо записываем дефолтные настройки
    useEffect(() => {
        if (Object.keys(dataResponse || {})?.length) {
            setDataWidget(dataResponse)
        } else {
            setDataWidget(settings)
        }
    }, [dataResponse])

    //При отрисовке передаем в селектор мнемо виджета, если редактирование
    useEffect(() => {
        setWidgetMnemo(dataResponse?.widgetMnemo)
    }, [page])

    //При смене виджета устанавливаем дефолтные настройки
    useEffect(() => {
        if (changeMnemo === true && widgetMnemo !== undefined) {
            setDataWidget((prevData) => ({
                ...prevData,
                settings: settings.settings,
                widgetMnemo: widgetMnemo,
            }))
            setOpenModal(true)
            setChangeMnemo(false)
        } 

        if (widgetMnemo === undefined) {
            setDataWidget(settings)
        } 
    }, [widgetMnemo])

    useEffect(() => {
        setDataWidget((prevData) => ({
            ...prevData,
            settings: {
                ...prevData?.settings,
                baseSettings: {
                    ...prevData?.settings?.baseSettings,
                    ...baseSettings
                },
                vtemplate: { 
                    ...prevData?.settings?.vtemplate, 
                    objectId,
                    page,
                    builderData,
                    builderView: isInterfaceShowcase === false && !undefined ? true : false
                },
                widget: {
                    ...prevData?.settings?.widget,
                    widgetId: prevData.id
                }
            } 
        }))
    }, [objectId, baseSettings, builderData, isInterfaceShowcase])

    //Передаем объект настроек для сохранения
    useEffect(() => {
        if (!editable) {
            save(dataWidget)
        }
    }, [dataWidget, editable])

    const onChangeWidget = (mnemo: string) => {
        setWidgetMnemo(mnemo)
        setChangeMnemo(true)
    }

    //Сохранение настроек формы виджета
    const saveWidgetModal = (params: any, mnemo: string) => {

        const tmp = dataWidget?.settings.widget ?
            {
                ...dataWidget,
                widgetMnemo: mnemo || '',
                wrapper: {
                    style: params?.style
                },
                settings: {
                    ...dataWidget.settings,
                    widget: params?.settings.widget,
                    view: {},
                    vtemplate: params?.settings.vtemplate
                }
            }
            :
            settings

        setDataWidget((prev) => {
            return {
                ...prev,
                ...tmp
            }
        })
        closeModal()
    }

    const deleteWidget = () => {
        setDataWidget(settings)
        setWidgetMnemo('')
    }

    //Закрыть модалку
    const closeModal = () => {
        setOpenModal(false)
    }

    useEffect(() => {
        setRGLLoaded(false)
        setTimeout(() => {
            setRGLLoaded(true)
        }, 100)
    }, [page])

    return (
        <>
            <div style={{ flex: 1, height: '100%' }}>
                <Select
                    placeholder="Выберите виджет"
                    value={widgetMnemo || undefined}
                    onChange={(value) => onChangeWidget(value)}
                    options={arrSelectWidgets2}
                    style={
                        (!editable && !isInterfaceShowcase) ? { 
                            minWidth: 300, 
                            maxWidth: 500, 
                            width: '100%' 
                        } : {
                            display: 'none' 
                        }
                    }
                />
                <RGLLoadingWrapper isLoaded={isRGLLoaded}>
                    <WidgetMnemoChecker
                        isDataWidget={Object.keys(dataWidget).length > 0}
                        isWidgetMnemo={!!widgetMnemo}
                    >
                        <div 
                            style={{ position: 'relative', height: '100%' }}
                        >
                            {!editable && (
                                <SettingsBarTemplate
                                    widget={dataWidget}
                                    openSettings={() => setOpenModal(true)}
                                    deleteCard={deleteWidget}
                                    isInterfaceShowcase={isInterfaceShowcase}
                                    showSettingsInfo={showSettingsInfo}
                                />
                            )}
                            <WrapperWidget settings={dataWidget?.wrapper}>
                                <div 
                                    style={{ 
                                        width: '100%', 
                                        height: '100%', 
                                        display: 'flex', 
                                        justifyContent: 'center', 
                                        alignItems: 'center' 
                                    }}
                                >
                                    <Widget
                                        settings={dataWidget?.settings}
                                        widgetMnemo={widgetMnemo}
                                        widgetType={WIDGET_TYPES.WIDGET_TYPE_PREVIEW}
                                    />
                                </div>
                            </WrapperWidget>
                        </div>
                    </WidgetMnemoChecker>
                    {/* {
                        !!widgetMnemo && 
                        dataWidget && (
                            <div 
                                style={{ position: 'relative', height: '100%' }}
                            >
                                {!editable && (
                                    <SettingsBarTemplate
                                        widget={dataWidget}
                                        openSettings={() => setOpenModal(true)}
                                        deleteCard={deleteWidget}
                                        isInterfaceShowcase={isInterfaceShowcase}
                                        showSettingsInfo={showSettingsInfo}
                                    />
                                )}
                                <WrapperWidget settings={dataWidget?.wrapper}>
                                    <div 
                                        style={{ 
                                            width: '100%', 
                                            height: '100%', 
                                            display: 'flex', 
                                            justifyContent: 'center', 
                                            alignItems: 'center' 
                                        }}
                                    >
                                        <Widget
                                            settings={dataWidget?.settings}
                                            widgetMnemo={widgetMnemo}
                                            widgetType={WIDGET_TYPES.WIDGET_TYPE_PREVIEW}
                                        />
                                    </div>
                                </WrapperWidget>
                            </div>
                        )
                    } */}
                </RGLLoadingWrapper>
                {/* {isRGLLoaded ? 
                    !!widgetMnemo && dataWidget && (
                        <div 
                            style={{ position: 'relative', height: '100%' }}
                        >
                            {!editable && (
                                <SettingsBarTemplate
                                    widget={dataWidget}
                                    openSettings={() => setOpenModal(true)}
                                    deleteCard={deleteWidget}
                                    isInterfaceShowcase={isInterfaceShowcase}
                                    showSettingsInfo={showSettingsInfo}
                                />
                            )}
                            <WrapperWidget settings={dataWidget?.wrapper}>
                                <div 
                                    style={{ 
                                        width: '100%', 
                                        height: '100%', 
                                        display: 'flex', 
                                        justifyContent: 'center', 
                                        alignItems: 'center' 
                                    }}
                                >
                                    <Widget
                                        settings={dataWidget?.settings}
                                        widgetMnemo={widgetMnemo}
                                        widgetType={WIDGET_TYPES.WIDGET_TYPE_PREVIEW}
                                    />
                                </div>
                            </WrapperWidget>
                        </div>
                    ) : 
                    <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                        <CustomPreloader size="default" />
                    </div>} */}
            </div>
            <DefaultModal2
                open={openModal}
                onCancel={closeModal}
                showFooterButtons={false}
                tooltipText="Настройки дашборда"
                height="90vh"
                width="90vw"
                centered
            >
                <WidgetFormBase
                    onChangeWidget={onChangeWidget}
                    widgetMnemo={widgetMnemo}
                    widget={dataWidget}
                    width={300}
                    save={saveWidgetModal}
                    fullscreen={true}
                />
            </DefaultModal2>
        </>
    )
}, (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps)
})

const RGLLoadingWrapper: FC<PropsWithChildren<{ 
    isLoaded: boolean 
}>> = ({ children, isLoaded }) => {

    return isLoaded 
        ? children
        : (
            <div 
                style={{ 
                    height: '100%', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center'   
                }} 
            >
                <CustomPreloader size="default" />
            </div>
        )
}

const WidgetMnemoChecker: FC<PropsWithChildren<{ 
    isWidgetMnemo: boolean 
    isDataWidget: boolean 
}>> = ({ children, isWidgetMnemo, isDataWidget }) => {

    return isWidgetMnemo && isDataWidget
        ? children
        : null
}

export default FullscreenZone
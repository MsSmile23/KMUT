import { SERVICES_VTEMPLATES } from '@shared/api/vtemplates'
import { StoreStates } from '@shared/types/storeStates'
import { dataVtemplateProps, layoutType, MacroZoneType, paramsVtemplate, TabsArrType } from '@shared/types/vtemplates'
import { styleParamsType, widgetType, wrapperType } from '@shared/types/widgets'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { initialDataLayout, initialLabels, initialLayout, initialStyle } from './data'
import { Layout } from 'react-grid-layout'
import { updateLayoutByType, updateVtemplate } from './utils'
import { interceptorErrorsStore } from '../utils/interceptorErrorsStore'

export enum LAYOUT_TYPE {
    CONTENT = 'content',
    HEADER = 'header',
}

export interface IVtemplateStore {
    vtemplate: dataVtemplateProps<paramsVtemplate>
    state: StoreStates
    error: string
    layout: layoutType
    headerLayout: layoutType
    zone: widgetType
    activeTab: TabsArrType
    params: {
        loadLoopTime: number
        updateLoop: any
        isLoadAtStart: boolean
        loadOrder: number
    }
    localeName: string
    setState: (value: StoreStates) => void
    setBaseSettings: (value: paramsVtemplate['dataToolbar']) => void
    setZoneSettings: (params: styleParamsType) => void
    setLabelZone: <T>(key: string, value: T) => void
    setLayout: (layout: layoutType, type?: LAYOUT_TYPE) => void
    getLayoutByType: (type: LAYOUT_TYPE) => layoutType
    setVtemplate: (vtemplate: dataVtemplateProps<paramsVtemplate>, objectId?: number) => void
    addZone: (widget: any, type?: LAYOUT_TYPE) => void
    addWidget: (widget: any, type?: LAYOUT_TYPE, zoneId?: string) => void
    setWidgetZoneSettings: (params, widgetId: string) => void
    setLabelWidget: (value, key, currentWidgetId: string) => void
    setZoneMnemo: (value: string) => void
    setWidgetMnemo: (value: string, id: string) => void
    setWidgetSettings: (params) => void
    removeZone: (id?: string, type?: LAYOUT_TYPE) => void
    getZone: (id: string, type?: LAYOUT_TYPE) => widgetType
    saveZone: (type?: LAYOUT_TYPE) => void
    updateLayout: (newLayout: Layout[], allZones: { [key: string]: Layout[] }, type?: LAYOUT_TYPE) => void
    breakpointChange: (breakpoint: string, cols: number, type?: LAYOUT_TYPE) => void
    saveVtemplate: () => void
    getSaveData: () => any
    fetchLayoutData: (id: string) => void
    setError: (error?: string) => void
    setStartApiUpdateLoop: (time?: number) => void
    setStopApiUpdateLoop: () => void
    setInitialStore: (type?: LAYOUT_TYPE) => void
    setInitialZone: (id: string, type?: LAYOUT_TYPE) => void
    setMacroZone: (value: number) => void
    setTab: (action: 'change' | 'update' | 'remove', key?: string, data?: TabsArrType) => void
}
export const useVtemplateStore = create<IVtemplateStore>()(
    devtools(
        immer((set, get) => ({
            vtemplate: initialLayout,
            state: StoreStates.NONE,
            error: '',
            layout: {} as layoutType, // Основной контент
            headerLayout: {} as layoutType, // Контент для зоны шапки (для управляемой зоны отображение над табами)
            zone: {} as widgetType,
            activeTab: {} as TabsArrType,
            params: { loadLoopTime: 60000, updateLoop: null, isLoadAtStart: true, loadOrder: 2 },
            localeName: 'Визуальный шаблон',
            setState: (value) => {
                set((state) => {
                    state.state = value
                })
            },
            setBaseSettings: (settings) => {
                set((state) => {
                    state.vtemplate.params.dataToolbar = settings
                    state.vtemplate.name = settings.name
                    const { vtemplate } = state

                    const newWidgetSettings = {
                        objectId: vtemplate.params.dataToolbar?.objectId,
                        page: vtemplate.params.dataToolbar?.pageBinding,
                        classes: vtemplate.params.dataToolbar?.classes,
                    }

                    state.layout.widgets = state.layout?.widgets?.map((widget) => ({
                        ...widget,
                        settings: {
                            ...widget.settings,
                            vtemplate: {
                                ...widget.settings.vtemplate,
                                ...newWidgetSettings,
                            },
                        },
                    }))

                    if (state.vtemplate.params.makroZone === MacroZoneType.UNMANAGE_ZONE) {
                        state.vtemplate.params.layoutContentUnmanageableZone = state.layout
                    } else {
                        state.vtemplate.params.layoutContentUnmanageableZone = state.headerLayout
                        Object.keys(state.vtemplate.params.layoutContentManageZone || {}).forEach((key) => {
                            const zoneLayout = state.vtemplate.params.layoutContentManageZone[key]

                            if (zoneLayout) {
                                const updatedZoneWidgets = zoneLayout.widgets?.map((widget) => ({
                                    ...widget,
                                    settings: {
                                        ...widget.settings,
                                        vtemplate: {
                                            ...widget.settings.vtemplate,
                                            ...newWidgetSettings,
                                        },
                                    },
                                }))

                                state.vtemplate.params.layoutContentManageZone[key].widgets = updatedZoneWidgets
                            }
                        })
                    }
                })
            },
            setLayout: (layout, type = LAYOUT_TYPE.CONTENT) => {
                set((state) => {
                    type === LAYOUT_TYPE.HEADER ? (state.headerLayout = layout) : (state.layout = layout)
                })
            },
            getLayoutByType: (type) => {
                return type === LAYOUT_TYPE.HEADER ? get().headerLayout : get().layout
            },
            updateLayout: (newLayout, allZones, type = LAYOUT_TYPE.CONTENT) => {
                set((state) => {
                    const targetLayout = get().getLayoutByType(type)

                    const updatedLayout = {
                        ...targetLayout,
                        ...allZones,
                        widgets: newLayout.map((onLayout) => {
                            const tmp = targetLayout.widgets.find((widget) => widget.id === onLayout.i)

                            return {
                                ...tmp,
                                layout: { x: onLayout.x, y: onLayout.y, w: onLayout.w, h: onLayout.h },
                                settings: {
                                    ...tmp?.settings,
                                    widget: {
                                        ...tmp?.settings?.widget,
                                    },
                                },
                            }
                        }),
                    }

                    updateVtemplate(state, updatedLayout, state.activeTab.key, type)
                    updateLayoutByType(state, type, updatedLayout)
                })
            },
            breakpointChange: (breakpoint, cols, type = LAYOUT_TYPE.CONTENT) => {
                set((state) => {
                    const targetLayout = get().getLayoutByType(type)

                    const updatedLayout = {
                        ...targetLayout,
                        breakpoint,
                        cols,
                    }

                    updateLayoutByType(state, type, updatedLayout)
                })
            },
            setVtemplate: (vtemplate, objectId) => {
                const updateWidgetsWithObjectId = (widgets, objectId) => {
                    return widgets?.map((widget) => {
                        return {
                            ...widget,
                            settings: {
                                ...widget.settings,
                                vtemplate: {
                                    ...widget.settings.vtemplate,
                                    objectId: objectId,
                                },
                            },
                        }
                    })
                }

                set((state) => {
                    state.vtemplate = vtemplate
                    const headerKeys = Object.keys(vtemplate.params?.layoutContentUnmanageableZone || {})

                    if (objectId) {
                        if (vtemplate.params.makroZone === MacroZoneType.MANAGE_ZONE) {
                            const updatedManageZoneLayouts = Object.keys(
                                vtemplate.params.layoutContentManageZone
                            ).reduce((acc, key) => {
                                const currentZone = vtemplate.params.layoutContentManageZone[key]

                                const updatedWidgets = updateWidgetsWithObjectId(currentZone.widgets, objectId)

                                acc[key] = {
                                    ...currentZone,
                                    widgets: updatedWidgets,
                                }

                                return acc
                            }, {})

                            state.layout = updatedManageZoneLayouts[vtemplate.params.tabs[0].key]

                            if (headerKeys.length > 0) {
                                const updatedHeaderWidgets = updateWidgetsWithObjectId(
                                    vtemplate.params.layoutContentUnmanageableZone.widgets,
                                    objectId
                                )

                                state.headerLayout = {
                                    ...vtemplate.params.layoutContentUnmanageableZone,
                                    widgets: updatedHeaderWidgets,
                                }
                            }
                        } else {
                            const updatedWidgets = updateWidgetsWithObjectId(
                                vtemplate.params.layoutContentUnmanageableZone.widgets,
                                objectId
                            )

                            state.layout = {
                                ...vtemplate.params.layoutContentUnmanageableZone,
                                widgets: updatedWidgets,
                            }
                        }
                    } else {
                        if (state.vtemplate.params.makroZone === MacroZoneType.UNMANAGE_ZONE) {
                            state.headerLayout = {} as layoutType
                            state.layout = vtemplate.params.layoutContentUnmanageableZone
                        } else {
                            if (headerKeys.length > 0) {
                                state.headerLayout = vtemplate.params.layoutContentUnmanageableZone
                            }

                            state.activeTab = vtemplate.params.tabs[0]
                            state.layout = vtemplate.params.layoutContentManageZone[state.activeTab.key]
                        }
                    }
                })
            },
            setMacroZone: (value) => {
                set((state) => {
                    state.vtemplate.params.makroZone = value
                })
            },
            setTab: (action, key, data) => {
                set((state) => {
                    const currentTabIndex = state.vtemplate.params.tabs?.findIndex(
                        (tab) => tab?.key === (key || state.activeTab.key)
                    )

                    switch (action) {
                        case 'change':
                            if (currentTabIndex !== -1) {
                                state.activeTab = state.vtemplate.params.tabs[currentTabIndex]
                                state.layout =
                                    state.vtemplate.params.layoutContentManageZone?.[key] || initialDataLayout
                            }
                            break
                        case 'update':
                            if (data) {
                                if (currentTabIndex === -1) {
                                    state.vtemplate.params.tabs.push(data)
                                    state.activeTab = data
                                    state.layout = initialDataLayout
                                } else {
                                    state.vtemplate.params.tabs[currentTabIndex] = {
                                        ...state.vtemplate.params.tabs[currentTabIndex],
                                        ...data,
                                    }
                                    state.activeTab = state.vtemplate.params.tabs[currentTabIndex]
                                    state.layout = state.vtemplate.params.layoutContentManageZone[key]
                                }
                            }
                            break
                        case 'remove':
                            if (currentTabIndex !== -1) {
                                state.vtemplate.params.tabs.splice(currentTabIndex, 1)
                                delete state.vtemplate.params.layoutContentManageZone[key]

                                if (state.activeTab.key === key) {
                                    state.activeTab = state.vtemplate.params.tabs[0] || ({} as TabsArrType)
                                    state.layout = state.vtemplate.params.layoutContentManageZone?.[state.activeTab.key]
                                }
                            }
                            break
                        default:
                            console.error(`Неизвестно действие - ${action} либо ключ или данные не переданы`)
                    }
                })
            },
            setWidgets: (widgets, type = LAYOUT_TYPE.CONTENT) => {
                set((state) => {
                    state.zone.settings.widgets = widgets

                    const targetLayout =
                        Object.keys(get().getLayoutByType(type)).length > 0
                            ? get().getLayoutByType(type)
                            : initialDataLayout

                    const updatedWidgets = targetLayout.widgets.map((widget) => {
                        if (widget.id === state.zone.id) {
                            return {
                                ...widget,
                                settings: {
                                    ...widget.settings,
                                    widgets,
                                },
                            }
                        }

                        return widget
                    })

                    const updatedLayout = {
                        ...targetLayout,
                        widgets: updatedWidgets,
                    }

                    updateVtemplate(state, updatedLayout, state.activeTab.key, type)
                    updateLayoutByType(state, type, updatedLayout)
                })
            },
            setZoneSettings: (params) => {
                set((state) => {
                    state.zone = {
                        ...state.zone,
                        wrapper: {
                            ...state.zone?.wrapper,
                            style: {
                                ...state.zone?.wrapper?.style,
                                styleParams: {
                                    ...state.zone?.wrapper?.style?.styleParams,
                                    ...params,
                                },
                            },
                        },
                    }
                })
            },
            setWidgetZoneSettings: (params, widgetId) => {
                set((state) => {
                    // const widget = state.zone.settings.widgets.find(el => el.id == widgetId)
                    const updatedWidgets = state.zone.settings.widgets.map((widget) => {
                        if (widget.id === widgetId) {
                            return {
                                ...widget,
                                settings: {
                                    ...widget.settings,
                                    widget: params,
                                },
                            }
                        }

                        return widget
                    })

                    state.zone = {
                        ...state.zone,
                        settings: {
                            ...state.zone.settings,
                            widgets: updatedWidgets,
                        },
                    }
                })
            },
            setLabelZone: (key, value) => {
                set((state) => {
                    state.zone.wrapper.style.labelParams[key] = value
                })
            },
            setLabelWidget: (key, value, widgetId) => {
                set((state) => {
                    const updatedWidgets = state.zone.settings.widgets.map((widget) => {
                        if (widget.id == widgetId) {
                            return {
                                ...widget,
                                wrapper: {
                                    ...widget.wrapper,
                                    style: {
                                        ...widget.wrapper.style,
                                        labelParams: {
                                            ...widget.wrapper.style.labelParams,
                                            [key]: value,
                                        },
                                    },
                                },
                            }
                        }

                        return widget
                    })

                    state.zone.settings.widgets = updatedWidgets
                })
            },
            addZone: (widget, type = LAYOUT_TYPE.CONTENT) => {
                set((state) => {
                    const { vtemplate } = state
                    const targetLayout =
                        Object.keys(get().getLayoutByType(type)).length > 0
                            ? get().getLayoutByType(type)
                            : initialDataLayout

                    const newData = {
                        id: widget.id,
                        layout: {
                            x: (targetLayout.widgets?.length * 2) % (targetLayout.cols || 12),
                            y: Infinity,
                            w: 10,
                            h: 10,
                        },
                        widgetMnemo: '',
                        wrapper: {
                            style: {
                                styleParams: initialStyle,
                            },
                        },
                        settings: {
                            // Если поле 'orientation' присутствует, меняем структуру на массив
                            ...(widget?.orientation && widget?.orientation != 'default'
                                ? {
                                    widgets: [],
                                }
                                : {
                                    widget: {
                                        widgetId: widget.id,
                                    },
                                }),
                            view: {},
                            orientation: widget?.orientation || 'default',
                            vtemplate: {
                                objectId: widget.objectId,
                                page: widget.page,
                                classes: widget.classes,
                            },
                            baseSettings: vtemplate.params.dataToolbar,
                        },
                    }

                    const updatedLayout = {
                        ...targetLayout,
                        widgets: [...targetLayout.widgets, newData],
                    }

                    updateVtemplate(state, updatedLayout, state.activeTab.key, type)
                    updateLayoutByType(state, type, updatedLayout)
                })
            },
            addWidget: (widget, type = LAYOUT_TYPE.CONTENT, zoneId) => {
                set((state) => {
                    const { vtemplate } = state
                    const targetLayout =
                        Object.keys(get().getLayoutByType(type)).length > 0
                            ? get().getLayoutByType(type)
                            : initialDataLayout

                    const newData = {
                        id: widget.id,
                        widgetMnemo: '',
                        layout: {
                            x: (targetLayout.widgets?.length * 2) % (targetLayout.cols || 12),
                            y: Infinity,
                            w: 10,
                            h: 10,
                        },
                        wrapper: {
                            style: {
                                styleParams: initialStyle,
                            },
                        },
                        settings: {
                            widget: {
                                widgetId: widget.id,
                            },
                            view: {},
                            vtemplate: {
                                objectId: widget.objectId,
                                page: widget.page,
                                classes: widget.classes,
                            },
                            baseSettings: vtemplate.params.dataToolbar,
                        },
                    }

                    const updatedWidgets = targetLayout.widgets.map((widget) => {
                        if (widget.id == zoneId) {
                            return {
                                ...widget,
                                settings: {
                                    ...widget.settings,
                                    widgets: [...widget.settings.widgets, newData],
                                },
                            }
                        }

                        return widget
                    })

                    const updatedLayout = {
                        ...targetLayout,
                        widgets: [...updatedWidgets],
                    }

                    state.zone = updatedLayout.widgets.find((zone) => zone.id == zoneId)

                    updateVtemplate(state, updatedLayout, state.activeTab.key, type)
                    updateLayoutByType(state, type, updatedLayout)
                })
            },
            removeZone: (id, type = LAYOUT_TYPE.CONTENT) => {
                set((state) => {
                    const targetLayout = get().getLayoutByType(type)

                    if (id) {
                        const updatedWidgets = targetLayout.widgets.map((zone) => {
                            if (zone?.settings?.widgets) {
                                const newZone = {
                                    ...zone,
                                    settings: {
                                        ...zone.settings,
                                        widgets: zone.settings.widgets.filter((widget) => widget.id !== id),
                                    },
                                }

                                state.zone = newZone

                                return newZone
                            }

                            return zone
                        })

                        const updatedLayout = {
                            ...targetLayout,
                            widgets: updatedWidgets?.filter((widget) => widget.id !== id),
                        }

                        updateVtemplate(state, updatedLayout, state.activeTab.key, type)
                        updateLayoutByType(state, type, updatedLayout)
                    } else {
                        state.zone = {} as widgetType
                    }
                })
            },
            getZone: (id, type = LAYOUT_TYPE.CONTENT) => {
                const targetLayout = get().getLayoutByType(type)

                return targetLayout.widgets.find((widget) => widget.id === id)
            },
            saveZone: (type = LAYOUT_TYPE.CONTENT) => {
                set((state) => {
                    const targetLayout = get().getLayoutByType(type)
                    const currentZone = get().zone

                    const updatedWidgets = targetLayout.widgets.map((widget) => {
                        // if (widget.settings.widgets) {
                        //     return widget
                        // }

                        if (widget.id == currentZone.id) {
                            return currentZone
                        }

                        if (widget.id === state.zone.id) {
                            return state.zone
                        }

                        return widget
                    })

                    const updatedLayout = {
                        ...targetLayout,
                        widgets: updatedWidgets,
                    }

                    updateVtemplate(state, updatedLayout, state.activeTab.key, type)
                    updateLayoutByType(state, type, updatedLayout)
                })
            },
            setZoneMnemo: (value) => {
                set((state) => {
                    state.zone.widgetMnemo = value
                })
            },
            setWidgetMnemo: (value, id) => {
                set((state) => {
                    const updatedWidgets = state.zone.settings.widgets.map((widget) => {
                        if (widget.id === id) {
                            return {
                                ...widget,
                                widgetMnemo: value,
                            }
                        }

                        return widget
                    })

                    state.zone.settings.widgets = updatedWidgets
                })
            },
            setWidgetName: (value, id) => {
                set((state) => {
                    const updatedWidgets = state.zone.settings.widgets.map((widget) => {
                        if (widget.id === id) {
                            return {
                                ...widget,
                                widgetName: value,
                            }
                        }

                        return widget
                    })

                    state.zone.settings.widgets = updatedWidgets
                })
            },
            setWidgetSettings: (params) => {
                set((state) => {
                    state.zone.settings.widget = params
                })
            },
            saveVtemplate: () => {
                set((state) => {
                    const { vtemplate } = state

                    state.vtemplate = {
                        ...vtemplate,
                        name: vtemplate.name || vtemplate.params.dataToolbar.name,
                        vtemplate_type_id: vtemplate.vtemplate_type_id || vtemplate.params.dataToolbar.maketType,
                        mnemonic: '1',
                    }
                })
            },
            getSaveData: () => {
                const state = get()
                const { vtemplate } = state
                const data = {
                    ...vtemplate,
                    params: JSON.stringify(vtemplate.params),
                }

                return data
            },
            fetchLayoutData: async (id: string) => {
                get().state = StoreStates.LOADING
                get().vtemplate = initialLayout

                try {
                    const response = await SERVICES_VTEMPLATES.Models.getVtemplateById(id)

                    if (response?.success) {
                        const layoutData = response.data

                        if (layoutData !== null || undefined || [] || {}) {
                            layoutData.params = JSON.parse(layoutData.params)

                            set((state) => {
                                state.vtemplate = layoutData
                                const keys = Object.keys(layoutData.params?.layoutContentManageZone)
                                const headerKeys = Object.keys(layoutData.params?.layoutContentUnmanageableZone)

                                if (keys.length > 0) {
                                    state.headerLayout =
                                        headerKeys.length > 0
                                            ? layoutData.params.layoutContentUnmanageableZone
                                            : initialDataLayout
                                    state.layout = layoutData.params.layoutContentManageZone[keys[0]]
                                    state.activeTab = layoutData.params.tabs[0]
                                } else {
                                    state.headerLayout = {} as layoutType
                                    state.layout = layoutData.params.layoutContentUnmanageableZone
                                }
                                state.state = StoreStates.FINISH
                                state.error = ''
                            })
                        }
                        get().setState(StoreStates.FINISH)
                    } else {
                        set((state) => {
                            state.error = response?.error ?? 'Ошибка'
                        })

                        // if (response?.status === 403) {
                        //     get().setState(StoreStates.ERROR)
                        // }

                        interceptorErrorsStore({
                            errorCode: response?.status,
                            callBack: () => get().setState(StoreStates.FINISH),
                        })
                    }
                } catch (error) {
                    set((state) => {
                        state.error = error ?? 'Ошибка'
                    })
                } finally {
                    // console.log('')
                }
            },
            setError: (error) => {
                set((state) => {
                    state.error = error
                })
            },
            setStartApiUpdateLoop: (time = get().params.loadLoopTime) => {
                const updateLoop = get().params.updateLoop

                if (updateLoop !== null) {
                    set((state) => {
                        state.params.updateLoop = null
                    })
                }

                set((state) => {
                    state.params.updateLoop = setInterval(() => {
                        get().fetchLayoutData(`${get().vtemplate.id}`)
                    }, time)
                })
            },
            setStopApiUpdateLoop: () => {
                const updateLoop = get().params.updateLoop

                if (updateLoop !== null) {
                    clearInterval(updateLoop)
                }

                set((state) => {
                    state.params.updateLoop = null
                })
            },
            setInitialStore: (type) => {
                set((state) => {
                    if (type === LAYOUT_TYPE.HEADER) {
                        state.headerLayout = initialDataLayout
                    }
                    state.vtemplate = initialLayout
                    state.layout = initialDataLayout
                    state.state = StoreStates.FINISH
                    state.error = ''
                })
            },
            setInitialZone: (id, type = LAYOUT_TYPE.CONTENT) => {
                set((state) => {
                    const targetLayout = get().getLayoutByType(type)
                    const currentZone =
                        targetLayout.widgets.find((widget) => widget.id === id) ||
                        targetLayout.widgets
                            .find((widget) => !!widget.settings.widgets)
                            .settings.widgets.find((widget) => widget.id === id)

                    state.zone = {
                        ...currentZone,
                        wrapper: {
                            ...currentZone?.wrapper,
                            style: {
                                ...currentZone?.wrapper?.style,
                                styleParams: currentZone?.wrapper?.style?.styleParams || initialStyle,
                                labelParams: currentZone?.wrapper?.style?.labelParams || initialLabels,
                            },
                        },
                    }
                })
            },
        }))
    )
)
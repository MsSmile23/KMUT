import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { Layout, Responsive as ResponsiveGridLayout } from 'react-grid-layout'
import { WrapperWidget } from '@containers/widgets/WrapperWidget';
import { TPage } from '@shared/types/common';
import { IObject } from '@shared/types/objects';
import { Select } from '@shared/ui/forms/Select/Select';
import ECModal from '@shared/ui/ECUIKit/ECModal/ECModal';
import { LAYOUT_TYPE, useVtemplateStore } from '@shared/stores/vtemplate';
import { Card, Carousel, Col, Dropdown, MenuProps, message, Row, Upload } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { getLayouts } from '@shared/utils/layouts';
import { layoutType, TInitialDataSettingVTType } from '@shared/types/vtemplates';
import { widgetType } from '@shared/types/widgets';
import ZoneSettings from './ZoneSettings/ZoneSettings';
import { Buttons, ButtonSettings } from '@shared/ui/buttons';
import { exportJson, readJsonFile } from '@containers/vtemplates/VtemplateFormContainer/services';
import { ECTooltip } from '@shared/ui/tooltips';
import { AppstoreAddOutlined, DeleteOutlined, SettingOutlined, ShrinkOutlined } from '@ant-design/icons';
import { zIndex } from '@shared/config/zIndex.config';
import { CustomTab } from '@shared/ui/CustomTabs/components/CustomTab';
import { Widget } from '@containers/widgets';
import { SettingsLabelTab } from '@containers/widgets/WidgetFormBase/components/SettingsLabelTab';
import { WIDGET_TYPES, WIDGETS } from '@containers/widgets/widget-const';
import PreviewModal from './PreviewModal/PreviewModal';
import { WizardStick } from '@shared/ui/icons/WizardStick';
import { SortableList } from '@shared/ui/SortableList';
import { Input } from '@shared/ui/forms';

const tabsTitle = [
    { key: '0', title: 'Заголовок' },
    { key: '1', title: 'Настройки зоны' },
    { key: '2', title: 'Настройки виджета' }
]

interface VtemplateMobileDashboardProps {
    editable?: boolean,
    onChange?: (layout: layoutType) => void,
    objectId?: IObject['id'],
    dataResponse?: layoutType,
    baseSettings?: TInitialDataSettingVTType,
    isInterfaceShowcase?: boolean,
    showSettingsInfo?: (widget?: widgetType) => void,
    page?: TPage,
    classes?: number[],
    layoutSize?: { width: number, height: number },
    isManageZone?: boolean,
    isMobile?: boolean,
    isHeader?: boolean
}

const VtemplateMobileDashboard: FC<VtemplateMobileDashboardProps> = (props) => {
    const {
        editable = true,
        objectId,
        baseSettings,
        page,
        classes = [],
        isInterfaceShowcase = false,
        layoutSize,
        isManageZone,
        isMobile = true,
        isHeader = false
    } = props

    const {
        layout,
        headerLayout,
        zone,
        addZone,
        removeZone,
        updateLayout,
        setInitialZone,
        setLabelZone,
        saveZone,
        addWidget,
        setWidgetZoneSettings,
        setLabelWidget,
        setLayout,
        setZoneMnemo,
        setWidgetMnemo,
        setWidgetSettings,
        setWidgets,
        setWidgetName,
    } = useVtemplateStore()
    const [messageApi, contextHolder] = message.useMessage()
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [openWidgetModal, setOpenWidgetModal] = useState<boolean>(false)
    const [activeKey, setActiveKey] = useState<string>('0')
    const [currentWidgetId, setCurrentWidgetId] = useState(null)
    const [currentWidget, setCurrentWidget] = useState(null)
    const [currWidgetName, setCurrWidgetName] = useState(currentWidget?.widgetName || null)
    const dataLayout = isHeader ? headerLayout : layout
    const typeLayout = isHeader ? LAYOUT_TYPE.HEADER : LAYOUT_TYPE.CONTENT
    const error = (message?: string) => {
        messageApi.open({
            type: 'error',
            content: message || 'Ошибка сохранения',
        })
    }

    useEffect(() => {
        if (currentWidgetId) {
            const widget = zone?.settings?.widgets?.find(el => el.id === currentWidgetId)

            setCurrentWidget(widget)
            setCurrWidgetName(widget?.widgetName || null)
        }

    }, [currentWidgetId, zone, currentWidget])

    // Закрытие модалки
    const closeModal = () => {
        setOpenModal(false)
    }

    // Добавление новой зоны
    const addCard = () => {
        const id = uuidv4()

        const newWidget = {
            id,
            widgetMnemo: '',
            widgetId: id,
            view: {},
            objectId,
            page,
            classes,
            baseSettings,
        }

        addZone(newWidget, typeLayout)
    }

    // Добавление виджета в зону при наличии массива widgets
    const addWidgetInZone = (zoneId) => {
        const id = uuidv4()

        const newWidget = {
            id,
            widgetMnemo: '',
            widgetId: id,
            view: {},
            objectId,
            page,
            classes,
            baseSettings,
        }

        addWidget(newWidget, typeLayout, zoneId)
    }

    const addCardWithOrientation = (widgetOrientation) => {
        const id = uuidv4()

        const newWidget = {
            id,
            widgetMnemo: '',
            widgetId: id,
            view: {},
            objectId,
            page,
            classes,
            baseSettings,
            orientation: widgetOrientation
        }

        addZone(newWidget, typeLayout)
    }

    // Удаление зоны
    const deleteZone = (id: string) => {
        removeZone(id, typeLayout)
    }

    // Открытие модалки настроек зоны
    const openSettings = (e: any, id: string) => {
        setInitialZone(id, typeLayout)
        setOpenModal(true)
    }

    // Открытие модалки настроек мультизоны
    const openMultiWidgetSettings = (id: string) => {
        // setInitialZone(id, typeLayout)
        setCurrentWidgetId(id)
        setOpenWidgetModal(true)
    }

    // Сохранение настроек зоны
    const saveSettings = () => {
        saveZone(typeLayout)
        setOpenModal(false)
    }

    // Сохранение настроек мультизоны
    const saveMultizoneSettings = () => {
        setWidgetName(currWidgetName, currentWidgetId)
        saveZone(typeLayout)
        setCurrentWidget(null)
        setOpenWidgetModal(false)
    }

    //Получение обновленных данных виджета при перемещении
    const onLayoutChange = useCallback((layout: Layout[], layouts: { [x: string]: Layout[] }) => {
        if (editable) {
            updateLayout(layout, layouts, typeLayout)
        }

    }, [updateLayout, editable, typeLayout])

    const selectWidgetsOptions = useMemo(() => {
        const filteredWidgets = WIDGETS.filter(widget =>
            widget.purposeMaket?.some(purpose => purpose === 3 || purpose === 4))

        return filteredWidgets
            .map((item) => {
                return {
                    label: item.name,
                    value: item.mnemo
                }
            })
            .sort((a, b) => a.label.localeCompare(b.label))
    }, [WIDGETS])

    const renderZoneContentModal = useMemo(() => ({
        '0': <SettingsLabelTab onChange={setLabelZone} values={zone?.wrapper?.style?.labelParams} />,
        '1': <ZoneSettings />,
        '2': (
            <Widget
                settings={{
                    widget: zone?.settings?.widget,
                    vtemplate: zone?.settings?.vtemplate,
                    baseSettings: zone?.settings?.baseSettings,
                }}
                widgetMnemo={zone?.widgetMnemo || ''}
                widgetType={WIDGET_TYPES.WIDGET_TYPE_FORM}
                onChangeForm={setWidgetSettings}
            />
        ),
    }), [zone])

    const renderWidgetContentModal = useMemo(() => ({
        '0': (
            <SettingsLabelTab
                onChange={(value, key) => setLabelWidget(value, key, currentWidgetId)}
                values={currentWidget?.wrapper?.style?.labelParams || {}}
            />
        ),
        // '1': <ZoneSettings widget={currentWidget} />,
        '2': (
            <Widget
                settings={{
                    widget: currentWidget?.settings?.widget,
                    vtemplate: zone?.settings?.vtemplate,
                    baseSettings: currentWidget?.settings?.baseSettings,
                }}
                widgetMnemo={currentWidget?.widgetMnemo || ''}
                widgetType={WIDGET_TYPES.WIDGET_TYPE_FORM}
                onChangeForm={(params) => setWidgetZoneSettings(params, currentWidgetId)}
            />
        ),
    }), [currentWidget])

    // Экспорт/импорт----------------------------------------------------------------------------------------------
    //export RGL зоны целиком
    const exportRGL = () => {
        exportJson('RGL зона', layout)
    }

    //Проверка на валидность json
    const isValidRgl = (obj: any): obj is layoutType => {
        return obj.widgets !== undefined && Array.isArray(obj.widgets)
    }

    //Импорт RGL зоны целиком
    const importRGL = async (file: Blob) => {
        const result: layoutType = await readJsonFile(file)

        if (isValidRgl(result)) {
            setLayout(result)
        } else {
            error('Невалидный шаблон')
        }
    }

    // Выпадающий список импорта/экспорта
    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <Upload
                    beforeUpload={(file) => {
                        importRGL(file)

                        return false
                    }}
                    showUploadList={false}
                    accept=".json"
                >
                    Импорт всей панели
                </Upload>
            ),
        },
        {
            key: '2',
            label: (
                <div onClick={exportRGL}>Экспорт всей панели</div>
            ),
        },
    ]
    //------------------------------------------------------------------------------------------------------------------

    // Выпадающий список выбора типа зон
    const zoneTypes: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <div onClick={addCard}>Обычная</div>
            ),
        },
        {
            key: '2',
            label: (
                <div onClick={() => addCardWithOrientation('horizontal')}>Горизонтальная прокрутка</div>
            ),
        },
        // {
        //     key: '3',
        //     label: (
        //         <div onClick={addCard}>Вертикальная прокрутка</div>
        //     ),
        // },
    ]
    //------------------------------------------------------------------------------------------------------------------

    //Сбрасываем текущее значение зоны, если модалка закрыта
    useEffect(() => {
        if (!openModal) {
            removeZone(null, typeLayout)
        }
    }, [openModal])

    return (
        <div style={{ position: 'relative' }}>
            {contextHolder}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    flexDirection: isMobile ? 'column' : 'row',
                    position: isMobile ? 'absolute' : 'static',
                    top: 0,
                    left: `calc(${layoutSize.width}px + 10px)`
                }}
            >
                {editable && !isInterfaceShowcase &&
                    <div
                        style={{
                            display: 'flex',
                            gap: 10,
                            marginBottom: 10,
                            flexDirection:
                                isMobile ? 'column' : 'row'
                        }}
                    >
                        <div>
                            <ECTooltip title="Импорт - Экспорт">
                                <Dropdown menu={{ items }} placement="bottom">
                                    <ButtonSettings
                                        shape="circle"
                                        size="small"
                                        icon={false}
                                    >
                                        <ShrinkOutlined />
                                    </ButtonSettings>
                                </Dropdown>
                            </ECTooltip>
                        </div>
                        <div>
                            <ECTooltip title="Добавить зону">
                                <ButtonSettings
                                    shape="circle"
                                    size="small"
                                    onClick={addCard}
                                    icon={false}
                                >
                                    <AppstoreAddOutlined />
                                </ButtonSettings>
                            </ECTooltip>
                        </div>
                        <div>
                            <ECTooltip title="Выбор зоны">
                                <Dropdown menu={{ items: zoneTypes }} placement="bottom">
                                    <ButtonSettings
                                        shape="circle"
                                        size="small"
                                        // onClick={addCard}
                                        icon={false}
                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <WizardStick />
                                    </ButtonSettings>
                                </Dropdown>

                            </ECTooltip>
                        </div>
                    </div>}
            </div>
            <div
                style={{
                    overflow: 'auto',
                    width: `${layoutSize.width}px`,
                    // width: '100%',
                    height: `${isHeader
                        ? 70
                        : layoutSize.height - ('widgets' in headerLayout ? 126 : isManageZone ? 58 : 0)}px`,
                }}
            >
                <ResponsiveGridLayout
                    className="layout"
                    style={{
                        background: !editable ? '#FFF' : 'rgb(245, 245, 245)',
                        borderRadius: 10,
                        overflow: 'hidden',
                        minHeight: 64,
                        width: '100%',
                        flex: 1
                    }}
                    layouts={getLayouts(dataLayout)}
                    breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                    cols={{ lg: 24, md: 24, sm: 24, xs: 8, xxs: 4 }}
                    rowHeight={10}
                    autoSize={true}
                    width={layoutSize.width}
                    isDraggable={editable}
                    isResizable={editable}
                    onLayoutChange={onLayoutChange}
                >
                    {dataLayout?.widgets?.map((widget) => (
                        <div
                            key={widget.id}
                            data-grid={{ ...widget.layout }}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                border: editable ? '1px solid grey' : 'none',
                                borderRadius: widget.wrapper?.style?.styleParams?.widgetBorderEnable ? 0 : '10px',
                                boxShadow: widget.wrapper?.style?.styleParams?.widgetBorderEnable
                                    ? 'none' : '0px 0px 8px rgba(0, 0, 0, 0.4)',
                                backgroundColor: 'white',
                                overflow: 'auto',
                            }}
                        >
                            {editable && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        right: 10,
                                        top: 5,
                                        cursor: 'pointer',
                                        borderRadius: '3px',
                                        backgroundColor: '#d9d9d9',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        gap: 10,
                                        padding: '0 3px 0 3px',
                                        zIndex: zIndex.widgetToolbarIndex
                                    }}
                                >
                                    <div>
                                        <ECTooltip title="Настройки">
                                            <SettingOutlined
                                                onClick={(e) => openSettings(e, widget.id)}
                                                onMouseDown={(e: any) => e.stopPropagation()}
                                            />
                                        </ECTooltip>
                                    </div>
                                    <div>
                                        <ECTooltip title="Удалить">
                                            <DeleteOutlined
                                                onClick={() => deleteZone(widget.id)}
                                                onMouseDown={(e: any) => e.stopPropagation()}
                                            />
                                        </ECTooltip>
                                    </div>
                                </div>
                            )}
                            <div style={{ width: '100%', height: '100%', overflow: 'auto' }} >
                                {widget?.settings?.widgets
                                    ?
                                    <Carousel
                                        arrows
                                        infinite={false}
                                        dotPosition={widget?.settings?.orientation == 'horizontal' ? 'bottom' : 'left'}
                                    >
                                        {widget?.settings?.widgets.map((widgetItem, index) => (
                                            <WrapperWidget settings={widgetItem?.wrapper} key={index}>
                                                <Widget
                                                    settings={widgetItem?.settings}
                                                    widgetMnemo={widgetItem?.widgetMnemo || ''}
                                                    widgetType={WIDGET_TYPES.WIDGET_TYPE_SHOW}
                                                />
                                            </WrapperWidget>
                                        ))}
                                    </Carousel>
                                    :
                                    <WrapperWidget settings={widget?.wrapper} >
                                        <Widget
                                            settings={widget?.settings}
                                            widgetMnemo={widget?.widgetMnemo || ''}
                                            widgetType={WIDGET_TYPES.WIDGET_TYPE_SHOW}
                                        />
                                    </WrapperWidget>}

                            </div>
                        </div>
                    ))}
                </ResponsiveGridLayout>
                <ECModal
                    open={openModal}
                    onCancel={closeModal}
                    showFooterButtons={false}
                    tooltipText="Настройки дашборда"
                    height="90vh"
                    width="90vw"
                    centered
                >
                    {zone?.settings?.widgets
                        ?
                        <div style={{ height: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div
                                style={{
                                    width: '100%',
                                    marginTop: 20,
                                    marginBottom: 20,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <ButtonSettings
                                    icon={false}
                                    type="primary"
                                    onClick={saveSettings}
                                >
                                    Сохранить
                                </ButtonSettings>
                                {/* <Buttons.ButtonAddRow
                                    size="middle"
                                    tooltipText="Добавить виджет"
                                    style={{ margin: '10px 20px' }}
                                    onClick={() => {
                                        addWidgetInZone(zone.id) // добавляем плашку, которую можно настроить
                                    }}
                                /> */}
                            </div>
                            <div style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                                <Card
                                    style={{
                                        overflow: 'auto',
                                        height: '100%',
                                        width: 'max-content',
                                        borderRadius: '0px 5px 0px 0px'
                                    }}
                                    title="Настройка зоны"
                                >
                                    {renderZoneContentModal['1']}
                                </Card>
                                <Card
                                    style={{
                                        overflow: 'auto',
                                        height: '100%',
                                        width: 'max-content',
                                        borderRadius: '0px 5px 0px 0px',
                                    }}
                                    title={
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                            }}
                                        >
                                            Список виджетов
                                            <Buttons.ButtonAddRow
                                                size="small"
                                                tooltipText="Добавить виджет"
                                                style={{ margin: '10px 20px' }}
                                                onClick={() => {
                                                    addWidgetInZone(zone.id)
                                                }}
                                            />
                                        </div>
                                    }
                                >
                                    <SortableList
                                        // items={layout?.widgets?.find(el => el.id == zone.id).settings?.widgets}
                                        items={zone?.settings?.widgets}
                                        renderItem={(item: widgetType) => {
                                            return (
                                                <SortableList.Item
                                                    id={item.id}
                                                    customItemStyle={{ padding: 0, borderRadius: '8px' }}
                                                >
                                                    <div style={{ width: '600px', paddingLeft: 20 }}>
                                                        {item?.widgetMnemo
                                                            ? `${selectWidgetsOptions
                                                                .find(el => el.value == item.widgetMnemo)?.label} 
                                                                ${item?.widgetName ? `(${item?.widgetName})` : ''}`
                                                            : '<Выберите виджет>'}
                                                    </div>
                                                    <Row gutter={4} justify="space-between">
                                                        <Col>
                                                            {' '}
                                                            <Buttons.ButtonEditRow
                                                                onClick={() => openMultiWidgetSettings(item.id)}
                                                            />
                                                        </Col>

                                                        <Col>
                                                            {' '}
                                                            <Buttons.ButtonDeleteRow
                                                                onClick={() => removeZone(item.id)}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <SortableList.DragHandle
                                                        customDragHandlerStyle={{
                                                            padding: '15px 10px',
                                                            alignSelf: 'baseline',
                                                            marginTop: '5px',
                                                        }}
                                                    />
                                                </SortableList.Item>
                                            )
                                        }}
                                        onChange={setWidgets}
                                    />
                                </Card>
                                <ECModal
                                    open={openWidgetModal}
                                    onCancel={() => {
                                        setOpenWidgetModal(false)
                                        setCurrentWidget(null)
                                    }}
                                    showFooterButtons={false}
                                    tooltipText="Настройки виджета"
                                    height="90vh"
                                    width="90vw"
                                    centered
                                >
                                    <div style={{ height: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', flexDirection: 'row', width: '50%', gap: 20 }}>
                                            <Select
                                                placeholder="Выберите виджет"
                                                value={currentWidget?.widgetMnemo || undefined}
                                                onChange={(value) => {
                                                    setWidgetMnemo(value, currentWidgetId)
                                                }}
                                                options={selectWidgetsOptions}
                                                style={{ minWidth: 300, maxWidth: 500, width: '100%' }}
                                            />
                                            <Input
                                                placeholder="Введите название"
                                                value={currWidgetName}
                                                onChange={(e) => {
                                                    setCurrWidgetName(e.target.value)
                                                }}
                                                style={{ minWidth: 300, maxWidth: 500, width: '100%' }}
                                            />
                                        </div>

                                        <div style={{ width: 100, marginTop: 20, marginBottom: 20 }}>
                                            <ButtonSettings
                                                icon={false}
                                                type="primary"
                                                onClick={saveMultizoneSettings}
                                            >
                                                Сохранить
                                            </ButtonSettings>
                                        </div>
                                        <div style={{ display: 'flex', marginTop: '10px' }}>
                                            {tabsTitle.map((tab, i) => (
                                                <span onClick={() => setActiveKey(tab.key)} key={tab.key} >
                                                    <CustomTab
                                                        activeKey={activeKey}
                                                        currentKey={tab.key}
                                                        tabsLength={tabsTitle.length - 1}
                                                        index={i}
                                                    >
                                                        {tab.title}
                                                    </CustomTab>
                                                </span>
                                            ))}
                                        </div>
                                        <Card
                                            style={{
                                                overflow: 'auto',
                                                height: '100%',
                                                borderRadius: '0px 5px 0px 0px'
                                            }}
                                        >
                                            {renderWidgetContentModal[activeKey]}
                                        </Card>
                                    </div>
                                </ECModal>
                            </div>
                        </div>
                        :
                        <div style={{ height: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <Select
                                placeholder="Выберите виджет"
                                value={zone?.widgetMnemo || undefined}
                                onChange={setZoneMnemo}
                                options={selectWidgetsOptions}
                                style={{ minWidth: 300, maxWidth: 500, width: '100%' }}
                            />
                            <div style={{ width: 100, marginTop: 20, marginBottom: 20 }}>
                                <ButtonSettings
                                    icon={false}
                                    type="primary"
                                    onClick={saveSettings}
                                >
                                    Сохранить
                                </ButtonSettings>
                            </div>
                            <div style={{ display: 'flex', marginTop: '10px' }}>
                                {tabsTitle.map((tab, i) => (
                                    <span onClick={() => setActiveKey(tab.key)} key={tab.key} >
                                        <CustomTab
                                            activeKey={activeKey}
                                            currentKey={tab.key}
                                            tabsLength={tabsTitle.length - 1}
                                            index={i}
                                        >
                                            {tab.title}
                                        </CustomTab>
                                    </span>
                                ))}
                            </div>
                            <Card style={{ overflow: 'auto', height: '100%', borderRadius: '0px 5px 0px 0px' }} >
                                {renderZoneContentModal[activeKey]}
                            </Card>
                            <PreviewModal layoutSize={layoutSize} />
                        </div>}

                </ECModal>
            </div>
        </div>
    )
}

export default VtemplateMobileDashboard
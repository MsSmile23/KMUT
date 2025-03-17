import { CheckBox, Forms, Input } from '@shared/ui/forms'
import { Col, Form, Row, Switch, Collapse, Select, Divider } from 'antd'
import ECSelectColorsFromScheme from '@shared/ui/ECUIKit/forms/ECSelectColorsFromScheme/ECSelectColorsFromScheme'
import ColorsTable from '../ColorsTable'
import ECColorPicker from '@shared/ui/ECUIKit/forms/ECColorPicker/ECColorPicker'
import TableFormSettings from '../TableFormSettings'
import { ECUploadFile } from '@shared/ui/ECUIKit/forms'
import { useState } from 'react'
import ThemeTempModificationsFrom from './ThemeTempModificationsFrom/ThemeTempModificationsFrom'
import { FitlerPresetsForm } from '@features/objects/FilterPresetsForm/FilterPresetsForm'

const PAGINATION_OPTIONS = [
    { value: 'up', label: 'Сверху' },
    { value: 'down', label: 'Снизу' },
]

const THEME_MODE_OPTIONS = [
    { label: <span>Пользовательская</span>, value: 'default' },
    {
        label: <span style={{ maxWidth: '100%', textAlign: 'center', width: '100%' }}>---Зафиксировать схему---</span>,
        value: 'dark',
        disabled: true,
    },
    { label: <span>Тёмная</span>, value: 'dark' },
    { label: <span>Светлая</span>, value: 'light' },
]

enum CollapseKeys {
    ColorTable = 'colorTable',
    Header = 'header',
    Menu = 'menu',
    Table = 'table',
    Tree = 'tree',
    Filters = 'filters',
    ViewTable = 'viewTable',
    Widgets = 'widgets',
    SideBar = 'sideBar',
    Common = 'common',
    Fonts = 'fonts',
    Tabs = 'tabs',
    Colors = 'colors',
    Holydays = 'holydays',
}


type CollapseHeaders = Record<CollapseKeys, string[]>;


const MainSettingsForm = ({ form, colors, isSavingColors, tempModificat }) => {
    const [settingsPanels, setSettingsPanels] = useState<CollapseHeaders>({
        colorTable: [],
        header: [],
        menu: [],
        table: [],
        tree: [],
        filters: [],
        viewTable: [],
        widgets: [],
        sideBar: [],
        common: [],
        fonts: [],
        tabs: [],
        colors: [],
        holydays: []
    })

    const onChangeCollapseHeader = (key: CollapseKeys, value: string[] | string) => {
        setSettingsPanels((prevState) => ({
            ...prevState,
            [key]: value,
        }))
    }
    const switchHandler = (value: boolean) => {
        const finalValue = value ? ['1'] : []

        const updatedState = Object.fromEntries(
            Object.entries(settingsPanels).map(([key]) => [key, finalValue])
        ) as CollapseHeaders

        setSettingsPanels(updatedState)
    }

    return (
        <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                Открыть все <Switch onChange={(e) => { switchHandler(e) }} />
            </div>
            <Collapse
                activeKey={settingsPanels.colorTable}
                onChange={(e) => { onChangeCollapseHeader(CollapseKeys.ColorTable, e) }}
                defaultActiveKey={[]}
                style={{ marginBottom: '10px', marginTop: '20px' }}
                items={[
                    {
                        key: '1',
                        label: 'Цветовая схема',
                        children: (
                            <Col span={24}>
                                <Form.Item
                                    label="Цветовая схема проекта"
                                    name="colorSchemeMode"
                                    labelCol={{ span: 3, offset: 0 }}
                                >
                                    <Select
                                        options={THEME_MODE_OPTIONS}
                                        style={{ width: '300px' }}
                                    />
                                </Form.Item>
                                <Form.Item name="colorScheme" style={{ margin: 0 }}>
                                    <ColorsTable isSavingColors={isSavingColors} form={form} />
                                </Form.Item>
                            </Col>
                        ),
                    },
                ]}
            />
            <Collapse
                activeKey={settingsPanels.header}
                onChange={(e) => { onChangeCollapseHeader(CollapseKeys.Header, e) }}
                defaultActiveKey={[]}
                style={{ marginBottom: '10px' }}
                items={[
                    {
                        key: '1',
                        label: 'Шапка',
                        children: (
                            <Row gutter={[8, 8]}>
                                <Col span={6}>
                                    <Form.Item
                                        style={{ margin: 0 }}
                                        labelCol={{ span: 10, offset: 0 }}
                                        label="Цвет текста"
                                        name="headerTextColor"
                                    >
                                        <ECSelectColorsFromScheme colors={colors} />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        style={{ margin: 0 }}
                                        labelCol={{ span: 10, offset: 0 }}
                                        label="Цвет фона"
                                        name="headerBackgroundColor"
                                    >
                                        <ECSelectColorsFromScheme colors={colors} />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        label="Логотип"
                                        name="headerLogo"
                                    >
                                        <ECUploadFile
                                            setFieldValue={form.setFieldValue}
                                            fieldName="headerLogo"
                                            mediaFileId={form.getFieldValue('headerLogo')}
                                            getFieldValue={form.getFieldValue}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        labelCol={{ span: 14, offset: 0 }}
                                        label="Скрыть строку поиска"
                                        name="hideSearch"
                                        valuePropName="checked"
                                    >
                                        <Switch />
                                    </Form.Item>
                                </Col>
                            </Row>
                        ),
                    },
                ]}
            />
            <Collapse
                activeKey={settingsPanels.tree}
                onChange={(e) => { onChangeCollapseHeader(CollapseKeys.Tree, e) }}
                defaultActiveKey={[]}
                style={{ marginBottom: '10px' }}
                items={[
                    {
                        key: '1',
                        label: 'Дерево',
                        children: (
                            <>
                                <Row gutter={[8, 8]} style={{ marginBottom: '10px' }}>
                                    <Col span={24}>
                                        <Form.Item
                                            style={{ margin: 0 }}
                                            labelCol={{ span: 6, offset: 0 }}
                                            labelAlign="left"
                                            label="Горизонтальная прокрутка"
                                            name="treeVersion"
                                        >
                                            <Select
                                                defaultValue="fullVersion"
                                                style={{ width: 200 }}
                                                options={[
                                                    { value: 'fullVersion', label: 'Полная версия' },
                                                    { value: 'simpleVersion', label: 'Упрощённая версия' },
                                                ]}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={[8, 8]} style={{ marginBottom: '10px' }}>
                                    <Col span={24}>
                                        <Form.Item
                                            valuePropName="checked"
                                            style={{ margin: 0 }}
                                            labelCol={{ span: 6, offset: 0 }}
                                            labelAlign="left"
                                            label="Горизонтальная прокрутка"
                                            name="treeHorizontalScroll"
                                        >
                                            <Switch />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={[8, 8]} style={{ marginBottom: '10px' }}>
                                    <Col span={24}>
                                        <Form.Item
                                            valuePropName="checked"
                                            style={{ margin: 0 }}
                                            labelCol={{ span: 6, offset: 0 }}
                                            labelAlign="left"
                                            label="Дочернее дерево"
                                            name="treeShowChildTree"
                                        >
                                            <Switch />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Divider />
                                <Row>
                                    <Col>
                                        <Form.Item shouldUpdate name="treeFilterPresets">
                                            <FitlerPresetsForm />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </>
                        )
                    }
                ]}
            />
            <Collapse
                activeKey={settingsPanels.filters}
                onChange={(e) => { onChangeCollapseHeader(CollapseKeys.Filters, e) }}
                defaultActiveKey={[]}
                style={{ marginBottom: '10px' }}
                items={[
                    {
                        key: '1',
                        label: 'Фильтры',
                        children: (
                            <Row>
                                <Col span={8}>
                                    <Form.Item
                                        style={{ margin: 0 }}
                                        labelCol={{ span: 10, offset: 0 }}
                                        label="Цвет обводки фильтров"
                                        name="filtersBorderColor"
                                    >
                                        <ECSelectColorsFromScheme colors={colors} />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        style={{ margin: 0 }}
                                        labelCol={{ span: 10, offset: 0 }}
                                        label="Цвет текста фильтров"
                                        name="filtersTextColor"
                                    >
                                        <ECSelectColorsFromScheme colors={colors} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        )
                    }
                ]}
            />
            <Collapse
                activeKey={settingsPanels.menu}
                onChange={(e) => { onChangeCollapseHeader(CollapseKeys.Menu, e) }}
                defaultActiveKey={[]}
                style={{ marginBottom: '10px' }}
                items={[
                    {
                        key: '1',
                        label: 'Меню',
                        children: (
                            <>
                                <Row gutter={[8, 8]} style={{ marginBottom: '10px' }}>
                                    <Col span={6}>
                                        <Form.Item
                                            style={{ margin: 0 }}
                                            labelCol={{ span: 16, offset: 0 }}
                                            label="Ширина меню в пикселях"
                                            name="menuWidth"
                                        >
                                            <Input type="number" min={0} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item
                                            style={{ margin: 0 }}
                                            labelCol={{ span: 10, offset: 0 }}
                                            label="Цвет фона меню"
                                            name="menuBackgroundColor"
                                        >
                                            <ECSelectColorsFromScheme colors={colors} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={[8, 8]}>
                                    <Col span={12}>
                                        <Collapse
                                            defaultActiveKey={['1']}
                                            style={{ marginBottom: '10px' }}
                                            items={[
                                                {
                                                    key: '1',
                                                    label: 'Неактивный пункт меню',
                                                    children: (
                                                        <Row gutter={[8, 8]}>
                                                            <Col span={12}>
                                                                <Form.Item
                                                                    style={{ margin: 0 }}
                                                                    labelCol={{ span: 10, offset: 0 }}
                                                                    label="Цвет текста"
                                                                    name="inactiveMenuItemTextColor"
                                                                >
                                                                    <ECSelectColorsFromScheme colors={colors} />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col span={12}>
                                                                <Form.Item
                                                                    style={{ margin: 0 }}
                                                                    labelCol={{ span: 10, offset: 0 }}
                                                                    label="Цвет фона"
                                                                    name="inactiveMenuItemBackgroundColor"
                                                                >
                                                                    <ECSelectColorsFromScheme colors={colors} />
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>
                                                    ),
                                                },
                                            ]}
                                        />
                                    </Col>
                                    <Col span={12}>
                                        <Collapse
                                            defaultActiveKey={['1']}
                                            style={{ marginBottom: '10px' }}
                                            items={[
                                                {
                                                    key: '1',
                                                    label: 'Активный пункт меню',
                                                    children: (
                                                        <Row gutter={[8, 8]}>
                                                            <Col span={12}>
                                                                <Form.Item
                                                                    style={{ margin: 0 }}
                                                                    labelCol={{ span: 10, offset: 0 }}
                                                                    label="Цвет текста"
                                                                    name="activeMenuItemTextColor"
                                                                >
                                                                    <ECSelectColorsFromScheme colors={colors} />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col span={12}>
                                                                <Form.Item
                                                                    style={{ margin: 0 }}
                                                                    labelCol={{ span: 10, offset: 0 }}
                                                                    label="Цвет фона"
                                                                    name="activeMenuItemBackgroundColor"
                                                                >
                                                                    <ECSelectColorsFromScheme colors={colors} />
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>
                                                    ),
                                                },
                                            ]}
                                        />
                                    </Col>
                                </Row>
                            </>
                        ),
                    },
                ]}
            />
            <Collapse
                activeKey={settingsPanels.table}
                onChange={(e) => { onChangeCollapseHeader(CollapseKeys.Table, e) }}
                defaultActiveKey={[]}
                style={{ marginBottom: '10px' }}
                items={[
                    {
                        key: '1',
                        label: 'Таблица',
                        children: (
                            <TableFormSettings colors={colors} />

                        ),
                    },
                ]}
            />
            <Collapse
                activeKey={settingsPanels.widgets}
                onChange={(e) => { onChangeCollapseHeader(CollapseKeys.Widgets, e) }}
                defaultActiveKey={[]}
                style={{ marginBottom: '10px' }}
                items={[
                    {
                        key: '1',
                        label: 'Виджеты',
                        children: (
                            <>
                                <Row gutter={[8, 8]} style={{ marginBottom: '10px' }}>
                                    <Col span={6}>
                                        <Form.Item
                                            style={{ margin: 0 }}
                                            labelCol={{ span: 10, offset: 0 }}
                                            label="Цвет фона"
                                            name="widgetBackground"
                                        >
                                            <ECSelectColorsFromScheme colors={colors} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item
                                            style={{ margin: 0 }}
                                            labelCol={{ span: 10, offset: 0 }}
                                            label="Цвет текста"
                                            name="widgetColor"
                                        >
                                            <ECSelectColorsFromScheme colors={colors} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item
                                            style={{ margin: 0 }}
                                            labelCol={{ span: 10, offset: 0 }}
                                            label="Толщина тени"
                                            name="widgetShadowWidth"
                                        >
                                            <Input type="number" min={0} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item
                                            style={{ margin: 0 }}
                                            labelCol={{ span: 10, offset: 0 }}
                                            label="Цвет тени"
                                            name="widgetShadowColor"
                                        >
                                            <ECSelectColorsFromScheme colors={colors} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Collapse
                                    defaultActiveKey={['1']}
                                    style={{ marginBottom: '10px' }}
                                    items={[
                                        {
                                            key: '1',
                                            label: 'Оформление (базовое)',
                                            children: (
                                                <Row gutter={8}>
                                                    <Col span={5}>
                                                        {' '}
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                width: '300px',
                                                                flexDirection: 'column',
                                                                alignItems: 'center',
                                                            }}
                                                        >

                                                            <Form.Item noStyle name="paddingOutTitleTop">
                                                                <Input style={{ width: '70px' }} type="number" />
                                                            </Form.Item>
                                                            <div
                                                                style={{
                                                                    width: '250px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                }}
                                                            >

                                                                <Form.Item noStyle name="paddingOutTitleLeft">
                                                                    <Input style={{ width: '100px' }} type="number" />
                                                                </Form.Item>
                                                                <div
                                                                    style={{
                                                                        border: '1px solid black',
                                                                        padding: '10px',
                                                                        margin: '10px',
                                                                    }}
                                                                >
                                                                    Заголовок
                                                                </div>

                                                                <Form.Item noStyle name="paddingOutTitleRight">
                                                                    <Input style={{ width: '100px' }} type="number" />
                                                                </Form.Item>
                                                            </div>


                                                        </div>
                                                    </Col>

                                                    <Col
                                                        span={12}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            flexDirection: 'column',
                                                        }}
                                                    >
                                                        <Form.Item noStyle name="paddingOutWidgetTop">
                                                            <Input style={{ width: '70px' }} type="number" />
                                                        </Form.Item>
                                                        <div
                                                            style={{
                                                                width: '600px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                            }}
                                                        >

                                                            <Form.Item noStyle name="paddingOutWidgetLeft">
                                                                <Input style={{ width: '70px' }} type="number" />
                                                            </Form.Item>
                                                            <div
                                                                style={{
                                                                    display: 'flex',
                                                                    width: '400px',
                                                                    flexDirection: 'column',
                                                                    alignItems: 'center',
                                                                    border: '1px solid black',
                                                                    padding: '5px',
                                                                    position: 'relative',
                                                                    margin: '5px',
                                                                }}
                                                            >
                                                                <div
                                                                    style={{
                                                                        position: 'absolute',
                                                                        left: 5,
                                                                        top: 5,
                                                                    }}
                                                                >
                                                                    Границы виджета
                                                                </div>

                                                                <Form.Item noStyle name="paddingInWidgetTop">
                                                                    <Input style={{ width: '70px' }} type="number" />
                                                                </Form.Item>
                                                                <div
                                                                    style={{
                                                                        width: '250px',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                    }}
                                                                >

                                                                    <Form.Item noStyle name="paddingInWidgetLeft">
                                                                        <Input
                                                                            style={{ width: '100px' }}
                                                                            type="number"
                                                                        />
                                                                    </Form.Item>
                                                                    <div
                                                                        style={{
                                                                            border: '1px solid black',
                                                                            padding: '10px',
                                                                            margin: '10px',
                                                                        }}
                                                                    >
                                                                        Контент
                                                                    </div>

                                                                    <Form.Item noStyle name="paddingInWidgetRight">
                                                                        <Input
                                                                            style={{ width: '100px' }}
                                                                            type="number"
                                                                        />
                                                                    </Form.Item>
                                                                </div>

                                                                <Form.Item noStyle name="paddingInWidgetBottom">
                                                                    <Input style={{ width: '70px' }} type="number" />
                                                                </Form.Item>
                                                            </div>{' '}

                                                            <Form.Item noStyle name="paddingOutWidgetRight">
                                                                <Input style={{ width: '70px' }} type="number" />

                                                            </Form.Item>
                                                        </div>

                                                        <Form.Item noStyle name="paddingOutWidgetBottom">
                                                            <Input style={{ width: '70px' }} type="number" />
                                                        </Form.Item>
                                                    </Col>

                                                    <Col span={7}>
                                                        <Row gutter={8}>
                                                            <Col span={12}>
                                                                Закругление границ:
                                                                <Form.Item style={{ width: '50%' }} name="borderRadius">
                                                                    <Input type="number" />
                                                                </Form.Item>
                                                                Толщина границ:
                                                                <Form.Item
                                                                    name="borderThickness"
                                                                    style={{ width: '50%' }}
                                                                >
                                                                    <Input type="number" />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col span={12}>
                                                                {' '}
                                                                Цвет границ:
                                                                <Form.Item name="borderColor">
                                                                    <ECColorPicker />
                                                                </Form.Item>
                                                                Отключить зону границ:
                                                                <Form.Item
                                                                    name="widgetBorderEnable"
                                                                    valuePropName="checked"
                                                                >
                                                                    <CheckBox />
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            ),
                                        },
                                    ]}
                                />
                            </>
                        ),
                    },
                ]}
            />
            <Collapse
                activeKey={settingsPanels.sideBar}
                onChange={(e) => { onChangeCollapseHeader(CollapseKeys.SideBar, e) }}
                defaultActiveKey={[]}
                style={{ marginBottom: '10px' }}
                items={[
                    {
                        key: '1',
                        label: 'Сайдбар',
                        children: (
                            <Row gutter={[8, 8]} style={{ marginBottom: '10px' }}>
                                <Col span={6}>
                                    <Form.Item
                                        style={{ margin: 0 }}
                                        labelCol={{ span: 10, offset: 0 }}
                                        label="Цвет фона"
                                        name="sidebarBackground"
                                    >
                                        <ECSelectColorsFromScheme colors={colors} />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        style={{ margin: 0 }}
                                        labelCol={{ span: 10, offset: 0 }}
                                        label="Цвет текста"
                                        name="sidebarColor"
                                    >
                                        <ECSelectColorsFromScheme colors={colors} />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        style={{ margin: 0 }}
                                        labelCol={{ span: 16, offset: 0 }}
                                        label="Ширина по умолчанию"
                                        name="sidebarWidth"
                                    >
                                        <Input type="number" min={0} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        ),
                    },
                ]}
            />
            <Collapse
                activeKey={settingsPanels.common}
                onChange={(e) => { onChangeCollapseHeader(CollapseKeys.Common, e) }}
                defaultActiveKey={[]}
                items={[
                    {
                        key: '1',
                        label: 'Общие настройки',
                        children: (
                            <Row gutter={[8, 8]}>
                                <Col span={6}>
                                    <Form.Item
                                        style={{ margin: 0 }}
                                        labelCol={{ span: 10, offset: 0 }}
                                        label="Название"
                                        name="title"
                                    >
                                        <Forms.Input allowClear placeholder="Название проекта" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        style={{ margin: 0 }}
                                        labelCol={{ span: 10, offset: 0 }}
                                        label="Текст"
                                        name="text"
                                    >
                                        <Forms.Input allowClear placeholder="Текст" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        style={{ margin: 0 }}
                                        labelCol={{ span: 10, offset: 0 }}
                                        label="ServiceDesk URL"
                                        name="externalTicketUrl"
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        style={{ margin: 0 }}
                                        labelCol={{ span: 10, offset: 0 }}
                                        label="Карта с сервера"
                                        name="relativePath"
                                        valuePropName="checked"
                                    >
                                        <Switch />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        style={{ margin: 0 }}
                                        labelCol={{ span: 10, offset: 0 }}
                                        label="Статус лицензии"
                                        name="licenseStatus"
                                        valuePropName="checked"
                                    >
                                        <Switch />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        style={{ margin: 0 }}
                                        labelCol={{ span: 10, offset: 0 }}
                                        label="Разделение сторов"
                                        name="isExternalObjectAttributes"
                                        valuePropName="checked"
                                    >
                                        <Switch />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        style={{ margin: 0 }}
                                        labelCol={{ span: 12, offset: 0 }}
                                        label="Скрыть левый сайдбар"
                                        name="hideLeftSidebar"
                                        valuePropName="checked"
                                    >
                                        <Switch />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        style={{ margin: 0 }}
                                        labelCol={{ span: 18, offset: 0 }}
                                        label="Проверка доступности сервера"
                                        name="checkHealthBlocking"
                                        valuePropName="checked"
                                    >
                                        <Switch />
                                    </Form.Item>
                                </Col>
                            </Row>
                        ),
                    },
                ]}
                style={{ marginBottom: '10px' }}
            />
            <Collapse
                activeKey={settingsPanels.fonts}
                onChange={(e) => { onChangeCollapseHeader(CollapseKeys.Fonts, e) }}
                defaultActiveKey={[]}
                style={{ marginBottom: '10px' }}
                items={[
                    {
                        key: '1',
                        label: 'Настройки шрифтов',
                        children: (
                            <Row gutter={[8, 8]}>
                                <Col span={6}>
                                    <Form.Item
                                        labelCol={{ span: 10, offset: 0 }}
                                        label="Шрифт"
                                        name="font"
                                        style={{ margin: 0 }}
                                    >
                                        <Forms.Input allowClear placeholder="Шрифт" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        labelCol={{ span: 10, offset: 0 }}
                                        label="Размер шрифта"
                                        name="fontSize"
                                        style={{ margin: 0 }}
                                    >
                                        <Forms.Input type="number" min={1} placeholder="Размер шрифта" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        style={{ margin: 0 }}
                                        labelCol={{ span: 10, offset: 0 }}
                                        label="Толщина шрифта"
                                        name="fontWeight"
                                    >
                                        <Forms.Input
                                            type="number"
                                            min={100}
                                            step={100}
                                            max={900}
                                            placeholder="Размер шрифта"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        ),
                    },
                ]}
            />{' '}
            <Collapse
                activeKey={settingsPanels.colors}
                onChange={(e) => { onChangeCollapseHeader(CollapseKeys.Colors, e) }}
                defaultActiveKey={[]}
                style={{ marginBottom: '10px' }}
                items={[
                    {
                        key: '1',
                        label: 'Цветовая палитра',
                        children: (
                            <Row gutter={[8, 8]}>
                                <Col span={6}>
                                    <Form.Item
                                        style={{ margin: 0 }}
                                        labelCol={{ span: 10, offset: 0 }}
                                        label="Цвет текста"
                                        name="textColor"
                                    >
                                        <ECSelectColorsFromScheme colors={colors} />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        style={{ margin: 0 }}
                                        labelCol={{ span: 10, offset: 0 }}
                                        label="Цвет фона"
                                        name="backgroundColor"
                                    >
                                        <ECSelectColorsFromScheme colors={colors} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        ),
                    },
                ]}
            />
            <Collapse
                activeKey={settingsPanels.tabs}
                onChange={(e) => { onChangeCollapseHeader(CollapseKeys.Tabs, e) }}
                defaultActiveKey={[]}
                style={{ marginBottom: '10px' }}
                items={[
                    {
                        key: '1',
                        label: 'Вкладки',
                        children: (
                            <Row gutter={[8, 8]}>
                                <Col span={6}>
                                    <Form.Item
                                        style={{ margin: 0 }}
                                        labelCol={{ span: 10, offset: 0 }}
                                        label="Цвет активной вкладки"
                                        name="activeTabBackgroundColor"
                                    >
                                        <ECSelectColorsFromScheme colors={colors} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        ),
                    },
                ]}
            />
            <Collapse
                activeKey={settingsPanels.holydays}
                onChange={(e) => { onChangeCollapseHeader(CollapseKeys.Holydays, e) }}
                defaultActiveKey={[]}
                style={{ marginBottom: '10px' }}
                items={[
                    {
                        key: '1',
                        label: 'Праздники',
                        children: (
                            <Form.Item name="pictureAfterSystemTitle">
                                <ThemeTempModificationsFrom props={tempModificat} />
                            </Form.Item>
                        ),
                    },
                ]}
            />
        </>
    )
}

export default MainSettingsForm
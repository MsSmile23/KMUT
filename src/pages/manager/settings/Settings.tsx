/* eslint-disable max-len */
/* eslint-disable react/jsx-max-depth */
import { DownloadOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons'
import { SERVICES_CONFIG } from '@shared/api/Config'
import { useDocumentTitle } from '@shared/hooks/useDocumentTitle'
import { useConfigStore } from '@shared/stores/config'
import { CONFIG_MNEMOS } from '@shared/types/config'
import { Buttons } from '@shared/ui/buttons'
import WrapperCard from '@shared/ui/wrappers/WrapperCard/WrapperCard'
import { Form, message, Modal, Row, Upload } from 'antd'
import { FC, useEffect, useState } from 'react'
import { useTheme } from '@shared/hooks/useTheme'
import CustomPreloader from '@shared/ui/preloader/CustomPreloader'
import { jsonParseAsObject, responseErrorHandler } from '@shared/utils/common'
import { merge } from 'lodash'
import PaddingForm from './PaddingForm'
import { ECTabs } from '@shared/ui/tabs'
import MainSettingsForm from './MainSettingForm/MainSettingsForm'
import { findFieldIsImage, uploadImage } from '@shared/ui/ECUIKit/forms/ECUploadFile/utils'
import { ECTooltip } from '@shared/ui/tooltips'
import { readJsonFile } from '@containers/vtemplates/VtemplateFormContainer/services'
import { useObjectsStore } from '@shared/stores/objects'
import { ITempModificat } from '@shared/types/temp-modification'
import { validateHolidays } from './MainSettingForm/ThemeTempModificationsFrom/themeTempSettings/tempSettings'
import SystemSettingForm from './SystemSettingForm/SystemSettingForm'
import { useAccountStore } from '@shared/stores/accounts'



const title = 'Настройка проекта'

const getPadding = (isActive, value) => ({
    isActive: isActive ?? false,
    value: value ?? 3,
});

const BASE_MAP_TILES = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
const Settings: FC = () => {
    useDocumentTitle(title)
    const [form] = Form.useForm()
    //*Находим нужную тему, чтобы в случае пустых значений строковых они брались из темы проекта
    const theme = useTheme()
    const forceUpdateConfigStore = useConfigStore((st) => st.forceUpdate)
    const findConfig = useConfigStore((st) => st.getConfigByMnemo)
    const checkConfig = findConfig(CONFIG_MNEMOS.FRONT_SETTINGS)
    const [isLoadingForm, setIsLoadingForm] = useState<boolean>(true)

    const [isSavingColors, setIsSavingColors] = useState<boolean>(false)
    const [tableData, setTableData] = useState<any>(null)
    const [activeTab, setActiveTab] = useState('system')

    const [colors, setColors] = useState<any[]>([])
    const setOASource = useObjectsStore((st) => st.setOASource)
    const [tempModificat, setTempModifications] = useState<ITempModificat[]>([])
    const getConfig = useConfigStore(st => st.getConfigByMnemo)
    const config = jsonParseAsObject(getConfig('front_settings')?.value)
    const account = useAccountStore.getState().store.data.user

    //*Если есть данные, заполняем форму
    useEffect(() => {
        SERVICES_CONFIG.Models.getConfigByMnemo(CONFIG_MNEMOS.FRONT_SETTINGS).then((resp) => {
            if (resp.success) {
                if (resp.data.value !== undefined) {
                    const data = JSON.parse(resp.data.value)

                    setColors(data?.colors)
                    setTempModifications(data?.tempModifications)
                    const formData = {
                        title: data.title,
                        font: data.font,
                        color: data.titleSettings.color,
                        fontSize: data.titleSettings.fontSize,
                        fontWeight: data.titleSettings.fontWeight,
                        text: data?.titleSettings.text,
                        darkColor: data?.dark?.fontColor,
                        darkBackground: data?.dark?.background,
                        externalTicketUrl: data?.externalTicketUrl,
                        licenseStatus: data?.licenseStatus,
                        colorScheme: data?.colors,
                        textColor: data?.textColor,
                        backgroundColor: data?.backgroundColor,
                        relativePath: data?.map?.tilesUrl == BASE_MAP_TILES ? false : true,
                        basePadding: data?.paddings?.basePadding,
                        isExternalObjectAttributes: data?.isExternalObjectAttributes,

                        system: data?.system ?? {},
                        systemLogs: data?.systemLogs ?? [],

                        widgetBackground: data?.widget?.background,
                        widgetColor: data?.widget?.textColor,

                        leftPaddingMenu: data?.paddings?.leftPaddingMenu?.isActive,
                        leftPaddingMenuValue: data?.paddings?.leftPaddingMenu?.value,

                        headerPadding: data?.paddings?.headerPadding?.isActive,
                        headerPaddingValue: data?.paddings?.headerPadding?.value,

                        headerContentPadding: data?.paddings?.headerContentPadding?.isActive,
                        headerContentPaddingValue: data?.paddings?.headerContentPadding?.value,

                        rightPaddingContent: data?.paddings?.rightPaddingContent?.isActive,
                        rightPaddingContentValue: data?.paddings?.rightPaddingContent?.value,

                        bottomPaddingContent: data?.paddings?.bottomPaddingContent?.isActive,
                        bottomPaddingContentValue: data?.paddings?.bottomPaddingContent?.value,

                        menuSidebar: data?.paddings?.menuSidebar?.isActive,
                        menuSidebarValue: data?.paddings?.menuSidebar?.value,

                        upAndDownTreePadding: data?.paddings?.upAndDownTreePadding?.isActive,
                        upAndDownTreePaddingValue: data?.paddings?.upAndDownTreePadding?.value,

                        sidebarPageContentPadding: data?.paddings?.sidebarPageContentPadding?.isActive,
                        sidebarPageContentPaddingValue: data?.paddings?.sidebarPageContentPadding?.value,

                        verticalWidgetPadding: data?.paddings?.verticalWidgetPadding?.isActive,
                        verticalWidgetPaddingValue: data?.paddings?.verticalWidgetPadding?.value,

                        horizontalWidgetPadding: data?.paddings?.horizontalWidgetPadding?.isActive,
                        horizontalWidgetPaddingValue: data?.paddings?.horizontalWidgetPadding?.value,
                        tableRowCount: data?.table?.tableRowCount,

                        //*Новые настройки
                        widgetShadowWidth: data?.widget?.shadowWidth,
                        widgetShadowColor: data?.widget?.shadowColor,
                        headerTextColor: data?.header?.textColor,
                        headerBackgroundColor: data?.header?.background,
                        menuWidth: data?.menu?.width,
                        menuBackgroundColor: data?.menu?.background,
                        inactiveMenuItemTextColor: data?.menu?.inactiveMenu?.textColor,
                        inactiveMenuItemBackgroundColor: data?.menu?.inactiveMenu?.background,
                        activeMenuItemTextColor: data?.menu?.activeMenu?.textColor,
                        activeMenuItemBackgroundColor: data?.menu?.activeMenu?.background,
                        tableHeaderTextColor: data?.table?.header?.textColor,
                        tableHeaderLeftPadding: data?.table?.header?.paddingLeft,
                        tableHeaderRightPadding: data?.table?.header?.paddingRight,
                        tableHeaderUpPadding: data?.table?.header?.paddingUp,
                        tableHeaderDownPadding: data?.table?.header?.paddingDown,
                        tableHeaderBackgroundColor: data?.table?.header?.background,
                        tableContentTextColor: data?.table?.content?.textColor,
                        tableContentBackgroundColor: data?.table?.content?.background,
                        tableBorderColor: data?.table?.borders?.color,
                        tableBorderWidth: data?.table?.borders?.width,
                        tableNetColor: data?.table?.net?.color,
                        tableNetWidth: data?.table?.net?.width,
                        tableNetShow: data?.table?.net?.show ?? false,
                        paddingOutTitleTop: data?.baseDecoration?.paddingOutTitleTop,
                        paddingOutTitleLeft: data?.baseDecoration?.paddingOutTitleLeft,
                        paddingOutTitleRight: data?.baseDecoration?.paddingOutTitleRight,
                        paddingOutWidgetTop: data?.baseDecoration?.paddingOutWidgetTop,
                        paddingOutWidgetLeft: data?.baseDecoration?.paddingOutWidgetLeft,
                        paddingInWidgetTop: data?.baseDecoration?.paddingInWidgetTop,
                        paddingInWidgetLeft: data?.baseDecoration?.paddingInWidgetLeft,
                        paddingInWidgetRight: data?.baseDecoration?.paddingInWidgetRight,
                        paddingInWidgetBottom: data?.baseDecoration?.paddingInWidgetBottom,
                        paddingOutWidgetRight: data?.baseDecoration?.paddingOutWidgetRight,
                        paddingOutWidgetBottom: data?.baseDecoration?.paddingOutWidgetBottom,
                        borderRadius: data?.baseDecoration?.borderRadius,
                        borderThickness: data?.baseDecoration?.borderThickness,
                        borderColor: data?.baseDecoration?.borderColor,
                        widgetBorderEnable: data?.baseDecoration?.widgetBorderEnable,
                        sidebarBackground: data?.sideBar?.background,
                        sidebarColor: data?.sideBar?.textColor,
                        sidebarWidth: data?.sideBar?.width,
                        headerLogo: data?.header?.logo,
                        treeShowChildTree: data?.tree?.treeShowChildTree,
                        treeHorizontalScroll: data?.tree?.treeHorizontalScroll,
                        treeFilterPresets: data?.tree?.treeFilterPresets,
                        treeVersion: data?.tree?.treeVersion,

                        filtersBorderColor: data?.filter?.filtersBorderColor,
                        filtersTextColor: data?.filter?.filtersTextColor,

                        activeTabBackgroundColor: data?.tabs?.activeTabBackgroundColor,
                        colorSchemeMode: data?.projectThemeMode,
                        hideLeftSidebar: data?.hideLeftSidebar,

                        hideSearch: data?.header?.hideSearch,

                        checkHealthBlocking: data?.checkHealthBlocking

                    }

                    setTableData(formData)
                    form.setFieldsValue(formData)
                    setIsLoadingForm(false)
                }
            } else {
                setIsLoadingForm(false)
            }
        })
    }, [])



    const createColorForTheme = (mnemo: string, colors: any[], themeMode: 'light' | 'dark') => {
        const colorItem = colors?.find((color) => color?.mnemo === mnemo)

        const color = colorItem?.colors.find((color) => color?.mnemo == themeMode)?.color

        return color
    }

    const submitButtonHandler = async () => {
        let values = merge(tableData, form?.getFieldsValue())

        const valuesHasOwnImage = findFieldIsImage(values)
        const checkTempModification = validateHolidays(form?.getFieldValue('pictureAfterSystemTitle'), tempModificat)

        if (valuesHasOwnImage) {
            values = await uploadImage(values, form.setFieldsValue)
        }

        //*В случае выбора разделения сторов объектов и атрибутов используем метод стора объектов 
        if (values?.isExternalObjectAttributes !== undefined) {
            setOASource(values?.isExternalObjectAttributes ? 'oaStore' : 'backend')
        }
        setColors(values.colorScheme ?? colors)
        const map = values.relativePath
            ? import.meta.env.VITE_API_SERVER + '/tiles/map/{z}/{x}/{y}.png'
            : BASE_MAP_TILES

        const colorsForm = form?.getFieldsValue()?.colorScheme ?? values.colorScheme ?? colors

        const system = form?.getFieldsValue()?.system ?? values.system ?? {}


        //* Логирование изменений для настройки system
        const systemLogs = values.systemLogs || [];
        const oldSystem = config.system || {};
        const newSystem = system;

        if (JSON.stringify(oldSystem) !== JSON.stringify({})) {
            systemLogs.push({
                timestamp: new Date().toISOString(),
                user: account,
                oldValues: oldSystem,
                newValues: newSystem,
            });
        }
        //*

        const payload = {
            title: values.title ? values.title : theme.title,
            font: values.font ? values.font : theme?.font,
            titleSettings: {
                color: values.textColor
                    ? createColorForTheme(values.textColor, colorsForm, 'light')
                    : theme.titleSettings.color,
                fontSize: values.fontSize,
                fontWeight: values.fontWeight,
                text: values.text ? values.text : theme.titleSettings.text,
            },
            map: {
                tilesUrl: map,
            },
            dark: {
                fontColor: values.textColor
                    ? createColorForTheme(values.textColor, colorsForm, 'dark')
                    : theme.dark.fontColor,
                background: values.backgroundColor
                    ? createColorForTheme(values.backgroundColor, colorsForm, 'dark')
                    : theme.dark.background,
            },
            colors: colorsForm ?? colors,
            projectThemeMode: values?.colorSchemeMode,

            system: system,
            // system: {},
            systemLogs: systemLogs,

            paddings: {
                basePadding: values?.basePadding ?? tableData?.basePadding,
                leftPaddingMenu: getPadding(values?.leftPaddingMenu ?? tableData?.leftPaddingMenu, values?.leftPaddingMenuValue ?? tableData?.leftPaddingMenuValue),
                headerPadding: getPadding(values?.headerPadding ?? tableData?.headerPadding, values?.headerPaddingValue ?? tableData?.headerPaddingValue),
                headerContentPadding: getPadding(values?.headerContentPadding ?? tableData?.headerContentPadding, values?.headerContentPaddingValue ?? tableData?.headerContentPaddingValue),
                rightPaddingContent: getPadding(values?.rightPaddingContent ?? tableData?.rightPaddingContent, values?.rightPaddingContentValue ?? tableData?.rightPaddingContentValue),
                bottomPaddingContent: getPadding(values?.bottomPaddingContent ?? tableData?.bottomPaddingContent, values?.bottomPaddingContentValue ?? tableData?.bottomPaddingContentValue),
                menuSidebar: getPadding(values?.menuSidebar ?? tableData?.menuSidebar, values?.menuSidebarValue ?? tableData?.menuSidebarValue),
                upAndDownTreePadding: getPadding(values?.upAndDownTreePadding ?? tableData?.upAndDownTreePadding, values?.upAndDownTreePaddingValue ?? tableData?.upAndDownTreePaddingValue),
                sidebarPageContentPadding: getPadding(values?.sidebarPageContentPadding ?? tableData?.sidebarPageContentPadding, values?.sidebarPageContentPaddingValue ?? tableData?.sidebarPageContentPaddingValue),
                verticalWidgetPadding: getPadding(values?.verticalWidgetPadding ?? tableData?.verticalWidgetPadding, values?.verticalWidgetPaddingValue ?? tableData?.verticalWidgetPaddingValue),
                horizontalWidgetPadding: getPadding(values?.horizontalWidgetPadding ?? tableData?.horizontalWidgetPadding, values?.horizontalWidgetPaddingValue ?? tableData?.horizontalWidgetPaddingValue),
            },
            externalTicketUrl: values.externalTicketUrl,
            licenseStatus: values.licenseStatus,
            textColor: values.textColor,
            backgroundColor: values.backgroundColor,
            background: createColorForTheme(values.backgroundColor, colorsForm, 'light'),
            isExternalObjectAttributes: values.isExternalObjectAttributes,

            widget: {
                textColor: values.widgetColor,
                background: values.widgetBackground,
                shadowWidth: values.widgetShadowWidth,
                shadowColor: values.widgetShadowColor
            },

            header: {
                textColor: values.headerTextColor,
                background: values.headerBackgroundColor,
                logo: values.headerLogo,
                hideSearch: values?.hideSearch

            },
            menu: {
                width: values.menuWidth,
                background: values.menuBackgroundColor,
                inactiveMenu: {
                    textColor: values.inactiveMenuItemTextColor,
                    background: values.inactiveMenuItemBackgroundColor,
                },
                activeMenu: {
                    textColor: values.activeMenuItemTextColor,
                    background: values.activeMenuItemBackgroundColor,
                }
            },
            table: {
                tableRowCount: values.tableRowCount,
                header: {
                    textColor: values.tableHeaderTextColor,
                    background: values.tableHeaderBackgroundColor,
                    paddingLeft: values.tableHeaderLeftPadding,
                    paddingRight: values.tableHeaderRightPadding,
                    paddingUp: values.tableHeaderUpPadding,
                    paddingDown: values.tableHeaderDownPadding,
                },
                content: {
                    textColor: values.tableContentTextColor,
                    background: values.tableContentBackgroundColor
                },
                borders: {
                    color: values.tableBorderColor,
                    width: values.tableBorderWidth,
                    radius: values.tableBorderRadius
                },
                net: {
                    color: values.tableNetColor,
                    width: values.tableNetWidth,
                    show: values.tableNetShow
                }
            },
            tabs: {
                activeTabBackgroundColor: values.activeTabBackgroundColor
            },
            baseDecoration: {
                paddingOutTitleTop: values.paddingOutTitleTop,
                paddingOutTitleLeft: values.paddingOutTitleLeft,
                paddingOutTitleRight: values.paddingOutTitleRight,
                paddingOutWidgetTop: values.paddingOutWidgetTop,
                paddingOutWidgetLeft: values.paddingOutWidgetLeft,
                paddingInWidgetTop: values.paddingInWidgetTop,
                paddingInWidgetLeft: values.paddingInWidgetLeft,
                paddingInWidgetRight: values.paddingInWidgetRight,
                paddingInWidgetBottom: values.paddingInWidgetBottom,
                paddingOutWidgetRight: values.paddingOutWidgetRight,
                paddingOutWidgetBottom: values.paddingOutWidgetBottom,
                borderRadius: values.borderRadius,
                borderThickness: values.borderThickness,
                borderColor: values.borderColor,
                widgetBorderEnable: values.widgetBorderEnable
            },
            sideBar: {
                background: values.sidebarBackground,
                textColor: values.sidebarColor,
                width: values.sidebarWidth
            },
            tree: {
                treeShowChildTree: values.treeShowChildTree,
                treeHorizontalScroll: values.treeHorizontalScroll,
                treeVersion: values.treeVersion,
                treeFilterPresets: {
                    presets: values.treeFilterPresets?.presets?.filter?.(preset => preset.id !== 0),
                    defaultPresetId: values.treeFilterPresets?.defaultPresetId || 0,
                },
            },
            filter: {
                filtersTextColor: values.filtersTextColor,
                filtersBorderColor: values.filtersBorderColor,
            },
            tempModifications: checkTempModification,
            hideLeftSidebar: values.hideLeftSidebar,
            checkHealthBlocking: values.checkHealthBlocking
        }

        const resp = checkConfig
            ? await SERVICES_CONFIG.Models.patchConfigByMnemo(CONFIG_MNEMOS.FRONT_SETTINGS, {
                mnemo: CONFIG_MNEMOS.FRONT_SETTINGS,
                value: JSON.stringify(payload),
            })
            : await SERVICES_CONFIG.Models.postConfig({
                mnemo: CONFIG_MNEMOS.FRONT_SETTINGS,
                value: JSON.stringify(payload),
            })

        setIsSavingColors(false)

        if (resp.success) {
            Modal.success({
                content: 'Настройки проекта успешно сохранены',
            })
            forceUpdateConfigStore()
        } else {
            responseErrorHandler({ response: resp, modal: Modal, errorText: 'Ошибка в сохранении настроек темы' })
        }
    }

    const downloadBlob = (content, filename, contentType) => {
        const blob = new Blob([content], { type: contentType })
        const url = URL.createObjectURL(blob)

        const pom = document.createElement('a')

        pom.href = url
        pom.setAttribute('download', filename)
        pom.click()
    }

    const downLoadButtonHandler = () => {
        const content = {
            mnemo: 'themeSettings',
            value: merge(tableData, form.getFieldsValue())
        }

        downloadBlob(JSON.stringify(content), 'themeSettings.json', 'json')
    }

    return (
        <WrapperCard
            style={{ height: 'auto' }}
            bodyStyle={{ padding: ' 0px 15px', width: '100%', height: '100%' }}
            styleMode="replace"
            title={
                <Row justify="space-between" align="middle">
                    Настройка проекта
                    <div style={{ display: 'flex', gap: '5px' }}>
                        {' '}
                        <ECTooltip key="button-download" title="Экспортировать настройки проекта">
                            <Buttons.BaseButton
                                icon={<DownloadOutlined />}
                                shape="circle"
                                onClick={downLoadButtonHandler}
                                size="middle"
                            />
                        </ECTooltip>
                        <Upload
                            key="key"
                            accept=".json"
                            multiple={true}
                            beforeUpload={async (file) => {
                                const parseFile: any = await readJsonFile(file)

                                if (parseFile.mnemo == 'themeSettings') {
                                    form.setFieldsValue(parseFile?.value)
                                    setTableData(parseFile?.value)
                                    setColors(parseFile?.value?.colorScheme)
                                }
                                else {
                                    message.error('Ошибка при импорте меню. Неверно указана мнемоника')
                                }

                                return false
                            }}
                            showUploadList={false}
                        >
                            <ECTooltip key="button-download" title="Импортировать настройки проекта">
                                <Buttons.BaseButton
                                    size="middle"
                                    icon={<UploadOutlined />}
                                    shape="circle"
                                    key="button-download"
                                />
                            </ECTooltip>
                        </Upload>
                    </div>
                </Row>
            }
        >
            {isLoadingForm ? (
                <CustomPreloader size="small" style={{ textAlign: 'center' }} />
            ) : (
                <Form name="form" labelCol={{ span: 8 }} autoComplete="off" form={form} style={{ marginTop: '15px' }}>
                    <ECTabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        items={[
                            {
                                key: 'system',
                                label: 'Система',
                                children: (
                                    // <MainSettingsForm colors={colors} form={form} isSavingColors={isSavingColors} tempModificat={tempModificat} />
                                    <SystemSettingForm form={form} />
                                ),
                            },
                            {
                                key: 'main',
                                label: 'Внешний вид',
                                children: (
                                    <MainSettingsForm colors={colors} form={form} isSavingColors={isSavingColors} tempModificat={tempModificat} />
                                ),
                            },
                            {
                                key: 'paddings',
                                label: 'Отступы',
                                children: <PaddingForm />,
                            },
                        ]}
                    />

                    <Buttons.FloatButton
                        type="primary"
                        icon={<SaveOutlined />}
                        tooltip="Сохранить"
                        onClick={() => {
                            setIsSavingColors(true)

                            setTimeout(() => {
                                submitButtonHandler()
                            }, 200)
                        }}
                    />
                </Form>
            )}
        </WrapperCard>
    )
}

export default Settings
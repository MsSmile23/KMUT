/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import VTGeneralToolbar from './components/VTGeneralToolbar/VTGeneralToolbar'
import { DefaultModal2 } from '@shared/ui/modals';
import ModalsTab from './components/modals/ModalsTab';
import { message } from 'antd';
import VtemplateDashboardView from '@app/vtemplate/VtemplateDashboardView';
import ModalsSettings from './components/modals/ModalsSettings';
import { useNavigate, useParams } from 'react-router-dom';
import { SERVICES_VTEMPLATES } from '@shared/api/vtemplates';
import ModalsManageZone from './components/modals/ModalsManageZone';
import ModalsUnmanageableZone from './components/modals/ModalsUnmanageableZone';
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths';
import { ButtonSettings } from '@shared/ui/buttons';
import ModalMacroZone from './components/modals/ModalsMacroZone';
import { dataVtemplateProps, paramsVtemplate } from '@shared/types/vtemplates';
import {
    IDataModalMacroZone,
    MacroZoneType,
    ModalType,
    TBuilderData,
    TDataSettingManageZoneTabType,
    TDataSettingUnmanageZoneTabType,
    TInitialDataSettingVTType,
    TabsArrType,
    VTGeneratorToolbarType,
    initialDataModalTabtype,
    initialItemsProps,
    layoutType,
    requestVtemplate
} from './types/types';
import { CreateLabelTab } from './components/CreateLabelTab';
import { exportJson, formatName, readJsonFile, trimName } from './services';
import CustomPreloader from '@shared/ui/preloader/CustomPreloader';
import { FullscreenZone } from './components/FullscreenZone';
import { UnmanageableZone } from './components/UnmanageableZone';
import {
    builderDataList,
    initialDataModalTab,
    initialDataSettingManageZoneTab,
    initialDataSettingUnManageZoneTab,
    initialDataSettingVT,
    textModalTitle
} from './data';
import './VtemplateFormStyle.css';
import { selectGetClassById, useVTemplatesStore } from '@shared/stores/vtemplates';
import ModalConflictsClasses from './components/modals/ModalConflictsClasses';
import { widgetType } from '@containers/widgets/widget-types';
import { selectObjectByIndex, useObjectsStore } from '@shared/stores/objects';
import { getURL } from '@shared/utils/nav';
import { IChildObjectWithPaths, findChildObjectsWithPaths } from '@shared/utils/objects';
import { ECColorfulText } from '@shared/ui/text/ECColorfulText/ECColorfulText';
import TabBarManagedZone3 from './components/TabBarManagedZone/TabBarManagedZone3';
import { useClassesStore, selectGetClassById as getClassById } from '@shared/stores/classes';
import { formatText } from '@shared/ui/ECUIKit/ECTemplatedText/utils/utility';

interface VtemplateFormContainerCreateProps {
    updateDataProp?: dataVtemplateProps<paramsVtemplate>
    objectCard?: boolean
    setIsFullScreenZone?: (value: boolean) => void
    idVtemplateShowcase?: number 
    isInterfaceShowcase?: boolean
    objectIdShowcase?: number
}

/**
 * @param updateData - данные которые получаем с сервера, используются при редактировании макета
 * @param objectCard - Используется ли контеинер в карточке объекта, если да, выключает часть логики
 * @param setIsFullScreenZone - функция стейта, определяющего полноэкранный режим или нет 
 * @param idVtemplateShowcase - id макета с витрины, при переходе в режим редактирования на витрине
 * @param isInterfaceShowcase - Флаг, обозначающий открыт ли конструктор с витрины (режим редактирования)
 * @param objectIdShowcase - id объекта с витрины, при переходе в режим редактирования на витрине
 */

const VtemplateFormContainer: FC<VtemplateFormContainerCreateProps> = (props) => {

    const { updateDataProp, objectCard = false, setIsFullScreenZone, idVtemplateShowcase, isInterfaceShowcase = false, objectIdShowcase = undefined } = props

    const navigate = useNavigate()

    const idParams = useParams<{ id: string } | null>()
    const id = idVtemplateShowcase ?? idParams.id
    const [messageApi, contextHolder] = message.useMessage();

    const [activeKey, setActiveKey] = useState<string>('')
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [preview, setPreview] = useState<boolean>(objectCard)

    //----------------START TABS-----------------------------//
    const [settingTabsArr, setSettingTabsArr] = useState<initialItemsProps>({ tabs: [], oldTabs: [] }); //Табы из модалки для дальнейнего преобразования
    const [tabsArr, setTabsArr] = useState<TabsArrType[]>([]) //табы на клиенте с фильтрами
    const [typeTabs, setTypeTabs] = useState<IDataModalMacroZone['typeTabs']>('horizontal')
    //----------------END TABS-----------------------------//

    //--------------START MODAL----------------------------//
    const [dataSettingVT, setDataSettingVT] = useState<TInitialDataSettingVTType>({ ...initialDataSettingVT, vtemplateId: +id }) //Данные настройки шаблона
    const [dataSettingVTTabs, setDataSettingVTTabs] = useState<initialDataModalTabtype>(initialDataModalTab) //Данные настройки табов
    const [dataSettingManageZoneTab, setDataSettingManageZoneTab] = useState<TDataSettingManageZoneTabType>(initialDataSettingManageZoneTab) //Данные настроки отображения табов
    const [dataSettingUnmanageZoneTab, setDataSettingUnmanageZoneTab] = useState<TDataSettingUnmanageZoneTabType>(initialDataSettingUnManageZoneTab) //Данные настроки отображения табов
    //--------------END MODAL----------------------------//

    const [saveFlag, setSaveFlag] = useState<boolean>(objectCard ? false : !id) //Флаг редактирования или создания
    const [typeModal, setTypeModal] = useState<ModalType>(id ? ModalType.SETTING_DEFAULT : ModalType.SETTING_VT) //Какой контент отобразить в модалке
    const [showInfo, setShowInfo] = useState<boolean>(false)  //Модалка инфо настроек макета или отдельных виджетов
    const [contentInfo, setContentInfo] = useState<any>('')  //Контент модалки инфо настроек макета или отдельных виджетов

    const [updateData, setUpdateData] = useState<dataVtemplateProps<paramsVtemplate>>()
    const [layoutContentManageZone, setLayoutContentManageZone] = useState<{ [x: string]: layoutType }>({} as { [x: string]: layoutType })//получаем разметку лаяута табов
    const [layoutContentManageUpdateZone, setLayoutContentManageUpdateZone] = useState<{ [x: string]: layoutType }>({} as { [x: string]: layoutType })//обновляем данные при выборе id объекта
    const [layoutContentUnmanageableZone, setLayoutContentUnmanageableZone] = useState<layoutType>({} as layoutType) //Получаем разметку неуправляемой зоны

    const [dataResponseUnmanageLayout, setDataResponseUnmanageLayout] = useState<layoutType>({} as layoutType) //Данные при редактировании неуправляемой зоны

    const [dataSettingFullScreenZone, setDataSettingFullScreenZone] = useState<widgetType>()    //Данные для сохранения полноэкранной зоны
    const [dataUpdateSettingFullScreen, setDataUpdateSettingFullScreen] = useState<widgetType>()   //Данные при редактировании полноэкранной зоны

    const [updateId, setUpdateId] = useState<number | undefined>(isNaN(Number(id)) ? undefined : Number(id))
    const [macroZone, setMacroZone] = useState<MacroZoneType>(MacroZoneType.DEFAULT_ZONE) //макро зона

    const [showLoadComponent, setShowLoadComponent] = useState(!!updateData) //Загрузка компонента
    const [loading, setLoading] = useState<boolean>(false)  //лоадер при ожидании ответа

    const [openConflictModal, setOpenConflictModal] = useState<boolean>(false)   //Открытие модалки конфликтов
    const [resolveConflict, setResolveConflict] = useState<boolean>(false)  //Флаг для сохранения данных из модалки конфликтов
    const [updateVtemplatesData, setUpdateVtemplatesData] = useState<dataVtemplateProps<paramsVtemplate>[]>([])  //Данные из модалки конфликтов для обновления макетов 

    const [showHeaderZone, setShowHeaderZone] = useState<boolean>(false)  //Поазать зону header
    const [selectedObjects, setSelectedObjects] = useState<{ id: number | null; keyTab: string | null }[]>([])   //Выбор объектов в выпадающем списке групповой вкладки
    const [builderData, setBuilderData] = useState<TBuilderData>(builderDataList[0].value as TBuilderData)  //Настройка вывода данных для превью в конструкторе 

    const classById = useClassesStore(getClassById)

    const vTemplateStore = useVTemplatesStore()
    const vTemplateStoreByIndex = useVTemplatesStore(selectGetClassById)
    const getObjectByIndex = useObjectsStore(selectObjectByIndex)
    const object = getObjectByIndex('id', (objectIdShowcase ?? Number(dataSettingVT?.objectId)))
    
    const success = (message?: string) => {
        messageApi.open({
            type: 'success',
            content: message ? message : 'Сохранено',
        });
    };

    const error = (message?: string) => {
        messageApi.open({
            type: 'error',
            content: message ? message : 'Ошибка сохранения',
        });
    };

    //Наполняем данными при редактировании или импорте json
    const updateDataAllConstructor = (data: any) => {

        const params = typeof data == 'string' ? JSON.parse(data) : data

        setLayoutContentManageZone(params?.layoutContentManageZone || {})
        setLayoutContentManageUpdateZone(params?.layoutContentManageZone || {})
        setLayoutContentUnmanageableZone(params?.layoutContentUnmanageableZone || {} as layoutType)
        setDataResponseUnmanageLayout(params?.layoutContentUnmanageableZone || {} as layoutType)
        setDataSettingManageZoneTab(params?.dataSettingManageZoneTab || initialDataSettingManageZoneTab)
        setDataSettingUnmanageZoneTab(params?.dataSettingUnmanageZoneTab || initialDataSettingUnManageZoneTab)
        setMacroZone(params?.makroZone || MacroZoneType.DEFAULT_ZONE)
        setDataSettingVT({ ...params?.dataToolbar, vtemplateId: +id } || { ...initialDataSettingVT, vtemplateId: +id })
        setDataUpdateSettingFullScreen(params?.dataSettingFullScreenZone)
        setShowHeaderZone(params?.showHeaderZone)
        setTypeTabs(params?.typeTabs)
        setBuilderData(params?.builderData ?? builderDataList[0].value)

        if (!!params?.tabs && !!params?.tabs?.length) {
            setSettingTabsArr((prev) => {
                return {
                    ...prev,
                    tabs: params?.tabs
                }
            })
        }

        setActiveKey(params?.tabs?.[0]?.key || '')
    }

    //При редактировании записываем данные в стейт
    useEffect(() => {

        if (Object.keys(updateDataProp || {})?.length) {
            setUpdateData(updateDataProp || undefined)
        }
        const timer = setTimeout(() => {
            setShowLoadComponent(false)
        }, 300)

        return () => {
            clearTimeout(timer)
        }

    }, [updateDataProp])

    //Обновляем данные при редактировании
    useEffect(() => {

        if (Object.keys(updateData || {})?.length) {
            updateDataAllConstructor(updateData?.params)
            setUpdateId(updateData.id || undefined)
        }
    }, [updateData])

    useEffect(() => {
        setUpdateData(vTemplateStoreByIndex(updateId))
    }, [vTemplateStore.store.data.length])

    useEffect(() => {
        if (updateData !== undefined && !updateDataProp) {
            navigate(getURL(
                `${ROUTES.VTEMPLATES}/${ROUTES_COMMON.UPDATE}/${updateData.id}`,
                'constructor'
            ))
        }
    }, [updateData])

    const handleChangeEditLayoutUnmanageableZone = (layout: layoutType) => {
        setLayoutContentUnmanageableZone(layout)
    }

    // Формируем данные для табов и управляемой зоны
    useEffect(() => {
        //Функция получения дочерних объектов
        const getLinkedObjects = (tab: TabsArrType) => findChildObjectsWithPaths({
            currentObj: object,
            childClassIds: tab?.settings?.connectingClasses,
            targetClassIds: tab?.settings?.targetClasses,
        })?.objectsWithPath

        //Определяем общую длину массива вместе с дочерними объектами групповых вкладок
        let lengthTabs = 0

        settingTabsArr?.tabs?.forEach(tab => {
            if (tab.type !== 'group' || tab?.tabOutputMode !== ('individualTabs' || undefined) || isInterfaceShowcase) {
                lengthTabs++
            } else {
                const linkedObjects = getLinkedObjects(tab)

                lengthTabs += linkedObjects?.length
            }
        })

        //Получаем id и имя объекта для групповой вкладки с выпадающим списком
        const selectedObjectId = (key: string) => selectedObjects?.find(obj => obj.keyTab === key)?.id
        const selectedObjectName = (key: string) => getObjectByIndex('id', selectedObjectId(key))?.name

        // Текст в табе
        const currentLabel = (tab: TabsArrType, objectName: string) => {
            const objectId = selectedObjectId(tab?.key) ?? dataSettingVT?.objectId
            const classes = tab?.settings?.targetClasses || dataSettingVT?.classes
            const value = tab?.currentLabel + `${tab?.tabOutputMode === 'tabsList' 
                ? `: ${objectName ?? 'объект не найден'}` : ''}`

            return formatText(value, objectId, classes, getObjectByIndex, classById)
        }

        const groupCurrentLabel = (tab: TabsArrType, objectName: string) => (tab?.group_name?.length > 0 && tab?.tabOutputMode !== 'tabsList' 
            ? `${tab?.group_name} (группа вкладок)` : (currentLabel(tab, objectName) || ''))

        //Определяем индекс для передачи в табы групповых вкладок
        let indexGroupTab = 0

        const createLabel = (tab: TabsArrType, linkedObjectId: number, index: number, linkedObjects: IChildObjectWithPaths[]) => (
            <CreateLabelTab
                keyTab={tab?.key + (linkedObjectId || '')}
                label={groupCurrentLabel(tab, selectedObjectName(tab?.key) ?? object?.name)}
                i={index}
                preview={preview}
                activeKey={activeKey}
                lengthTab={!preview && !isInterfaceShowcase ? settingTabsArr?.tabs?.length - 1 : lengthTabs - 1 || 0}
                objectId={linkedObjectId || selectedObjectId(tab?.key) || object?.id || dataSettingVT?.objectId}
                enableStateText={tab?.enabledStatelable}
                handleClickEdit={handleClickEdit}
                handleRemoveTab={handleRemoveTab}
                isInterfaceShowcase={isInterfaceShowcase}
                typeTabs={typeTabs}
                tabOutputMode={tab?.tabOutputMode}
                linkedObjects={linkedObjects}
                objectGroupPreview={tab?.objectGroupPreview}
                onSelectObject={(id: number, keyTab: string) => {
                    const tabIndex = selectedObjects.findIndex(obj => obj.keyTab === keyTab)

                    if (tabIndex !== -1) {
                        const updatedSelectedObjects = [...selectedObjects]

                        updatedSelectedObjects[tabIndex] = { id, keyTab }
                        setSelectedObjects(updatedSelectedObjects)
                    } else {
                        setSelectedObjects(prevState => [...prevState, { id, keyTab }])
                    }
                }}
            />
        )

        const createChildren = (tab: TabsArrType, objectId: number) => {
            const updateTab = (data: layoutType) => {
                setLayoutContentManageZone((prevState) => ({ ...prevState, [tab.key]: data }))
            }
        
            return (
                <VtemplateDashboardView
                    editable={!preview}
                    onChange={updateTab}
                    objectId={objectId || selectedObjectId(tab?.key) || (tab?.objectGroupPreview ?? tab?.object_preview) || undefined}
                    dataResponse={layoutContentManageZone[tab.key]}
                    baseSettings={dataSettingVT}
                    isInterfaceShowcase={isInterfaceShowcase}
                    showSettingsInfo={showSettingsInfo}
                    page={dataSettingVT?.pageBinding}
                    classes={tab?.settings?.targetClasses?.length > 0 ? tab?.settings?.targetClasses : dataSettingVT?.classes}
                    builderData={builderData}
                />
            );
        };

        const tmp = settingTabsArr?.tabs?.reduce((acc, tab, index) => {
            const linkedObjects = tab?.type === 'group' ? getLinkedObjects(tab) : []
            
            if (tab?.type === 'group' && preview && tab?.tabOutputMode !== 'tabsList') {
                linkedObjects?.forEach((linkedObject, i) => {
                    acc.push({
                        ...tab,
                        key: tab?.key + linkedObject.id,
                        label: createLabel(tab, linkedObject?.id, indexGroupTab + i, []),
                        currentLabel: groupCurrentLabel(tab, linkedObject?.name),
                        children: createChildren(tab, linkedObject?.id),
                    });
                });
                indexGroupTab += linkedObjects?.length
            } else {
                acc.push({
                    ...tab,
                    key: tab?.key,
                    label: createLabel(tab, null, indexGroupTab, tab?.tabOutputMode !== ('individualTabs' && undefined) 
                        ? linkedObjects : []),
                    currentLabel: groupCurrentLabel(tab, selectedObjectName(tab?.key) ?? object?.name),
                    children: createChildren(tab, (objectIdShowcase ? object?.id : null))
                })
                indexGroupTab++
            }

            return acc
        }, [])

        setTabsArr(tmp)
    }, [settingTabsArr, preview, activeKey, layoutContentManageUpdateZone, selectedObjects, builderData, dataSettingVTTabs.tabOutputMode])

    //При смене режима отображения групповых вкладок фильтруем отбъекты из selectedObjects
    useEffect(() => {
        if (dataSettingVTTabs?.tabOutputMode !== 'tabsList') {
            setSelectedObjects((prevObjects) => prevObjects.filter(obj => obj.keyTab !== dataSettingVTTabs?.key))
        }
    }, [dataSettingVTTabs?.tabOutputMode])

    //Закрыть модалку
    const closeModal = () => {
        setOpenModal(false)
        setOpenConflictModal(false)
        setShowInfo(false)
        setContentInfo('')
    }

    //Удаление таба
    const handleRemoveTab = useCallback((event: any, targetKey: string) => {
        event.stopPropagation()
        setActiveKey((prevKey) => {
            let newActiveKey = prevKey;
            let lastIndex = -1;

            setSettingTabsArr((prev) => {
                prev.tabs.forEach((item, i) => {
                    if (item.key === targetKey) {
                        lastIndex = i - 1;
                    }
                });

                const newPanes = prev.tabs.filter((item) => item.key !== targetKey);

                if (newPanes.length && newActiveKey === targetKey) {
                    if (lastIndex >= 0) {
                        newActiveKey = newPanes[lastIndex].key;
                    } else {
                        newActiveKey = newPanes[0].key;
                    }
                }

                return {
                    ...prev,
                    tabs: newPanes
                }
            })

            return newActiveKey
        })

        setSelectedObjects((prevObjects) => prevObjects.filter(obj => obj.keyTab !== targetKey))

    }, [setSettingTabsArr, setActiveKey])

    //Редактирование таба
    const handleClickEdit = useCallback((event: any, key: string) => {
        event.stopPropagation()
        setTypeModal(ModalType.SETTING_VT_TAB)
        setSettingTabsArr((prev) => {
            const tmpTab = prev.tabs.find((tab) => tab.key === key)

            if (tmpTab) {
                setDataSettingVTTabs({ 
                    key: tmpTab.key, 
                    name: tmpTab.currentLabel,
                    objectBinding: tmpTab?.objectBinding,
                    enabledStatelable: tmpTab?.enabledStatelable,
                    type: tmpTab?.type,
                    settings: {
                        targetClasses: tmpTab?.settings?.targetClasses,
                        connectingClasses: tmpTab?.settings?.connectingClasses,
                    },
                    group_name: tmpTab?.group_name,
                    objectGroupPreview: tmpTab?.objectGroupPreview,
                    tabOutputMode: tmpTab?.tabOutputMode
                })
            }

            return prev
        })

        setOpenModal(true)
    }, [setSettingTabsArr, setOpenModal])

    const generateDataInSave = (template?: dataVtemplateProps<paramsVtemplate>) => {
        const newTabs = settingTabsArr?.tabs?.reduce((acc: Omit<TabsArrType, 'content'>[], tab: TabsArrType) => {
            acc.push({
                children: '',
                label: '',
                currentLabel: tab.currentLabel,
                key: tab.key,
                object_preview: tab.object_preview,
                objectBinding: tab?.objectBinding,
                enabledStatelable: tab?.enabledStatelable,
                type: tab?.type,
                settings: {
                    targetClasses: tab?.settings?.targetClasses,
                    connectingClasses: tab?.settings?.connectingClasses,
                },
                group_name: tab?.group_name,
                objectGroupPreview: tab?.objectGroupPreview,
                tabOutputMode: tab?.tabOutputMode
            })

            return acc
        }, [])

        const commonParams = {
            name: template?.name || dataSettingVT?.name,
            vtemplate_type_id: template?.vtemplate_type_id || dataSettingVT?.maketType,
            mnemonic: '1',
        }

        //Сохранение при редактировании на витрине
        if (isInterfaceShowcase) {
            return {
                ...commonParams,
                params: JSON.stringify({
                    ...template.params,
                    layoutContentManageZone,
                    layoutContentUnmanageableZone,
                    dataSettingManageZoneTab,
                    dataSettingUnmanageZoneTab,
                    tabs: newTabs,
                    typeTabs
                })
            }
        }

        return template ? {
            ...commonParams,
            params: JSON.stringify(template.params)
        } : {
            ...commonParams,
            params: JSON.stringify({
                dataToolbar: dataSettingVT,
                layoutContentManageZone,
                layoutContentUnmanageableZone,
                dataSettingManageZoneTab,
                dataSettingUnmanageZoneTab,
                makroZone: macroZone,
                tabs: newTabs,
                dataSettingFullScreenZone,
                showHeaderZone,
                typeTabs,
                builderData
            })
        }

    }

    //Фильтруем макеты, где нет привязанных объектов
    const filteredVtemplates = vTemplateStore?.store.data
        .filter((vTemplate) => vTemplate.params?.dataToolbar?.objectBindings?.length === 0 
        && vTemplate.params?.dataToolbar?.purpose !== 3 && vTemplate.params?.dataToolbar?.purpose !== 4)   // Макеты МП

    //Ищем совпадения классов в уже созданных макетах
    const matchVtemplatesLinkedClasses = filteredVtemplates?.filter((vTemplate) => vTemplate.params.dataToolbar.classes
        .some(cls => dataSettingVT?.classes?.includes(cls)))
        ?.filter((template) => template.id !== Number(id))

    const saveWidgetInTab = async (type: requestVtemplate, result: any) => {
        try {
            setLoading(true)

            //Если уже есть такие классы в макетах, то выводим модалку конфликтов
            if (matchVtemplatesLinkedClasses?.length > 0 
                && !resolveConflict
                && dataSettingVT?.objectBindings.length === 0) {
                setOpenConflictModal(true)
                setLoading(false)

                return false
            }

            if (type === requestVtemplate.POST) {
                const res = await SERVICES_VTEMPLATES.Models.postVtemplates(result)

                if (res.success === true) {
                    setUpdateId(res.data.id)
                }
                vTemplateStore.fetchData()
                success()

                return res?.success
            } else {
                const res = await SERVICES_VTEMPLATES.Models.patchVtemplates(result, updateId)

                vTemplateStore.fetchData()
                success()

                return res?.success
            }
        } catch (e) {
            error()
            setLoading(false)

            return false
        } finally {
            setLoading(false);
        }
    }

    //Открыть модалку настроек
    const settingVT = () => {
        setOpenModal(true)
        setTypeModal(ModalType.SETTING_VT)
    }

    //Отобразить настройки в модалке (информационно)
    const showSettingsInfo = (widget?: widgetType) => {
        setShowInfo(true)

        if (widget) {
            setContentInfo({ ...widget?.settings, widgetMnemo: widget?.widgetMnemo })
        } else if (!widget) {
            setContentInfo(dataSettingVT)
        } else {
            setContentInfo('')
        }
    }

    const typeUpdate = useMemo(() => updateId ? requestVtemplate.PATCH : requestVtemplate.POST, [updateId])

    //Обработка нажатий на кнопки тулбара
    const handleVTGeneratorToolbar = async (type: VTGeneratorToolbarType, file?: Blob) => {

        switch (type) {
            case VTGeneratorToolbarType.SETTING: {
                settingVT()
                break
            }
            case VTGeneratorToolbarType.ADD_TOP_BLOCK: {
                // handleVisibleHeaderVT()
                break
            }
            case VTGeneratorToolbarType.SHOW: {
                setPreview(true)
                break
            }
            case VTGeneratorToolbarType.EDIT: {
                setPreview(false)
                break
            }
            case VTGeneratorToolbarType.SAVE: {

                await saveWidgetInTab(typeUpdate, generateDataInSave())

                break
            }
            case VTGeneratorToolbarType.MAKRO_ZONE: {
                break
            }
            case VTGeneratorToolbarType.SAVE_AND_EXIT: {
                try {
                    const res = await saveWidgetInTab(typeUpdate, generateDataInSave())

                    if (res) {
                        navigate(getURL(`${ROUTES.VTEMPLATES}/${ROUTES_COMMON.LIST}`, 'constructor'))
                        // navigate(
                        //     `/${ROUTES.VTEMPLATES}/${ROUTES_COMMON.LIST}`
                        // )
                    }
                } catch (error) {
                    error('Ошибка сохранения')
                }
                break
            }
            case VTGeneratorToolbarType.EXPORT_JSON: {
                const name = trimName(dataSettingVT?.name)

                exportJson(name, generateDataInSave())
                break
            }
            case VTGeneratorToolbarType.IMPORT_JSON: {
                try {
                    const result: any = await readJsonFile(file)

                    if (result?.params) {
                        updateDataAllConstructor(result?.params || {})
                    } else {
                        error('Некорректный шаблон')
                    }
                } catch (error) {
                    console.log('error', error)
                }
                break
            }
        }
    }

    //Сохранение таба
    const saveModalTab = (data: initialDataModalTabtype) => {
        const tmpTab = settingTabsArr?.tabs?.find((tab) => tab?.key === data?.key)

        if (tmpTab) {
            setActiveKey(tmpTab.key)
            setSettingTabsArr((prev) => ({
                ...prev,
                tabs: prev.tabs.map((tab, index) => {
                    return (
                        tab.key === data?.key ?
                            {
                                ...tab,
                                ...data,
                                label: (
                                    <CreateLabelTab
                                        label={tab?.currentLabel}
                                        keyTab={tab?.key}
                                        i={index}
                                        preview={preview}
                                        activeKey={activeKey}
                                        lengthTab={settingTabsArr.tabs.length - 1}
                                        handleClickEdit={handleClickEdit}
                                        handleRemoveTab={handleRemoveTab}
                                        objectId={(tab?.objectBinding && true) ? Number(tab?.objectBinding) : dataSettingVT?.objectId}
                                        enableStateText={tab?.enabledStatelable}
                                        group_name={tab?.group_name}
                                        typeTabs={typeTabs}
                                        tabOutputMode={tab?.tabOutputMode}
                                    />
                                ),
                                currentLabel: data.name
                            } : tab
                    )
                })
            }))
        } else {
            setActiveKey(data.key)
            setSettingTabsArr((prev) => ({ ...prev, tabs: [...prev.tabs, createTab(data)] }))
        }

        setDataSettingVTTabs(data)
        closeModal()
    }

    //Сохранение модалки контролируемых табов
    const saveModalManageZone = (data: TDataSettingManageZoneTabType) => {
        setDataSettingManageZoneTab(data)
        closeModal()
    }

    //Сохранение модалки неконтролируемых табов
    const saveModalUnmanageZone = (data: TDataSettingUnmanageZoneTabType) => {
        setDataSettingUnmanageZoneTab(data)
        closeModal()
    }

    //Сохранение модалки выбора зон
    const saveModalMacroZone = (data: IDataModalMacroZone) => {
        setMacroZone(data.typeEditContent)
        setTypeTabs(data.typeTabs)
        closeModal()
    }

    //Сохранение модалки базовых настроек
    const saveModalSettinVT = (data: TInitialDataSettingVTType) => {
        setSaveFlag(false)
        setDataSettingVT(data)

        if (settingTabsArr.tabs.length !== 0) {
            setSettingTabsArr((prev) => ({
                ...prev,
                tabs: prev.tabs?.map((item) => {
                    return {
                        ...item,
                        object_preview: data.objectId,
                    }
                })
            }))
        }
        closeModal()
    }

    //Сохранение макета с конфликтующими классами
    const saveConflict = async (template: dataVtemplateProps<paramsVtemplate>) => {
        try {
            setLoading(true)
            const res = await SERVICES_VTEMPLATES.Models.patchVtemplates(generateDataInSave(template), template.id)

            success(`${template.name} обновлен`)
            setLoading(false)

            return res?.success
        } catch (error) {
            console.error(error)
            setResolveConflict(false)
        }
    }
    
    const saveVtemplateWidthUpdateBaseSettings = () => {
        handleVTGeneratorToolbar(VTGeneratorToolbarType.SAVE_AND_EXIT)
        setResolveConflict(false)
    }

    //Функция сохранения макетов с конфликтующими классами
    const saveModalConflicts = async () => {
        //Проходим по каждому макету и сохраняем
        const promises = updateVtemplatesData.map(template => saveConflict(template))

        try {
            await Promise.all(promises) 
        } catch (error) {
            console.error(error)
            setResolveConflict(false)
        }
        const timeoutSaveAndExit = setTimeout(saveVtemplateWidthUpdateBaseSettings, 1500)
        
        return () => clearTimeout(timeoutSaveAndExit)
    }

    //Если поступили данные для обновления макетов, запускаем функцию сохранения
    useEffect(() => {
        if (updateVtemplatesData?.length > 0) {
            saveModalConflicts()
        } else if (resolveConflict && matchVtemplatesLinkedClasses?.length === 0) {
            saveVtemplateWidthUpdateBaseSettings()
        }
    }, [resolveConflict, updateVtemplatesData?.length, matchVtemplatesLinkedClasses?.length])

    const saveDataSettingFullScreenZone = (data: widgetType) => {
        setDataSettingFullScreenZone(data)
    }

    //Открыть модалку настроек зоны
    const settingZoneVT = () => {
        setOpenModal(true)
        setTypeModal(ModalType.SETTING_MANAGE_ZONE)
    }

    //Открыть модалку выбора макро зон
    const settingsMacroZone = () => {
        setOpenModal(true)
        setTypeModal(ModalType.SETTING_MAKRO_ZONE)
    }

    //Контент модалок
    const renderComponentModal = () => {

        //Основные настройки
        if (typeModal === ModalType.SETTING_VT) {
            return (
                <ModalsSettings
                    value={dataSettingVT}
                    save={saveModalSettinVT}
                    saveFlag={saveFlag}
                />
            )
        }

        //Настройка одного таба
        if (typeModal === ModalType.SETTING_VT_TAB) {
            return (
                <ModalsTab
                    value={dataSettingVTTabs}
                    save={saveModalTab}
                    baseSettings={dataSettingVT}
                />
            )
        }

        //Настрока зоны табов
        if (typeModal === ModalType.SETTING_MANAGE_ZONE) {
            return (
                <ModalsManageZone
                    save={saveModalManageZone}
                    value={dataSettingManageZoneTab}
                />
            )
        }

        //Настройки неуправляемой зоны
        if (typeModal === ModalType.SETTING_UNMANAGE_ZONE) {
            return (
                <ModalsUnmanageableZone
                    save={saveModalUnmanageZone}
                    value={dataSettingUnmanageZoneTab}
                />
            )
        }

        //Выбор макрозоны
        if (typeModal === ModalType.SETTING_MAKRO_ZONE) {
            return (
                <ModalMacroZone
                    save={saveModalMacroZone}
                    value={macroZone}
                    setIsFullScreenZone={setIsFullScreenZone}
                />
            )
        }

        return ModalType.SETTING_DEFAULT
    }

    //Создание нового таба
    const createTab = (tab: initialDataModalTabtype) => {
        return {
            ...tab,
            object_preview: dataSettingVT.objectId,
            currentLabel: tab.name,
            label: (
                <CreateLabelTab
                    label={tab?.name}
                    keyTab={tab?.key}
                    i={settingTabsArr?.tabs?.length + 1}
                    preview={preview}
                    activeKey={activeKey}
                    lengthTab={settingTabsArr.tabs.length - 1}
                    handleClickEdit={handleClickEdit}
                    handleRemoveTab={handleRemoveTab}
                    group_name={tab?.group_name}
                    typeTabs={typeTabs}
                    tabOutputMode={tab?.tabOutputMode}
                />
            ),
            children: ''
        }
    }

    //Открыть модалку настроек таба
    const settingVTTab = () => {
        setTypeModal(ModalType.SETTING_VT_TAB)
        setDataSettingVTTabs(() => {
            return {
                ...initialDataModalTab,
                key: String(new Date().getTime())
            }
        })
        setOpenModal(true)
    }

    const settingUnmanageZone = () => {
        setOpenModal(true)
        setTypeModal(ModalType.SETTING_UNMANAGE_ZONE)
    }

    //Добавление и удаление таба
    const onEdit = useCallback((
        targetKey: React.MouseEvent | React.KeyboardEvent | string,
        action: 'add' | 'remove',
    ) => {
        if (action === 'add') {
            settingVTTab()
        }
    }, [settingVTTab])

    const onChangeTab = useCallback((newActiveKey: string) => {
        setActiveKey(newActiveKey)
    }, [setActiveKey])

    return (
        showLoadComponent
            ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CustomPreloader size="large" />
                </div>
            )
            : (
                <div className="VtemplateSCForm">
                    {contextHolder}
                    {!objectCard && (
                        <VTGeneralToolbar
                            handleVTGeneratorToolbar={handleVTGeneratorToolbar}
                            preview={preview}
                            saveFlag={saveFlag}
                            loading={loading}
                            isInterfaceShowcase={isInterfaceShowcase}
                            showSettingsInfo={showSettingsInfo}
                            setShowHeaderZone={setShowHeaderZone}
                            showHeaderZone={showHeaderZone}
                            isManagedZone={macroZone === 1}
                            onBuilderDataChange={setBuilderData}
                            builderData={builderData}
                        />
                    )}

                    {!macroZone && (
                        <div
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 50 }}
                        >
                            <div
                                style={{
                                    padding: 10,
                                    borderRadius: 10,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
                                }}
                            >
                                <h3 style={{ marginTop: 0 }}>Для начала работы выберите макро-зону</h3>
                                <ButtonSettings
                                    icon={false}
                                    type="primary"
                                    onClick={settingsMacroZone}
                                >
                                    Выбрать макро-зону
                                </ButtonSettings>
                            </div>
                        </div>
                    )}

                    { /* Управляемая зона */ }
                    {macroZone === MacroZoneType.MANAGE_ZONE && (
                        <>
                            { /* Дополнительная зона для header */ }
                            {showHeaderZone && 
                                <UnmanageableZone
                                    preview={preview}
                                    objectId={dataSettingVT?.objectId}
                                    handleChangeEditLayoutUnmanageableZone={handleChangeEditLayoutUnmanageableZone}
                                    dataResponse={dataResponseUnmanageLayout}
                                    settingUnmanageZone={settingUnmanageZone}
                                    baseSettings={dataSettingVT}
                                    isInterfaceShowcase={isInterfaceShowcase}
                                    showSettingsInfo={showSettingsInfo}
                                    page={dataSettingVT?.pageBinding}
                                    builderData={builderData}
                                />}
                            <TabBarManagedZone3
                                tabsArr={tabsArr}
                                preview={preview}
                                onEdit={onEdit}
                                activeKey={activeKey}
                                onChangeTab={onChangeTab}
                                settingZoneVT={settingZoneVT}
                                isInterfaceShowcase={isInterfaceShowcase}
                                typeTabs={typeTabs}
                                isMiniHeader={dataSettingManageZoneTab?.isMiniHeader}
                            />
                        </>
                    )}

                    { /* Неуправляемая зона */ }
                    {macroZone === MacroZoneType.UNMANAGE_ZONE && (
                        <UnmanageableZone
                            preview={preview}
                            objectId={dataSettingVT?.objectId}
                            handleChangeEditLayoutUnmanageableZone={handleChangeEditLayoutUnmanageableZone}
                            dataResponse={dataResponseUnmanageLayout}
                            settingUnmanageZone={settingUnmanageZone}
                            baseSettings={dataSettingVT}
                            isInterfaceShowcase={isInterfaceShowcase}
                            showSettingsInfo={showSettingsInfo}
                            page={dataSettingVT?.pageBinding}
                            builderData={builderData}
                        />
                    )}

                    { /* Полноэкранный режим (один виджет на весь экран) */ }  
                    {macroZone === MacroZoneType.FULLSCREEN_ZONE && (
                        <FullscreenZone 
                            editable={preview}
                            objectId={dataSettingVT?.objectId}
                            dataResponse={dataUpdateSettingFullScreen}
                            save={saveDataSettingFullScreenZone}
                            baseSettings={dataSettingVT}
                            isInterfaceShowcase={isInterfaceShowcase}
                            showSettingsInfo={showSettingsInfo}
                            page={dataSettingVT?.pageBinding}
                            builderData={builderData}
                        />
                    )}

                    <DefaultModal2
                        open={saveFlag ? true : openModal}
                        onCancel={() => {
                            closeModal()
                            saveFlag && navigate(getURL(
                                `${ROUTES.VTEMPLATES}/${ROUTES_COMMON.LIST}`, 
                                'constructor'
                            ))
                        }}
                        showFooterButtons={false}
                        tooltipText={textModalTitle[typeModal]}
                    >
                        {renderComponentModal()}
                    </DefaultModal2>
                    <DefaultModal2
                        title="Обнаружены конфликты по привязанным классам"
                        open={openConflictModal}
                        width="70vw"
                        onCancel={() => {
                            closeModal()
                        }}
                        onOk={() => setResolveConflict(true)}
                        loading={loading}
                    >
                        <ModalConflictsClasses 
                            matchVtemplatesLinkedClasses={matchVtemplatesLinkedClasses} 
                            baseSettings={dataSettingVT}
                            setUpdateVtemplatesData={setUpdateVtemplatesData}
                            setBaseSetting={setDataSettingVT}
                            resolveConflict={resolveConflict}
                        />
                    </DefaultModal2>
                    <DefaultModal2
                        open={showInfo}
                        onCancel={closeModal}
                        // onOk={onSaveModal}
                        showFooterButtons={false}
                        tooltipText={`Настройки ${contentInfo !== '' ?  'макета' : 'виджета'}`}
                        height="80vh"
                        width="80vw"
                        centered
                        style={{ background: '#000' }}
                    >
                        <div style={{ maxHeight: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
                            <ECColorfulText 
                                backgroundColor="#000" 
                                textColor="#fff" format="json" 
                                content={contentInfo} 
                            />
                        </div>
                    </DefaultModal2>
                </div>
            )
    )
}

export default VtemplateFormContainer
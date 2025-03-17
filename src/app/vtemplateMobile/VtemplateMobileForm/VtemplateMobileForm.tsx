/* eslint-disable react/jsx-max-depth */
import ModalsSettings from '@containers/vtemplates/VtemplateFormContainer/components/modals/ModalsSettings'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import ECModal from '@shared/ui/ECUIKit/ECModal/ECModal'
import { getURL } from '@shared/utils/nav'
import { FC, Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ModalType } from '../types/types'
import { TInitialDataSettingVTType, VTGeneratorToolbarType, requestVtemplate } from '@containers/vtemplates/VtemplateFormContainer/types/types'
import { initialDataModalTab, resolutionOptions, textModalTitle } from '../data'
import VtemplateMobileDashboard from '../VtemplateMobileDashboard/VtemplateMobileDashboard'
import { useVtemplateStore } from '@shared/stores/vtemplate'
import { SERVICES_VTEMPLATES } from '@shared/api/vtemplates'
import { useVTemplatesStore } from '@shared/stores/vtemplates'
import { message } from 'antd'
import { exportJson, readJsonFile, trimName } from '@containers/vtemplates/VtemplateFormContainer/services'
import { ECTooltip } from '@shared/ui/tooltips'
import { PlusOutlined } from '@ant-design/icons'
import { ButtonSettings } from '@shared/ui/buttons'
import CustomPreloader from '@shared/ui/preloader/CustomPreloader'
import { IDataModalMacroZone, MacroZoneType, TabsArrType } from '@shared/types/vtemplates'
import ModalMacroZone from '@containers/vtemplates/VtemplateFormContainer/components/modals/ModalsMacroZone'
import ModalsTab from '@containers/vtemplates/VtemplateFormContainer/components/modals/ModalsTab'
import { CreateLabelTab } from '@containers/vtemplates/VtemplateFormContainer/components/CreateLabelTab'
import './VtemplateMobileForm.css'
import Toolbar from './Toolbar/Toolbar'
import { StoreStates } from '@shared/types/storeStates'

interface IVtemplateMobileFormProps {
    id?: string,
    isMobile?: boolean
}

const VtemplateMobileForm: FC <IVtemplateMobileFormProps> = ({ id, isMobile = true }) => {
    const idParams = useParams<{ id: string } | null>()
    const paramsId = idParams.id
    const navigate = useNavigate()

    const { 
        vtemplate, 
        activeTab,
        setBaseSettings, 
        fetchLayoutData, 
        setInitialStore, 
        saveVtemplate, 
        getSaveData,
        setVtemplate,
        setMacroZone,
        setTab,
        state
    } = useVtemplateStore()
    const [updateId, setUpdateId] = useState<number | undefined>(isNaN(Number(id)) ? undefined : Number(id))
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [typeModal, setTypeModal] = useState<ModalType>(id ? ModalType.SETTING_DEFAULT : ModalType.SETTING_VT)

    const [messageApi, contextHolder] = message.useMessage()
    const [tempTab, setTempTab] = useState(null)   // Данные временного таба при создании
    const [saveFlag, setSaveFlag] = useState<boolean>(!id)
    const [preview, setPreview] = useState<boolean>(false)

    const [loading, setLoading] = useState<boolean>(false)
    const [showLoadComponent, setShowLoadComponent] = useState(false)
    const [layoutSize, setLayoutSize] = useState<{ width: number, height: number }>(
        JSON.parse(resolutionOptions[0].value)
    )

    const vTemplatesStore = useVTemplatesStore()

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

    // При сохранении нового макета переводим на страницу редактирования
    useEffect(() => {
        if (!id && updateId) {
            vTemplatesStore.fetchData()
            const timer = setTimeout(() => {
                navigate(getURL(
                    `/${ROUTES.VTEMPLATES}/${ROUTES.MOBILE}/${ROUTES_COMMON.UPDATE}/${updateId}`,
                    'constructor'
                ))
            }, 1500)

            return () => clearTimeout(timer)
        }
    }, [updateId, id])

    // Загрузка макета в стор
    useEffect(() => {
        if (id) {
            fetchLayoutData(id)
        } else {
            setInitialStore()
        }
    }, [id, fetchLayoutData])

    useEffect(() => {
        if (state !== StoreStates.FINISH) {
            setShowLoadComponent(true)
        } else {
            setShowLoadComponent(false)
        }
    }, [state])

    // Сохранение базовых настроек
    const saveModalSettingVT = (data: TInitialDataSettingVTType) => {
        setSaveFlag(false)
        setBaseSettings(data)
        closeModal()
    }

    //Сохранение модалки выбора зон
    const saveModalMacroZone = (data: IDataModalMacroZone) => {
        setMacroZone(data.typeEditContent)
        // setTypeTabs(data.typeTabs)
        closeModal()
    }

    //Открыть модалку выбора макро зон
    const settingsMacroZone = () => {
        setOpenModal(true)
        setTypeModal(ModalType.SETTING_MAKRO_ZONE)
    }

    //Открыть модалку настроек
    const settingVT = () => {
        setOpenModal(true)
        setTypeModal(ModalType.SETTING_VT)
    }

    // Табы--------------------------------------------------------------------------------------------------
    //Открыть модалку настроек таба (создание)
    const settingVTTab = () => {
        setTypeModal(ModalType.SETTING_VT_TAB)
        const key = String(new Date().getTime())

        setTempTab({ ...initialDataModalTab, key })
        setOpenModal(true)
    }

    // Открыть модалку редактирования таба
    const handleClickEdit = useCallback((event: any, key: string) => {
        event.stopPropagation()
        setTypeModal(ModalType.SETTING_VT_TAB)
        setTab('change', key)
        setOpenModal(true)
    }, [setTab, setOpenModal])

    // Сохранение настроек таба
    const saveModalTab = (data) => {
        const { name, ...rest } = data
        const updatedData = { ...rest, currentLabel: name }

        setTab('update', data.key, updatedData)
        closeModal()
    }

    const renderTab = useCallback((item: TabsArrType, index: number) => {
        const tabContent = (
            <span
                onClick={() => {
                    setTab('change', item.key)
                }}
            >
                <CreateLabelTab
                    label={item?.currentLabel}
                    keyTab={item?.key}
                    i={index}
                    preview={preview}
                    activeKey={activeTab?.key}
                    lengthTab={vtemplate.params.tabs?.length - 1}
                    group_name={item?.group_name}
                    handleClickEdit={handleClickEdit}
                    handleRemoveTab={() => setTab('remove', item?.key)}
                />
            </span>
        )

        return item.currentLabel.length > (!preview ? 20 : 25) ? (
            <ECTooltip 
                key={index} 
                title={item.currentLabel} 
                placement="top"
            >
                {tabContent}
            </ECTooltip>
        ) : (
            <Fragment key={index}>
                {tabContent}
            </Fragment>
        )
    }, [setTab, preview, activeTab?.key, vtemplate.params.tabs])
    //-----------------------------------------------------------------------------------------------------

    // Контент модалок
    const renderComponentModal = useMemo(() => {
        //Основные настройки
        if (typeModal === ModalType.SETTING_VT) {
            return (
                <ModalsSettings
                    value={vtemplate?.params?.dataToolbar}
                    save={saveModalSettingVT}
                    saveFlag={saveFlag}
                    isMobile={true}
                />
            )
        }

        //Выбор макрозоны
        if (typeModal === ModalType.SETTING_MAKRO_ZONE) {
            return (
                <ModalMacroZone
                    save={saveModalMacroZone}
                    value={vtemplate.params.makroZone}
                    // setIsFullScreenZone={setIsFullScreenZone}
                />
            )
        }

        //Настройка одного таба
        if (typeModal === ModalType.SETTING_VT_TAB) {
            const currentTab = tempTab ?? { ...activeTab, name: activeTab.currentLabel }

            return (
                <ModalsTab
                    value={currentTab}
                    save={saveModalTab}
                    baseSettings={vtemplate.params.dataToolbar}
                    isMobile={isMobile}
                />
            )
        }

        return ModalType.SETTING_DEFAULT
    }, [typeModal, vtemplate?.params?.dataToolbar, activeTab?.key, activeTab?.currentLabel, tempTab])

    const generateDataInSave = () => {
        saveVtemplate()

        return getSaveData()
    } 
  
    const typeUpdate = useMemo(() => updateId ? requestVtemplate.PATCH : requestVtemplate.POST, [updateId])

    //Обработка нажатий на кнопки тулбара
    const handleVTGeneratorToolbar = async (type: VTGeneratorToolbarType, file?: Blob) => {
        switch (type) {
            case VTGeneratorToolbarType.SETTING: {
                settingVT()
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

                await save(typeUpdate, generateDataInSave())

                break
            }
            case VTGeneratorToolbarType.MAKRO_ZONE: {
                break
            }
            case VTGeneratorToolbarType.SAVE_AND_EXIT: {
                try {
                    const res = await save(typeUpdate, generateDataInSave())

                    if (res) {
                        navigate(getURL(`${ROUTES.VTEMPLATES}/${ROUTES_COMMON.LIST}`, 'constructor'),
                            { state: { isMobile: true } })
                    }
                } catch (error) {
                    error('Ошибка сохранения')
                }
                break
            }
            case VTGeneratorToolbarType.EXPORT_JSON: {
                const name = trimName(vtemplate.name)

                exportJson(name, generateDataInSave())
                break
            }
            case VTGeneratorToolbarType.IMPORT_JSON: {
                try {
                    const result: any = await readJsonFile(file)

                    if (result?.params) {
                        const params = JSON.parse(result?.params)
                        const data = { ...result, params }

                        setVtemplate(data)
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

    // Сохранение макета
    const save = async (type: requestVtemplate, result: any) => {
        try {
            setLoading(true)

            if (type === requestVtemplate.POST) {
                const res = await SERVICES_VTEMPLATES.Models.postVtemplates(result)

                if (res.success === true) {
                    setUpdateId(res.data.id)
                    vTemplatesStore.fetchData()
                    success()

                    return res?.success
                }
            } else {
                const res = await SERVICES_VTEMPLATES.Models.patchVtemplates(result, updateId)

                vTemplatesStore.fetchData()
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

    // Переключение селектора 
    const changeResolution = (resolution: string) => {
        const resolutionParse = resolution 
            ? JSON.parse(resolution) 
            : { width: 360, height: 640 }

        setLayoutSize(resolutionParse)
    }

    //Закрыть модалку
    const closeModal = () => {
        setOpenModal(false)

        if (tempTab) {
            setTempTab(null)
        }
    }

    return (showLoadComponent
        ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CustomPreloader size="large" />
            </div>
        )
        : (
            <>
                {contextHolder}
                {vtemplate.params.makroZone !== MacroZoneType.DEFAULT_ZONE &&
                <Toolbar 
                    loading={loading} 
                    saveFlag={saveFlag} 
                    handleVTGeneratorToolbar={handleVTGeneratorToolbar} 
                    vtemplate={vtemplate}
                    editable={!preview}
                    changeResolution={changeResolution}
                />}
                {!vtemplate.params.makroZone && !paramsId && (
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
                {vtemplate.params.makroZone === MacroZoneType.MANAGE_ZONE && vtemplate.params.tabs.length === 0 && (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 50,
                            cursor: 'pointer',
                            width: '100%'
                        }}
                        onClick={settingVTTab}
                    >
                        <ButtonSettings
                            size="large"
                            icon={false}
                            type="primary"
                            onClick={settingVTTab}
                        >
                            Создайте первый таб
                        </ButtonSettings>
                    </div>
                )}
                <div style={{ position: 'relative', width: layoutSize.width, height: layoutSize.height }} >
                    {((vtemplate.params.makroZone == MacroZoneType.MANAGE_ZONE 
                    && vtemplate.params.tabs.length !== 0)) &&
                        <VtemplateMobileDashboard 
                            editable={!preview} 
                            objectId={vtemplate.params.dataToolbar.objectId}
                            page={vtemplate.params.dataToolbar.pageBinding}
                            layoutSize={layoutSize}
                            isManageZone={vtemplate.params.makroZone === MacroZoneType.MANAGE_ZONE}
                            isMobile={isMobile}
                            isHeader
                        />}
                    {vtemplate.params.makroZone === MacroZoneType.MANAGE_ZONE && (
                        <div 
                            className="VtemplateSCForm__tabs-block"
                            style={{ marginTop: 0, gap: 10, marginBottom: 16 }}
                        >
                            <div className="VtemplateSCForm__tabs" >
                                {vtemplate.params.tabs.map(renderTab)}
                            </div>
                            {!preview && vtemplate.params.tabs.length !== 0 &&
                            <div 
                                style={{ 
                                    display: 'flex', 
                                    position: isMobile ? 'absolute' : 'static', 
                                    left: `calc(${layoutSize.width}px + 10px)`, top: 0 }}
                            >
                                <ButtonSettings
                                    icon={false}
                                    size="large"
                                    type="default"
                                    disabled={false}
                                    onClick={settingVTTab}
                                    style={{ width: 'auto' }}
                                >
                                    <PlusOutlined />
                                </ButtonSettings>
                                {/* <ECTooltip title="Настройки зоны" placement="bottom">
                                    <span>
                                        <ButtonSettings
                                            icon={false}
                                            style={{ marginTop: 5 }}
                                            className="tabs-extra-demo-button"
                                            type="primary"
                                            shape="circle"
                                            disabled={true}
                                            // onClick={settingZoneVT}
                                        >
                                            <SettingOutlined />
                                        </ButtonSettings>
                                    </span>
                                </ECTooltip> */}
                            </div>}
                        </div>)}
                    {(vtemplate.params.makroZone === MacroZoneType.UNMANAGE_ZONE 
                    || (vtemplate.params.makroZone == MacroZoneType.MANAGE_ZONE 
                    && vtemplate.params.tabs.length !== 0) && Object.keys(activeTab)?.length > 0) &&
                        <VtemplateMobileDashboard 
                            editable={!preview} 
                            objectId={vtemplate.params.dataToolbar.objectId}
                            page={vtemplate.params.dataToolbar.pageBinding}
                            layoutSize={layoutSize}
                            isManageZone={vtemplate.params.makroZone === MacroZoneType.MANAGE_ZONE}
                            isMobile={isMobile}
                        />}
                </div>
                <ECModal
                    open={saveFlag ? true : openModal}
                    onCancel={() => {
                        closeModal()
                        saveFlag && navigate(getURL(
                            `${ROUTES.VTEMPLATES}/${ROUTES_COMMON.LIST}`, 
                            'constructor'
                        ))
                    }}
                    width="60%"
                    showFooterButtons={false}
                    tooltipText={textModalTitle[typeModal]}
                >
                    {renderComponentModal}
                </ECModal>
            </>)
    )
}

export default VtemplateMobileForm
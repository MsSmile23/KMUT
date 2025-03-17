import { dataVtemplateProps, paramsVtemplate } from '@shared/types/vtemplates'
import { IDataModalMacroZone, MacroZoneType, TabsArrType } from '../types/types'
import UnmanageableZone from './UnmanageableZone/UnmanageableZone'
import React, { FC, useEffect, useMemo, useState } from 'react'
import VtemplateDashboardView from '@app/vtemplate/VtemplateDashboardView'
import { CreateLabelTab } from './CreateLabelTab'
import { IObject } from '@shared/types/objects'
import { FullscreenZone } from './FullscreenZone'
import { selectObjectByIndex, useObjectsStore } from '@shared/stores/objects'
import { IChildObjectWithPaths, findChildObjectsWithPaths } from '@shared/utils/objects.ts'
import { selectCheckIEPerms, useAccountStore } from '@shared/stores/accounts'
import { generalStore } from '@shared/stores/general'
import VtemplateFormContainer from '../VtemplateFormContainer'
import { TPage } from '@shared/types/common';
import TabBarManagedZone3 from './TabBarManagedZone/TabBarManagedZone3'
import { formatText } from '@shared/ui/ECUIKit/ECTemplatedText/utils/utility'
import { selectGetClassById, useClassesStore } from '@shared/stores/classes'
import { ECPage422 } from '@shared/ui/ECUIKit/errors/ECPage422/ECPage422'

interface VtemplateViewProps {
    objectId?: IObject['id']
    vtemplate: dataVtemplateProps<paramsVtemplate>
    page?: TPage
}

/**
 * @param vtemplate - объект макета
 * @param objectId - ID объекта
 */



const VtemplateView: FC<VtemplateViewProps> = React.memo((props) => {

    const { vtemplate, objectId, page } = props


    // useEffect(() => {
    //     console.log('Измениалсь страничка', page, new Date())
    // }, [page])


    // useEffect(() => {
    //     const handleBeforeUnload = (event) => {
    //       // Устанавливаем сообщение, которое будет показано пользователю
    //       event.returnValue = 'Вы уверены, что хотите покинуть страницу?';
    
    //       // Для некоторых браузеров (например, Chrome) нужно установить свойство returnValue
    //       // на самом объекте события, а не на event.preventDefault()
    //       event.preventDefault();
    //     };
    
    //     // Добавляем обработчик события beforeunload
    //     window.addEventListener('beforeunload', handleBeforeUnload);
    
    //     // Очистка обработчика при размонтировании компонента
    //     return () => {
    //       window.removeEventListener('beforeunload', handleBeforeUnload);
    //     };
    //   }, [])
    const checkIEPerms = useAccountStore(selectCheckIEPerms)

    const [activeKey, setActiveKey] = useState<string>('')
    const [editableShowcase, setEditableShowcase] = useState<boolean>(false)
    const [selectedObjects, setSelectedObjects] = useState<{ id: number | null; keyTab: string | null }[]>([])
    const [typeTabs, setTypeTabs] = useState<IDataModalMacroZone['typeTabs']>('horizontal')

    const getObjectByIndex = useObjectsStore(selectObjectByIndex)
    const classById = useClassesStore(selectGetClassById)
    const isInterfaceShowcase = generalStore()?.interfaceView === 'showcase'
    const userData = useAccountStore(st => st?.store?.data.user)
    const object = getObjectByIndex('id', objectId)
    const makroZone = vtemplate?.params?.makroZone || 0
    const activeKeyRender = vtemplate?.params?.tabs?.length ? '1' : ''

    //Заменяем первый ключ табов на '1' для логики запоминания табов
    const changeFirstKey = (key: string, index: number) => index === 0 ? '1' : key

    const baseSettings = useMemo(() => ({
        ...vtemplate?.params.dataToolbar,
        vtemplateId: vtemplate.id
    }), [vtemplate?.params.dataToolbar, vtemplate.id])

    useEffect(() => {
        setTypeTabs(vtemplate?.params?.typeTabs)
    }, [vtemplate])

    //Формируем данные табов и контента управляемой зоны для отрисовки
    const generateTabsData = useMemo(() => {
        //Функция получения дочерних объектов
        const getLinkedObjects = (tab: TabsArrType) => findChildObjectsWithPaths({
            currentObj: object,
            childClassIds: tab?.settings?.connectingClasses,
            targetClassIds: tab?.settings?.targetClasses,
        })?.objectsWithPath

        //Получаем длину массива табов с учетом дочерних объектов в групповых вкладках
        let lengthTabs = 0

        vtemplate?.params?.tabs?.forEach(tab => {
            if (tab.type !== 'group' || tab?.tabOutputMode !== ('individualTabs' || undefined)) {
                lengthTabs++
            } else {
                const linkedObjects = getLinkedObjects(tab)

                lengthTabs += linkedObjects?.length
            }
        })

        const selectedObjectId = (key: string) => selectedObjects?.find(obj => obj.keyTab === key)?.id
        const selectedObjectName = (key: string) => getObjectByIndex('id', selectedObjectId(key))?.name

        const currentLabel = (
            tab: TabsArrType,
            objectName: string,
            index: number,
            linkedObject?: IChildObjectWithPaths
        ) => {
            const key = changeFirstKey(tab?.key, index)
            const objectId = selectedObjectId(key) ?? object?.id
            const classes = tab?.settings?.targetClasses || vtemplate?.params?.dataToolbar?.classes
            const value = tab?.currentLabel + `${tab?.tabOutputMode === 'tabsList' ? `: ${objectName}` : ''}`

            return formatText(value, linkedObject?.id ?? objectId, classes, getObjectByIndex, classById)
        }

        const createLabel = (
            tab: TabsArrType,
            linkedObject: IChildObjectWithPaths,
            index: number,
            linkedObjects: IChildObjectWithPaths[]
        ) => {
            const key = changeFirstKey(tab?.key, index)

            return (
                <CreateLabelTab
                    keyTab={changeFirstKey(tab?.key + (linkedObject?.id || ''), index)}
                    label={currentLabel(
                        tab,
                        linkedObject?.name ?? (selectedObjectName(key) ?? object?.name),
                        index,
                        linkedObject
                    )}
                    i={index}
                    preview={true}
                    activeKey={activeKey ? activeKey : activeKeyRender}
                    lengthTab={!isInterfaceShowcase ? vtemplate?.params?.tabs?.length - 1 : lengthTabs - 1 || 0}
                    objectId={linkedObject?.id || selectedObjectId(key) || objectId}
                    enableStateText={tab?.enabledStatelable}
                    typeTabs={typeTabs}
                    linkedObjects={linkedObjects}
                    tabOutputMode={tab?.tabOutputMode}
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
        }

        const createChildren = (tab: TabsArrType, linkedObjectId: number, index: number) => {
            const key = changeFirstKey(tab?.key, index)

            return (
                <VtemplateDashboardView
                    editable={false}
                    objectId={linkedObjectId || selectedObjectId(key) || objectId}
                    dataResponse={vtemplate?.params?.layoutContentManageZone?.[tab?.key]}
                    baseSettings={baseSettings}
                    page={page}
                    classes={tab?.settings?.targetClasses || vtemplate?.params.dataToolbar?.classes}
                />
            )
        }

        //Определяем индекс для передачи в табы групповых вкладок
        let indexGroupTab = 0

        const tabs = vtemplate?.params?.tabs?.reduce((acc, tab, index) => {
            const key = changeFirstKey(tab?.key, index)
            const linkedObjects = tab?.type === 'group' ? getLinkedObjects(tab) : []

            if (tab?.type === 'group' && tab?.tabOutputMode !== 'tabsList') {
                linkedObjects?.forEach((linkedObject, i) => {
                    acc.push({
                        ...tab,
                        key: changeFirstKey(tab?.key + linkedObject.id, indexGroupTab),
                        label: createLabel(tab, linkedObject, indexGroupTab, []),
                        currentLabel: currentLabel(tab, linkedObject?.name, index, linkedObject),
                        children: createChildren(tab, linkedObject.id, index),
                    });

                    indexGroupTab++
                })
                indexGroupTab += linkedObjects?.length
            } else {
                acc.push({
                    ...tab,
                    key: changeFirstKey(tab?.key, index),
                    label: createLabel(tab, null, indexGroupTab, tab?.tabOutputMode !== ('individualTabs' && undefined)
                        ? linkedObjects : []),
                    currentLabel: currentLabel(tab, selectedObjectName(key) ?? object?.name, index),
                    children: createChildren(tab, null, index),
                });
                indexGroupTab++
            }

            return acc
        }, []) || []

        if (tabs?.[0]) {
            tabs[0].key = '1'
        }

        return tabs
    }, [vtemplate?.params?.tabs, selectedObjects, activeKey, objectId])

    const onChangeTab = (key: string, index?: number) => {
        const keyTab = changeFirstKey(key, index)

        setActiveKey(keyTab)
    }

    // Переход в режим редактирования
    useEffect(() => {
        const isSuperadmin = userData?.role.interfaces.includes('constructor')

        if (isSuperadmin && isInterfaceShowcase) {
            const handleKeyDown = (event) => {
                if (event.ctrlKey && event.shiftKey && event.key === 'E' ||
                    event.ctrlKey && event.shiftKey && event.key === 'У') {
                    setEditableShowcase(prevState => !prevState)
                }
            }

            document.addEventListener('keydown', handleKeyDown)

            return () => {
                document.removeEventListener('keydown', handleKeyDown)
            }
        }

    }, []);

    if (!checkIEPerms('vtemplates', vtemplate.id) || !checkIEPerms('pages', page?.id)) {
        return (
            <ECPage422 />
        )
    }

    return (
        checkIEPerms('vtemplates', vtemplate.id) && checkIEPerms('pages', page?.id)
            ?
            <>
                {makroZone === MacroZoneType.MANAGE_ZONE && !editableShowcase && (
                    <>
                        {vtemplate?.params?.showHeaderZone &&
                            <UnmanageableZone
                                preview={true}
                                objectId={objectId || undefined}
                                handleChangeEditLayoutUnmanageableZone={() => false}
                                dataResponse={vtemplate?.params?.layoutContentUnmanageableZone}
                                settingUnmanageZone={() => false}
                                baseSettings={baseSettings}
                                page={page}
                            />}
                        <TabBarManagedZone3
                            tabsArr={generateTabsData}
                            preview={true}
                            onEdit={() => false}
                            activeKey={activeKey ? activeKey : activeKeyRender}
                            onChangeTab={onChangeTab}
                            settingZoneVT={() => false}
                            typeTabs={typeTabs}
                            isMiniHeader={vtemplate.params.dataSettingManageZoneTab?.isMiniHeader}
                        />
                    </>
                )}

                {makroZone === MacroZoneType.UNMANAGE_ZONE && !editableShowcase && (
                    <UnmanageableZone
                        preview={true}
                        objectId={objectId || undefined}
                        handleChangeEditLayoutUnmanageableZone={() => false}
                        dataResponse={vtemplate?.params?.layoutContentUnmanageableZone}
                        settingUnmanageZone={() => false}
                        baseSettings={baseSettings}
                        page={page}
                    />
                )}
                {makroZone === MacroZoneType.FULLSCREEN_ZONE && !editableShowcase && (
                    <FullscreenZone
                        objectId={objectId || undefined}
                        dataResponse={vtemplate?.params?.dataSettingFullScreenZone}
                        page={page}
                    />
                )}
                {editableShowcase && (
                    <VtemplateFormContainer
                        updateDataProp={vtemplate}
                        objectCard={false}
                        // isFullScreenZone={false}
                        idVtemplateShowcase={vtemplate?.id}
                        isInterfaceShowcase={isInterfaceShowcase}
                        objectIdShowcase={objectId}
                    />
                )}
            </>
            : <ECPage422 />
    )
})

export default VtemplateView
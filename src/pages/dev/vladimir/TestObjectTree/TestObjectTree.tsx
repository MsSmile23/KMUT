import { ObjectTree } from '@containers/objects/ObjectTree';
import { ITreeProps, ITreeStore } from '@containers/objects/ObjectTree/treeTypes';
import { FC, useEffect, useLayoutEffect, useState } from 'react';
import { TestTreeForm } from './TestTreeForm'
import { ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView';
import { Col } from 'antd';
import { useObjectsStore, selectObjects, selectObject } from '@shared/stores/objects'
import { IObject } from '@shared/types/objects'
import { useTreeStore } from '@shared/stores/trees';
import { useLocation, useParams } from 'react-router';
import { DefaultModal2 } from '@shared/ui/modals';
import { useTheme } from '@shared/hooks/useTheme';
import { selectClassByIndex, useClassesStore } from '@shared/stores/classes';
import { useAccountStore } from '@shared/stores/accounts';
import { ECTooltip } from '@shared/ui/tooltips';
import { createColorForTheme } from '@shared/utils/Theme/theme.utils';
import { useGetObjects } from '@shared/hooks/useGetObjects';
// import { patchAccountById } from '@shared/api/Accounts/Models/patchAccountById/patchAccountById';

export interface ITestObjectTree extends ITreeProps {
    objectCount?: number,
}
export const TestObjectTree: FC<{
    height: number
    emptyHeight?: number
    id: number
    classes?: ITreeProps['classIds']
    parentClasses?: ITreeProps['parentTrackedClasses']
    track?: 'none' | 'lastOpened'
}> = ({ height, emptyHeight, id, parentClasses, track, classes }) => {
    // const rawObjects = useObjectsStore(selectObjects)
    const rawObjects = useGetObjects()
    const accountData = useAccountStore((st) => st.store.data?.user)
    const getClassByIndex = useClassesStore(selectClassByIndex)
    const themeMode = accountData?.settings?.themeMode
    
    const theme = useTheme()
    const objClasses: Record<string, { id: IObject['id'], name: IObject['name'] }> = rawObjects
        .reduce((acc, o) => {
            if (acc[o.class?.id]) {
                return acc
            }

            if (o.class.package_id === 1) {
                acc[o.class?.id] = { id: o.class.id, name: o.class.name }

                return acc
            }

            return acc
        }, {} as Record<string, { id: IObject['id'], name: IObject['name'] }>)

    const objClassIds = Object.values(objClasses)
    const [dataWidget, setDataWidget] = useState<ITestObjectTree>({
        id: id,
        classIds: objClassIds,
        intermediateClassIds: objClassIds,
        parentTrackedClasses: parentClasses ?? [],
        trackId: track ?? 'none',
        objectCount: rawObjects.length
    })

    // console.log('dataWidget', id, dataWidget)
    const treeStore = {
        trackId: useTreeStore((state: ITreeStore) => state.trackId[dataWidget.id]),
        lastTrackedObjectId: useTreeStore((state: ITreeStore) => state.lastTrackedObjectId),
        classIds: useTreeStore((state: ITreeStore) => state.classIds[dataWidget.id]),
        groupingOrder: useTreeStore((state: ITreeStore) => state.groupingOrder[dataWidget.id]),
        setGroupingOrder: useTreeStore((state: ITreeStore) => state.setGroupingOrder),
        parentTrackedClasses: useTreeStore((state: ITreeStore) => state.parentTrackedClasses[dataWidget.id]),
        setClassIds: useTreeStore((state: ITreeStore) => state.setClassIds),
        setParentTrackedClasses: useTreeStore((state: ITreeStore) => state.setParentTrackedClasses),
        setTrackID: useTreeStore((state: ITreeStore) => state.setTrackID),
        setLastTrackedObjectId: useTreeStore((state: ITreeStore) => state.setLastTrackedObjectId),
        treeObjectFilter: useTreeStore((state: ITreeStore) => state.treeObjectFilter[dataWidget.id]),
        setAllTreeObjectFilter: useTreeStore((state: ITreeStore) => state.setAllTreeObjectFilter),
        setEmptyTreeObjectFilter: useTreeStore((state: ITreeStore) => state.setEmptyTreeObjectFilter),
    }

    useLayoutEffect(() => {
        // Создание полей в сторе, если таких нет по существующему айдишнику
        if (dataWidget.id === 9023 || dataWidget.id === 85636) {
            const targetClasses = dataWidget.id === 9023 
                ? accountData.settings?.trees?.[id]?.targetClasses ?? theme.components.tree.showcase?.mainTree?.classes ?? []
                : accountData.settings?.trees?.[id]?.targetClasses ?? theme.components.tree.showcase?.childrenTree?.classes ?? []

            const themeClasses = targetClasses.map((group => {
                        return {
                            target: group.target.reduce((acc, cls) => { 
                                const currentClass = getClassByIndex('id', cls?.id ?? cls)
                                if (currentClass) {
                                    acc.push({
                                        id: cls?.id ?? cls, 
                                        name: currentClass.name
                                    })
                                }

                                return acc
                            }, []),
                            linking: group.linking.reduce((acc, cls) => { 
                                const currentClass = getClassByIndex('id', cls?.id ?? cls)
                                if (currentClass) {
                                    acc.push({
                                        id: cls?.id ?? cls, 
                                        name: currentClass.name
                                    })
                                }

                                return acc
                            }, []),
                        }
                    }))
            !treeStore.treeObjectFilter && treeStore.setAllTreeObjectFilter(
                themeClasses ?? [{
                    target: [],
                    linking: []
                }], 
                dataWidget.id
            )
            const newClasses = themeClasses.length > 0 && themeClasses[0].target && 
                themeClasses[0].target.length > 0
                ? themeClasses.reduce((acc, group) => {
                    acc.push(...group.target)

                    return acc
                }, [])
                : dataWidget.classIds

            if(!treeStore.classIds) {
                treeStore.setClassIds(newClasses, dataWidget.id)
            } 

            
            const groupingOrder = dataWidget.id === 9023 
                ? accountData.settings?.trees?.[id]?.groupingOrder ?? theme.components.tree.showcase?.mainTree?.groupingOrder
                : accountData.settings?.trees?.[id]?.groupingOrder ?? theme.components.tree.showcase?.childrenTree?.groupingOrder
            
            !treeStore.groupingOrder && treeStore.setGroupingOrder(groupingOrder, dataWidget.id)
        } else {
            !treeStore.classIds && treeStore.setClassIds(classes ?? dataWidget.classIds, dataWidget.id)
            !treeStore.treeObjectFilter && treeStore.setEmptyTreeObjectFilter(dataWidget.id)
        }

        // trackId & parentTrackedClasses
        if (dataWidget.id === 85636) {
            const isTrack = accountData.settings?.trees?.[id]?.trackId ?? theme.components.tree.showcase?.childrenTree?.enabled 
                ? 'lastOpened'
                : 'none'
            
            const trackedClasses = accountData.settings?.trees?.[id]?.parentTrackedClasses ?? 
                theme.components.tree.showcase?.childrenTree?.parentTrackedClasses
                    .map((id) => ({ 
                        id, 
                        name: getClassByIndex('id', id)?.name 
                    }))
            
            !treeStore.trackId && treeStore.setTrackID(isTrack ?? 'none', dataWidget.id)
            !treeStore.parentTrackedClasses &&
                treeStore.setParentTrackedClasses(
                    trackedClasses ?? [], 
                    dataWidget.id
                )
        } else {
            !treeStore.trackId && 
                treeStore.setTrackID(track ?? accountData.settings?.trees?.[id]?.trackId ?? dataWidget.trackId, dataWidget.id)
            !treeStore.parentTrackedClasses &&
                treeStore.setParentTrackedClasses(parentClasses ?? 
                    accountData.settings?.trees?.[id]?.parentTrackedClasses ?? 
                    dataWidget.parentTrackedClasses, 
                dataWidget.id)
        }
    }, [])
    const [show, setShow] = useState(false)
    const showModal = (value: boolean) => {
        setShow(value)
    }

    const closeModal = () => {
        setShow(false)
    }
    const setSettings = (settings: Partial<ITreeProps>) => {
        setDataWidget(state => ({
            ...state,
            ...settings
        }))
    }
    const selectCurrObject = useObjectsStore(selectObject)

    const userId = useParams().id
    const location = useLocation()
    
    useEffect(() => {
        if (userId) {
            const paramId = Number(userId)
            const currObj = selectCurrObject(paramId)

            if (currObj) {
                const classFromParamId = currObj.class_id
                const isInTrackedClasses = treeStore
                    .parentTrackedClasses?.findIndex(item => item.id === classFromParamId)

                isInTrackedClasses > -1 && treeStore.setLastTrackedObjectId(paramId)
            }
        }
    }, [location.pathname])
    
    return (
        <div
            style={{ position: 'relative', width: '100%', /* maxWidth: 400 */ }}
        >
            <ECTooltip title="Настройки виджета дерева">
                <div 
                    style={{ 
                        position: 'absolute', 
                        top: 3, 
                        right: 3, 
                        zIndex: 1000, 
                        cursor: 'pointer' 
                    }}   
                    onClick={() => showModal(true)}  
                >
                    <ECIconView icon="SettingOutlined" />
                </div>
                {/* </Popover> */}
            </ECTooltip>
            <DefaultModal2 
                onCancel={closeModal} 
                open={show} 
                footer={null} 
                title="Настройки виджета дерева"
                width="70%"
                height="70%"
            >
                <TestTreeForm
                    setSettings={setSettings}
                    dataWidget={dataWidget}
                    closeModal={closeModal}
                    objClassIds={objClassIds}
                />
            </DefaultModal2>
            {(treeStore.trackId === 'none' || (
                treeStore.trackId === 'lastOpened' &&
                treeStore.parentTrackedClasses.length === 0
            ) || (
                treeStore.trackId === 'lastOpened' &&
                treeStore.parentTrackedClasses.length > 0 &&
                treeStore.lastTrackedObjectId !== null
            )) ? (
                    <ObjectTree dataWidget={dataWidget} height={height} />
                ) : (
                    <Col
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            flex: 1,
                            padding: 16,
                            // backgroundColor: theme.components.tree.showcase.backgroundColor || '#fff',
                            borderRadius: theme.components.tree.showcase.borderRadius || 16,
                            height: emptyHeight,
                            boxShadow: 'rgba(0, 0, 0, 0.4) 0px 0px 8px', 
                            background: createColorForTheme(theme?.sideBar?.background, theme?.colors, themeMode)
                        }}
                    >

                    </Col>
                )}
        </div>
    )
}
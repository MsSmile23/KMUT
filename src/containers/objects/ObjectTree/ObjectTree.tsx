import { selectObjectByIndex, selectObjects, selectState, useObjectsStore } from '@shared/stores/objects'
import { IObject } from '@shared/types/objects'
import { FC, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { CustomTreeNode } from './CustomTreeNode'
import { IClassifiersProps, ITreeObjectsStatesProps, ITreeState, ITreeStore } from './treeTypes'
import { PACKAGE_AREA } from '@shared/config/entities/package'
import { useRelationsStore, selectRelations, selectRelationByIndex } from '@shared/stores/relations'
import { getRelationProps } from '@shared/utils/relations'
import { buildBranches, /* objectGenerator, */ makeKey, getObjectState, /* saveTreeIdSettings */ } from './utils'
import DirectoryTree from 'antd/es/tree/DirectoryTree'
import { CustomTreeTitle } from './CustomTreeTitle'

import { ITestObjectTree } from '@pages/dev/vladimir/TestObjectTree/TestObjectTree'
import { useLocation, useParams } from 'react-router'
import { IsBuildTree } from './IsBuildTree'
import { IsNotEmptyTree } from './IsNotEmptyTree'
import { TreeHeader } from './TreeHeader/TreeHeader'
import { useTreeStore } from '@shared/stores/trees'
import { Col, Divider } from 'antd'
import { findChildsByBaseClasses } from '@shared/utils/classes'
import { IFindChildObjectsWithPathsReturn, findChildObjectsWithPaths } from '@shared/utils/objects'
import { TreeSearch } from './TreeSearch'
import { useTheme } from '@shared/hooks/useTheme'
import { useNavigate } from 'react-router-dom'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { getStateViewParamsWithDefault, stateViewParamsDefault } from '@shared/utils/states'
import { useStateStereotypesStore, selectStateStereotypes } from '@shared/stores/statesStereotypes'
import { IParams } from '@shared/types/states'
import { useAccountStore } from '@shared/stores/accounts'
import { getURL } from '@shared/utils/nav'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import { selectThemeName, useThemeStore } from '@shared/stores/theme'
import { useGetObjects } from '@shared/hooks/useGetObjects'

// ITestObjectTree для подключения TestObjectTreeForm формы к дереву 
// height для виртуализации дерева
export const ObjectTree: FC<{ dataWidget: ITestObjectTree, height: number }> = ({ dataWidget, height = 500 }) => {
    // export const ObjectTree: FC<{ dataWidget: ITreeProps }> = ({ dataWidget }) => {
    const {
        id,
        objectCount,
    } = dataWidget
    const theme = useTheme()
    const accountData = useAccountStore((st) => st.store.data?.user)
    const currentTheme = useThemeStore(selectThemeName)
    const shadowColor = theme?.widget?.shadowColor
    const themeMode = accountData?.settings?.themeMode
    const getRelation = useRelationsStore().getRelationById
    // const color = createColorForTheme(theme?.sideBar?.textColor, theme?.colors, themeMode)
    // const background = createColorForTheme(theme?.sideBar?.background, theme?.colors, themeMode)

    const color = useMemo(() => {
        return (
            createColorForTheme(theme?.sideBar?.textColor, theme?.colors, themeMode) ||
            '#000000'
        )
    }, [theme, themeMode])
    const background = useMemo(() => {
        return (
            createColorForTheme(theme?.sideBar?.background, theme?.colors, themeMode) ||
            '#ffffff'
        )
    }, [theme, themeMode])

    const navigate = useNavigate()
    const isShowHorizontalScroll = accountData?.settings?.trees?.showHorizontalScroll ?? false

    // const newTreeStore = useCurrentTreeStore(id)
    const groupingOrder = useTreeStore((state) => state.groupingOrder[id])

    const treeStore = {
        chosenClassifiers: useTreeStore((state: ITreeStore) => state.chosenClassifiers[id]),
        setChosenClassifiers: useTreeStore((state: ITreeStore) => state.setChosenClassifiers),
        chosenClassifiersCount: useTreeStore((state: ITreeStore) => state.chosenClassifiersCount[id]),
        setChosenClassifiersCount: useTreeStore((state: ITreeStore) => state.setChosenClassifiersCount),
        groupingOrder: useTreeStore((state: ITreeStore) => state.groupingOrder[id]),
        setGroupingOrder: useTreeStore((state: ITreeStore) => state.setGroupingOrder),
        searchValue: useTreeStore((state: ITreeStore) => state.searchValue[id]),
        setSearchValue: useTreeStore((state: ITreeStore) => state.setSearchValue),
        lastTrackedObjectId: useTreeStore((state: ITreeStore) => state.lastTrackedObjectId),
        setLastTrackedObjectId: useTreeStore((state: ITreeStore) => state.setLastTrackedObjectId),
        expandedKeys: useTreeStore((state: ITreeStore) => state.expandedKeys[id]),
        setExpandedKeys: useTreeStore((state: ITreeStore) => state.setExpandedKeys),
        classIds: useTreeStore((state: ITreeStore) => state.classIds[id]),
        parentTrackedClasses: useTreeStore((state: ITreeStore) => state.parentTrackedClasses[id]),
        trackId: useTreeStore((state: ITreeStore) => state.trackId[id]),
        setClassIds: useTreeStore((state: ITreeStore) => state.setClassIds),
        setParentTrackedClasses: useTreeStore((state: ITreeStore) => state.setParentTrackedClasses),
        setTrackID: useTreeStore((state: ITreeStore) => state.setTrackID),
        intermediateClassIds: useTreeStore((state: ITreeStore) => state.intermediateClassIds[id]),
        setIntermediateClassIds: useTreeStore((state: ITreeStore) => state.setIntermediateClassIds),
        visibleClassIds: useTreeStore((state: ITreeStore) => state.visibleClassIds[id]),
        setVisibleClassIds: useTreeStore((state: ITreeStore) => state.setVisibleClassIds),
        showHierarchy: useTreeStore((state: ITreeStore) => state.showHierarchy[id]),
        setShowHierarchy: useTreeStore((state: ITreeStore) => state.setShowHierarchy),
        treeObjectFilter: useTreeStore((state: ITreeStore) => state.treeObjectFilter[dataWidget.id]),
        setAllTreeObjectFilter: useTreeStore((state: ITreeStore) => state.setAllTreeObjectFilter),
        setEmptyTreeObjectFilter: useTreeStore((state: ITreeStore) => state.setEmptyTreeObjectFilter),
    }

    useLayoutEffect(() => {
        // Создание полей в сторе, если таких нет по существующему айдишнику
        !treeStore.expandedKeys && treeStore.setExpandedKeys(
            accountData?.settings?.trees?.[id]?.expandedKeys ?? ['0-0'],
            id
        )
        !treeStore.chosenClassifiers && treeStore.setChosenClassifiers(
            accountData?.settings?.trees?.[id]?.chosenClassifiers as IClassifiersProps['classifiers'] ?? {},
            id
        )
        !treeStore.groupingOrder && treeStore.setGroupingOrder(
            accountData?.settings?.trees?.[id]?.groupingOrder ?? [],
            id
        )
        !treeStore.visibleClassIds && treeStore.setVisibleClassIds(
            accountData?.settings?.trees?.[id]?.visibleClasses ?? [],
            id
        )
        !treeStore.intermediateClassIds && treeStore.setIntermediateClassIds(
            accountData?.settings?.trees?.[id]?.intermediateClassIds ?? [],
            id
        )
        !treeStore.searchValue && treeStore.setSearchValue(
            // accountData?.settings?.trees?.[id]?.searchValue ?? '', 
            '',
            id
        )
        !treeStore.showHierarchy && treeStore.setShowHierarchy(
            accountData?.settings?.trees?.[id]?.showHierarchy ?? false,
            id
        )
        !treeStore.treeObjectFilter && treeStore.setEmptyTreeObjectFilter(id)
    }, [])

    // const rawObjects1 = useObjectsStore(selectObjects)
    const rawObjects1 = useGetObjects()
    const objectsStoreState = useObjectsStore(selectState)
    const selectCurrObject = useObjectsStore(selectObjectByIndex)

    const userId = useParams().id
    const location = useLocation()

    const [rawObjects, setRawObjects] = useState<IObject[]>(rawObjects1)

    useEffect(() => {
        setRawObjects(rawObjects1)
        // const objs = objectCount > rawObjects1.length
        //     ? objectGenerator(objectCount, rawObjects1)
        //     : rawObjects1

        // setRawObjects(objs)
    }, [objectCount])

    const relations = useRelationsStore(selectRelations)
    const stateStereotypes = useStateStereotypesStore(selectStateStereotypes)
    const [isBuild, setIsBuild] = useState<boolean>(false)
    const [treeState, setTreeState] = useState<ITreeState>({
        availableClassifiers: {},
        defaultTree: [],
        customTree: [],
    })

    const onExpand = (keys: string[]) => {
        treeStore.setExpandedKeys(keys, id)
        // saveTreeIdSettings(
        //     accountData?.settings,
        //     {
        //         expandedKeys: keys
        //     },
        //     id
        // )
    }

    const baseTreeObject = {
        title: 'Все объекты',
        key: '0-0',
        children: [],
    }

    useEffect(() => {
        if (userId) {
            const paramId = Number(userId)
            const currObj = selectCurrObject('id', paramId)

            if (currObj) {
                const classFromParamId = currObj.class_id
                const isInTrackedClasses = treeStore
                    .parentTrackedClasses?.findIndex(item => item.id === classFromParamId)

                isInTrackedClasses > -1 && treeStore.setLastTrackedObjectId(paramId)
            }
        }
    }, [location.pathname])

    const prepareClassifiers = () => {
        const tempClassifiers: IClassifiersProps['classifiers'] = {
            0: {
                id: 0,
                name: 'Класс объекта',
                children: []
            }
        }

        const classesIds = treeStore.classIds?.map(item => item.id)

        relations?.forEach(relationItem => {
            // Проверяем релейшены только отслеживаемых классов


            if (classesIds.includes(relationItem.left_class_id)) {
                const { classId, name, className } = getRelationProps(relationItem)

                if (currentTheme === 'fns') {
                    const isSubjectRelation = [
                        relationItem.left_class.package_id,
                        relationItem.right_class.package_id
                    ].every(it => it === PACKAGE_AREA.SUBJECT)

                    if (isSubjectRelation && !relationItem.virtual) {
                        if (!tempClassifiers[relationItem.id]) {
                            tempClassifiers[relationItem.id] = {
                                id: relationItem.id,
                                name: name,
                                // name: className,
                                children: [],
                                targetClass: classId
                            }
                        }
                        // if (!tempClassifiers[classId]) {
                        //     tempClassifiers[classId] = {
                        //         id: relationItem.id,
                        //         name: name,
                        //         children: []
                        //     }
                        // }
                    }
                } else {
                    if (relationItem.relation_type === 'association') {
                        // Если тип "Ассоциация", то наполняем классификаторы всеми доступными релейшенами

                        if (!tempClassifiers[relationItem.id]) {
                            tempClassifiers[relationItem.id] = {
                                id: relationItem.id,
                                name: name,
                                children: [],
                                targetClass: classId
                            }
                        }
                    }
                    
                }

            }
        })

        return tempClassifiers
    }

    const buildTree = () => {
        const tempClassifiers = prepareClassifiers()
        const tempDefaultTree: ITreeState['defaultTree'] = [{ ...baseTreeObject }]
        const tempCustomTree: ITreeState['customTree'] = [{ ...baseTreeObject }]
        const tempStates: ITreeObjectsStatesProps['statuses'] = []

        // Проверка наличия параметров обработки объекта
        const objectStateSettings = {
            searchValue: treeStore.searchValue !== '',
            chosenClassifiers: Object.values(treeStore.chosenClassifiers).reduce((sum, classifier) => {
                return sum + classifier.children.length
            }, 0) > 0,
            groupingOrder: groupingOrder.length > 0,
            // groupingOrder: treeStore.groupingOrder.length > 0,
        }

        let childrenObjectsOfTrackedObject: IFindChildObjectsWithPathsReturn['objectsWithPath']
        let filteredChildrenByTL: IFindChildObjectsWithPathsReturn['objectsWithPath']

        if (treeStore.lastTrackedObjectId) {
            const trackingObject = selectCurrObject('id', treeStore.lastTrackedObjectId)
            const childClassIds = findChildsByBaseClasses({
                relations,
                classIds: [trackingObject?.class_id],
                package_area: 'SUBJECT',
            }) as number[]

            setTreeState((state) => ({
                ...state,
                childClasses: [...new Set(childClassIds)].map(item => ({ id: String(item), name: '' }))
            }))

            const visibleClasses = treeStore?.visibleClassIds?.map(item => Number(item.id))
            const intermediateClasses = treeStore?.intermediateClassIds?.map(item => Number(item.id))

            childrenObjectsOfTrackedObject = findChildObjectsWithPaths({
                childClassIds,
                targetClassIds: treeStore.classIds.map(item => item.id),
                currentObj: trackingObject,
                visibleClasses,
                intermediateClasses,
                onlyUnique: false,
                // id: id
            }).objectsWithPath

            filteredChildrenByTL = childrenObjectsOfTrackedObject.filter(child => {
                const cases = treeStore.treeObjectFilter.some((objFilter) => {
                    const isTarget = objFilter?.target?.length > 0
                        ? objFilter?.target?.some(item => item.id === child.classId)
                        : true

                    // id === 85636 && console.log('isTarget', child.name, isTarget)

                    const isLinked = objFilter?.linking?.length > 0
                        ? isTarget && objFilter?.linking?.some(item => {
                            return child.paths.allClassArr.includes(Number(item.id))
                        })
                        : true

                    // id === 85636 && console.log('isLinked', child.id, child.name, isLinked)

                    return isLinked
                })

                // id === 85636 && console.log('cases', cases)

                return cases
            })

            if (id === 85636) {
                // console.log('treeStore.treeObjectFilter', treeStore.treeObjectFilter)
                // console.log('visibleClasses tree', visibleClasses)
                // console.log('intermediate', treeStore.intermediateClassIds)
                // console.log('childrenObjectsOfTrackedObject', childrenObjectsOfTrackedObject)
                // console.log('childrenObjectsOfTrackedObject paths', childrenObjectsOfTrackedObject
                //     .map(it => it.paths.visibleArr))
                // console.log('childrenObjectsOfTrackedObject cl paths', childrenObjectsOfTrackedObject
                //     .map(it => it.id + ' ' + it.paths.allClassStr))
                // console.log('filteredChildrenByTL paths', id, filteredChildrenByTL
                //     .map(it => it.paths.visibleArr))
                // .map(it => it.paths.allClassArr))
                // console.log('filteredChildrenByTL', filteredChildrenByTL)
            }
        }

        const checkObject = (obj: IObject) => {
            // Перечень условий для отображения каждого объекта в дереве
            const cases = {
                // Принадлежит ли объект предметной области
                subjectArea: obj.class.package_id === PACKAGE_AREA.SUBJECT,
                // Есть ли класс объекта в перечне отображаемых классов
                // При отсутствии перечня отображаются объекты всех возможных классов
                isInClassIds: treeStore.classIds.length > 0
                    ? treeStore.classIds.findIndex(item => item.id === obj.class.id) > -1
                    : true,
                // Нужно ли отслеживать последний открытый объект на наличие его дочерних объектов
                isToTrackLastOpened: treeStore.trackId === 'lastOpened',
                // Выбран ли последний отслеживаемый объект или его нет
                isHaveObjToTrack: Boolean(treeStore.lastTrackedObjectId),
                // Является ли текущий объект дочерним отслеживаемому lastTrackedObjectId

                isSubOfTrackedClass: filteredChildrenByTL?.findIndex(child => child.id === obj.id) > -1,
                // isSubOfTrackedClass: childrenObjectsOfTrackedObject?.findIndex(child => child.id === obj.id) > -1,
            }

            // Условия отображения основного дерева
            const baseConditions = [
                cases.subjectArea,
                cases.isInClassIds,
            ]

            // Условия отображения дерева дочерних объектов
            const trackParentConditions = [
                ...baseConditions,
                cases.isToTrackLastOpened,
                cases.isHaveObjToTrack,
                cases.isSubOfTrackedClass
            ]

            // findChildObjectsOfTarget()

            return treeStore.trackId === 'lastOpened'
                ? trackParentConditions.every(item => item === true)
                : baseConditions.every(item => item === true)
        }

        for (let i = 0; i < rawObjects.length; i++) {

            // Добавляем в селектор все связанные классы
            Object.keys(tempClassifiers).forEach(key => {
                if (tempClassifiers[key]?.targetClass == rawObjects[i].class_id) {
                    tempClassifiers[key]?.children?.push(rawObjects[i])
                }
            })

            // Комплексная проверка объекта на соответствие всем заданным критериям
            if (checkObject(rawObjects[i])) {
                const objWithPath = filteredChildrenByTL?.find(item => {
                    // const objWithPath = childrenObjectsOfTrackedObject?.find(item => {
                    return item.id === rawObjects[i].id
                })

                // id === 85636 && console.log('object', rawObjects[i], rawObjects[i].name)

                const prepareRequirements = {
                    isFilteredBySearchValue: false,
                    isFilteredByChosenClassifiers: false,
                    isGrouped: false
                }

                // Добавить объект в классификатор "Тип объекта", если в них присутствует класс объекта
                const classTypeIdx = tempClassifiers['0'].children
                    .findIndex(child => child.id === rawObjects[i].class.id)

                if (classTypeIdx < 0 &&
                    treeStore.classIds.find(item => item.id === rawObjects[i].class.id)
                ) {
                    tempClassifiers['0'].children.push({
                        id: rawObjects[i].class.id,
                        name: rawObjects[i].class.name,
                    })
                }

                // Также проверяем по остальным классификаторам, если есть соответствующий классификатор
                // Если такого классификатора нет, значит не был создан релейшен между соответствующими классами
                // Object.keys(tempClassifiers).forEach(key => {
                //     const leftLinksIdx = rawObjects[i].links_where_left
                //         .findIndex(item => item.relation_id === Number(key))
                //     const rightLinksIdx = rawObjects[i].links_where_right
                //         .findIndex(item => item.relation_id === Number(key))

                //     if ((leftLinksIdx > -1 || rightLinksIdx > -1) 
                //         && tempClassifiers[key].targetClass == rawObjects[i].class_id
                //     ) {
                //         tempClassifiers[key].children.push(rawObjects[i])
                //     }
                // })
                // if (tempClassifiers[rawObjects[i].class.id]) {
                //     tempClassifiers[rawObjects[i].class.id].children.push(rawObjects[i])
                // }

                /// Если никаких настроек для обработки объекта нет, кладём в дефолтное дерево
                if (Object.values(objectStateSettings).every(setting => setting === false)) {
                    const objectState = getObjectState(tempStates, rawObjects[i].id, stateStereotypes)

                    if (treeStore.lastTrackedObjectId && treeStore.showHierarchy) {
                        const newPaths = objWithPath.paths.visibleArr.map(item => ({ id: '0', name: item.name }))

                        const branchPropsWithHierarchy = {
                            id: id,
                            key: '0-0',
                            objectIndex: i,
                            tempTree: tempDefaultTree,
                            showHierarchy: treeStore.showHierarchy,
                            allClassifiers: treeState.availableClassifiers,
                            groupingOrder: newPaths,
                            object: rawObjects[i],
                            objectState,
                            // getLinkById,
                            selectCurrObject,
                            themeStyles: {
                                backgroundColor: 'transparent',
                                color
                            }
                        }

                        buildBranches(branchPropsWithHierarchy)
                    } else {
                        tempDefaultTree[0].children.push({
                            title: (
                                <CustomTreeNode
                                    id={rawObjects[i].id}
                                    name={rawObjects[i].name}
                                    icon={rawObjects[i].class.icon}
                                    // state={newState}
                                    state={objectState}
                                    styles={{
                                        backgroundColor: 'transparent',
                                    }}
                                />
                            ),
                            key: makeKey(String(tempDefaultTree[0].key), 0, rawObjects[i].id),
                            // key: makeKey(String(tempDefaultTree[0].key), 0, i),
                            isLeaf: true,
                            // eslint-disable-next-line react/jsx-no-useless-fragment
                            icon: <></>
                        })
                    }
                    ///
                } else {

                    // Проходит ли объект фильтр по поисковому запросу при его наличии
                    const searchResult = [
                        rawObjects[i]?.name?.toLowerCase()
                            .includes(treeStore.searchValue.toLowerCase()), // название объекта
                        rawObjects[i].object_attributes?.some(objAttr => {
                            return objAttr?.attribute_value?.includes(treeStore.searchValue) // значение атрибута
                        }),
                    ].some(item => item === true)

                    prepareRequirements.isFilteredBySearchValue = objectStateSettings.searchValue
                        ? searchResult
                        : true

                    if (objectStateSettings?.chosenClassifiers) {
                        // console.log(treeStore.chosenClassifiers)
                        // Проходит ли объект фильтр по типу объекта, если выбран такой классификатор
                        const isClassifiedByType = treeStore?.chosenClassifiers[0]?.children
                            .find(child => child.id === rawObjects[i]?.class?.id)

                        //* Большая проверка на то, подходит ли объект по классификаторам
                        const objectsRelationsIds = [
                            ...rawObjects[i].links_where_left.map(link => link.relation_id),
                            ...rawObjects[i].links_where_right.map(link => link.relation_id)
                        ]

                        let isClassifiedByClassifiers = false

                        for (const [key, classifier] of Object.entries(treeStore.chosenClassifiers)) {

                            if (objectsRelationsIds.includes(Number(classifier.id))) {
                                const classifierObjects = classifier.children.flatMap(child => {
                                    const allLinks = [...child.links_where_right, ...child.links_where_left]

                                    return allLinks.flatMap(link => [link.right_object_id, link.left_object_id])
                                })

                                if (classifierObjects.includes(rawObjects[i].id) &&
                                    rawObjects[i].class_id !== classifier.children[0].class_id) {
                                    isClassifiedByClassifiers = true
                                    break
                                }
                            }
                        }

                        // const isClassifiedByClassifiers = true
                        // treeStore.chosenClassifiers[rawObjects[i].class.id] &&
                        //     treeStore.chosenClassifiers[rawObjects[i].class.id].children
                        //         .find(child => child.id === rawObjects[i].id)


                        prepareRequirements.isFilteredByChosenClassifiers = Boolean(isClassifiedByType) ||
                            Boolean(isClassifiedByClassifiers)

                    } else {
                        prepareRequirements.isFilteredByChosenClassifiers = true
                    }

                    // Нужна ли группировка объекта по группам
                    prepareRequirements.isGrouped = objectStateSettings.groupingOrder

                    // Если объект прошёл по фильтру поиска 
                    if (prepareRequirements.isFilteredBySearchValue) {
                        // и удовлетворяет условиям выбранных классификаторов
                        if (prepareRequirements.isFilteredByChosenClassifiers) {
                            // Если есть группировка, то группируем, либо просто добавляем объект в корень
                            if (prepareRequirements.isGrouped) {
                                const objectState = getObjectState(tempStates, rawObjects[i].id, stateStereotypes)


                                const newOrder = treeStore.lastTrackedObjectId && treeStore.showHierarchy
                                    ? objWithPath.paths.visibleArr.map(item => ({
                                        id: '0',
                                        name: item.name
                                    })).concat(groupingOrder)
                                    // })).concat(treeStore.groupingOrder)
                                    : groupingOrder
                                // : treeStore.groupingOrder
                                const branchProps = {
                                    id: id,
                                    key: '0-0',
                                    groupingOrder: newOrder,
                                    objectIndex: i,
                                    tempTree: tempDefaultTree,
                                    showHierarchy: treeStore.showHierarchy,
                                    allClassifiers: treeState.availableClassifiers,
                                    object: rawObjects[i],
                                    // objectState: newState,
                                    objectState,
                                    // getLinkById,
                                    selectCurrObject,
                                    themeStyles: {
                                        backgroundColor: 'transparent',
                                        color
                                    }
                                }

                                buildBranches(branchProps)
                            } else {
                                const objectState = getObjectState(tempStates, rawObjects[i].id, stateStereotypes)

                                if (treeStore.lastTrackedObjectId && treeStore.showHierarchy) {
                                    const branchPropsWithHierarchy = {
                                        id: id,
                                        key: '0-0',
                                        objectIndex: i,
                                        tempTree: tempDefaultTree,
                                        showHierarchy: treeStore.showHierarchy,
                                        allClassifiers: treeState.availableClassifiers,
                                        groupingOrder: objWithPath.paths.visibleArr.map(item => ({
                                            id: '0', name:
                                                item.name
                                        })),
                                        object: rawObjects[i],
                                        objectState,
                                        // getLinkById,
                                        selectCurrObject,
                                        themeStyles: {
                                            backgroundColor: 'transparent',
                                            color
                                        }
                                    }

                                    buildBranches(branchPropsWithHierarchy)
                                } else {
                                    tempCustomTree[0].children.push({
                                        title: (
                                            <CustomTreeNode
                                                id={rawObjects[i].id}
                                                name={rawObjects[i].name}
                                                icon={rawObjects[i].class.icon}
                                                // state={newState}
                                                state={objectState}
                                                styles={{
                                                    backgroundColor: 'transparent',
                                                }}
                                            />
                                        ),
                                        key: makeKey(String(tempCustomTree[0].key), 0, rawObjects[i].id),
                                        // key: makeKey(String(tempCustomTree[0].key), 0, i),
                                        isLeaf: true,
                                        // eslint-disable-next-line react/jsx-no-useless-fragment
                                        icon: <></>
                                    })
                                }
                            }
                        } else {
                            continue
                        }
                    } else {
                        continue
                    }
                }
            } else {
                continue
            }

        }
        // todo исправить постОбработку состояний, сделать на этапе аккумуляции состояний объектов

        const blankStates = stateStereotypes.map(stereo => {
            const stereoParams = getStateViewParamsWithDefault(stereo)
            const stereoParamsWithDefault: IParams[] = Object.entries(stereoParams)
                .filter(([key,]) => {
                    return ['fill', 'textColor', 'border', 'icon'].includes(key)
                })
                .map(([key, value]) => {
                    return {
                        type: key,
                        value: String(value)
                    }
                })

            return {
                state: {
                    id: stereo.id,
                    view_params: {
                        name: stereo.view_params.name,
                        params: stereoParamsWithDefault,
                    },
                    states: []
                },
                count: 0
            }
        })

        // console.log('blankStates', blankStates)

        const groupedTempStates = tempStates
            .reduce((acc, item) => {
                if (item.state.id !== 'unknown') {
                    item?.state?.states?.forEach(state => {
                        const stereoIdx = acc.findIndex(accItem => accItem.state.id === state.state_stereotype_id)

                        if (stereoIdx < 0) {
                            const stateIdx = acc.findIndex(accItem => accItem.state.id === state.id)

                            if (stateIdx < 0) {
                                const stateParams = getStateViewParamsWithDefault(state)
                                const stateParamsWithDefault: IParams[] = Object.entries(stateParams)
                                    .filter(([key,]) => {
                                        return ['fill', 'textColor', 'border', 'icon'].includes(key)
                                    })
                                    .map(([key, value]) => {
                                        return {
                                            type: key,
                                            value: String(value)
                                        }
                                    })

                                acc.push({
                                    state: {
                                        id: state.id,
                                        view_params: {
                                            name: state.view_params.name,
                                            params: stateParamsWithDefault,
                                        },
                                        states: [state]
                                    },
                                    count: 1
                                })

                            } else {
                                acc[stateIdx].state.states.push(state)
                                acc[stateIdx].count++
                            }
                        } else {
                            acc[stereoIdx].state.states.push(state)
                            acc[stereoIdx].count++
                        }
                    })
                } else {
                    item.state.states.forEach(state => {
                        const unknownIdx = acc.findIndex(accItem => accItem.state.id === 5)

                        if (unknownIdx < 0) {
                            const stateParamsWithDefault: IParams[] = Object.entries(stateViewParamsDefault)
                                .filter(([key,]) => {
                                    return ['fill', 'textColor', 'border', 'icon'].includes(key)
                                })
                                .map(([key, value]) => {
                                    return {
                                        type: key,
                                        value: String(value)
                                    }
                                })

                            acc.push({
                                state: {
                                    id: 0,
                                    view_params: {
                                        name: stateViewParamsDefault.name,
                                        params: stateParamsWithDefault,
                                    },
                                    states: [state]
                                },
                                count: 1
                            })
                        } else {
                            acc[unknownIdx].state.states.push(state)
                            acc[unknownIdx].count++

                        }
                    })
                }



                return acc
            }, blankStates)
            .filter(item => item.count > 0)

        // console.log('stateStereotypes', stateStereotypes)
        // console.log('groupedTempStates', groupedTempStates)
        tempDefaultTree[0].title = (
            <CustomTreeTitle
                id={id}
                statuses={groupedTempStates}
                // statuses={Object.values(newTempStates)}
                // statuses={tempStates}
                styles={{
                    backgroundColor: 'transparent',
                    color: color
                }}
                color={color}
            />
        )
        tempCustomTree[0].title = (
            <CustomTreeTitle
                id={id}
                title="Все объекты"
                color={color}
                // title={`Все ${treeStore.trackId === 'lastOpened' ? 'устройства' : 'объекты'}`}
                // title={
                //     `Все ${treeStore.trackId === 'lastOpened' 
                //         ? `устройства объекта "${selectCurrObject(treeStore.lastTrackedObjectId).name}"`
                //         : 'объекты'}
                //     `
                // }
                statuses={groupedTempStates}
                // statuses={Object.values(newTempStates)}
                // statuses={tempStates}
                styles={{
                    backgroundColor: 'transparent',
                    color: color
                }}
            />
        )

        setTreeState((state) => ({
            ...state,
            defaultTree: tempDefaultTree,
            customTree: tempCustomTree,
            availableClassifiers: tempClassifiers,
        }))

        setIsBuild(true)
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsBuild(false)
            buildTree()
        }, 0)

        return () => {
            clearTimeout(timeout)
        }
    }, [
        objectsStoreState,
        // rawObjects.length,
        treeStore.classIds,
        treeStore.visibleClassIds,
        treeStore.intermediateClassIds,
        treeStore.parentTrackedClasses,
        objectCount,
        treeStore.trackId,
        treeStore.chosenClassifiers,
        treeStore.groupingOrder,
        groupingOrder,
        treeStore.searchValue,
        treeStore.lastTrackedObjectId,
        treeStore.showHierarchy,
        treeStore.treeObjectFilter,
    ])

    const renderTree = () => {
        const isDefault = [
            treeStore.searchValue !== '',
            treeStore.chosenClassifiers?.[id] &&
            Object.values(treeStore.chosenClassifiers).reduce((sum, classifier) => {
                return sum + classifier.children.length
            }, 0) > 0,
            groupingOrder?.length > 0,
            // treeStore.groupingOrder?.length > 0,
        ].every(setting => setting === false)

        return isDefault
            ? treeState.defaultTree
            : treeState.customTree
    }

    return (
        <Col
            style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                padding: 16,
                // backgroundColor: theme?.components?.tree?.showcase?.backgroundColor || '#fff',
                borderRadius: theme?.components?.tree?.showcase?.borderRadius || 16,
                // border: `1px solid ${theme?.components?.tree?.showcase?.borderColor || '#fff'}`,
                boxShadow: 'rgba(0, 0, 0, 0.4) 0px 0px 8px',
                background: background
            }}
        >
            <TreeHeader
                availableClassifiers={treeState.availableClassifiers}
                id={id}
            />
            <TreeSearch id={id} />
            <Divider style={{ margin: '14px 0' }} />
            <div
                style={{
                    height: height - 141,
                    overflow: isShowHorizontalScroll ? 'auto' : 'hidden',
                }}
            >
                <IsBuildTree isBuild={isBuild}>
                    <IsNotEmptyTree
                        isNotEmpty={renderTree().length > 0 && renderTree()[0].children.length > 0}
                    >
                        <DirectoryTree
                            style={{
                                color: color,
                                width: '650px',
                                backgroundColor: background,
                            }}
                            treeData={renderTree()}
                            virtual={true}
                            // 141 - 15 высота остального содержимого виджета дерева минус паддинги, чтобы избежать
                            height={height - 141 - 15}
                            onExpand={onExpand}
                            defaultExpandAll
                            defaultExpandedKeys={treeStore.expandedKeys}
                            expandedKeys={treeStore.expandedKeys}
                            onSelect={(selectedKeys, e) => {
                                const key = String(e.node.key).split('-')
                                const objectId = key[key.length - 1]

                                if (!e.node.children) { // если это не тайтл, а нода, тогда переходим
                                    navigate(getURL(
                                        `${ROUTES.OBJECTS}/${ROUTES_COMMON.SHOW}/${objectId}`,
                                        'showcase'
                                    ))
                                    // navigate(`/${ROUTES.OBJECTS}/${ROUTES_COMMON.SHOW}/${objectId}`)
                                }
                            }}
                        />
                    </IsNotEmptyTree>
                </IsBuildTree>
            </div>
        </Col>
    )
}
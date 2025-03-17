import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { FC, useEffect, useMemo, useRef, useState } from 'react'
import networkgraph from 'highcharts/modules/networkgraph'
import {
    checkValidCoordPosition,
    createChartOptions,
    createNode,
    getNodeColorsWithStacks,
    getRandomPosition
} from './utils'
import { useCables, useCables2 } from '@shared/hooks/useCables'
import ObjectCardModal from '@features/objects/ObjectCardModal/ObjectCardModal'
import { useAccountStore } from '@shared/stores/accounts';
import { getStateViewParamsFromEntity } from '@shared/utils/states';
import { initialArrType } from '../NetworkMap/data';
import { ContextMenu } from './components/ContextMenu';
import { usePatchConfig } from '@containers/accounts/AccountsTableContainer/hooks';
import { useApi2 } from '@shared/hooks/useApi2';
import { getConfigByMnemo } from '@shared/api/Config/Models/getConfigByMnemo/getConfigByMnemo';
import { initialConfigContext, mnemo, SUPER_ADMIN } from './data';
import { CoordinateContextType, coordTooltipLineInitial, IObjectCableMap } from './types';
import { jsonParseAsObject } from '@shared/utils/common';
import { postConfig } from '@shared/api/Config/Models/postConfig/postConfig';
import { Flex, Spin } from 'antd';
import { TooltipLine } from './components/TooltipLine';
import { useWindowResize } from '@shared/hooks/useWindowResize';
import { Toolbar } from './components/Toolbar';
import { selectStateEntities, useStateEntitiesStore } from '@shared/stores/state-entities';
import { ButtonEditRow } from '@shared/ui/buttons';

networkgraph(Highcharts);

export enum SettingsMnemo {
    TEXT_SIZE = 'text_size',
    TEXT_COLOR = 'text_color',
    LINE_COLOR = 'line_color',
    ON_STATUS = 'on_status'
}

const ObjectCableMap: FC<IObjectCableMap> = ({
    //paintCablesByState,
    height,
    cablesPortsDevices,
    parentObject,
    cableClasses = [],
    childClassesIds = [],
    targetClassesIds = [],
    relationsCablePort = [],
    relationsPortDevice = [],
    attributes,
    mnemoMapCore,
    backgroundColorMap = '#FFF',
    devicesClasses = [],
    portClasses = []
}) => {
    const chartComponent = useRef<HighchartsReact.RefObject>(null);
    const role = useAccountStore().store.data.user.role.name

    const isEdit = useMemo(() => (role === SUPER_ADMIN && mnemoMapCore), [role, mnemoMapCore])

    const refParent = useRef<any>()

    const windowDimensions = useWindowResize()

    const standartUserConfigCreating = useApi2(postConfig, { onmount: 'item' })
    //------ Для позиций точек ----------//
    const standartUserConfig = useApi2(() => getConfigByMnemo(mnemoMapCore))
    const standartUserConfigUpdating = usePatchConfig(mnemoMapCore ?? mnemo)

    const [coordinateContext, setCoordinateContext] = useState<CoordinateContextType>(initialConfigContext)
    const [coordTooltipLine, setCoordTooltipLine] = useState<coordTooltipLineInitial>({ x: 0, y: 0, content: [] })
    const [selectAllObject, setSelectAllObject] = useState<{ name: string, id: number }[]>([])
    const [selectedDeviceId, setSelectedDeviceId] = useState<number | undefined>(undefined)

    const [tempChanges, setTempChanges] = useState<{ x?: number; y?: number }>({})

    const [positions, setPositions] = useState<initialArrType[]>([])
    const [savedPositions, setSavedPositions] = useState<initialArrType[]>([])

    const [showContext, setShowContext] = useState<boolean>(false)
    const [showTooltipLine, setShowTooltipLine] = useState<boolean>(false)
    const [textColor, setTextColor] = useState<string>('')
    const [textSize, setTextSize] = useState<number>(10)
    const [lineColor, setLineColor] = useState<string>('')
    const [switchStatus, setSwitchStatus] = useState<boolean>(false)
    const [newNodes, setNewNodes] = useState<any[]>(undefined)
    const [newData, setNewData] = useState<any[]>(undefined)
    const [chartOptions, setChartOptions] = useState<any>(undefined)
    //const [states, setStates] = useState<IStateEntities | undefined>(undefined)
    const states = useStateEntitiesStore(selectStateEntities)



    //&Тестутирую новый хук по поиску кабелей


    const DEVICES_CLASS_IDS = [
        10090, 10088, 10084, 10085, 10086
    ]

    const cables = useCables2({ parentObject: parentObject, 
        devicesClassIds: devicesClasses,
        portClassesIds: portClasses,
        cableClassesIds: cableClasses,
        widget: {     childClassesIds,
            cableClasses,
            targetClassesIds,
            relationsCablePort,
            relationsPortDevice,
            locationVisibleClassesIds: [],
            attributes },
        showWithoutDeviceB: false
    })

    const reserveCables = useCables(parentObject, {
        cableClasses,
        childClassesIds,
        targetClassesIds,
        relationsCablePort,
        relationsPortDevice,
        locationVisibleClassesIds: [],
        attributes
    })


    //&Тестутирую новый хук по поиску кабелей
    const nodesDataCables = useMemo(
        () =>
            cables.linkedDevices.length > 0
                ? cables.linkedDevices.filter(cb => cb.deviceB !== undefined)
                : reserveCables.cablesPortsDevices.filter(cb => cb.deviceB !== undefined),
        [cablesPortsDevices, cables, reserveCables]
    )

    useEffect(() => {
        if (newNodes) {
            const newOptions = getChartOptions()

            if (chartOptions && chartComponent?.current?.chart) {
                const chart = chartComponent.current.chart

                if (chart?.series?.length > 0) {
                    chart?.series?.reduceRight((acc, serie, idx) => {
                        chart?.series[idx]?.remove()

                        return acc
                    }, {})
                }

                newOptions.series?.map((serie) => {
                    chart?.addSeries(serie)
                })

                return
            }

            setChartOptions(newOptions)
        }
    }, [newNodes, isEdit, switchStatus, textSize, textColor, newData, windowDimensions, positions])

    
    const [editPosition, setEditPosition] = useState<{x: number, y: number}>(null)
    const showContextModal = (e, point, indexPoint) => {
        setShowContext(true)
        const rect = e?.target?.getBoundingClientRect()

        //setEditPosition(positions[indexPoint])
        //const indexPoint = positions.findIndex((item) => Number(item.id) === Number(point.id))

        setCoordinateContext({
            top: rect?.top,
            left: rect?.left,
            bottom: rect?.bottom,
            right: rect?.right,
            width: rect?.width,
            height: rect?.height,
            id: point?.id,
            name: point?.name,
            oldCoordinatePoint: { top: point?.plotY, left: point?.plotX },
            indexPosition: indexPoint
        })
    }
    
    const getChartOptions = (): any => {
        return createChartOptions({
            nodes: newNodes,
            data: newData,
            role,
            windowDimensions,
            backgroundColorMap,
            textSize,
            textColor,
            switchStatus,
            onClick(e, allNodes, type) {
                const point = type === 'link' ? e?.custom?.cable : e?.point

                if (!!allNodes && allNodes?.length > 1) {
                    const hashPositions = positions.reduce((acc, pos, currentIndex) => {
                        return { ...acc, [pos.id]: currentIndex }
                    }, {})

                    setSelectAllObject(allNodes.map((node) => ({
                        ...node,
                        extraComponent: (isEdit) 
                            ? 
                            <ButtonEditRow 
                                onClick={(clickE) => {
                                    showContextModal(
                                        clickE,
                                        { ...point, id: node.id, name: node.name },
                                        hashPositions?.[node.id]
                                    )
                                }}
                            />
                            : undefined
                    })))
                } else {
                    setSelectedDeviceId(point?.id)
                }
            },
            onContextMenu(e, point) {
                if (isEdit) {
                    showContextModal(e, point, positions.findIndex((item) => Number(item.id) === Number(point.id)))
                }
            },
            onMouseOver(lines, coord) {
                setShowTooltipLine(true)
                setCoordTooltipLine({ ...coord, content: lines })
            },
            onMouseOut() {
                setShowTooltipLine(false)
            },
            initialDataMap: positions
        })
    }

    useEffect(() => {
        if (states && positions.length > 0) {
            const updatedNewNodes = []
            const updatedNewData = []
            const stackColors = getNodeColorsWithStacks(positions)
            const uniqNodesData = {
                nodes: new Set([]),
                data: new Set([]),
            }

            nodesDataCables.forEach((cable: any) => {
                const { deviceA, deviceB } = cable;

                for (const device of [cable.deviceA, cable.deviceB]) {

                    if (uniqNodesData.nodes.has(device.id)) { continue }
                    const node = createNode(device, 42, stackColors?.[device.id])

                    uniqNodesData.nodes.add(device.id)
                    updatedNewNodes.push(node)
                }

                const cableHash = `${deviceA?.id}_${deviceB?.id}`
                const newData = {
                    from: `${deviceA?.id}`,
                    to: `${deviceB?.id}`,
                    // color: cableColors[paintCablesByState ? cable?.id : cable.class_id],
                    color: switchStatus ? '#cccccc' : lineColor ? lineColor : '#cccccc',
                    custom: {
                        cable: cable?.cable ?? 'Нет информации о кабеле',
                        color: getStateViewParamsFromEntity(cable.class_id, 'objects')?.fill ?? 'grey',
                    }
                }

                uniqNodesData.data.add(cableHash)
                updatedNewData.push(newData)
            })

            if (largeJson(newData) !== largeJson(updatedNewData)) {
                setNewData(updatedNewData)
            }

            if (largeJson(newNodes) !== largeJson(updatedNewNodes)) {
                setNewNodes(updatedNewNodes)
            }
        }
    }, [nodesDataCables, positions, states, lineColor])

    const largeJson = (data) => {
        if (data) {
            let out = '[';

            for (let indx = 0; indx < data.length - 1; indx++) {
                out += JSON.stringify(data[indx]) + ',';
            }
            out += JSON.stringify(data[data.length - 1]) + ']';

            return out
        }

        return '[]'
    }
    
    //Получаем координаты из конфига или создаем рандомные
    useEffect(() => {
        if (!standartUserConfig.loading && !positions.length) {
            const nodes = nodesDataCables.flatMap(({ deviceA, deviceB }) => [
                { id: deviceA.id },
                { id: deviceB.id }
            ])
            const newNodesIds = [...new Set(nodes.map((item) => Number(item.id)))]

            const tmp = jsonParseAsObject(standartUserConfig.data.value) as {
                positions?: initialArrType[],
                settings?: any
            }

            if (Object.keys(tmp.settings || {}).length) {
                const setting = tmp.settings

                setTextColor(setting.textColor)
                setTextSize(setting.textSize)
                setLineColor(setting.lineColor)
                setSwitchStatus(setting?.switchStatus || false)
            }

            //TODO: Поддержка старого формата - потом убрать Array.isArray(tmp)
            if (Array.isArray(tmp) || Array.isArray(tmp.positions) && !positions.length) {

                if (Array.isArray(tmp)) {
                    const newPosition = checkValidCoordPosition(newNodesIds, tmp)

                    setPositions(newPosition)
                } else {
                    const newPosition = checkValidCoordPosition(newNodesIds, tmp.positions)

                    setPositions(newPosition)
                }

                return
            }

            if (!standartUserConfig.data.value && !positions.length && !!nodes.length) {
                const parentSize = refParent?.current?.getBoundingClientRect()
                const newPosition = getRandomPosition(parentSize, newNodesIds)

                return setPositions(newPosition)
            }
        }
    }, [standartUserConfig.data.value, savedPositions, nodesDataCables, refParent, standartUserConfig.loading])

    //Текущие значения при открытии модалки
    useEffect(() => {
        if (coordinateContext) {
            const currentPoint = positions[coordinateContext.indexPosition]

            setTempChanges({ x: currentPoint?.x, y: currentPoint?.y })
        }
    }, [coordinateContext, positions])

    const closeContextMenu = () => {
        setShowContext(false)
    }
    /**
     * Получаем координаты из модалки контекст меню
     * @param name позиция top - left (x - y)
     * @param value - значение
     */
    const handleChangeContext = (name: string, value: string) => {

        if (name === 'top') {
            setTempChanges(prevState => ({
                ...prevState,
                y: Number(value)
            }))
        }

        if (name === 'left') {
            setTempChanges(prevState => ({
                ...prevState,
                x: Number(value)
            }))
        }
    }

    const handleSaveChanges = (newPosition?: { x: number, y: number }) => {
        const newPositions = [...positions]

        newPositions[coordinateContext.indexPosition].x = Number(newPosition.x)
        newPositions[coordinateContext.indexPosition].y = Number(newPosition.y)

        setTempChanges(newPosition)
        setSavedPositions(newPositions)
        //setPositions(newPositions)
        setShowContext(false)
    }

    //Закрыть контекст меню
    const cancelContextMenu = () => {
        const newPositions = [...positions]

        newPositions[coordinateContext.indexPosition].y = coordinateContext.oldCoordinatePoint.top
        newPositions[coordinateContext.indexPosition].x = coordinateContext.oldCoordinatePoint.left
        setSavedPositions(newPositions)
        setShowContext(false)
    }

    /**
     * Получаем изменения из тулбара
     * @param value
     * @param key
     */
    const handleChangeSettings = <T extends string | number | boolean>(value: T, key: SettingsMnemo): void => {
        if (key === SettingsMnemo.TEXT_COLOR && typeof value === 'string') {
            setTextColor(value)
        }

        if (key === SettingsMnemo.TEXT_SIZE && typeof value === 'number') {
            setTextSize(value)
        }

        if (key === SettingsMnemo.LINE_COLOR && typeof value === 'string') {
            setLineColor(value)
        } 

        if (key === SettingsMnemo.ON_STATUS && typeof value === 'boolean') {
            setSwitchStatus(value)
        }
    }

    const saveMap = async () => {
        const settings = {
            textColor,
            textSize,
            lineColor,
            switchStatus
        }

        if (standartUserConfig?.data?.value) {
            await standartUserConfigUpdating.request({
                value: JSON.stringify({
                    positions,
                    settings
                })
            })
        } else {
            await standartUserConfigCreating.request({
                mnemo: mnemoMapCore ?? mnemo,
                value: JSON.stringify({
                    positions,
                    settings
                })
            })
        }
    }

    return (
        standartUserConfig.loading
            ? (
                <Flex
                    justify="center"
                    align="center"
                    style={{
                        height: '70vh'
                    }}
                >
                    <Spin />
                </Flex>
            )
            : (
                <div
                    style={height
                        ? { height }
                        : { height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}
                    ref={refParent}
                >
                    {isEdit && (
                        <Toolbar
                            handleChangeSettings={handleChangeSettings}
                            loading={standartUserConfigUpdating.loading}
                            saveMap={saveMap}
                            lineColor={lineColor}
                            textColor={textColor}
                            textSize={textSize}
                            switchStatus={switchStatus}
                        />
                    )}
                    <div style={{ flex: 1 }}>
                        {chartOptions && !!positions.length && !!newNodes.length && (
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={chartOptions}
                                containerProps={
                                    {
                                        style: height
                                            ? { height }
                                            : { height: '100%' }
                                    }
                                }
                                ref={chartComponent}
                                updateArgs={[true]}
                                oneToOne={true}
                            />
                        )}
                    </div>

                    <ObjectCardModal
                        objectId={selectedDeviceId}
                        listObject={selectAllObject}
                        modal={{
                            open: Boolean(selectAllObject.length) || Boolean(selectedDeviceId),
                            onCancel: () => {
                                setSelectedDeviceId(undefined)
                                setSelectAllObject([])
                            }
                        }}
                    />
                    {isEdit && showContext && (
                        <ContextMenu
                            coordinateContext={coordinateContext}
                            tempChanges={tempChanges}
                            handleChangeContext={handleChangeContext}
                            cancelContextMenu={cancelContextMenu}
                            closeContextMenu={closeContextMenu}
                            handleSaveChanges={handleSaveChanges}
                        />
                    )}
                    {showTooltipLine && (
                        <TooltipLine
                            coordTooltipLine={coordTooltipLine}
                            setVisible={setShowTooltipLine}
                        />
                    )}
                </div>
            )
    )
}

export default ObjectCableMap;
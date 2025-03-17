import { useGetObjects } from '@shared/hooks/useGetObjects'
import { objectsStore, selectObjects } from '@shared/stores/objects'
import { SimpleTable } from '@shared/ui/tables'
import { bestTextColor } from '@shared/utils/common'
import { Col } from 'antd'

import { FC, useEffect, useLayoutEffect, useRef, useState } from 'react'

interface IObjectRoomsWithDevicesTable {
    buildingClassId: number
    buildingsIds?: number[]
    relationFloorBuildings?: number
    relationRoomFloor?: number
    relationStandRoom?: number
    relationsDevicesUnit?: number[]
    relationStandUnit?: number
       height?: number
}

const colors = ['red', 'green', 'yellow', 'grey']

const columns = [
    {
        title: '',
        dataIndex: 'building',
        onCell: (item) => {
            return { rowSpan: item.rowSpanBuilding?.props?.title }
        },
    },
    {
        title: 'Этаж',
        dataIndex: 'floor',
        render: (_, record) => {
            return <>{record.floor}</>
        },
        onCell: (item) => {
            return { rowSpan: item.rowSpanFloor?.props?.title }
        },
    },
    {
        title: 'Помещение',
        dataIndex: 'room',
        render: (_, record) => {
            return <>{record.room}</>
        },
    },

    {
        title: 'Всего',
        dataIndex: 'devices',
    },
    {
        title: 'Норма',
        dataIndex: 'normal',
    },
    {
        title: 'Отклонение',
        dataIndex: 'reject',
    },
    {
        title: 'Нарушение',
        dataIndex: 'violation',
    },
]
const ObjectRoomsWithDevicesTable: FC<IObjectRoomsWithDevicesTable> = ({
    buildingClassId,
    buildingsIds,
    relationFloorBuildings,
    relationRoomFloor,
    relationStandRoom,
    relationsDevicesUnit,
    relationStandUnit,
    height
}) => {
    const [rows, setRows] = useState<any[]>([])
    const objects = useGetObjects()
    const buildingsObjects = buildingsIds
        ? objects.filter((obj) => obj.class_id == buildingClassId).filter((obj) => buildingsIds.includes(obj.id))
        : objects.filter((obj) => obj.class_id == buildingClassId)

    const [clientHeight, setClientHeight] = useState(0)
    const ref = useRef(null)
    
    useLayoutEffect(() => {
        setClientHeight(ref.current.clientHeight)
    }, [])

    const getRandomInt = (max) => {
        return Math.floor(Math.random() * max)
    }

    useEffect(() => {
        const localRows: any = []

        buildingsObjects.forEach((build, index) => {
            const floors = build.links_where_right.filter((link) => relationFloorBuildings == link.relation_id)
            let roomsCount = 0


            floors.forEach((floor, indexFloor) => {
                const currentFloor = objects.find((obj) => obj.id == floor.left_object_id)
                const rooms = currentFloor?.links_where_right.filter((link) => relationRoomFloor == link.relation_id)

                roomsCount += rooms?.length
                rooms.forEach((room, indexRoom) => {
                    const currentRoom = objects.find((obj) => obj.id == room.left_object_id)

                    let roomDevices = 0
                    const stands = currentRoom?.links_where_right.filter(
                        (link) => relationStandRoom == link.relation_id
                    )

                    stands.forEach((stand) => {
                        const currentStand = objects.find((obj) => obj.id == stand.left_object_id)

                        const units = currentStand?.links_where_right.filter(
                            (link) => relationStandUnit == link.relation_id
                        )

                        units.forEach((unit) => {
                            const currentStand = objects.find((obj) => obj.id == unit.left_object_id)
                            const devices = currentStand?.links_where_right.filter((link) =>
                                relationsDevicesUnit.includes(link.relation_id)
                            )

                            roomDevices = devices?.length
                            devices.forEach((device) => {
                                const currentDevice = objects.find((obj) => obj.id == device.left_object_id)
                            })
                        })
                    })

                    const randomDevices = getRandomInt(150)
                    const randomNormal = getRandomInt(randomDevices)
                    const randomReject = getRandomInt(randomNormal)
                    const violation = randomDevices - randomNormal - randomReject

                    localRows.push({
                        building: build.name,
                        floor: currentFloor?.name,
                        room: 
                        <div
                            style={{ background: colors[getRandomInt(3)],
                                color: bestTextColor(colors[getRandomInt(3)]) }}
                        >{currentRoom?.name}
                        </div>,
                        devices: roomDevices,
                        rowSpanBuilding: indexFloor == 0 && indexRoom == 0 ? 'roomsCount' : 0,
                        rowSpanFloor: indexRoom == 0 ? rooms?.length : 0,
                        // normal: ,
                        // reject: ,
                        // violation: ,
                    })
                })
            })

            if (localRows?.[index]?.rowSpanBuilding !== 0 && localRows?.[index]?.rowSpanBuilding) {
                localRows[index].rowSpanBuilding = roomsCount
            }
        })

        setRows(localRows)
    }, [])

    return (
    
        <Col
            ref={ref}
            span={24}
            style={
                height
                    ? {
                        padding: '5px',
                        height: `${height}px`,
                        overflowY: clientHeight > Number(height) ? 'scroll' : 'auto',
                        overflowX: clientHeight > Number(height) ? 'clip' : 'auto',
                        textAlign: 'center',
                    }
                    : { padding: '5px', textAlign: 'center' }
            }
        >
            <SimpleTable columns={columns} rows={rows} />
    
        </Col>)
}

export default ObjectRoomsWithDevicesTable
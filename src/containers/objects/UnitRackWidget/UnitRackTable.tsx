import { Table, Tag } from 'antd'
import { FC, useEffect, useMemo, useState } from 'react'
import { StateLabel } from '@entities/states/StateLabels'
import { IState } from '@shared/types/states'
import { ColumnsType, TableProps } from 'antd/es/table'
import { useOpen } from '@shared/hooks/useOpen'
import ObjectCardModal from '@features/objects/ObjectCardModal/ObjectCardModal'
import { IUnit } from './types'

interface IUnitRackTable extends TableProps<any> {
    units: IUnit[]
    stateLabelWidth?: number
    rackSize: number
    compact?: boolean
    unitsDirection?: 'direct' | 'reverse'
}

export const UnitRackTable: FC<IUnitRackTable> = ({ 
    units, 
    stateLabelWidth, 
    rackSize,
    compact,
    unitsDirection,
    ...props 
}) => {
    const mergeValue = new Set();

    useEffect(() => {
        mergeValue.clear();
    }, []);

    const columns: ColumnsType<any> = useMemo(() => [
        { 
            key: 'unit', 
            dataIndex: 'unit', 
            align: 'center',
            width: 40,
            render: (value) => {
                return (
                    <Tag style={{ width: '30px', textAlign: 'center' }}>
                        {value}
                    </Tag>
                )
            },
        },
        { 
            key: 'device', 
            dataIndex: 'device',
            onCell: (record) => {                

                return {
                    rowSpan: record.size,
                }
            },            
            
            render(_v, record) {
                const device = units.find((unit) => unit.order === record.unit)?.device

                return device?.state
                    ? (
                        <StateLabel 
                            title={record?.device}
                            maxWidth
                            state={device?.state as IState} 
                            wrapperStyles={{
                                width: stateLabelWidth,                                
                                minHeight: device?.size * 32,
                                display: 'flex',
                                alignItems: 'center'
                            }}
                            onClick={() => setObjectModalId(device?.id)}
                        >
                            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {record.device !== null ? record.device : ''}
                            </div>
                        </StateLabel>
                    ) 
                    : (
                        <div
                            style={{ userSelect: 'none' }}
                            onClick={() => setObjectModalId(device?.id)}
                        >
                            {record.device !== null ? record.device : ''}
                        </div>
                    )
            }, 
        }
    ], [units])

    const { isOpen: modalVisible, close: closeModal, open: openModal } = useOpen()
    const [ objectModalId, setObjectModalId ] = useState(0)

    useEffect(() => {
        if (objectModalId) {
            openModal()
        }
    }, [objectModalId])

    const devicesInRack = new Array(rackSize || 0).fill(null).map((_, i) => {
        const unit = unitsDirection === 'direct' ? (i + 1) : (rackSize - i)

        return { unit, device: undefined, key: `unit-in-rack-${unit}`, size: 1 }
    })

    devicesInRack.forEach((unit, i) => {
        const device = units?.find((d) => d.order === unit.unit)?.device

        if (device) {
            // Обогащаем данные из units
            devicesInRack[i] = { 
                ...devicesInRack[i],
                device: device.name,
                size: device.size }
    
            // Рассчитываем и устанавливаем size для следующих элементов
            for (let j = 1; j < device.size; j++) {
                devicesInRack[i + j] = { ...devicesInRack[i + j], size: 0 }
            }
        }
    })

    const handleClose = () => {
        closeModal()
        setObjectModalId(0)
    }

    return (
        <>
            <ObjectCardModal objectId={objectModalId} modal={{ open: modalVisible, onCancel: handleClose }} />
            <Table
                rowClassName={(record) => (record?.device && !compact) ? 'rack-colored-unit' : ''}
                showHeader={false}
                pagination={false}
                columns={columns}
                dataSource={devicesInRack}
                {...props}
            />
        </>
    )
}
import { Table, Tag } from 'antd'
import { FC, ReactElement, useEffect, useMemo } from 'react'
import { IState } from '@shared/types/states'
import { ColumnsType, TableProps } from 'antd/es/table'
import { useTheme } from '@shared/hooks/useTheme'
import { useAccountStore, selectAccount } from '@shared/stores/accounts'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import { generalStore } from '@shared/stores/general'

interface IUnitRackTable extends TableProps<any> {
    devices: IDevice[]
    stateLabelWidth?: number
    rackSize: number
    compact?: boolean
    unitsDirection?: 'direct' | 'reverse'
    onDeviceClick?: (deviceId: number) => void
}

export interface IDevice {
    id: number
    name: string
    size: number
    order: number
    classId?: number
    state?: IState | undefined
    component?: ReactElement
}

export const UnitRackTable: FC<IUnitRackTable> = ({
    devices,
    rackSize,
    compact,
    unitsDirection,
    onDeviceClick,
    ...props
}) => {
    const mergeValue = new Set()

    useEffect(() => {
        mergeValue.clear()
    }, [])

    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode

    const interfaceView = generalStore((st) => st.interfaceView)
    const isShowcase = interfaceView === 'showcase'

    const color = isShowcase ? createColorForTheme(theme?.textColor, theme?.colors, themeMode) || '#000000' : '#000000'
    const background = isShowcase
        ? createColorForTheme(theme?.backgroundColor, theme?.colors, themeMode) || '#ffffff'
        : '#ffffff'

    const generateRowClassName = () => {
        return `
            .custom-row {
                background-color: ${background} !important;
                color: ${color} !important;
            }
            .custom-row td {
                color: ${color} !important;
            }
        `
    }
    const columns: ColumnsType<any> = useMemo(
        () => [
            {
                key: 'unit',
                dataIndex: 'unit',
                align: 'center',
                width: 40,
                render: (value) => {
                    return <Tag style={{ width: '30px', textAlign: 'center' }}>{value}</Tag>
                },
            },
            {
                key: 'device',
                dataIndex: 'device',
                onCell: (record) => {
                    return {
                        rowSpan: record?.size,
                    }
                },

                render(_v, record) {
                    const device = devices.find((device) => device.order === record.unit)

                    return (
                        device?.component ?? (
                            <div style={{ userSelect: 'none' }} onClick={() => onDeviceClick(device?.id)}>
                                {record.device !== null ? record.device : ''}
                            </div>
                        )
                    )
                },
            },
        ],
        [devices]
    )

    const devicesInRack = new Array(rackSize || 0).fill(null).map((_, i) => {
        const unit = unitsDirection === 'direct' ? i + 1 : rackSize - i

        return { unit, device: undefined, key: `unit-in-rack-${unit}`, size: 1 }
    })

    devicesInRack.forEach((unit, i) => {
        const device = devices?.find((d) => d.order === unit.unit)

        if (device) {
            // Обогащаем данные из units
            devicesInRack[i] = {
                ...devicesInRack[i],
                device: device.name,
                size: device.size,
            }

            // Рассчитываем и устанавливаем size для следующих элементов
            for (let j = 1; j < device.size; j++) {
                devicesInRack[i + j] = { ...devicesInRack[i + j], size: 0 }
            }
        }
    })

    return (
        <div>
            <style>{generateRowClassName()}</style>
            <Table
                rowClassName={(record) => (record?.device && !compact ? 'rack-colored-unit custom-row' : 'custom-row')}
                showHeader={false}
                pagination={false}
                columns={columns}
                dataSource={devicesInRack}
                {...props}
            />
        </div>
    )
}
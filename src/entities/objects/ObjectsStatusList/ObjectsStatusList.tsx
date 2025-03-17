import { useTheme } from '@shared/hooks/useTheme'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { generalStore } from '@shared/stores/general'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import { useEffect, useState } from 'react'
import StatusItem from './StatusItem'
import { getObjectsStatuses } from '@shared/api/Objects/Models/getObjectsStatuses/getObjectsStatuses'
import { ECLoader } from '@shared/ui/loadings'

const mockData = {
    objects: {
        '1': { mnemo: 'connected', label: 'Подключено', color: '#3d95e7', objects_count: '51 272' },
        '2': { mnemo: 'withotEvents', label: 'Без событий', color: '#4bb462', objects_count: '49 243' },
        '3': {
            mnemo: 'disconnected', label: 'С недоступностью', color: '#d8352c', objects_count: 797,
            reasons: [
                { label: 'ЭП', count: 41 },
            ]
        },
        '4': { mnemo: 'ppr', label: 'Объекты с ППР', color: '#9651a0', objects_count: 1 },
        '5': { mnemo: 'closed', label: 'Ремонт или стоп-фактор', color: '#e8bb4b', objects_count: '1 231' },
    },
    channels: {
        '1': { mnemo: 'connected', label: 'Подключено', color: '#3d95e7', objects_count: '50 272' },
        '2': { mnemo: 'withotEvents', label: 'Без событий', color: '#4bb462', objects_count: '48 243' },
        '3': {
            mnemo: 'disconnected', label: 'С недоступностью', color: '#d8352c', objects_count: 770,
            reasons: [
                { label: 'ЭП', count: 41 },
            ]
        },
        '4': { mnemo: 'ppr', label: 'Объекты с ППР', color: '#9651a0', objects_count: 1 },
        '5': { mnemo: 'closed', label: 'Ремонт или стоп-фактор', color: '#e8bb4b', objects_count: '1 207' },
    },
    ground_based: {
        '1': { mnemo: 'connected', label: 'Подключено', color: '#3d95e7', objects_count: 512 },
        '2': { mnemo: 'withotEvents', label: 'Без событий', color: '#4bb462', objects_count: 502 },
        '3': {
            mnemo: 'disconnected', label: 'С недоступностью', color: '#d8352c', objects_count: 47,
            reasons: [
                { label: 'ЭП', count: 41 },
            ]
        },
        '4': { mnemo: 'ppr', label: 'Объекты с ППР', color: '#9651a0', objects_count: 0 },
        '5': { mnemo: 'closed', label: 'Ремонт или стоп-фактор', color: '#e8bb4b', objects_count: 11 },
    },
    objects_available: 98.1, // в процентном соотношении
}

type GroupKeys = 'objects' | 'satellite' | 'ground_based'

type StatusesKeys = 'connected' | 'no_events' | 'ppr' | 'stop_factor'

export type IStatus = {
    label: string
    color: string
    value: number
    children?: Record<string, IStatus>
}

type StatusObject = Record<StatusesKeys, IStatus>

type StatusesObjects = Record<GroupKeys, StatusObject> & { objects_available: number }


const ObjectsStatusList = ({ statuses }: { statuses: StatusesObjects }) => {
    //* Настройки темы
    const interfaceView = generalStore((st) => st.interfaceView)
    const isShowcase = interfaceView === 'showcase'
    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode
    const textColor = isShowcase ? createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode) : 'black'
    const backgroundColor = isShowcase
        ? createColorForTheme(theme?.widget?.background, theme?.colors, themeMode)
        : 'white'

    const [openReason, setOpenReason] = useState({})

    //* Подготовка данных
    // Получение мнемоник и цвето статусов
    // Получение оъектов

    const toggleReason = (statusType) => {
        setOpenReason((prev) => ({ ...prev, [statusType]: !prev[statusType] }))
    }

    const renderStatusGroup = (groupData: StatusObject, groupLabel, groupKey) => {
        return (
            <>
                <h3 style={{ color: textColor }}>{groupLabel}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', fontSize: 14, gap: 6 }}>
                    {Object.entries(groupData).map(([key, status]) => {
                        const statusType = `${groupKey}_${key}`

                        return (
                            <StatusItem
                                key={key}
                                mnemo={key}
                                status={status}
                                toggleReason={toggleReason}
                                openReason={openReason}
                                statusType={statusType}
                                textColor={textColor}
                            />
                        )
                    })}
                </div>
            </>
        )
    }

    return (
        <div style={{ backgroundColor }}>
            {statuses['objects'] && renderStatusGroup(statuses['objects'], 'Объекты', 'objects')}
            {statuses['ground_based'] && renderStatusGroup(statuses['ground_based'], 'Кабель', 'ground_based')}
            {statuses['satellite'] && renderStatusGroup(statuses['satellite'], 'Спутник', 'satellite')}

            <div
                style={{
                    height: 140,
                    width: 140,
                    borderRadius: 150,
                    border: '10px solid orange',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 50,
                    background: '#2e3d56',
                }}
            >
                <span style={{ color: textColor, fontSize: 15 }}>Доступно</span>
                <span style={{ color: textColor, fontSize: 28, fontWeight: 700 }}>
                    {statuses?.objects_available}%
                </span>
                <span style={{ color: textColor, fontSize: 15 }}>Объектов</span>
            </div>
        </div>
    )
}

export default ObjectsStatusList
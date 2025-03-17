import HorizontalTimeBarChart from '@entities/stats/ValuesHistoryAggregationWidget/components/HorizontalTimeBarChart'
import { getObjectStateHistory } from '@shared/api/Objects/Models/getObjectStateHistory/getObjectStateHistory'
import { useApi2 } from '@shared/hooks/useApi2'
import { selectStates, useStatesStore } from '@shared/stores/states'
import { Col, Row, Spin } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { FC, useEffect, useState } from 'react'

export interface IStateHistoryProps {
    settings?: {
        targetEntity?: 'object' | 'object_attribute'
        entityId?: number
        updatingInterval?: number
        period?: [Dayjs, Dayjs]
    }
}

/**
 * График истории статусов
 * 
 * @param settings.targetEntity - выбор отображения статусов для объекта или атрибута объекта
 * @param settings.entityId - идентификатор объекта или атрибута объекта
 * @param settings.updatingInterval - время автообновления графика
 */
export const ObjectStateHistory: FC<IStateHistoryProps> = ({ settings }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const states = useStatesStore(selectStates)
    const autoUpdate = settings?.updatingInterval

    const [ initialLoading, setInitialLoading ] = useState(false)

    const statesHistory = useApi2(() => getObjectStateHistory(settings?.entityId, settings?.period), {
        autoUpdate,
        onmount: false,
    })

    useEffect(() => {
        if (settings?.entityId) {
            setInitialLoading(true)

            statesHistory.request().then(() => setInitialLoading(false))
        }
    }, [settings?.entityId, settings?.period])


    const chartData = statesHistory.data?.series?.map((bar) => ({
        title: `${bar.name}`,
        data: bar.data.map((barPart, i, arr) => {
            const state = states.find((st) => st.id === barPart.state_id)
            const defaultColor = 'rgba(0,0,0,0.05)'
            const isLast = i === arr.length - 1
            const now = dayjs().format('YYYY-MM-DD HH:mm:ss')

            return {
                title: state?.view_params?.name,
                color: state?.view_params?.params?.find(({ type }) => type === 'fill')?.value || defaultColor,
                start_dt: barPart?.time_in,
                end_dt: barPart?.time_out || (isLast ? now : arr[i + 1]?.time_in)
            }
        })
    }))

    return (
        <Row justify="center" align="middle" style={{ height: '100%', width: '100%' }}>
            {initialLoading 
                ? <Spin /> 
                : (chartData?.length === 0 
                    ? <Col>Нет данных</Col> 
                    : <HorizontalTimeBarChart data={chartData || []} />
                )}
        </Row>
    )
}
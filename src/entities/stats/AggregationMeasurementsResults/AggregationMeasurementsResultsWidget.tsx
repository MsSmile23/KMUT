import { SERVICES_STATS } from '@shared/api/Stats';
import { API_STATS_ENDPOINTS } from '@shared/api/Stats/settings';
import { useApi2 } from '@shared/hooks/useApi2';
import { useBool } from '@shared/hooks/useBool';
import { IStatsProps, ITopResponseData } from '@shared/types/stats';
import { ECTableWithProgressBar } from '@shared/ui/ECUIKit/tables/ECTableWithProgressBar';
import { ButtonExport } from '@shared/ui/buttons/ButtonExport/ButtonExport';

import { Button, Modal } from 'antd';
import { FC, useEffect } from 'react';

export interface IAggregationMeasurementsResultsWidgetProps extends IStatsProps {
    dataSource: typeof API_STATS_ENDPOINTS[number]
    regexp?: Partial<{ values: string, indexes: string }>
    view?: {
        type: 'progress',
        progress?: 'absolute' | 'percent' | 'perAndAbs',
    }
    limit?: number
    modal?: boolean 
    height?: string
}

/**
 * Виджет "Агрегированные результаты измерений"
 * 
 * @param height - высота таблицы топов
 * @param dataSource - источник данных
 * @param view.type - тип отображения таблицы
 * @param view.progress - вариант отображения значений в таблице с прогресс-баром
 * @param modal - отображать кнопку с модальным окном таблицы с полными данными
 * @param limit - максимальное количество выводимых строк
 */
export const AggregationMeasurementsResultsWidget: FC<IAggregationMeasurementsResultsWidgetProps> = ({
    source,
    attributeId,
    sourceObjectId,
    sourceClassId,
    targetClassId,
    targetObjectId,
    relationIds,
    regexp,

    height,
    dataSource,
    view,
    limit = undefined,
    modal
}) => {
    const [ modalOpen, modalTable] = useBool()
    // преобразовываем объект в строку без undefiend для запроса по apiQuery
    const payload = JSON.parse(JSON.stringify({
        source,
        attribute_id: attributeId,
        source_object_id: sourceObjectId,
        source_class_id: sourceClassId,
        target_class_id: targetClassId,
        target_object_id: targetObjectId,
        relation_ids: relationIds,
        values_post_regexp: regexp?.values,
        indexes_post_regexp: regexp?.indexes
    }))

    const foundDataSource = Object.entries(SERVICES_STATS.Models).find(([ src ]) => src === dataSource)[1]
    const measurements = useApi2(foundDataSource as any, { 
        onmount: false,
        state: { tops: [] as unknown as ITopResponseData['tops'] },
    })

    useEffect(() => {
        if (foundDataSource) {
            measurements.request(payload)
        }
    }, [foundDataSource])

    const tableProps = {
        loading: measurements.loading, 
        view: view?.progress || 'absolute' 
    }

    

    const data = Array.isArray(measurements?.data) 
        ? (measurements?.data || []) 
        : measurements?.data?.tops || []
    const limitedData = data.slice(0, limit)

    return (modal ? (
        <>
            <Button onClick={modalTable.setTrue}>Расширенная таблица</Button>
            <Modal centered width="90%" open={modalOpen} footer={null} onCancel={modalTable.setFalse}>
                <div style={{ marginTop: 20 }}>
                    <ButtonExport data={data} view={view.progress} />
                    <ECTableWithProgressBar key="modal-ext" data={data} {...tableProps} height={height} />
                </div>
            </Modal>
            <ECTableWithProgressBar data={limitedData} key="modal-limited" {...tableProps} height={height} />
        </>
    ) : (<ECTableWithProgressBar data={limitedData} key="single" {...tableProps} height={height} />))
}
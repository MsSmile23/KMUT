import { ObjectStateHistory } from '@entities/states/ObjectStateHistory/ObjectStateHistory';
import { FC } from 'react';
import { IWidgetObjectStateSettings } from './types';
import { getPeriod } from '@shared/utils/datetime';

/**
 * Виджета для отображения истории статусов
 * 
 * @param settings - объект с настройками виджета
 * @param settings.widget.objectId - id объекта, на основе которого формируются данные (например, устройство)
 * @param settings.widget - см. interface IStateHistoryProps
 */
const WidgetObjectStateHistory: FC<IWidgetObjectStateSettings> = ({ settings }) => {
    const chartSettings = settings?.widget?.settings || {}

    return (
        <ObjectStateHistory 
            settings={{
                targetEntity: chartSettings?.targetEntity,
                entityId: settings?.vtemplate?.objectId || chartSettings?.entityId,
                updatingInterval: chartSettings?.updatingInterval,
                period: getPeriod(chartSettings?.period)
            }} 
        />
    )
}

export default WidgetObjectStateHistory
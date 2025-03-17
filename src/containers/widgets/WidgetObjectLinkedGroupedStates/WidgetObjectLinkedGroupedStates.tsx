import { FC } from 'react';
import { ObjectLinkedGroupedStates } from '@entities/objects/ObjectLinkedGroupedStates/ObjectLinkedGroupedStates';
import { IObjectLinkedGroupedStatesSettings } from './types';

/**
 * Виджета для отображения здоровья сервисов
 * 
 * @param settings - объект с настройками виджета
 * @param settings.widget.objectId - id объекта, на основе которого формируются данные (например, устройство)
 * @param settings.widget - см. interface IStateHistoryProps
 */
const WidgetObjectLinkedGroupedStates: FC<IObjectLinkedGroupedStatesSettings> = ({ settings }) => {
    const ids = settings?.widget?.classesIds

    return (
        <div 
            style={{
                width: '100%',
            }}
        >
            <ObjectLinkedGroupedStates 
                objectId={settings?.vtemplate?.objectId} 
                classesIds={ids} 
                yAxisStep={settings?.widget?.yAxisStep}
            />
        </div>
    )
}

export default WidgetObjectLinkedGroupedStates
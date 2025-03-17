import { FC } from 'react';
import { IWidgetObjectLinkedObjectsRackViewSettingsProps } from './types';
import { ObjectLinkedObjectsRackView } from '@entities/objects/ObjectLinkedObjectsRackView/ObjectLinkedObjectsRackView';
import { forumThemeConfig } from '@app/themes/forumTheme/forumThemeConfig';

/**
 * Виджет отображения сгруппированных и одиночных стоек
 * 
 * @param settings - объект с настройками виджета
 * @param settings.widget.objectId - id объекта, на основе которого формируются данные (например, здание или стойка)
 * @param settings.widget - см. interface IObjectLinkedObjectsRackViewProps
 */
const WidgetObjectLinkedObjectsRackView: FC<IWidgetObjectLinkedObjectsRackViewSettingsProps> = ({
    settings: { widget, vtemplate }
}) => {

    return (
        <div style={{ width: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
            <ObjectLinkedObjectsRackView 
                object={vtemplate?.objectId} 
                {...widget}
                deviceUnitRelationIds={widget?.deviceUnitRelationIds || forumThemeConfig.classesGroups.relationIds}
            />
        </div>
    )
}

export default WidgetObjectLinkedObjectsRackView
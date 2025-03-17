import { FC } from 'react';
import { TWidgetSettings } from '../widget-types';
import { IECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView';
import ObjectToolbarContainer from '@containers/objects/ObjectToolbarContainer/ObjectToolbarContainer';

export type toolsItem = {
    type: 'delimiter' | 'button',
    icon: IECIconView['icon'],
    functional: 'objectInfo' | 'pageInfo' | 'edit' | 'multiCharts' | 'tools' | 'ssh',
    id: number,
    name: string,
    description: string,
}

export interface WidgetObjectToolbarProps {
    objectId?: number
    buttonsSize?: number
    direction?: 'vertical' | 'horizontal'
    websocketUrl?: string
    tools?: toolsItem[] | []
}

const WidgetObjectToolbar: FC<TWidgetSettings<WidgetObjectToolbarProps>> = (props) => {

    const { settings } = props
    const { widget, baseSettings } = settings

    return (
        <ObjectToolbarContainer
            objectId={settings?.vtemplate?.objectId}
            buttonsSize={widget?.buttonsSize}
            direction={widget?.direction}
            tools={widget?.tools}
            vtemplateId={baseSettings?.vtemplateId}
            websocketUrl={widget?.websocketUrl}
        />
    );
}

export default WidgetObjectToolbar
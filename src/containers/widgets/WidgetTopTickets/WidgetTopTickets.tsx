import { FC, PropsWithChildren } from 'react'
import { TWidgetSettings } from '../widget-types'
import TicketsContainer from '@entities/tickets/TicketsContainer'
import { ITicketsContainerProps } from '@entities/tickets/types'


const WidgetTopTickets: FC<TWidgetSettings<PropsWithChildren<ITicketsContainerProps>>> = ({ 
    settings: { widget, vtemplate }
}) => {

    return (widget?.linkedObjectsForm?.baseObject || vtemplate?.objectId) 
        ? 
        <div style={{ width: '100%', height: '100%' }}>
            <TicketsContainer 
                {...widget} 
                parentObjectId={widget?.linkedObjectsForm?.baseObject ?? vtemplate?.objectId}
            />
        </div>
        : 
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
            <p>Выберите объект</p>
        </div>
}

export default WidgetTopTickets
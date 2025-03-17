import { FC } from 'react'
import { TWidgetSettings } from '../widget-types'

export interface IWidgetAIsaev {
    on: boolean,
}

const WidgetAIsaev: FC<TWidgetSettings<IWidgetAIsaev>> = (props) => {
    const { settings } = props;
    const { widget } = settings
    const { on } = widget;

    return (
        <div>{on ? 'Есть контакт (стейт виджета true)' : 'Нет контакта (стейт on false)'}</div>
    )
}

export default WidgetAIsaev;
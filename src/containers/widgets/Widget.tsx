import { FC, Suspense } from 'react';
import ErrorBoundary from 'antd/es/alert/ErrorBoundary';
import { WIDGETS, WIDGET_TYPES } from './widget-const';
import { TWidget, WidgetComponentProps } from './widget-types';

const Widget: FC<WidgetComponentProps> = ({
    widgetMnemo,
    widgetType = WIDGET_TYPES.WIDGET_TYPE_SHOW,
    ...props
}) => {

    // const widget: TWidget = WIDGETS[widgetMnemo];
    const widget: TWidget = WIDGETS.find((item) => item.mnemo === widgetMnemo);

    return (
        <ErrorBoundary message="Ошибка в работе виджета">
            {widgetType === WIDGET_TYPES.WIDGET_TYPE_FORM && widget?.components.form &&
                <Suspense fallback={null}>
                    <widget.components.form {...props} />
                </Suspense>}
            {widgetType === WIDGET_TYPES.WIDGET_TYPE_SHOW && widget?.components.widget &&
                <Suspense fallback={null}>
                    <widget.components.widget {...props} />
                </Suspense>}
            {widgetType === WIDGET_TYPES.WIDGET_TYPE_PREVIEW && widget?.preview &&
                <Suspense fallback={null}>
                    <widget.preview {...props} />
                </Suspense>}
        </ErrorBoundary>
    );
}

export default Widget;
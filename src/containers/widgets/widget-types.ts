import { TInitialDataSettingVTType } from '@containers/vtemplates/VtemplateFormContainer/types/types'
import { TPage } from '@shared/types/common';

export type WidgetsKeyProp = string;

/* eslint-disable max-len */
export type TWidgetGroup = {
    id: number, //уникальный номер группы
    name: string, //название
    order: number, //Порядок отображения группы
}

export type TWidget = {
    mnemo: string, //уникальная мнемоника виджета
    name: string, //название
    preview: string | any, //string - URL картинки, компонент - компонент превью
    groupIds: TWidgetGroup['id'][], //id групп для создания группировки виджетов в дальнейшем
    components: {
        widget: any, //Компонент служащий для отображения виджета - в него приходят настройки settings.widget
        form: any, //Компонент служащий для отображения формы виджета - в него приходят настройки settings.widget и settings.view
    }
    purposeMaket?: number[]
}

export type labelParamsType = {
    title_position: string;
    title_show: boolean,
    title_color: string,
    title_text: string
}

export type styleParamsType = {
    paddingOutWidgetTop: number,
    paddingOutWidgetRight: number,
    paddingOutWidgetLeft: number,
    paddingOutWidgetBottom: number,

    paddingInWidgetTop: number,
    paddingInWidgetRight: number,
    paddingInWidgetLeft: number,
    paddingInWidgetBottom: number,

    borderThickness: number,

    borderColor: string,

    borderRadiusTopLeft: number,
    borderRadiusTopRight: number,
    borderRadiusBottomLeft: number,
    borderRadiusBottomRight: number,

    paddingOutTitleTop: number,
    paddingOutTitleLeft: number,
    paddingOutTitleRight: number,

    widgetBorderEnable?: boolean
}

export type wrapperType = {
    style: {
        labelParams: labelParamsType,
        styleParams: styleParamsType
    }
}

export type TWidgetSettings<T = any> = {
    settings: {
        widget: T & { widgetId: string }, //типизация настроек самого виджета, то что задаётся и приходит из его формы
        vtemplate: {
            objectId?: number,
            classes?: number[],
            builderData?: 'previewReload' | 'preview' | 'mockData',
            builderView?: boolean
        }
        view: any //Настройки представления, пока оставляем any
        baseSettings?: TInitialDataSettingVTType,
    }
}

export type TWidgetFormSettings<T = any> = TWidgetSettings<T> & {
    onChangeForm: <T>(data: T) => void
}

export type widgetType = {
    id: string,
    layout: {
        x: number,
        y: number,
        w: number,
        h: number
    },
    widgetMnemo?: string,
    wrapper?: wrapperType, //настройки обёртки, наполнить в зависимости от двух форм настройки внешнего вида - заголовка и оформления
    settings?: {
        widget: any, //типизация настроек самого виджета, то что задаётся и приходит из его формы
        view: any, //Настройки представления, пока оставляем any
        vtemplate: any,
        baseSettings?: TInitialDataSettingVTType,
    },
    
}

export interface wrapperTypeGetForm extends wrapperType {
    settings: {
        widget: any,
        vtemplate: {
            objectId: number 
            page: TPage
        },
        baseSettings?: TInitialDataSettingVTType
    }
}

export interface WidgetComponentProps {
    widgetMnemo: WidgetsKeyProp,
    widgetType: string,

    [x: string]: any;
}

export type IGetFormState<T, P> = (form: T, formName: P) => void
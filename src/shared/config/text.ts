import { IThemes } from '@app/themes/types'

interface ITexts {
    page404: string
    vtemplate404: string
}
interface IGetThemeTextProps {
    theme: IThemes, 
    message: keyof ITexts
}
type IGetThemeText = (props: IGetThemeTextProps) => ITexts[keyof ITexts]

export const text: Record<IThemes, ITexts> = {
    default: {
        page404: 'Данной страницы не существует',
        vtemplate404: 'Проблемы с отображением страницы. Обратитесь к администратору'
    },
    vpn: {
        page404: 'Данной страницы не существует',
        vtemplate404: 'Проблемы с отображением страницы. Обратитесь к администратору'
    },
    fns: {
        page404: 'Проблема с отображением',
        vtemplate404: 'Проблемы с отображением страницы. Обратитесь к администратору'
    },
    forum: {
        page404: 'Данной страницы не существует',
        vtemplate404: 'Проблемы с отображением страницы. Обратитесь к администратору'
    },
    sirius: {
        page404: 'Данной страницы не существует',
        vtemplate404: 'Проблемы с отображением страницы. Обратитесь к администратору'
    },
    dark: {
        page404: 'Данной страницы не существует',
        vtemplate404: 'Проблемы с отображением страницы. Обратитесь к администратору'
    },
    light: {
        page404: 'Данной страницы не существует',
        vtemplate404: 'Проблемы с отображением страницы. Обратитесь к администратору'
    },
    mishk: {
        page404: 'Данной страницы не существует',
        vtemplate404: 'Проблемы с отображением страницы. Обратитесь к администратору'
    },
    zags: {
        page404: 'Данной страницы не существует',
        vtemplate404: 'Проблемы с отображением страницы. Обратитесь к администратору'
    },
    cypr: {
        page404: 'Данной страницы не существует',
        vtemplate404: 'Проблемы с отображением страницы. Обратитесь к администратору'
    },
}

export const getThemeText: IGetThemeText = ({ theme, message }) => {
    return theme in text
        ? text[theme][message]
        : text.default[message]
}
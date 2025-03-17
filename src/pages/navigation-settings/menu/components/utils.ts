export interface IMenuItem {
    id: number
    name: string
    pseudoId: number
    parentPseudoId: number | null
    icon: string
    on: boolean
    page: string
    url: number | string
    target?: boolean
    stereotype?: string
    size?: number
    screen?: number
    textIcon?: string
}

export const MNEMO = 'front_menu'

export interface IMenuConstructor {
    id: number
    name: string
    mnemo: string
    type: number
    active: boolean
    menu: IMenuItem[]
}

export interface IPage {
    name: string
    url: string
    vtemplate_id: number
    isActive: boolean
}

export const stereotypeOptions = [
    {
        value: 'default',
        label: 'Стандартный пункт меню',
    },
    {
        value: 'user_menu',
        label: 'Меню пользователя',
        disabled: true,
    },
    {
        value: 'lsidebar_toggle',
        label: 'Скрытие/Показ левого сайдбара',
    },
    { value: 'rsidebar_toggle', label: 'Скрытие/Показ правого сайдбара', disabled: true },
    { value: 'delimiter_space', label: 'Разделитель Свободное место' },
    { value: 'delimiter_line', label: 'Разделитель Линия', 
        disabled: true },
    { value: 'logout', label: 'Выход из аккаунта' },
    { value: 'settings_MP', label: 'Настройки МП (для мобильного приложения)' }

]

// - Стандартный пункт меню (default)
// - Меню пользователя (user_menu) (пока disable)
// - Скрытие/Показ левого сайдбара (lsidebar_toggle) (скрытие дерева сейчаС)
// - Скрытие/Показ левого сайдбара (rsidebar_toggle) (пока disable)
// - Разделитель Свободное место (delimiter_space)
// - Разделитель Линия (delimiter_line) (пока disable)
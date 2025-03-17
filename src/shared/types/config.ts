export enum CONFIG_MNEMOS {
    FRONT_FILTERS = 'front_filters',
    STANDART_USER_ID = 'standart-user-id',
    FRONT_PAGES = 'front_pages',
    FRONT_MENU = 'front_menu',
    FRONT_SETTINGS = 'front_settings',
    FRONT_SCREENS = 'front_screens',
    PAGE_HELP = 'page-help',
    DISCOVERY = 'discovery2'
}

export interface IConfig {
    mnemo: CONFIG_MNEMOS
    value: string
}
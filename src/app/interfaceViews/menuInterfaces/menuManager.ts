import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { useAccountStore } from '@shared/stores/accounts'

const checkPermission = useAccountStore.getState().checkPermission

export const generateMenuInterface = () => {
    return (
        {
            users: checkPermission(['get roles', 'get account'], 'OR') && {
                name: 'Учётные записи',
                key: 'users',
                children: 
                [
                    checkPermission(['get account']) && {
                        label: 'Пользователи',
                        key: `${ROUTES.ACCOUNTS}/${ROUTES_COMMON.LIST}`,
                        // rolesPermissions: ['super-admin'],
                        route: `${ROUTES.ACCOUNTS}/${ROUTES_COMMON.LIST}`,
                    },
                    checkPermission(['get roles']) && {
                        label: 'Роли',
                        key: 'roles/list',
                        route: 'roles/list'
                    },
                    checkPermission(['get group-policies']) && {
                        label: 'Групповые политики',
                        key: 'group-policies/list',
                        route: 'group-policies/list'
                    },
                    // {
                    //     label: 'Управления правилами отбора',
                    //     key: 'system/netflow',
                    //     route: `${ROUTES.SYSTEM}/${ROUTES.NETFLOW}`
                    // },
                ]
            },
            // pages: {
            //     name: 'Страницы',
            //     // route: `${ROUTES.MENU_MANAGER}/${ROUTES.PAGES}`,
            //     key: `${ROUTES.MENU_MANAGER}/${ROUTES.PAGES}`,
            // },
            // menu: {
            //     name: 'Меню',
            //     // route: `${ROUTES.MENU_MANAGER}/${ROUTES.MENU}`,
            //     key: `${ROUTES.MENU_MANAGER}/${ROUTES.MENU}`,
            // },
            // pages: {
            //     name: 'Страницы',
            //     // route: `${ROUTES.MENU_MANAGER}/${ROUTES.PAGES}`,
            //     key: `${ROUTES.MENU_MANAGER}/${ROUTES.PAGES}`,
            // },
            // menu: {
            //     name: 'Меню',
            //     // route: `${ROUTES.MENU_MANAGER}/${ROUTES.MENU}`,
            //     key: `${ROUTES.MENU_MANAGER}/${ROUTES.MENU}`,
            // },
            rule_layouts: checkPermission(['get rules']) && {
                name: 'Шаблоны правил',
                // route: `${ROUTES.RULE_TEMPLATES}/${ROUTES_COMMON.LIST}`,
                key: `${ROUTES.RULE_TEMPLATES}/${ROUTES_COMMON.LIST}`,
            },
            // discovery: checkPermission(['get objects']) && {
            //     name: 'Дискавери',
            //     // route: `${ROUTES.DISCOVERY}/${ROUTES_COMMON.LIST}`,
            //     key: `${ROUTES.DISCOVERY}/${ROUTES_COMMON.LIST}`
            // },
            theme_settings: checkPermission(['get config']) && {
                name: 'Настройки проекта',
                // route: `${ROUTES.THEME_SETTINGS}`,
                key: `${ROUTES.THEME_SETTINGS}`
            },
            system: checkPermission(['get tasks']) && {
                name: 'Система',
                key: 'system',
                children:
                    [
                        {
                            label: 'Лицензия',
                            key: 'system/license/show',
                            route: `${ROUTES.SYSTEM}/${ROUTES.LICENSE}/${ROUTES_COMMON.SHOW}`,
                        },
                        {
                            label: 'Конфигурация',
                            key: 'system/configuration',
                            route: `${ROUTES.SYSTEM}/${ROUTES.CONFIGURATION}`,
                        },
                        checkPermission(['get tasks']) && {
                            label: 'Массовые операции',
                            key: 'system/mass-actions/list',
                            route: `${ROUTES.SYSTEM}/${ROUTES.MASS_ACTIONS}/${ROUTES_COMMON.LIST}`
                        },
                        // {
                        //     label: 'Управления правилами отбора',
                        //     key: 'system/netflow',
                        //     route: `${ROUTES.SYSTEM}/${ROUTES.NETFLOW}`
                        // },
                    ]
            },
            // TODO Внедрить пермишены
            other: 
            // checkPermission(['get roles', 'get account', 'get netflow-sources'], 'OR') && 
            {
                name: 'Прочее',
                key: 'other',
                children:
                    [
                        // checkPermission(['get tasks']) &&
                        {
                            label: 'Системный журнал',
                            route: 'other/syslog/list',
                            key: `${ROUTES.OTHER}/${ROUTES.SYSLOG}/${ROUTES_COMMON.LIST}`,
                        },
                        // checkPermission(['get tasks']) && 
                        {
                            label: 'Дискавери',
                            route: 'other/discovery/list',
                            key: `${ROUTES.OTHER}/${ROUTES.DISCOVERY}/${ROUTES_COMMON.LIST}`,
                        },
                        // checkPermission(['get netflow-sources' ]) && 
                        {
                            label: 'Анализ трафика',
                            route: 'other/netflow/list',
                            key: `${ROUTES.OTHER}/${ROUTES.NETFLOW}/${ROUTES_COMMON.LIST}`,
                        },
                    ]
            },
            navigation: checkPermission(['get config']) && {
                name: 'Навигация',
                key: 'navigation',
                children: 
                [
                    {
                        label: 'Меню',
                        key: 'navigation/menu/list',
                        route: `${ROUTES.NAVIGATION}/${ROUTES.MENU}/${ROUTES_COMMON.LIST}`,
                    },
                    {
                        label: 'Страницы',
                        key: 'navigation/pages/list',
                        route: `${ROUTES.NAVIGATION}/${ROUTES.PAGES}/${ROUTES_COMMON.LIST}`
                    },
                    {
                        label: 'Экраны',
                        key: 'navigation/screens/list',
                        route: `${ROUTES.NAVIGATION}/${ROUTES.SCREENS}/${ROUTES_COMMON.LIST}`
                    },
                    {
                        label: 'Справки по страницам',
                        key: 'navigation/helps/list',
                        route: `${ROUTES.NAVIGATION}/${ROUTES.HELPS}/${ROUTES_COMMON.LIST}`
                    },
                ]
            }
        }
    )
}
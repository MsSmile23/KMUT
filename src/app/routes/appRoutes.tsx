/* eslint-disable max-len */
import { ROUTES } from '@shared/config/paths';
import { MAIN_ROUTE, ROUTE_DYNAMIC, ROUTE_ENTITY, ROUTE_INTERFACE, ROUTE_SUB } from './paths';
import { components } from './routeComponents'
import { Outlet } from 'react-router';

export const appRoutes = {
    constructor: {
        main: {
            path: `${ROUTE_INTERFACE.CONSTRUCTOR}`,
            component: components.constructor.main
        },
        accounts: {
            main: {
                path: `${ROUTE_INTERFACE.CONSTRUCTOR}/${ROUTE_ENTITY.ACCOUNTS}`,
                component: <Outlet />
            },
            list: {
                path: `${ROUTE_INTERFACE.CONSTRUCTOR}/${ROUTE_ENTITY.ACCOUNTS}/${ROUTE_SUB.LIST}`,
                component: components.constructor.accounts.list
            },
            create: {
                path: `${ROUTE_INTERFACE.CONSTRUCTOR}/${ROUTE_ENTITY.ACCOUNTS}/${ROUTE_SUB.CREATE}`,
                component: components.constructor.accounts.create
            },
            update: {
                path: `${ROUTE_INTERFACE.CONSTRUCTOR}/${ROUTE_ENTITY.ACCOUNTS}/${ROUTE_SUB.UPDATE}/${ROUTE_DYNAMIC.ID}`,
                component: components.constructor.accounts.update
            },
        },
        attributesCategories: {
            main: {
                path: `${ROUTE_INTERFACE.CONSTRUCTOR}/${ROUTE_ENTITY.ATTRIBUTE_CATEGORIES}`,
                component: <Outlet />
            },
            list: {
                path: `${ROUTE_INTERFACE.CONSTRUCTOR}/${ROUTE_ENTITY.ATTRIBUTE_CATEGORIES}/${ROUTE_SUB.LIST}`,
                component: components.constructor.attributesCategories.list
            },
            create: {
                path: `${ROUTE_INTERFACE.CONSTRUCTOR}/${ROUTE_ENTITY.ATTRIBUTE_CATEGORIES}/${ROUTE_SUB.CREATE}`,
                component: components.constructor.attributesCategories.create
            },
            update: {
                path: `${ROUTE_INTERFACE.CONSTRUCTOR}/${ROUTE_ENTITY.ATTRIBUTE_CATEGORIES}/${ROUTE_SUB.UPDATE}/${ROUTE_DYNAMIC.ID}`,
                component: components.constructor.attributesCategories.update
            },
        },
        attributes: {
            main: {
                path: `${ROUTE_INTERFACE.CONSTRUCTOR}/${ROUTE_ENTITY.ATTRIBUTES}`,
                component: <Outlet />
            },
            list: {
                path: `${ROUTE_INTERFACE.CONSTRUCTOR}/${ROUTE_ENTITY.ATTRIBUTES}/${ROUTE_SUB.LIST}`,
                component: components.constructor.attributes.list
            },
            create: {
                path: `${ROUTE_INTERFACE.CONSTRUCTOR}/${ROUTE_ENTITY.ATTRIBUTES}/${ROUTE_SUB.CREATE}`,
                component: components.constructor.attributes.create
            },
            update: {
                path: `${ROUTE_INTERFACE.CONSTRUCTOR}/${ROUTE_ENTITY.ATTRIBUTES}/${ROUTE_SUB.UPDATE}/${ROUTE_DYNAMIC.ID}`,
                component: components.constructor.attributes.update
            },
        },
        classes: {
            main: {
                path: `${ROUTE_INTERFACE.CONSTRUCTOR}/${ROUTE_ENTITY.CLASSES}`,
                component: <Outlet />
            },
            list: {
                path: `${ROUTE_INTERFACE.CONSTRUCTOR}/${ROUTE_ENTITY.CLASSES}/${ROUTE_SUB.LIST}`,
                component: components.constructor.classes.list
            },
            create: {
                path: `${ROUTE_INTERFACE.CONSTRUCTOR}/${ROUTE_ENTITY.CLASSES}/${ROUTE_SUB.CREATE}`,
                component: components.constructor.classes.create
            },
            update: {
                path: `${ROUTE_INTERFACE.CONSTRUCTOR}/${ROUTE_ENTITY.CLASSES}/${ROUTE_SUB.UPDATE}/${ROUTE_DYNAMIC.ID}`,
                component: components.constructor.classes.update
            },
        },
        relations: {
            main: {
                path: `${ROUTE_INTERFACE.CONSTRUCTOR}/${ROUTE_ENTITY.RELATIONS}`,
                component: <Outlet />
            },
            list: {
                path: `${ROUTE_INTERFACE.CONSTRUCTOR}/${ROUTE_ENTITY.RELATIONS}/${ROUTE_SUB.LIST}`,
                component: components.constructor.relations.list
            },
            create: {
                path: `${ROUTE_INTERFACE.CONSTRUCTOR}/${ROUTE_ENTITY.RELATIONS}/${ROUTE_SUB.CREATE}`,
                component: components.constructor.relations.create
            },
            update: {
                path: `${ROUTE_INTERFACE.CONSTRUCTOR}/${ROUTE_ENTITY.RELATIONS}/${ROUTE_SUB.UPDATE}/${ROUTE_DYNAMIC.ID}`,
                component: components.constructor.relations.update
            },
        },
        stateMachines: {
            main: {
                path: `${ROUTE_INTERFACE.CONSTRUCTOR}/${ROUTE_ENTITY.STATE_MACHINES}`,
                component: <Outlet />
            },
            list: {
                path: `${ROUTE_INTERFACE.CONSTRUCTOR}/${ROUTE_ENTITY.STATE_MACHINES}/${ROUTE_SUB.LIST}`,
                component: components.constructor.stateMachines.list
            },
            create: {
                path: `${ROUTE_INTERFACE.CONSTRUCTOR}/${ROUTE_ENTITY.STATE_MACHINES}/${ROUTE_SUB.CREATE}`,
                component: components.constructor.stateMachines.create
            },
            update: {
                path: `${ROUTE_INTERFACE.CONSTRUCTOR}/${ROUTE_ENTITY.STATE_MACHINES}/${ROUTE_SUB.UPDATE}/${ROUTE_DYNAMIC.ID}`,
                component: components.constructor.stateMachines.update
            },
        },
        vtemplates: {
            main: {
                path: `${ROUTE_INTERFACE.CONSTRUCTOR}/${ROUTE_ENTITY.VTEMPLATES}`,
                component: <Outlet />
            },
            list: {
                path: `${ROUTE_INTERFACE.CONSTRUCTOR}/${ROUTE_ENTITY.VTEMPLATES}/${ROUTE_SUB.LIST}`,
                component: components.constructor.vtemplates.list
            },
            create: {
                path: `${ROUTE_INTERFACE.CONSTRUCTOR}/${ROUTE_ENTITY.VTEMPLATES}/${ROUTE_SUB.CREATE}`,
                component: components.constructor.vtemplates.create
            },
            update: {
                path: `${ROUTE_INTERFACE.CONSTRUCTOR}/${ROUTE_ENTITY.VTEMPLATES}/${ROUTE_SUB.UPDATE}/${ROUTE_DYNAMIC.ID}`,
                component: components.constructor.vtemplates.update
            },
        },
    },
    manager: {
        main: {
            path: `${ROUTE_INTERFACE.MANAGER}`,
            component: components.manager.main
        },
        accounts: {
            main: {
                path: `${ROUTE_INTERFACE.MANAGER}/${ROUTE_ENTITY.ACCOUNTS}`,
                component: <Outlet />
            },
            list: {
                path: `${ROUTE_INTERFACE.MANAGER}/${ROUTE_ENTITY.ACCOUNTS}/${ROUTE_SUB.LIST}`,
                component: components.constructor.accounts.list
            },
            create: {
                path: `${ROUTE_INTERFACE.MANAGER}/${ROUTE_ENTITY.ACCOUNTS}/${ROUTE_SUB.CREATE}`,
                component: components.constructor.accounts.create
            },
            update: {
                path: `${ROUTE_INTERFACE.MANAGER}/${ROUTE_ENTITY.ACCOUNTS}/${ROUTE_SUB.UPDATE}/${ROUTE_DYNAMIC.ID}`,
                component: components.constructor.accounts.update
            },
        },
        classes: {
            main: {
                path: `${ROUTE_INTERFACE.MANAGER}/${ROUTE_ENTITY.CLASSES}`,
                component: <Outlet />
            },
            list: {
                path: `${ROUTE_INTERFACE.MANAGER}/${ROUTE_ENTITY.CLASSES}/${ROUTE_SUB.LIST}`,
                component: components.manager.classes.list
            },
            create: {
                path: `${ROUTE_INTERFACE.MANAGER}/${ROUTE_ENTITY.CLASSES}/${ROUTE_SUB.CREATE}`,
                component: components.manager.classes.create
            },
            update: {
                path: `${ROUTE_INTERFACE.MANAGER}/${ROUTE_ENTITY.CLASSES}/${ROUTE_SUB.UPDATE}/${ROUTE_DYNAMIC.ID}`,
                component: components.manager.classes.update
            },
        },
        discovery: {
            main: {
                path: `${ROUTE_INTERFACE.MANAGER}/${ROUTE_ENTITY.DISCOVERY}`,
                component: <Outlet />
            },
            list: {
                path: `${ROUTE_INTERFACE.MANAGER}/${ROUTE_ENTITY.DISCOVERY}/${ROUTE_SUB.LIST}`,
                component: components.manager.discovery.list
            },
        },
        objects: {
            main: {
                path: `${ROUTE_INTERFACE.MANAGER}/${ROUTE_ENTITY.OBJECTS}`,
                component: <Outlet />
            },
            list: {
                path: `${ROUTE_INTERFACE.MANAGER}/${ROUTE_ENTITY.OBJECTS}/${ROUTE_SUB.LIST}`,
                component: components.manager.objects.list
            },
            create: {
                path: `${ROUTE_INTERFACE.MANAGER}/${ROUTE_ENTITY.OBJECTS}/${ROUTE_SUB.CREATE}`,
                component: components.manager.objects.create
            },
            update: {
                path: `${ROUTE_INTERFACE.MANAGER}/${ROUTE_ENTITY.OBJECTS}/${ROUTE_SUB.UPDATE}/${ROUTE_DYNAMIC.ID}`,
                component: components.manager.objects.update
            },
        },
        ruleTemplates: {
            main: {
                path: `${ROUTE_INTERFACE.MANAGER}/${ROUTE_ENTITY.RULE_TEMPLATES}`,
                component: <Outlet />
            },
            list: {
                path: `${ROUTE_INTERFACE.MANAGER}/${ROUTE_ENTITY.RULE_TEMPLATES}/${ROUTE_SUB.LIST}`,
                component: components.manager.ruleTemplates.list
            },
            create: {
                path: `${ROUTE_INTERFACE.MANAGER}/${ROUTE_ENTITY.RULE_TEMPLATES}/${ROUTE_SUB.CREATE}`,
                component: components.manager.ruleTemplates.create
            },
            update: {
                path: `${ROUTE_INTERFACE.MANAGER}/${ROUTE_ENTITY.RULE_TEMPLATES}/${ROUTE_SUB.UPDATE}/${ROUTE_DYNAMIC.ID}`,
                component: components.manager.ruleTemplates.update
            },
        },
        system: {
            main: {
                path: `${ROUTE_INTERFACE.MANAGER}/${ROUTES.SYSTEM}`,
                component: <Outlet />
            },
            configuration: {
                
            },
            massActions: {
                list: {
                    path: `${ROUTE_INTERFACE.MANAGER}/${ROUTE_ENTITY.MASS_ACTIONS}/${ROUTE_SUB.LIST}`,
                    component: components.manager.system.massActions.list
                },
                create: {
                    path: `${ROUTE_INTERFACE.MANAGER}/${ROUTE_ENTITY.MASS_ACTIONS}/${ROUTE_SUB.CREATE}`,
                    component: components.manager.system.massActions.create
                },
                update: {
                    path: `${ROUTE_INTERFACE.MANAGER}/${ROUTE_ENTITY.MASS_ACTIONS}/${ROUTE_SUB.UPDATE}/${ROUTE_DYNAMIC.ID}`,
                    component: components.manager.system.massActions.update
                },
            },
            netflow: {

            }
        }
    },
    showcase: {
        main: {
            path: `${ROUTE_INTERFACE.SHOWCASE}`,
            component: components.showcase.main
        },
        objects: {
            main: {
                path: `${ROUTE_INTERFACE.SHOWCASE}${ROUTE_ENTITY.OBJECTS}`,
                component: <Outlet />
            },
            list: {
                path: `${ROUTE_INTERFACE.SHOWCASE}${ROUTE_ENTITY.OBJECTS}/${ROUTE_SUB.LIST}`,
                component: components.showcase.objects.list
            },
            show: {
                path: `${ROUTE_INTERFACE.SHOWCASE}${ROUTE_ENTITY.OBJECTS}/${ROUTE_SUB.SHOW}/${ROUTE_DYNAMIC.ID}`,
                component: components.showcase.objects.show
            },
            map: {
                path: `${ROUTE_INTERFACE.SHOWCASE}${ROUTE_ENTITY.OBJECTS}/${ROUTE_SUB.MAP}`,
                component: components.showcase.objects.map
            },
            syslog: {
                path: `${ROUTE_INTERFACE.SHOWCASE}${ROUTE_ENTITY.OBJECTS}/${ROUTE_SUB.SYSLOG}`,
                component: components.showcase.objects.syslog
            },
        },
        settings: {
            main: {
                path: `${ROUTE_INTERFACE.SHOWCASE}${ROUTE_ENTITY.SETTINGS}`,
                component: <Outlet />
            },
            layout: {
                path: `${ROUTE_INTERFACE.SHOWCASE}${ROUTE_ENTITY.SETTINGS}/${ROUTE_SUB.LAYOUT}`,
                component: components.showcase.settings.layout
            },
        },
        incidents: {
            main: {
                path: `${ROUTE_INTERFACE.SHOWCASE}${ROUTE_ENTITY.INCIDENTS}`,
                component: <Outlet />
            },
            list: {
                path: `${ROUTE_INTERFACE.SHOWCASE}${ROUTE_ENTITY.INCIDENTS}/${ROUTE_SUB.LIST}`,
                component: components.showcase.incidents.list
            },
            show: {
                path: `${ROUTE_INTERFACE.SHOWCASE}${ROUTE_ENTITY.INCIDENTS}/${ROUTE_SUB.SHOW}/${ROUTE_DYNAMIC.ID}`,
                component: components.showcase.incidents.show
            },
        },
        infopanels: {
            main: {
                path: `${ROUTE_INTERFACE.SHOWCASE}${ROUTE_ENTITY.INFOPANELS}`,
                component: <Outlet />
            },
            show: {
                path: `${ROUTE_INTERFACE.SHOWCASE}${ROUTE_ENTITY.INFOPANELS}/${ROUTE_SUB.SHOW}/${ROUTE_DYNAMIC.ID}`,
                component: components.showcase.infopanels.show
            },
        },
        inventory: {
            main: {
                path: `${ROUTE_INTERFACE.SHOWCASE}${ROUTE_ENTITY.INVENTORY}`,
                component: <Outlet />
            },
            list: {
                path: `${ROUTE_INTERFACE.SHOWCASE}${ROUTE_ENTITY.INVENTORY}/${ROUTE_SUB.LIST}`,
                component: components.showcase.inventory.list
            },
        },
        reports: {
            main: {
                path: `${ROUTE_INTERFACE.SHOWCASE}${ROUTE_ENTITY.REPORTS}`,
                component: <Outlet />
            },
            list: {
                path: `${ROUTE_INTERFACE.SHOWCASE}${ROUTE_ENTITY.REPORTS}/${ROUTE_SUB.LIST}`,
                component: components.showcase.reports.list
            },
            create: {
                path: `${ROUTE_INTERFACE.SHOWCASE}/${ROUTE_ENTITY.REPORTS}/${ROUTE_SUB.CREATE}`,
                component: components.showcase.reports.create
            },
        },
        notifications: {
            main: {
                path: `${ROUTE_INTERFACE.SHOWCASE}${ROUTE_ENTITY.NOTIFICATIONS}`,
                component: <Outlet />
            },
            list: {
                path: `${ROUTE_INTERFACE.SHOWCASE}${ROUTE_ENTITY.NOTIFICATIONS}/${ROUTE_SUB.LIST}`,
                component: components.showcase.notifications.list
            },
        },
    }
} as const 

export const authRoutes = {
    main: {
        path: `${MAIN_ROUTE}${ROUTE_ENTITY.AUTH}`,
        component: <Outlet />
    },
    login: {
        path: `${MAIN_ROUTE}${ROUTE_ENTITY.AUTH}/${ROUTE_SUB.LOGIN}`,
        component: components.auth.login
    },
    preload: {
        path: `${MAIN_ROUTE}${ROUTE_ENTITY.AUTH}/${ROUTE_SUB.PRELOAD}`,
        component: components.auth.preload
    },
    interfaceViews: {
        path: `${MAIN_ROUTE}${ROUTE_ENTITY.AUTH}/${ROUTE_SUB.INTERFACEVIEWS}`,
        component: components.auth.interfaceViews
    },
} as const

export const publicRoutes = {
    main: {
        path: `${MAIN_ROUTE}${ROUTE_ENTITY.PUBLIC}`,
        component: <Outlet />
    },
    zond: {
        registration: {
            path: `${MAIN_ROUTE}${ROUTE_ENTITY.PUBLIC}/${ROUTE_SUB.ZOND}/${ROUTE_SUB.REGISTRATION}`,
            component: components.public.zond.registration
        }
    }
} as const

export const devRoutes = {
    alex: {
        path: `${MAIN_ROUTE}${ROUTE_ENTITY.DEV}/${ROUTE_SUB.ALEX}`,
        component: components.dev.alex
    },
    vladimir: {
        path: `${MAIN_ROUTE}${ROUTE_ENTITY.DEV}/${ROUTE_SUB.VLADIMIR}`,
        component: components.dev.vladimir
    },
    alexey: {
        path: `${MAIN_ROUTE}${ROUTE_ENTITY.DEV}/${ROUTE_SUB.ALEKSEY}`,
        component: components.dev.aleksey
    },
    artem: {
        path: `${MAIN_ROUTE}${ROUTE_ENTITY.DEV}/${ROUTE_SUB.ARTEM}`,
        component: components.dev.artem
    },
    aptest: {
        path: `${MAIN_ROUTE}${ROUTE_ENTITY.DEV}/${ROUTE_SUB.APTEST}`,
        component: components.dev.aptest
    },
    paveltest: {
        path: `${MAIN_ROUTE}${ROUTE_ENTITY.DEV}/${ROUTE_SUB.PAVELTEST}`,
        component: components.dev.paveltest
    },
    vtemplateDemo: {
        path: `${MAIN_ROUTE}${ROUTE_ENTITY.DEV}/${ROUTE_SUB.VTEMPLATE_DEMO}`,
        component: components.dev.vtemplateDemo
    },
    nikita: {
        path: `${MAIN_ROUTE}${ROUTE_ENTITY.DEV}/${ROUTE_SUB.NIKITA}`,
        component: components.dev.nikita
    },
} as const
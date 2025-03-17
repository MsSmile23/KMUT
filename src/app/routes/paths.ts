export const MAIN_ROUTE = '/'

export enum ROUTE_INTERFACE {
    CONSTRUCTOR = '/constructor',
    MANAGER = '/manager',
    SHOWCASE = MAIN_ROUTE
}

// first level routes
export enum ROUTE_ENTITY {
    ACCOUNTS = 'accounts',
    ATTRIBUTES = 'attributes',
    ATTRIBUTE_CATEGORIES = 'attribute-categories',
    AUTH = 'auth',
    CLASSES = 'classes',
    DEV = 'dev',
    DISCOVERY = 'discovery',
    INCIDENTS = 'incidents',
    INFOPANELS = 'infopanels',
    INVENTORY = 'inventory',
    NOTIFICATIONS = 'notifications',
    OBJECTS = 'objects',
    RELATIONS = 'relations',
    REPORTS = 'reports',
    RULE_TEMPLATES = 'ruleTemplates',
    SETTINGS ='settings',
    STATE_MACHINES = 'state-machines',
    VTEMPLATES = 'vtemplates',
    MASS_ACTIONS = 'mass-actions',
    PUBLIC = 'public',
    LICENSE = 'license'
}

// second level routes
export enum ROUTE_SUB {
    // ROUTES_COMMON
    LIST = 'list',
    CREATE = 'create',
    UPDATE = 'update',
    LINKS = 'links',
    SHOW = 'show',
    SYSLOG = 'syslog',
    MAP = 'map',
    LAYOUT = 'layout',

    // dev
    ARTEM = 'artem',
    APTEST = 'aptest',
    ALEX = 'alex',
    VLADIMIR = 'vladimir',
    ALEKSEY = 'aleksey',
    PAVELTEST = 'paveltest',
    NIKITA = 'nikita',

    // auth
    LOGIN = 'login',
    INTERFACEVIEWS = 'interface-change',
    PRELOAD = 'preload',
    
    // public
    ZOND = 'zond',
    REGISTRATION = 'registration',

    // other routes
    VTEMPLATE_DEMO = 'demo/VtemplateDemo'
}

export enum ROUTE_DYNAMIC {
    ID = ':id',
    SEARCH = '?'
}
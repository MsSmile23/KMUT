/* eslint-disable */
/* import { API_GROUP_PERMISSIONS_SCHEME } from '@api/GroupPermissions/settings';
import { API_SUBJECT_TYPES_SCHEME } from '@api/SubjectTypes/settings';
import { API_ACCOUNT_SCHEME } from '@api/Account/settings';
import { API_ROLES_SCHEME } from '@api/Roles/settings';
import { API_CLASSIFIER_TYPES } from '@api/ClassifierType/settings'; */

export const ENTITIES = {
    EXAMPLE: {
        MNEMO: "example",
        MNEMO2: "Example",
        NAME: "Пример",
        ROUTE: "Example",
        CONTAINER: "Example",
        API_VERSION: "spa/v1",
        API_ROUTE: "example",
        /*       API_SCHEME: API_GROUP_PERMISSIONS_SCHEME, */
    },

    SUBJECT_TYPES: {
        MNEMO: "subject-type",
        NAME: "Типы субъектов",
        ROUTE: "SubjectTypes",
        CONTAINER: "SubjectTypes",
        API_VERSION: "spa/v1",
        API_ROUTE: "subject-types",
        /*  API_SCHEME: API_SUBJECT_TYPES_SCHEME, */
        TEXTS: {
            default: "Типы субъектов",
            menu: "Типы субъектов",
        }
    },

    ACCOUNT: {
        MNEMO: "account",
        NAME: "Аккаунт",
        ROUTE: "Accounts",
        CONTAINER: "Accounts",
        API_VERSION: "spa/v1",
        API_ROUTE: "accounts",
        /*   API_SCHEME: API_ACCOUNT_SCHEME, */

    },

    METRIC_TEMPLATES: {
        MNEMO: "metric-templates",
        MNEMO2: "MetricTemplates",
        NAME: "Шаблоны измерений",
        ROUTE: "MetricTemplates",
        CONTAINER: "MetricTemplates",
        API_VERSION: "spa/v1",
        API_ROUTE: "metric-templates",
        /*       API_SCHEME: API_SUBJECT_TYPES_SCHEME, */
        TEXTS: {
            default: "Типы субъектов",
            menu: "Типы субъектов",
        }
    },

    ROLES: {
        MNEMO: "role",
        NAME: "Роли",
        ROUTE: "Roles",
        CONTAINER: "Roles",
        API_VERSION: "spa/v1",
        API_ROUTE: "accounts",
        /*       API_SCHEME: API_ROLES_SCHEME, */

    },
    GROUP_PERMISSIONS: {
        MNEMO: "group-permission",
        NAME: "Групповые разрешения",
        ROUTE: "GroupPermissions",
        CONTAINER: "GroupPermissions",
        API_VERSION: "spa/v1",
        API_ROUTE: "group-permissions",
        /*         API_SCHEME: API_GROUP_PERMISSIONS_SCHEME, */
        TEXTS: {
            default: "Групповые разрешения",
            menu: "Групповые разрешения",
        }
    },


    //Тестовые Entites 


    CLASSIFIER_TYPES: {
        MNEMO: "classifier-type",
        NAME: "Типы классификаторов",
        ROUTE: "ClassifierTypes",
        CONTAINER: "ClassifierTypes",
        API_VERSION: "spa/v1",
        API_ROUTE: "classifier-types",
        /*      API_SCHEME: API_CLASSIFIER_TYPES, */
        TEXTS: {
            default: "Типы классификаторов",
            menu: "Типы классификаторов",
        }
    },

    CLASSIFIERS: {
        MNEMO: "classifier",
        NAME: "Классификаторы",
        ROUTE: "Classifiers",
        CONTAINER: "Classifiers",
        API_VERSION: "spa/v1",
        API_ROUTE: "classifiers",
        API_SCHEME: '/classifiers',
        TEXTS: {
            default: "Классификаторы",
            menu: "Классификаторы",
        }
    },

    EVENTS: {
        MNEMO: "events",
        MNEMO2: "Events",
        FEATURE: "events",
        NAME: "События",
        ROUTE: "Events",
        CONTAINER: "Events",
        API_VERSION: "spa/v1",
        API_ROUTE: "events",
        TEXTS: {
            default: "События",
            menu: "События",
        }
    },

    PERMISSIONS: {
        MNEMO: "permission",
        NAME: "Разрешения",
        ROUTE: "Permissions",
        CONTAINER: "Permissions",
        API_VERSION: "spa/v1",
        API_ROUTE: "permissions",
        API_SCHEME: '/permissions',
        TEXTS: {
            default: "Разрешения",
            menu: "Разрешения",
        }
    },
    SUBJECTS: {
        MNEMO: "subject",
        NAME: "Субъекты",
        ROUTE: "Subjects",
        CONTAINER: "Subjects",
        API_VERSION: "spa/v1",
        API_ROUTE: "subjects",
        API_SCHEME: `/subjects`,
        TEXTS: {
            default: "Субъекты",
            menu: "Субъекты",
        }
    },

    SUBJECT_ATTRS: {
        MNEMO: "subject-attribute",
        NAME: "Атрибуты субъекта",
        ROUTE: "SubjectAttribute",
        CONTAINER: "SubjectAttribute",
        API_VERSION: "spa/v1",
        API_ROUTE: "subject-attributes",
        API_SCHEME: `/subject-attributes`,
        TEXTS: {
            default: "Атрибуты субъекта",
            menu: "Атрибуты субъекта",
        }
    },
    SUBJECT_ATTR_TYPES: {
        MNEMO: "subject-attr-type",
        NAME: "Типы атрибутов субъекта",
        ROUTE: "SubjectAttributeTypes",
        CONTAINER: "SubjectAttributeTypes",
        API_VERSION: "spa/v1",
        API_ROUTE: "subject-attr-types",
        API_SCHEME: `/subject-attr-types`,
        TEXTS: {
            default: "Типы атрибутов субъекта",
            menu: "Типы атрибутов субъекта",
        }
    },

    SUBJECTS_SERVICE: {
        MNEMO: "subject-service",
        MNEMO2: "Subject-Service",
        NAME: "Услуга с субъектами",
        ROUTE: "SubjectService",
        CONTAINER: "SubjectService",
        API_VERSION: "spa/v1",
        API_ROUTE: "subject-services",
        SERVICES: '',
        API_SCHEME: '',
        MNEMOS: {
            default: "subject-service",
            route: "SubjectService",
            container: "SubjectService",
            api: "subject-services",
            additionalApi: "subject-services-additional-subjects"
        },
        LABELS: {
            default: "Услуга с субъектами",
            one: "Услуга с субъектами",
            many: "Услуги с субъектами"
        },

    },

    DATA_PROVIDERS: {
        MNEMO: "data-providers",
        MNEMO2: "DataProviders",
        NAME: "Источники данных",
        ROUTE: "DataProviders",
        CONTAINER: "DataProviders",
        API_VERSION: "spa/v1",
        API_ROUTE: "data-providers",
    },
    STATS: {
        MNEMO: "stats",
        MNEMO2: "Stats",
        FEATURE: "stats",
        NAME: "Статистика",
        ROUTE: "Stats",
        CONTAINER: "Stats",
        API_VERSION: "spa/v1",
        API_ROUTE: "/stats",
        TEXTS: {
            default: "Статистика",
            menu: "Статистика",
        }
    },

    DOCUMENTS: {
        MNEMO: "document",
        MNEMO2: "Documents",
        FEATURE: "documents",
        NAME: "Документы",
        ROUTE: "Documents",
        CONTAINER: "Documents",
        API_VERSION: "spa/v1",
        API_ROUTE: "/documents",
        TEXTS: {
            default: "Документы",
            menu: "Документы",
        }
    },

    TICKET_TYPES: {
        MNEMO: "ticket-types",
        MNEMO2: "Ticket-types",
        FEATURE: "ticket-types",
        NAME: "Типы заявок",
        ROUTE: "TicketTypes",
        CONTAINER: "TicketTypes",
        API_VERSION: "spa/v1",
        API_ROUTE: "/ticket-types",
        TEXTS: {
            default: "Типы заявок",
            menu: "Типы заявок",
        }
    },

    RULE_TARGETS: {
        MNEMO: "rule-targets",
        MNEMO2: "rule-targets",
        NAME: "",
        ROUTE: "RuleTargets",
        CONTAINER: "RuleTargets",
        API_VERSION: "spa/v1",
        API_ROUTE: "rule-targets",
        MNEMOS: {
            default: "rule-targets",
            route: "RuleTargets",
            container: "RuleTargets",
            api: "rule-targets"
        },
        LABELS: {
            default: "",
            one: "",
            many: ""
        },
        SERVICES: '',
    },

    TICKETS: {
        MNEMO: "tickets",
        MNEMO2: "tickets",
        NAME: "Заявка",
        ROUTE: "Tickets",
        CONTAINER: "Tickets",
        API_VERSION: "spa/v1",
        API_ROUTE: "tickets",
        MNEMOS: {
            default: "tickets",
            route: "Tickets",
            container: "Tickets",
            api: "tickets"
        },
        LABELS: {
            default: "Заявка",
            one: "Заявка",
            many: "Заявки"
        },
        SERVICES: '',
    },

    TICKET_ATTR_TYPES: {
        MNEMO: "ticket-attr-types",
        MNEMO2: "ticket-attr-types",
        NAME: "Типы атрибутов заявок",
        ROUTE: "TicketAttrTypes",
        CONTAINER: "TicketAttrTypes",
        API_VERSION: "spa/v1",
        API_ROUTE: "ticket-attr-types",
        MNEMOS: {
            default: "ticket-attr-types",
            route: "TicketAttrTypes",
            container: "TicketAttrTypes",
            api: "ticket-attr-types"
        },
        LABELS: {
            default: "Типы атрибутов заявок",
            one: "Тип атрибута заявки",
            many: "Типы атрибутов заявок"
        },
        SERVICES: '',
    },

    NOTIFY_POLICY: {
        MNEMO: "notify-policy",
        MNEMO2: "notify-policy",
        NAME: "Политики уведомлений",
        ROUTE: "notify-policy",
        CONTAINER: "NotifyPolicy",
        API_VERSION: "spa/v1",
        API_ROUTE: "notify/policy",
        MNEMOS: {
            default: "notify-policy",
            route: "notify-policy",
            container: "NotifyPolicy",
            api: "notify/policy"
        },
        LABELS: {
            default: "Политики уведомлений",
            one: "Политика уведомлений",
            many: "Политики уведомлений"
        },
        SERVICES: '',
    },

    NOTIFY_RULE: {
        MNEMO: "notify-rules",
        MNEMO2: "NotifyRule",
        NAME: "Правила уведомлений",
        ROUTE: "NotifyRule",
        CONTAINER: "NotifyRule",
        API_VERSION: "spa/v1",
        API_ROUTE: "notify/rules",
        MNEMOS: {
            default: "notify-rules",
            route: "NotifyRule",
            container: "NotifyRule",
            api: "notify/rules"
        },
        LABELS: {
            default: "Правила уведомлений",
            one: "Правило уведомлений",
            many: "Правила уведомлений"
        },
        SERVICES: ''
    },

    REACTIONS: {
        MNEMO: "reactions",
        MNEMO2: "Reactions",
        NAME: "Реакции",
        ROUTE: "Reactions",
        CONTAINER: "Reactions",
        API_VERSION: "spa/v1",
        API_ROUTE: "reactions",
        API_SERVICES: "",
        MNEMOS: {
            default: "reactions",
            route: "Reactions",
            container: "Reactions",
            api: "reactions"
        },
        LABELS: {
            default: "Реакции",
            one: "Реакция",
            many: "Реакции"
        },
    },

    IMPORT: {
        MNEMO: "import",
        MNEMO2: "import",
        NAME: "Импорт",
        ROUTE: "Import",
        CONTAINER: "Import",
        API_VERSION: "spa/v1",
        API_ROUTE: "import",
        MNEMOS: {
            default: "import",
            route: "Import",
            container: "Import",
            api: "import"
        },
        LABELS: {
            default: "Импорт",
            one: "Импорт",
            many: "Импортs"
        },
        SERVICES: '',
    },

    ENTITY_TYPES: {
        MNEMO: "entity-types",
        MNEMO2: "entity-types",
        NAME: "Типы сущностей",
        ROUTE: "EntityTypes",
        CONTAINER: "EntityTypes",
        API_VERSION: "spa/v1",
        API_ROUTE: "entity-types",
        MNEMOS: {
            default: "entity-types",
            route: "EntityTypes",
            container: "EntityTypes",
            api: "entity-types"
        },
        LABELS: {
            default: "Типы сущностей",
            one: "Тип сущности",
            many: "Типы сущностей"
        },
        SERVICES: '',
    },

    METRIC_GROUPS: {
        MNEMO: "metric-groups",
        MNEMO2: "metric-groups",
        NAME: "Группы метрик",
        ROUTE: "metric-groups",
        CONTAINER: "MetricGroups",
        API_VERSION: "spa/v1",
        API_ROUTE: "metric/groups",
        MNEMOS: {
            default: "metric-groups",
            route: "metric-groups",
            container: "MetricGroups",
            api: "metric/groups"
        },
        LABELS: {
            default: "Группы метрик",
            one: "Группы метрик",
            many: "Группы метрик"
        },
        SERVICES: "",
    },

    VTEMPLATES: {
        MNEMO: "vtemplates",
        MNEMO2: "Vtemplates",
        NAME: "Визуальные шаблоны",
        ROUTE: "Vtemplates",
        CONTAINER: "Vtemplates",
        API_VERSION: "spa/v1",
        API_ROUTE: "vtemplates",
        MNEMOS: {
            default: "vtemplates",
            route: "Vtemplates",
            container: "Vtemplates",
            api: "vtemplates"
        },
        LABELS: {
            default: "Визуальные шаблоны",
            one: "Визуальный шаблон",
            many: "Визуальные шаблоны"
        },
        SERVICES: '',
    }



}
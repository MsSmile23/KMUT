import AttributeCategoriesList from '@pages/attribute-categories/list'
import AttributeCategoriesCreate from '@pages/attribute-categories/create'
import AttributeCategoriesUpdate from '@pages/attribute-categories/update'
import AccountsCreate from '@pages/accounts/create'
import AccountsUpdate from '@pages/accounts/update'
import AccountsList from '@pages/accounts/list'
import AttributesCreate from '@pages/attributes/create'
import AttributesUpdate from '@pages/attributes/update'
import AttributesList from '@pages/attributes/list'
import ClassesCreate from '@pages/classes/create'
import ClassesUpdate from '@pages/classes/update'
import ClassesList from '@pages/classes/list'
import RelationsCreate from '@pages/relations/create'
import RelationsList from '@pages/relations/list'
import RelationsUpdate from '@pages/relations/update'
import StateMachinesCreate from '@pages/state-machine/create'
import StateMachinesList from '@pages/state-machine/list'
import StateMachinesUpdate from '@pages/state-machine/update'
import VtemplatesCreate from '@pages/vtemplates/create'
import VtemplatesList from '@pages/vtemplates/list'
import VtemplatesUpdate from '@pages/vtemplates/update'
import DiscoveryList from '@pages/discovery/list';
import * as PageObjects from '@pages/objects';
import RuleTemplatesCreate from '@pages/rule-templates/create'
import RuleTemplatesUpdate from '@pages/rule-templates/update'
import RuleTemplatesList from '@pages/rule-templates/list'
import * as PageSettings from '@pages/settings/layout';
import IncidentsList from '@pages/incidents/list'
import IncidentsShow from '@pages/incidents/show'
import { PAGES_INVENTORY } from '@pages/inventory'
import { PAGES_NOTIFICATIONS } from '@pages/notifications'
import AlekseyDev from '@pages/dev/aleksey'
import AlexTest from '@pages/dev/alex/AlexTest'
import ArtemDev from '@pages/dev/artem'
import { VladimirTest } from '@pages/dev/vladimir/VladimirTest'
import { Aptest } from '@pages/dev/aptest/Aptest'
import PavelDev from '@pages/dev/pavel'
import VtemplateDemo from '@pages/dev/demo/VtemplateDemo/VtemplateDemo'
import { AccessProvider, InterfaceProvider, PreloadProvider } from '../providers'
import { ConstructorMain, ManagerMain, ShowcaseMain } from '@pages/main'
import NikitaDev from '@pages/dev/nikita'
import MassActionsList from '@pages/system/mass-actions/list'
import MassActionsCreate from '@pages/system/mass-actions/create'
import MassActionsUpdate from '@pages/system/mass-actions/update'
import Registration from '@pages/public/zond/registration'

export const components = {
    constructor: {
        main: ConstructorMain,
        attributesCategories: {
            list: AttributeCategoriesList,
            create: AttributeCategoriesCreate,
            update: AttributeCategoriesUpdate,
        },
        accounts: {
            list: AccountsList,
            create: AccountsCreate,
            update: AccountsUpdate,
        },
        attributes: {
            list: AttributesList,
            create: AttributesCreate,
            update: AttributesUpdate,
        },
        classes: {
            list: ClassesList,
            create: ClassesCreate,
            update: ClassesUpdate,
        },
        relations: {
            list: RelationsList,
            create: RelationsCreate,
            update: RelationsUpdate,
        },
        stateMachines: {
            list: StateMachinesList,
            create: StateMachinesCreate,
            update: StateMachinesUpdate,
        },
        vtemplates: {
            list: VtemplatesList,
            create: VtemplatesCreate,
            update: VtemplatesUpdate,
        },
    },
    manager: {
        main: ManagerMain,
        accounts: {
            list: AccountsList,
            create: AccountsCreate,
            update: AccountsUpdate,
        },
        classes: {
            list: ClassesList,
            create: ClassesCreate,
            update: ClassesUpdate,
        },
        discovery: {
            list: DiscoveryList
        },
        objects: {
            list: PageObjects.List,
            create: PageObjects.Create,
            update: PageObjects.Update,
        },
        ruleTemplates: {
            list: RuleTemplatesList,
            create: RuleTemplatesCreate,
            update: RuleTemplatesUpdate,
        },
        system: {
            configuration: {},
            massActions: {
                list: MassActionsList,
                create: MassActionsCreate,
                update: MassActionsUpdate,
            },
            netflow: {}
        }
    },
    showcase: {
        main: ShowcaseMain,
        objects: {
            list: PageObjects.List,
            show: PageObjects.Show,
            map: PageObjects.Map,
            syslog: PageObjects.Syslog,
        },
        settings: {
            layout: PageSettings.LayoutSettings
        },
        incidents: {
            list: IncidentsList,
            show: IncidentsShow,
        },
        inventory: {
            list: PAGES_INVENTORY.List
        },
        notifications: {
            list: PAGES_NOTIFICATIONS.List,
        },
    },
    auth: {
        login: AccessProvider,
        preload: PreloadProvider,
        interfaceViews: InterfaceProvider
    },
    public: {
        zond: {
            registration: Registration
        }
    },
    dev: {
        alex: AlexTest,
        vladimir: VladimirTest,
        aleksey: AlekseyDev,
        artem: ArtemDev,
        aptest: Aptest,
        paveltest: PavelDev,
        vtemplateDemo: VtemplateDemo,
        nikita: NikitaDev,
    }
} as const
import { allFilters } from './filters';


export const filterFormInitialParameters: Record<keyof typeof allFilters, object> = {
    attributeFilter: {
        attributeId: null,
        comparision: null,
        value: '',
    },
    hasLinkFilter: {
        relationId: null,
        has: true,
        objectIds: [],
    },
    propertyFilter: {
        comparision: 'not_includes',
        property: 'codename',
        value: '',
    },
    textFilter: {
        text: '',
    },
};

export const filterFormTypesOptions: { value: keyof typeof allFilters, label: string }[] = [
    {
        label: 'Фильтр по свойству',
        value: 'propertyFilter',
    },
    {
        label: 'Фильтр по атрубуту',
        value: 'attributeFilter',
    },
    {
        label: 'Фильтр по связи',
        value: 'hasLinkFilter',
    },
];
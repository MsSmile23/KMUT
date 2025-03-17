import { FilterFunctionType } from '../types';

export type PropertyFilter = {
    property: 'name' | 'codename' | 'class_id',
    comparision: 'equals' | 'not_equals' | 'includes' | 'not_includes',
    value: any,
}

export const propertyFilter: FilterFunctionType<PropertyFilter> = (object, { comparision, property, value }) => {
    if (!object) {
        return false;
    }

    if (comparision === 'equals') {
        const objectValue = object[property];

        return objectValue === value;
    }

    if (comparision === 'not_equals') {
        const objectValue = object[property];

        return objectValue !== value;
    }

    if (comparision === 'includes') {
        const objectValue = object[property].toString();

        return objectValue.includes(value.toString());
    }

    if (comparision === 'not_includes') {
        const objectValue = object[property].toString();

        return !objectValue.includes(value.toString());
    }
    
    return true;
}
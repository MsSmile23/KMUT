import { allFilters } from '.';

export const applyFilter = (object, type: keyof typeof allFilters, parameters: any) => {
    const func = allFilters?.[type];

    if (!func) {
        console.error(`Фильтр ${type} не существует`);

        return false;
    }

    return func(object, parameters);
}
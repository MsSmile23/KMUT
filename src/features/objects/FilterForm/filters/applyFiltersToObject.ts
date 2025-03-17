import { IObject } from '@shared/types/objects';
import { FilterOption } from '../FilterForm';
import { applyFilter } from './applyFilter';

// Возвращает true, если все переданные фильтры возвращают true для объекта, иначе false
export const applyFiltersToObject = (object: IObject, filters: FilterOption[]) => {
    for (const filter of filters) {
        const result = applyFilter(object, filter.type, filter.parameters);
        
        if (!result) {
            return false;
        }
    }

    return true;
}
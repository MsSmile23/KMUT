import { FilterOption } from '../FilterForm/FilterForm'

export type FilterFormPreset = {
    name: string,
    id: number,
    filters: FilterOption[],
    targetClassesIds: number[],
    isUserPreset?: boolean;
}
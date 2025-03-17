import { IObject } from '@shared/types/objects';
import { allFilters } from './filters';

export type FormFilterObject = {
    type: keyof typeof allFilters,
    parameters: any,
    id: number,
}

export type FilterFunctionType<Options = undefined> = (object: IObject, options?: Options) => boolean;
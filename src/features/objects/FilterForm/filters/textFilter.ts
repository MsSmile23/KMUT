import { FilterFunctionType } from '../types';

export const textFilter: FilterFunctionType<{ text: string }> = (object, { text }) => {
    if (!object) {return false;}

    if (text === '') {return true;}
    
    return object.name.toString().toLocaleLowerCase().includes(text.toLocaleLowerCase());
}
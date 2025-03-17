import { create } from 'zustand';
import { TBaseStore } from '../types/types';
import { createBaseStore } from '../utils/createBaseStore';
import { immer } from 'zustand/middleware/immer';
import { IAttributeStereotype } from '@shared/types/attribute-stereotypes';
import { 
    getAttributeStereotypes 
} from '@shared/api/AttributeStereotypes/Models/getAttributeStereotypes/getAttributeStereotypes';

type Store = TBaseStore<IAttributeStereotype[]>

export const useAttributeStereotypeStore = create(immer<Store>((set, get) => ({
    ...createBaseStore<IAttributeStereotype[]>(set, get),
    data: [],
    localeName: 'Стереотипы атрибутов',
    request: () => getAttributeStereotypes({ all: true })
})))
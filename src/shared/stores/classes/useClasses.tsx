import { IClass } from '@shared/types/classes'
import { TBaseStore } from '../types/types'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { createBaseStore } from '../utils/createBaseStore'
import { getClasses } from '@shared/api/Classes/Models/getClasses/getClasses'

export const useClasses = create(immer<TBaseStore<IClass[]>>((set, get) => ({
    ...createBaseStore<IClass[]>(set, get),
    data: [],
    timer: 60_000,
    localeName: '',
    request: () => getClasses({ all: true }),
})))
import { TBaseStore } from '../types/types'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { createBaseStore } from '../utils/createBaseStore'
import { getObjects } from '@shared/api/Objects/Models/getObjects/getObjects'
import { IObject } from '@shared/types/objects'

export const useObjects = create(immer<TBaseStore<IObject[]>>((set, get) => ({
    ...createBaseStore<IObject[]>(set, get),
    data: [],
    timer: 60_000,
    localeName: '',
    request: () => getObjects({ all: true }),
})))
import { ReactNode } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface IUnformalTemplateOption {
    value: number,
    label: string
}

export interface IColumnReport {
    key: number
    name: string | ReactNode
    attribute: string
    attributePath: string[]
    relations: Record<string, number[]>
    aggregation: 'min' | 'avg' | 'max'
}

interface IUnformalStore {
    name: string
    columns: IColumnReport[]
    templateOptions: IUnformalTemplateOption[],
    templateColumns: Record<number, IColumnReport[]>

    update: (obj: Partial<IUnformalStore>) => void
    updateColumns: (columns: IColumnReport[]) => void
    saveTemplate: () => void 
}

export const useUnformalStore = create<IUnformalStore>()(
    persist((set) => ({
        name: '',
        columns: [],
        templateOptions: [],
        templateColumns: {},
        update: (obj) => set((state) => ({ ...state, ...obj })),
        updateColumns: (columns) => set(() => ({ columns })),
        saveTemplate: () => set((state) => {
            const uuid = Date.now()

            return {
                ...state,
                templateOptions: [...state.templateOptions, { value: uuid, label: state.name }],
                templateColumns: { ...state.templateColumns, [uuid]: state.columns },
            }
        })
    }),
    { 
        name: 'unformalStore',
        partialize: (state) => ({
            templateOptions: state.templateOptions,
            templateColumns: state.templateColumns,
        }) 
    })
)
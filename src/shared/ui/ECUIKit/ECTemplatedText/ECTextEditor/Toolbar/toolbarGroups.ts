export type TToolbarGroupBase = {
    id: number,
    format: 'bold' | 'italic' | 'underline' | 'alignLeft' | 'alignCenter' | 'alignRight' | 'template',
    type: 'mark' | 'block' | 'dropdown' | 'dropdownClasses',
}

export interface TToolbarGroupDropdown extends TToolbarGroupBase {
    id: number,
    type: 'dropdown' | 'dropdownClasses',
    options: {
        label: string,
        value: string
    }[]
}

export type TToolbarGroup = TToolbarGroupBase | TToolbarGroupDropdown

const toolbarGroups: TToolbarGroup[][] = [
    [
        {
            id: 1,
            format: 'bold',
            type: 'mark'
        },
        {
            id: 2,
            format: 'italic',
            type: 'mark'
        },
        {
            id: 3,
            format: 'underline',
            type: 'mark'
        }
    ],
    [
        {
            id: 4,
            format: 'alignLeft',
            type: 'block'
        },
        {
            id: 5,
            format: 'alignCenter',
            type: 'block'
        },
        {
            id: 6,
            format: 'alignRight',
            type: 'block'
        }
    ],
    [
        {
            id: 7,
            format: 'template',
            type: 'dropdownClasses',
            options: []
        } as TToolbarGroupDropdown,
    ],
    [
        {
            id: 8,
            format: 'template',
            type: 'dropdown',
            options: [
                { label: 'Название объекта', value: 'object:name' },
                { label: 'Id объекта', value: 'object:id' },
                { label: 'Класс объекта', value: 'object.class:name' },
                { label: 'Id класса объекта', value: 'object:class_id' }
            ]
        } as TToolbarGroupDropdown,
    ]
]
  
export default toolbarGroups
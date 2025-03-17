export type TFieldConstructionItemAtribute = {
    id: number
    value: number
    label: string
    hasAgregation: boolean
    agregation?: string //TODO Возможно поменяется тип
}

export type TFieldConstructorItem = {
    value: number
    name: string
    label: string
    level: number
    parentId: number,
    attributes: TFieldConstructionItemAtribute[]
}

export interface IRootClassLinkFormProps {
    root: number
    direction: 'childs' | 'parents'
    items: TFieldConstructorItem[]
    setItems: React.Dispatch<React.SetStateAction<TFieldConstructorItem[]>>
    agregationOptions: {value: string, label: string}[]
}
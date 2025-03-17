import { IDataType } from '@shared/types/data-types'
import { IAttribute } from '@shared/types/attributes'
//TODO:: почему отсюда импортируется???
import { IOa } from '@containers/objects/ObjectFormContainer/ObjectFormContainer/ObjectFormContainer'

export type TOAttrFieldProps = {
    rules: {required: boolean, message: string}
    id: number | null
    inner_type: IDataType['inner_type'],
    initialValue: string | null,
    valuePropName: 'checked' | undefined,
    name: string,
    isDeletable: boolean,
    isNextAddable: boolean,
    isLast: boolean,
    isButtons: boolean
    deleted?: boolean
}

export type TOAttrForForm = IAttribute & {
    currentAmount: number
    minAmount: number
    maxAmount: number
    objectAttributes?: IOa[]
    fields: TOAttrFieldProps[]
    settings: {
        cols: number,
    }
}
import { Rule } from 'antd/es/form'
import { rulesClassFormDefaultValues } from './rulesClassFormData'

type IRulesKeys = keyof typeof rulesClassFormDefaultValues
interface IFormFieldProps {
    label: string
    rules: Rule[]
    name: IRulesKeys
}

export const rulesClassesTableProps: Record<IRulesKeys, IFormFieldProps> = {
    class_id: { label: '', rules: [{ required: true, message: 'Обязательно' }], name: 'class_id' },
    attribute_id: { label: '', rules: [{ required: true, message: 'Обязательно' }], name: 'attribute_id' },
    operator: { label: '', rules: [{ required: true, message: 'Обязательно' }], name: 'operator' },
    state_ids: { label: '', rules: [{ required: true, message: 'Обязательно' }], name: 'state_ids' },
    min: { label: 'мин', rules: [{ required: true, message: 'Обязательно' }], name: 'min' },
    rules: { label: '', rules: [{ required: true, message: 'Обязательно' }], name: 'rules' },
}

export const operationsColumnsRulesClassTable = [
    { key: 'class_id', title: '', ellipsis: true, width: '20%' },
    { key: 'attribute_id', title: '', width: '20%', ellipsis: true },
    { key: 'operator', title: '', width: '15%' },
    { key: 'state_ids', title: '', width: '20%' },
    { key: 'min', title: '', width: '15%' },
    { key: 'delete', title: '', width: '5%' },
].map((col) => ({ ...col, dataIndex: col.key }))

export const manageClassOperatorOptions = [
    { value: 1, label: 'Входит' },
    // { value: 'separator', label: '–––', disabled: true },
    { value: 0, label: 'Не входит' },
]
import { Rule } from 'antd/es/form'
import { rulesAttributeFormDefaultValues } from './rulesAttributeFormData'



type IRulesKeys = keyof typeof rulesAttributeFormDefaultValues
interface IFormFieldProps {
    label: string,
    rules: Rule[],
    name: IRulesKeys,
}

export const rulesAttributeTableProps: Record<IRulesKeys, IFormFieldProps> = {
    operator: { label: 'Значение атрибута', rules: [{ required: true, message: 'Обязательно' }], name: 'operator' },
    right_operand: { label: '1', rules: [{ required: true, message: 'Обязательно' }], name: 'right_operand' },
    depth_value: { label: 'Глубина анализа', rules: [{ required: true, message: 'Обязательно' }], name: 'depth_value' },
    depth_type: { label: '2', rules: [{ required: true, message: 'Обязательно' }], name: 'depth_type' },
    rules: { label: '3', rules: [{ required: true, message: 'Обязательно' }], name: 'rules' },
}

export const operationsColumnsRulesAttributeTable = [
    { key: 'operator', title: '', width: '25%', ellipsis: true },
    { key: 'right_operand', title: '', width: '13%' },
    { key: 'depth_value', title: '', width: '20%' },
    { key: 'depth_type', title: '', width: '10%' },
    { key: 'delete', title: '', width: '5%' },
].map((col) => ({ ...col, dataIndex: col.key }))
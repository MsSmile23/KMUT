import { Rule } from 'antd/es/form'
import { statesFormDefaultValues } from './statesFormData'



type IStatesKeys = keyof typeof statesFormDefaultValues
interface IFormFieldProps {
    label: string,
    rules: Rule[],
    name: IStatesKeys,
}

export const statesProps: Record<IStatesKeys, IFormFieldProps> = {
    name: { label: 'Название', rules: [{ required: true, message: 'Обязательно' }], name: 'name' },
    parent_state_id: { label: 'Надсостояние', rules:
    [{ required: false, message: 'Обязательно' }], name: 'parent_state_id' },
    view_params: { label: 'Тип отображения', rules: [{ required: true, message: 'Обязательно' }], name: 'view_params' },
    effects: { label: 'Тип', rules: [{ required: true, message: 'Обязательно' }], name: 'effects' },
    object_attributes: undefined,
    objects: undefined,
    state_machine_id: undefined,
    state_section_id: undefined,
    state_machine: undefined,
    rules_tree: undefined,
    rule_group_id: undefined,
    priority: undefined,
    mnemo: undefined,
    is_entry_state: undefined,

}

export const statesPropsNames = {
    value: { label: 'Значение', rules: [{ required: true, message: 'Обязательно' }], name: 'value' },
    type: { label: 'Значение', rules: [{ required: true, message: 'Обязательно' }], name: 'type' },
    effects_type: { label: 'Тип', rules: [{ required: false, message: 'Обязательно' }], name: 'type' },
    effects_operation: { label: 'Действие', rules: [{ required: false, message: 'Обязательно' }],
        name: 'operation' },
    effects_action: { label: 'Действие', rules: [{ required: false, message: 'Обязательно' }],
        name: 'action' },
}


export const operationsColumnsViewTable = [
    { key: 'type', title: 'Тип', width: '45vw' },
    { key: 'value', title: 'Значение', width: '47vw' },
    { key: 'delete', title: '', width: '8vw' },
].map((col) => ({ ...col, dataIndex: col.key }))

export const operationsColumnsEffectsTable = [
    { key: 'type', title: 'Тип', width: '30vw' },
    { key: 'operation', title: 'Операция', width: '30vw' },
    { key: 'action', title: 'Действие', width: '30vw' },
    { key: 'delete', title: '', width: '10vw' },
].map((col) => ({ ...col, dataIndex: col.key }))
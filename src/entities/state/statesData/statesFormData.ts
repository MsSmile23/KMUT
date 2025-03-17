export const statesOptions = [
    { id: 0, value: 'fill', label: 'Цвет фона' },
    { id: 1, value: 'textColor', label: 'Цвет шрифта' },
    { id: 2, value: 'icon', label: 'Иконка' },
    { id: 3, value: 'border', label: 'Цвет рамки' },
]

export const effectsTypeOptions = [
    { id: 0, value: 'entry', label: 'При входе' },
    { id: 1, value: 'exit', label: 'При выходе' },
    { id: 2, value: 'insideActivity', label: 'Внутренняя активность' },
]

export const effectsOperationsOptions = [
    { id: 0, value: 'create_object', label: 'Создание объекта заданного класса' },
    { id: 1, value: 'edit_object', label: 'Редактирование объекта заданного класса' },
    { id: 2, value: 'email', label: 'Отправка сообщения на почту' },
]

const dynamicType = `type-${undefined}`
const dynamicValue = `value-${undefined}`
const dynamicEffectsType = `type-${undefined}`
const dynamicEffectsOperation = `operation-${undefined}`
const dynamicEffectsAction = `action-${undefined}`


export const baseViewParams = { [dynamicType]: '', [dynamicValue]: '#FFFFFF' }

export const statesFormDefaultValues = {
    name: '',
    view_params: [{
        [dynamicType]: undefined,
        [dynamicValue]: undefined,
    }],

    effects: [{
        [dynamicEffectsType]: undefined,
        [dynamicEffectsOperation]: undefined,
        [dynamicEffectsAction]: undefined,
    }],
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
    parent_state_id: undefined,
    state_stereotype_id: undefined,
    // entryState: false

}

export const statesFormItemNames = Object.keys(statesFormDefaultValues)
    .reduce((obj, k) => ({ ...obj, [k]: k }), {} as Record<keyof typeof statesFormDefaultValues, string>)
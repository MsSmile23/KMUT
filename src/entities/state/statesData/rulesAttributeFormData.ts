export const manageOperatorOptions = [
    { id: 0, value: '<', label: 'Меньше' },
    { id: 1, value: '<=', label: 'Меньше или равно' },
    { id: 2, value: '==', label: 'Равно' },
    { id: 3, value: '>', label: 'Больше' },
    { id: 4, value: '>=', label: 'Больше или равно' },
]

export const BooleanOperatorOptions = [
    {
        id: 0,
        value: 0,
        label: 'Ложь',
    },
    {
        id: 1,
        value: 1,
        label: 'Истина',
    },
]

export const manageDepthTypeOptions = [
    { id: 0, value: 'min', label: 'Минут' },
    { id: 1, value: 'dot', label: 'Точек' },
]

export const rulesAttributeFormDefaultValues = {
    operator: undefined,
    right_operand: undefined,
    depth_type: undefined,
    depth_value: undefined,
    rules: undefined,
}

export const statesFormItemNames = Object.keys(rulesAttributeFormDefaultValues).reduce(
    (obj, k) => ({ ...obj, [k]: k }),
    {} as Record<keyof typeof rulesAttributeFormDefaultValues, string>
)
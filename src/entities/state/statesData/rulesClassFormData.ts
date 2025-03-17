export const rulesClassFormDefaultValues = {
    class_id: undefined,
    attribute_id: undefined,
    operator: undefined,
    state_ids: undefined,
    min: undefined,
    rules: undefined,
}

export const statesFormItemNames = Object.keys(rulesClassFormDefaultValues)
    .reduce((obj, k) => ({ ...obj, [k]: k }), {} as Record<keyof typeof rulesClassFormDefaultValues, string>)
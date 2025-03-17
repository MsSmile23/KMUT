export const viewParamsData = [
    {
        id: 1,
        states: [
            { type: 'name', value: 'vp_1' },
            { type: 'fill', value: '#FFFFFF' },
            { type: 'textColor', value: '#FFFFFF' },
            { type: 'icon', value: '#FFFFFF' },
            { type: 'borderColor', value: '#FFFFFF' }
        ]
    },
    {
        id: 2,
        states: [
            { type: 'name', value: 'vp_2' },
            { type: 'fill', value: '#FFFFFF' },
            { type: 'textColor', value: '#FFFFFF' },
            { type: 'icon', value: '#E2F015' },
            { type: 'borderColor', value: '#FFFFFF' }
        ]
    },
    {
        id: 3,
        states: [
            { type: 'name', value: '#FFFFFF' },
            { type: 'fill', value: '#E2F015' },
            { type: 'textColor', value: '#FFFFFF' },
            { type: 'icon', value: '#FFFFFF' },
            { type: 'borderColor', value: '#FFFFFF' }
        ]
    }

]

export const effectsData = [
    {
        id: 0,
        effects: [
            { type: 'insideActivity', operation: 'create_object', action: 'К выполнению' },
            { type: 'exit', operation: 'edit_object', action: 'К согласованию' },
            { type: 'entry', operation: 'email', action: 'Отправить' },
            // { type: 'entry', operation: 'create_object', action: 'Поддержать' },
            // { type: 'exit', operation: 'email', action: 'Переслать' },
            // { type: 'insideActivity', operation: 'create_object', action: '' },
        ]
    }
]


export const manageRulesTableData = [
    {
        id: 10,
        rule_group_id: 11,
        attribute_id: 35,
        operator: '=',
        right_operand: true,
        depth_type: 'dot',
        depth_value: 10,
        pseudo_rule_group_id: 100
    },
    {
        id: 11,
        rule_group_id: 12,
        attribute_id: 36,
        operator: '>=',
        right_operand: 'STRING',
        depth_type: 'min',
        depth_value: 12,
        pseudo_rule_group_id: 101
    },
    {
        id: 12,
        rule_group_id: 12,
        attribute_id: 36,
        operator: '<',
        right_operand: 555,
        depth_type: 'dot',
        depth_value: 1500,
        pseudo_rule_group_id: 101
    }
]


export const manageRulesClassTableData = [
    {
        id: 12,
        rule_group_id: 14,
        class_id: null,
        attribute_id: 2,
        operator: 'Входит',
        state_ids: [10007, 10006],
        min: 10,
        pseudo_rule_group_id: 45
    },
]
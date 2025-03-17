
export interface IRuleTemplate {
    id: number,
    state_id: number,
    rules: [
        {
            rules: [
                {
                    id: number,
                    min: number,
                    count: number,
                    class_id: number,
                    operator: boolean,
                    state_ids: number[],
                    count_type: string,
                    entity_type: string,
                    attribute_id: number,
                    rule_group_id: number
                }
            ],
            is_leaf: boolean,
            group_operand: 'or'| 'and'
        }
    ],
    state: {
        id: number,
        view_params: {
            name: string,
            params: [
                {
                    type: string,
                    value: string
                }
            ]
        },
        state_machine_id: number,
        created_at: string,
        updated_at: string,
        priority: number,
        is_entry_state: boolean,
        state_section_id: number,
        rule_group_id: number,
        state_stereotype_id: number
    }
}

export interface IAttributeRuleTemplatePost  {
    state_id: number,
    rules:  {
        id: number,
        right_operand: number,
        depth_value: number
    }[]
    
}

export interface ISyncRuleTemplates {
    id: number,
    state_id: number,
    entity: 'objects' | 'objectAttributes',
    entity_ids: number[],
    method: 'sync' | 'update'
}

export interface IRuleTemplateGet extends IRuleTemplate {
    object_attributes: any[]
}
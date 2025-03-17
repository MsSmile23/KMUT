
export interface IClassRule{
    rule_group_pseudo_id: number,
    entity_type: string,
    attribute_id: number,
    class_id: number,
    operator: boolean,
    state_ids: number[],
    min: number
}
export interface IAttributeRule {

}
export  interface IGroup{
id: number, 
parent_id: number, 
group_operand: 'and' | 'or',
pseudo_id: number, 
pseudo_parent_id: number,
}

export interface IClassRulesGroups {
    groups: IGroup[],
    rules: IClassRule[]
}
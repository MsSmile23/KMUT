import { FC, useEffect, useState } from 'react'
import { useApi2 } from '@shared/hooks/useApi2'
import { getStateMachines } from '@shared/api/State-machines/Models/getStateMachines/getStateMachines'
import OneGroupComponent from '../OneGroupComponent/OneGroupComponent'
import { IDataType } from '@shared/types/data-types'
import { SERVICES_RULES } from '@shared/api/Rules'

interface IAttributeRule {
    attribute_id?: number
    operator: '<' | '<=' | '==' | '>' | '>='
    right_operand: string | boolean | number
    depth_type: 'min' | 'dot'
    depth_value: number
    pseudo_id: number
}

interface IClassRule {
    class_id: number
    attribute_id: number
    operator: any
    state_ids: any
    min: number
}

export type IRule = {
    rule_group_pseudo_id: number
    rule_group_id: number | null
    id: number | null,

} & (IAttributeRule | IClassRule)

interface ICommonGroupsComponent {
    attributesEnable: boolean
    chosenClasses: any
    chosenDataType: IDataType,
    value?: any, 
    onChange?: any,
    stateId?: number
    disableForm?: boolean
    rulesFromRuleTemplate?: any[]
}
export interface IGroupsInterface {
    id?: number
    parent_id: number | null
    group_operand: 'or' | 'and'
    pseudo_id: number
    pseudo_parent_id: number | null
}

const CommonGroupsComponent: FC<ICommonGroupsComponent> = ({
    attributesEnable, 
    chosenClasses,
    chosenDataType, 
    value, 
    onChange, stateId, disableForm,
    rulesFromRuleTemplate }) => {
    const [pseudoId, setPseudoId] = useState<number>(1)
    const [groups, setGroups] = useState<IGroupsInterface[]>([{
        parent_id: null,
        group_operand: 'or',
        pseudo_id: 1,
        pseudo_parent_id: null,
    }])

    useEffect(() => {


        if (stateId !== undefined && stateId !== null) {

            const groups: IGroupsInterface[] = []
            const rules: any[] = []
            let pseudoIdCounter = pseudoId


            SERVICES_RULES.Models.getRulesByStateId(stateId).then((resp) =>
            {
                if (resp.success)
                {
                    if (resp?.data !== undefined) {
                        resp.data.forEach(item => {
                      
                            const pseudoParentId = groups.find(gr => gr.id == item.parent_id)?.pseudo_id ?? null

                            groups.push({
                                parent_id: item.parent_id,
                                group_operand: item.group_operand,
                                pseudo_id: pseudoIdCounter,
                                pseudo_parent_id: pseudoParentId,
                                id: item?.id
                            })
                            pseudoIdCounter += 1

                            item.rules.forEach(rule => {
                        
                                const rulePseudoGroupId = groups.find(gr => gr.id == rule.rule_group_id)?.pseudo_id

                                if ( attributesEnable) 
                                {
                                    rules.push({
                                        id: rule?.id,
                                        rule_group_id: rule.rule_group_id,
                                        rule_group_pseudo_id: rulePseudoGroupId,
                                        pseudo_id: pseudoIdCounter,
                                        operator: rule?.operator, 
                                        depth_value: rule?.depth_value,
                                        depth_type: rule?.depth_type,
                                        right_operand: rule?.right_operand,
                                        


                                    })
                                    pseudoIdCounter += 1
                                }
                                else {
                                    rules.push(
                                        { id: rule.id,
                                            min: rule.min,
                                            rule_group_id: rule.rule_group_id,
                                            state_ids: rule.state_ids,
                                            operator: rule.operator,
                                            rule_group_pseudo_id: rulePseudoGroupId,
                                            attribute_id: rule.attribute_id,
                                            pseudo_id: pseudoIdCounter,
                                            class_id: rule.class_id,
                                            entity_type: rule.entity_type,
                                            count: rule.count, 
                                            count_type: rule.count_type

                                        }
                                    ) 
                                    pseudoIdCounter += 1
                                }
                            }
                            )
                        })

                        if (rulesFromRuleTemplate?.length > 0 && rulesFromRuleTemplate !== undefined) {
 
                            rules.splice(0, rules.length)

                            rulesFromRuleTemplate.forEach(item => {
                        
                                item.rules.forEach(rule => {
                                    const rulePseudoGroupId = groups.find(gr => gr.id == rule.rule_group_id)?.pseudo_id

                                    rules.push({
                                        id: rule?.id,
                                        rule_group_id: rule.rule_group_id,
                                        rule_group_pseudo_id: rulePseudoGroupId,
                                        pseudo_id: pseudoIdCounter,
                                        operator: rule?.operator, 
                                        depth_value: rule?.depth_value,
                                        depth_type: rule?.depth_type,
                                        right_operand: rule?.right_operand,
    
                                    })
                                    pseudoIdCounter += 1
                                })
                            })
 
                        }

                        setPseudoId(pseudoIdCounter)
                        setGroups(groups)
                        setRuleAndGroups((prev) => ({
                            ...prev,
                            groups: groups,
                            rules: rules,
                        }));
                        
                    }
                }  
            }
            
            )
        }


    }, [stateId])

    const stateMachines = useApi2(getStateMachines)?.data


    const [ruleAndGroups, setRuleAndGroups] = useState({
        groups: [] as IGroupsInterface[],
        rules: [] as IRule[],
    })

    useEffect(() => {

        setRuleAndGroups((prev) => ({
            ...prev,
            groups: groups
        }));
    }, [groups])

    useEffect(() => {
        onChange(ruleAndGroups)

    }, [ruleAndGroups])

    


    return (
        <OneGroupComponent
            disabledForm={disableForm}
            stateId={stateId}
            attributesEnable={attributesEnable}
            key={groups[0]?.pseudo_id}
            group={groups[0]}
            groups={groups}
            setPseudoId={setPseudoId}
            setGroups={setGroups}
            pseudoId={pseudoId}
            value={ruleAndGroups.groups}
            stateMachines={stateMachines}
            ruleAndGroups={ruleAndGroups}
            setRuleAndGroups={setRuleAndGroups}
            chosenClasses={chosenClasses}
            chosenDataType={chosenDataType}

            
        />
    )
}

export default CommonGroupsComponent
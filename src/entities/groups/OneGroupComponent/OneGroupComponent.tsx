import { FC } from 'react'
import { IStateMachine } from '@shared/types/state-machines'
import GroupComponent from '../GroupComponent/GroupComponent'
import { IGroupsInterface, IRule } from '../CommonGroupsComponent/CommonGroupsComponent'
import { IDataType } from '@shared/types/data-types'


interface IOneGroupComponent {
    group: any
    groups: IGroupsInterface[]
    setGroups: React.Dispatch<React.SetStateAction<IGroupsInterface[]>>
    pseudoId: number
    setPseudoId: React.Dispatch<React.SetStateAction<number>>
    value?: any
    stateMachines?: IStateMachine[]
    attributesEnable: boolean
    ruleAndGroups: {
        groups: IGroupsInterface[]
        rules: IRule[]
    }
    setRuleAndGroups: React.Dispatch<
        React.SetStateAction<{
            groups: IGroupsInterface[]
            rules: IRule[]
        }>
    >
    chosenClasses: number[],
    chosenDataType: IDataType
    stateId?: number
    disabledForm?: boolean
   
}
const OneGroupComponent: FC<IOneGroupComponent> = ({ 
    group, 
    groups,
    setGroups,
    pseudoId,
    setPseudoId,
    stateMachines,
    attributesEnable,
    ruleAndGroups,
    setRuleAndGroups,
    chosenClasses,
    chosenDataType,
    stateId,
    disabledForm }) => {
    const createRule = (group: IGroupsInterface) => {
        const childrenRules = groups?.filter((rl) => rl.pseudo_parent_id == group.pseudo_id)

        if (childrenRules?.length > 0) {
            
            return (
                <GroupComponent
                    stateId={stateId}
                    ruleAndGroups={ruleAndGroups}
                    setRuleAndGroups={setRuleAndGroups}
                    attributesEnable={attributesEnable}
                    key={group.pseudo_id}
                    group={group}
                    groups={groups}
                    setGroups={setGroups}
                    pseudoId={pseudoId}
                    setPseudoId={setPseudoId}
                    stateMachines={stateMachines}
                    chosenClasses={chosenClasses}
                    chosenDataType={chosenDataType}
                    disabledForm={disabledForm}
                >
                    {childrenRules?.length > 0 &&
                    childrenRules?.map((rl) => {
                        return (
                            createRule(rl)
                        )
                    })}
                </GroupComponent>
            )
        }
        else {
            return (
                <GroupComponent
                    stateId={stateId}
                    ruleAndGroups={ruleAndGroups}
                    setRuleAndGroups={setRuleAndGroups}
                    attributesEnable={attributesEnable}
                    key={group.pseudo_id}
                    group={group}
                    groups={groups}
                    setGroups={setGroups}
                    pseudoId={pseudoId}
                    setPseudoId={setPseudoId}
                    stateMachines={stateMachines}
                    chosenClasses={chosenClasses}
                    chosenDataType={chosenDataType}
                    disabledForm={disabledForm}
                >

                </GroupComponent>
            )
            
        }
 
    }
    const OneGroupComponent: React.ReactNode = createRule(group) 


    return <>{OneGroupComponent}</>
}

export default OneGroupComponent
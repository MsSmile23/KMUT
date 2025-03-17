import { Buttons } from '@shared/ui/buttons'
import { Select } from '@shared/ui/forms/Select/Select'
import { Card, Col, Row } from 'antd'
import { FC, useEffect, useState } from 'react'
import { IStateMachine } from '@shared/types/state-machines'
import StatesRulesClassForm from '@entities/states/StatesRulesClassForm/StatesRulesClassForm'
import { IGroupsInterface, IRule } from '../CommonGroupsComponent/CommonGroupsComponent'
import StatesRulesAttrForm from '@entities/states/StatesRulesAttrForm/StatesRulesAttrForm'
import { IDataType } from '@shared/types/data-types'

interface IGroupComponent {
    group: IGroupsInterface
    children?: any
    groups: IGroupsInterface[]
    setGroups: React.Dispatch<React.SetStateAction<IGroupsInterface[]>>
    pseudoId: number
    setPseudoId: React.Dispatch<React.SetStateAction<number>>
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
    chosenClasses: number[]
    chosenDataType: IDataType
    stateId?: number
    disabledForm?: boolean
}

const GroupComponent: FC<IGroupComponent> = ({
    group,
    children,
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
    disabledForm
}) => {



    const [groupOperand, setGroupOperand] = useState<'or'| 'and'> ('or')

    const addGroupHandler = () => {
        const localGroups = [...groups]
        const newGroup: IGroupsInterface = {
            pseudo_parent_id: group.pseudo_id,
            parent_id: group.id,
            group_operand: 'or',
            pseudo_id: pseudoId + 1,
        }

        localGroups.push(newGroup)
        setPseudoId(pseudoId + 1)
        setGroups(localGroups)
    }

    useEffect(() => {
        setGroupOperand(group.group_operand)
    }, [group])

    const deleteGroupHandler = (groupPseudoId) => {
        const localGroups = [...groups]

        const groupsForDelete: number[] = []
        const groupsAfterDeleted: IGroupsInterface[] = []

        localGroups.forEach((item) => {
            if (
                item.pseudo_id == groupPseudoId ||
                item.pseudo_parent_id == groupPseudoId ||
                groupsForDelete.includes(item.pseudo_parent_id)
            ) {
                groupsForDelete.push(item.pseudo_id)
            } else {
                groupsAfterDeleted.push(item)
            }
        })

        const localRules = [...ruleAndGroups.rules]

        setRuleAndGroups((prev) => ({
            ...prev,
            rules: localRules.filter((rule) => !groupsForDelete.includes(rule?.rule_group_pseudo_id)),
        }))
        setGroups(groupsAfterDeleted)
    }

    const addRule = () => {
        const localRules = [...ruleAndGroups.rules]
        const attributeRulePattern: IRule = {
            rule_group_pseudo_id: group.pseudo_id,
            rule_group_id: group.id,
            pseudo_id: pseudoId + 1,
            operator: '==',
            right_operand: null,
            depth_type: 'dot',
            depth_value: 1,
            id: null,
            

        }

        const classRulePattern = {
            id: null,
            rule_group_id: group.id,
            class_id: null,
            attribute_id: null,
            operator: 1,
            state_ids: [],
            min: 1,
            rule_group_pseudo_id: group.pseudo_id,
            pseudo_id: pseudoId + 1,
           
        }

        localRules.push( attributesEnable ? attributeRulePattern : classRulePattern)
        setPseudoId(pseudoId + 1)

        setRuleAndGroups((prev) => ({
            ...prev,
            rules: localRules,
        }))
    }

    const deleteRulesHandler = () => {
        const localRules = [...ruleAndGroups.rules]

        setRuleAndGroups((prev) => ({
            ...prev,
            rules: localRules.filter((rule) => rule.rule_group_pseudo_id !== group.pseudo_id),
        }))
    }

    const createRules = () => {
        const rules = ruleAndGroups.rules.filter((rl) => rl.rule_group_pseudo_id == group.pseudo_id)

        if (rules.length > 0) {
            if (attributesEnable) {
                return (
                    <StatesRulesAttrForm
                        disabledForm={disabledForm}
                        stateId={stateId}
                        chosenDataType={chosenDataType}
                        value={rules}
                        onChange={onChangeRulesHandler}
                        pseudoId={pseudoId}
                        setPseudoId={setPseudoId}
                        group={group}
                    />
                )
            } else {
                return (
                    <StatesRulesClassForm
                        disabledForm={disabledForm}
                        stateId={stateId}
                        value={rules}
                        class_ids={chosenClasses}
                        onChange={onChangeRulesHandler}
                        stateMachines={stateMachines}
                        group={group}
                        pseudoId={pseudoId}
                        setPseudoId={setPseudoId}
                    />
                )
            }
        }
    }

    const onChangeRulesHandler = (newRules) => {
        const localRules = [...ruleAndGroups.rules]
        const rules = localRules.filter((item) => item.rule_group_pseudo_id !== group.pseudo_id)

        setRuleAndGroups((prev) => ({
            ...prev,
            rules: [...rules, ...(newRules ?? [])],
        }))
    }

    const onChangeGroupOperand = (operand) => {
        const filteredGroups = [...ruleAndGroups.groups].filter(gr => gr.pseudo_id !== group.pseudo_id)
        const changedGroup = [...ruleAndGroups.groups].find(gr => gr.pseudo_id == group.pseudo_id)


        filteredGroups.push({
            group_operand: operand,
            parent_id: group.parent_id,
            pseudo_id: group.pseudo_id,
            pseudo_parent_id: group.pseudo_parent_id,
            id: changedGroup?.id ?? null,
        })

        setRuleAndGroups((prev) => ({
            ...prev,
            groups: filteredGroups,
        }))
        setGroupOperand(operand)
       

    }
    const RuleComponent: React.ReactNode = createRules()

    return (
        <Card style={{ marginBottom: '10px', borderWidth: '10px' }} bodyStyle={{ padding: '10px' }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: '10px' }}>
                <Col>
                    <Select
                        disabled={disabledForm}
                        allowClear={false}
                        onChange={(e) => onChangeGroupOperand(e)}
                        searchable={false}
                        style={{ width: '80px' }}
                        options={[
                            { value: 'or', label: 'ИЛИ' },
                            { value: 'and', label: 'И' },
                        ]}
                        value={groupOperand}
                    />
                </Col>
                <Col span={3}>
                    <Row gutter={[8, 8]} justify="end">
                        <Col>
                            <Buttons.ButtonAdd
                                disabled={disabledForm}
                                size="small"
                                shape="circle"
                                text={false}
                                tooltipText="Добавить группу"
                                onClick={addGroupHandler}
                            />
                        </Col>
                        <Col>
                            {ruleAndGroups.rules.filter((rule) => rule.rule_group_pseudo_id == group.pseudo_id).length >
                            0 ? (
                                    <Buttons.ButtonDeleteRules
                                        disabled={disabledForm} 
                                        size="small"
                                        shape="circle"
                                        text={false}
                                        onClick={() => {
                                            deleteRulesHandler()
                                        }}
                                    />
                                ) : (
                                    <Buttons.ButtonAdd
                                        disabled={disabledForm}
                                        color="green"
                                        size="small"
                                        shape="circle"
                                        text={false}
                                        tooltipText="Добавить правило"
                                        onClick={addRule}
                                    />
                                )}
                        </Col>
                        {group.pseudo_id !== 1 && (
                            <Col>
                                <Buttons.ButtonDelete
                                    disabled={disabledForm}
                                    size="small"
                                    shape="circle"
                                    text={false}
                                    tooltipText="Удалить группу"
                                    onClick={() => {
                                        deleteGroupHandler(group.pseudo_id)
                                    }}
                                />
                            </Col>
                        )}
                    </Row>
                </Col>
            </Row>
            {children}
            {RuleComponent}
        </Card>
    )
}

export default GroupComponent
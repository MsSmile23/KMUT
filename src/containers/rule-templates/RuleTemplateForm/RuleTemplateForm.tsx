import { SERVICES_STATE_MACHINES } from '@shared/api/State-machines'
import { selectAttributes, useAttributesStore } from '@shared/stores/attributes'
import { selectStates, useStatesStore } from '@shared/stores/states'
import { IDataType } from '@shared/types/data-types'
import { Col, Form, Modal, Tabs, TabsProps, message } from 'antd'
import { FC, useEffect, useState } from 'react'
import ObjectsTable from '../ObjectsTable/ObjectsTable'
import ObjectAttributesTable from '../ObjectAttributesTable/ObjectAttributesTable'
import { IAttribute } from '@shared/types/attributes'
import CommonGroupsComponent from '@entities/groups/CommonGroupsComponent/CommonGroupsComponent'
import { Select } from '@shared/ui/forms'
import { SERVICES_RULES_TEMPLATES } from '@shared/api/RuleTemplates'
import { ISyncRuleTemplates } from '@shared/types/rule-templates'
import { Buttons } from '@shared/ui/buttons'
import { useNavigate } from 'react-router-dom'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { getURL } from '@shared/utils/nav'
import { responseErrorHandler } from '@shared/utils/common'

interface IRuleTemplateForm {
    id?: number
}
const RuleTemplateForm: FC<IRuleTemplateForm> = ({ id }) => {
    const attributes = useAttributesStore(selectAttributes)
    const states = useStatesStore(selectStates)
    const [chosenDataType, setChosenDataType] = useState<IDataType>(null)
    const [chosenClasses, setChosenClasses] = useState<number[]>([])
    const [attributesEnable, setAttributesEnable] = useState<boolean>(false)
    const [form] = Form.useForm()
    const [stateAttributes, setStateAttributes] = useState<IAttribute[]>([])
    const [statesOptions, setStateOptions] = useState<{value: number, label: string}[]>([])
    const [stateId, setStateId] = useState<number>(undefined)
    const [ruleId, setRuleId] = useState<number>(id)
    const [rulesFromRuleTemplate, setRulesFromRuleTemplate] = useState<any[]>([])
    const [ruleTemplatesObjectAttrs, setRuleTemplateObjectAttrs] = useState<any[]>([])
    const [ruleEntityIds, setRuleEntityIds] = useState<number[]>([])
    const navigate = useNavigate()
    
    useEffect(() => {
        if (stateId !== undefined) {
            const state = states.find((st) => st.id == stateId)
            const stateMachineId = state?.state_machine_id

            SERVICES_STATE_MACHINES.Models.getStateMachineById(stateMachineId).then((resp) => {
                const classesIds: number[] = resp?.data.classes.map((cl) => cl.id)

                setChosenClasses(classesIds)

                if (resp?.data?.is_attribute) {
                    const attribute = attributes.find((attr) => attr.id == resp.data?.attributes[0].id)

                    setStateAttributes(resp?.data?.attributes)
                    setAttributesEnable(true)
                    setChosenDataType(attribute?.data_type)
                }
            })
        }
    }, [stateId])

    useEffect(() => {
        if (id !== undefined) {
            SERVICES_RULES_TEMPLATES.Models.getRuleTemplateById(String(id)).then(resp => {

                if (resp.success) {
                    if (resp?.data !== undefined) {
                        setRuleId(resp.data.id)
                        setStateId(resp.data.state_id)
                        setRulesFromRuleTemplate(resp.data.rules)
                        setRuleTemplateObjectAttrs(resp?.data?.object_attributes)
                        const entityIds: number[] = resp?.data.object_attributes.map(oa => oa.id)

                        setRuleEntityIds(entityIds)
                    }
                }
            })
        }
    }, [id])

    useEffect(() => {
        const localStatesOptions = states.filter(st => st.state_machine?.is_attribute == true).map(st => {
            return ({
                value: st.id,
                label: `${st.view_params?.name} [${st.state_machine.name}]`,
                key: st.id
            })
        })

        setStateOptions(localStatesOptions)

    }, [states])

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Шаблон правил',
            children: (
                <>
                    {' '}
                    {chosenClasses?.length > 0 && (
                    
                        <Form.Item name="rules">
                            <CommonGroupsComponent
                                disableForm
                                attributesEnable={attributesEnable}
                                chosenClasses={chosenClasses}
                                chosenDataType={chosenDataType}
                                stateId={stateId}
                                rulesFromRuleTemplate={rulesFromRuleTemplate}
                            />
                        </Form.Item>
                    )}
                </>
            ),
        },
        {
            key: '2',
            label: attributesEnable ? 'Атрибуты объектов' : 'Объекты',
            children: 
            <Form.Item name="entity_ids">
                {
                    attributesEnable 
                        ?
                        <ObjectAttributesTable
                            ruleTemplatesObjectAttrs={ruleTemplatesObjectAttrs}
                            classesIds={chosenClasses}
                            stateAttributes ={stateAttributes}

                        /> 
                        : <ObjectsTable classesIds={chosenClasses} />
                }
            </Form.Item>
        },
    ]

    const submitHandler = async (values) => {
        const rules = values?.rules?.rules.map(rule => {
            return ({
                id: rule.id,
                right_operand: Number(rule?.right_operand),
                depth_value: Number(rule?.depth_value)

            })
        })
        const payload = {
            state_id: stateId,
            rules: rules
        }

        const response: any = id ? 
            await SERVICES_RULES_TEMPLATES.Models.putAttributeRuleTemplate(String(id), payload) : 
            await SERVICES_RULES_TEMPLATES.Models.postAttributeRuleTemplate(payload)

        if (response.success) {
            if (response?.data !== undefined) {
                const ruleTemplateId = response.data.id

                setRuleId(ruleTemplateId)

                if (values.entity_ids == undefined || ruleEntityIds.length == 0) {
                    message.success(`Шаблон правила успешно ${id ? 'редактирован' : 'создан'}`)
                    form.resetFields()
                    navigate(getURL(
                        `${ROUTES.RULE_TEMPLATES}/${ROUTES_COMMON.LIST}`, 
                        'manager'
                    ))
                    // navigate('/ruleTemplates/list')
                }
                else {
                    const syncPayload: ISyncRuleTemplates = {
                        id: ruleTemplateId,
                        state_id: stateId,
                        entity: 'objectAttributes',
                        entity_ids: values.entity_ids ?? ruleEntityIds,
                        method: 'sync'

                    }

                    const syncResponse: any 
                = await SERVICES_RULES_TEMPLATES.Models.syncRuleTemplatesWithObjects(syncPayload)

                    if (syncResponse.success) {
                        message.success(`Шаблон правила успешно ${id ? 'редактирован' : 'создан'}`)
                        form.resetFields()
                        navigate(getURL(
                            `${ROUTES.RULE_TEMPLATES}/${ROUTES_COMMON.LIST}`, 
                            'manager'
                        ))
                        navigate('/ruleTemplates/list')
                    }   else {
                        responseErrorHandler({
                            response: syncResponse,
                            modal: Modal,
                            errorText: 'Ошибка при привязке объектов',
                        })
                    }
                }

            }

        }
        else {
            responseErrorHandler({
                response: response,
                modal: Modal,
                errorText: `Ошибка при ${id ? 'редактировании' : 'создании'} шаблона правил`,
            })
        }
    }

    return (
        <Form labelAlign="left" form={form} onFinish={submitHandler}>
            <Col>
                <Buttons.ButtonSubmit customText="Сохранить" color="green"  />
            </Col>
            <Select
                placeholder="Выберите состояние"
                style={{ minWidth: '400px', margin: '20px 0' }}
                disabled={id   || ruleId ? true : false} 
                value={stateId}
                onChange={(e) => {setStateId(e)}}
                options={statesOptions}
            />
            <Tabs defaultActiveKey="1" items={items} /> 
        </Form>
    )
}

export default RuleTemplateForm
import { Forms } from '@shared/ui/forms'
import { Col, Collapse, Divider, Form, message, Row, RowProps, Modal } from 'antd'
import { FormInstance } from 'antd/es/form'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { statesFormDefaultValues } from '../../../entities/state/statesData/statesFormData'
import { ButtonSubmit } from '@shared/ui/buttons'
import { statesProps } from '../../../entities/state/statesData/statesTableData'
import { effectsData } from '../../../entities/state/statesData/mock'
import { IState } from '@shared/types/states'
import { patchStateById } from '@shared/api/States/Models/patchStateById/patchStateById'
import { useNavigate } from 'react-router-dom'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { postState } from '@shared/api/States/Models/postState/postState'
import { SERVICES_STATES } from '@shared/api/States'
import MemoManageViewTable from '@entities/state/view/ManageViewTable/ManageViewTable'
import CommonGroupsComponent from '@entities/groups/CommonGroupsComponent/CommonGroupsComponent'
import { IDataType } from '@shared/types/data-types'
import { SERVICES_RULES } from '@shared/api/Rules'
import EffectsForm from '@entities/state/effects/EffectsForm/EffectsForm'
import { SERVICES_EFFECTS } from '@shared/api/Effects'
import { IEffects } from '@shared/types/effects'
import { selectStateStereotypes, useStateStereotypesStore } from '@shared/stores/statesStereotypes'
import { useApi2 } from '@shared/hooks/useApi2'
import { getAccounts } from '@shared/api/Accounts/Models/getAccounts/getAccounts'
import { getURL } from '@shared/utils/nav'

interface IStateMachineStatesFormContainer {
    form?: FormInstance<any>
    id?: number
    setLinkedAttributes?: React.Dispatch<React.SetStateAction<any>>
    modal?: any
    stateId: number | undefined
    stateSectionId?: number | undefined
    onSuccess?: (state: IState) => void
    attributesEnable?: boolean
    osForm?: any
    chosenDataType: IDataType
    setStateAdminTableData?: React.Dispatch<React.SetStateAction<any[]>>
    stateAdminTableData?: any[]
    classesIds?: number[]
    disableForm?: boolean
    setEditedRowId?: React.Dispatch<React.SetStateAction<any>>
}

const rowStyles: RowProps = {
    gutter: [32, 0],
    align: 'middle',
    justify: 'space-between',
}

const ItemDivider: React.FC = () => <Divider style={{ marginTop: 0 }} />

const StateMachineStatesFormContainer: React.FC<IStateMachineStatesFormContainer> = ({
    form,
    id,
    modal,
    stateId,
    stateSectionId,
    onSuccess,
    attributesEnable,
    osForm,
    chosenDataType,
    setStateAdminTableData,
    stateAdminTableData,
    classesIds,
    disableForm,
    setEditedRowId
}) => {
    const navigate = useNavigate()
    const [msg, ctx] = message.useMessage()
    const [stateData, setStateData] = useState<IState>(null)
    const [editedInitialValues, setEditedInitialValues] = useState<Partial<typeof statesFormDefaultValues>>({})
    const chosenClasses = classesIds ? classesIds : osForm?.getFieldValue('classes')
    const [isSaveEffects, setIsSaveEffects] = useState<boolean>(false)
    const [effectsFromBack, setEffectsFromBack] = useState<IEffects[]>([])
    const storeStateStereoTypes = useStateStereotypesStore(selectStateStereotypes)
    const [stateStereoTypes, setStateStereoTypes] = useState<any[]>([])

    const { data: accounts } = useApi2(() => getAccounts({ all: true }))

    useEffect(() => {

        const convertedData = storeStateStereoTypes.map((item) => {
            return { value: item?.id, label: item?.view_params?.name }
        })

        setStateStereoTypes(convertedData)
    }, [storeStateStereoTypes])

    useEffect(() => {
        const fetchData = async () => {
            if (id !== undefined) {
                const response = await SERVICES_STATES.Models.getStateById(id)

                // const sectionsResponse = await SERVICES_STATE_SECTIONS.Models.getStateSectionById(stateSectionId)

                if (!response.data) {
                    return
                }

                if (response.success && response?.data !== undefined) {
                    const responseData = response.data

                    setStateData(responseData)

                    // const sectionsResponseData = sectionsResponse.data.states

                    // setInitialValues([...sectionsResponseData])
                }
            }
        }

        fetchData()
    }, [])



    const currentEffects = effectsData?.find((effect) => effect.id === 0)

    const effects = React.useMemo(() => {
        return (
            currentEffects?.effects?.map((obj, index) => ({
                [`type-${index}`]: obj.type,
                [`operation-${index}`]: obj.operation,
                [`action-${index}`]: obj.action,
            })) ?? []
        )
    }, [currentEffects])

    const view_params = React.useMemo(() => {
        return (
            stateData?.view_params.params?.map((obj, index: number) => ({
                [`type-${index}`]: obj.type,
                [`value-${index}`]: obj.value,
            })) ?? []
        )
    }, [stateData])

    useEffect(() => {
        setEditedInitialValues({
            priority: stateData?.priority,
            name: stateData?.view_params?.name,
            parent_state_id: stateData?.parent_state_id,
            view_params: view_params,
            is_entry_state: stateData?.is_entry_state,
            state_stereotype_id: stateData?.state_stereotype_id,
            // effects,
        })
    }, [view_params])

    useEffect(() => {
        form?.setFieldsValue(editedInitialValues)
    }, [editedInitialValues])

    const memoInitialValues = React.useMemo(() => ({ editedInitialValues }), [editedInitialValues])

    // const onFinish = (values: any) => {
    //     console.log('Received values of form: ', values)
    // }

    useEffect(() => {
        if (id !== null && id !== undefined) {
            SERVICES_EFFECTS.Models.getStateEffects(String(id)).then((resp) => {
                if (resp.data !== undefined) {
                    setEffectsFromBack(resp.data.sort((a, b) => (a.type > b.type ? 1 : -1)))
                }
            })
        }
    }, [id])

    const submit = async () => {
        setIsSaveEffects(false)
        await form.validateFields()

        const ruleAndGroups = form.getFieldValue('rulesAndGroups')
        const effects: any[] = form.getFieldValue('Effects')

        const groupsAndRulesResponse = attributesEnable
            ? await SERVICES_RULES.Models.postAttributesRules(ruleAndGroups)
            : await SERVICES_RULES.Models.postClassesRules(ruleAndGroups)
        const values: Partial<typeof statesFormDefaultValues> = form.getFieldsValue(true)

        if (groupsAndRulesResponse.success) {
            if (groupsAndRulesResponse.data !== undefined) {
                

                const params = values?.view_params?.map((item) => {
                    const keys = Object.keys(item)

                    return {
                        type: item[keys[0]],
                        value: typeof item[keys[1]] === 'string' ? item[keys[1]] : item[keys[1]].toHexString(),
                    }
                })

                const ruleGroupId = groupsAndRulesResponse.data
                    .find(gr => gr.parent_id == null && gr.pseudo_parent_id == null)?.id

                const payload: IState = {
                    view_params: {
                        params: params,
                        name: values.name,
                    },
                    state_machine_id: stateId,
                    priority: values.priority,
                    parent_state_id: values.parent_state_id,
                    rule_group_id: ruleGroupId,
                    state_section_id: stateSectionId,
                    mnemo: stateData?.mnemo ?? null,
                    is_entry_state: values.is_entry_state ?? false,
                    state_stereotype_id: values?.state_stereotype_id,
                }
                const response = id ? await patchStateById(`${id}`, payload) : await postState(payload)
                const localEffects: IEffects[] = []

                if (response.success) {
                    const effectsErrors: any[] = []

                    if (response?.data !== undefined && effects !== undefined) {
                        await Promise.all(
                            effects.map(async (effect, index) => {
                                const resp: any =
                                    effect.id !== null
                                        ? await SERVICES_EFFECTS.Models.patchEffect({
                                            stateId: String(response.data.id),
                                            id: effect.id,
                                            data: effect,
                                        })
                                        : await SERVICES_EFFECTS.Models.postEffect(String(response.data.id), effect)

                                if (resp.success) {
                                    localEffects.push({ ...resp.data })
                                } else {
                                    effectsErrors.push(`Ошибка при сохранении блока эффектов № ${index + 1} :
    ${resp.error.response.data.errors.values[0]} `)
                                }
                            })
                        )
                    }

                    
                    if (effectsErrors.length == 0) {
                        Modal.success({
                            content: `Состояние успешно ${id ? 'обновлено' : 'создано'}`,
                        })

                        if (modal !== undefined) {
                            setTimeout(() => {
                                modal.close()
                                setEffectsFromBack(localEffects)
                                setEditedRowId(undefined)
                                form.resetFields()
                           
                            }, 500)
                        } else {
                            navigate(getURL(
                                `${ROUTES.STATE_MACHINES}/${ROUTES_COMMON.LIST}`, 
                                'constructor'
                            ))
                            // navigate(`/${ROUTES.STATE_MACHINES}/${ROUTES_COMMON.LIST}`)
                        }
                    } else {
                        Modal.error({
                            content: effectsErrors,
                            style: { zIndex: '999999' }
                        })
                    }

                    if (!response.data) {
                        return
                    }
                    const sections = [...stateAdminTableData] ?? []

                    if (!id) {
                        sections.forEach((section) => {
                            if (section.id == response.data.state_section_id) {
                                section.states.push(response.data)
                            }
                        })
                    } else {
                        sections.forEach((section) => {
                            if (section.id == response.data.state_section_id) {
                                section.states.forEach((state, index) => {
                                    if (state.id == response.data.id) {
                                        section.states[index] = response.data
                                    }
                                })
                            }
                        })
                    }
                    setStateAdminTableData(sections)

                    if (onSuccess) {
                        onSuccess(response.data)

                        setStateData(response.data)
                    }
                } else {
                    const error: any[] = []
                    const responseData: { errors?: any } = response.error.response?.data || {}
                    const chosenErrors = responseData.errors

                    if (chosenErrors !== undefined) {
                        if (typeof chosenErrors === 'object') {
                            Object.keys(chosenErrors)?.map((key) => {
                                error.push(chosenErrors[key])
                            })
                            Modal.warning({
                                title: 'Ошибка в сохранении состояния',
                                content: error[0],
                                style: { zIndex: '999999' }
                            })
                        }
                    } else {
                        console.error(response.error.message)
                        Modal.warning({
                            title: 'Ошибка в сохранении состояния',
                            content: response.error.message,
                            style: { zIndex: '999999' }
                        })
                    }
                }
            }
        } else {
            const error: any[] = []
            const chosenErrors = (groupsAndRulesResponse.error?.response?.data as { errors?: any[] })?.errors

            if (chosenErrors !== undefined) {
                Object.keys(chosenErrors)?.map((key) => {
                    error.push(chosenErrors[key])
                })
                Modal.warning({
                    title: 'Ошибка в работе с группами правил',
                    content: error[0],
                    style: { zIndex: '999999' }
                })
            } else {
                const message = (groupsAndRulesResponse.error?.response?.data as { message?: string })?.message

                Modal.warning({
                    title: 'Ошибка в работе с группами правил',
                    content: message || 'Неизвестная ошибка',
                    style: { zIndex: '999999' }
                })
            }
        }
    }

    return (
        <>
            {ctx}
            <Form
                id="sates-form"
                form={form}
                labelCol={{ xs: 8 }}
                colon={false}
                requiredMark={true}
                labelAlign="left"
                initialValues={editedInitialValues}
            >
                {!disableForm && (
                    <ButtonSubmit
                        style={{ background: 'green' }}
                        onClick={() => {
                            setIsSaveEffects(true)
                            setTimeout(() => {
                                submit()
                            }, 500)
                            // submit()
                        }}
                        htmlType="submit"
                    />
                )}
                <Row {...rowStyles} style={{ marginTop: 20 }}>
                    <Col span={6}>
                        <Form.Item
                            label={statesProps.name.label}
                            name={statesProps.name.name}
                            rules={statesProps.name.rules}
                        >
                            <Forms.Input disabled={disableForm} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            labelCol={{ span: 12 }}
                            label="Начальное состояние"
                            name="is_entry_state"
                            // rules={statesProps.name.rules}
                            valuePropName="checked"
                            initialValue={false}
                        >
                            <Forms.Switch disabled={disableForm} />
                        </Form.Item>
                    </Col>
                    {!attributesEnable && (
                        <Col span={6}>
                            <Form.Item labelCol={{ span: 10 }} label="Тип состояния" name="state_stereotype_id">
                                <Forms.Select
                                    disabled={disableForm}
                                    placeholder="Тип состояния"
                                    data={stateStereoTypes}
                                    onChange={(e) => {
                                        const localStateData = { ...stateData }

                                        localStateData.view_params = storeStateStereoTypes.
                                            find(st => st.id == e).view_params
                                        localStateData.state_stereotype_id = e
                                        setStateData(localStateData)
                                    }}
                                />
                            </Form.Item>
                        </Col>
                    )}
                    <Col span={6}>
                        <Form.Item label="Приоритет" name="priority" rules={statesProps.name.rules}>
                            <Forms.Input type="number" min={1} disabled={disableForm} />
                        </Form.Item>
                    </Col>
                </Row>

                <Collapse
                    // key={Date()}
                    size="small"
                    style={{ fontSize: '15px', textAlign: 'center' }}
                    defaultActiveKey={['2']}
                    items={[
                        {
                            key: '2',
                            label: 'Управление отображением',
                            children: (
                                <Row gutter={[10, 0]}>
                                    <Form.Item name={statesProps.view_params.name} style={{ width: '100%' }}>
                                        <MemoManageViewTable
                                            disableForm={disableForm}
                                            form={form}
                                            editedInitialValues={editedInitialValues}
                                            rowId={id}
                                        />
                                    </Form.Item>
                                </Row>
                            ),
                        },
                    ]}
                />

                <ItemDivider />
                <Collapse
                    size="small"
                    style={{ fontSize: '15px', textAlign: 'center' }}
                    defaultActiveKey={['3']}
                    items={[
                        {
                            key: '3',
                            label: 'Управление правилами',
                            children: (
                                <Form.Item name="rulesAndGroups">
                                    <CommonGroupsComponent
                                        disableForm={disableForm}
                                        attributesEnable={attributesEnable}
                                        chosenClasses={chosenClasses}
                                        chosenDataType={chosenDataType}
                                        stateId={id}
                                    />
                                </Form.Item>
                            ),
                        },
                    ]}
                />

                <ItemDivider />

                <Collapse
                    size="small"
                    style={{ fontSize: '15px', textAlign: 'center' }}
                    defaultActiveKey={['4']}
                    items={[
                        {
                            key: '4',
                            label: 'Управление эффектами',
                            children: (
                                <Row gutter={[10, 0]}>
                                    <Form.Item name="Effects" style={{ width: '100%' }}>
                                        <EffectsForm
                                            attributesEnable = {attributesEnable}
                                            accounts={accounts}
                                            disableForm={disableForm}
                                            isSaveEffects={isSaveEffects}
                                            effectsFromBack={[...effectsFromBack]}
                                            form={form}
                                            chosenClasses={chosenClasses}
                                            stateId={id}
                                            setIsSaveEffects={setIsSaveEffects}
                                        />
                                    </Form.Item>
                                </Row>
                            ),
                        },
                    ]}
                />
            </Form>
        </>
    )
}

export default StateMachineStatesFormContainer
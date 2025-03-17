import Form, { FormInstance } from 'antd/es/form'
import { FC, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { saveStateMachine } from './utils'
import { SERVICES_STATE_MACHINES } from '@shared/api/State-machines'
import StateTablesOperationsButtons from '@features/state/StateTableOperationsButtons/StateTablesOperationsButtons'
import MemoStateMachineForm, { TFormValues } from '@features/state/StateMachineForm/StateMachineForm'
import MemoStateStateAdminTable from '@features/state/StateStateAdminTable/StateStateAdminTable'
import { IStateMachine, IStateMachinePost, IStateMachineTransition } from '@shared/types/state-machines'
import { SERVICES_STATE_SECTIONS } from '@shared/api/State-sections'
import { IDataType } from '@shared/types/data-types'

export interface IStateMachineFormContainer {
    form?: FormInstance<any>
    id?: number
    modal?: any
}

const StateMachineFormContainer: FC<IStateMachineFormContainer> = ({ form }) => {
    const navigate = useNavigate()
    const { id } = useParams<{ id?: string }>()
    const [ formValues, setFormValues ] = useState<TFormValues>({ classes: [], name: '',
        attributes: [] });
    const [isContinue, setIsContinue] = useState<boolean>(false)
    const [addSectionButtonState, setAddSectionButtonState] = useState<boolean>(null)
    const [selectParentStateOptions, setSelectParentStateOptions] = useState([])
    const [stateAdminTableData, setStateAdminTableData] = useState([])
    const [attributesEnable, setAttributesEnable] = useState<boolean>(false)
    const [chosenDataType, setChosenDataType] = useState<IDataType>(null)
    const [stateTransitions, setStateTransitions] = useState<IStateMachineTransition[]>([])
    const [stateMachines, setStateMachines] = useState<IStateMachine[]>([])

    useEffect(() => {
        SERVICES_STATE_MACHINES.Models.getStateMachines({ all: true }).then((resp) => {
            if (resp?.success) {
                if (resp?.data !== undefined) {
                    
                    setStateMachines(resp?.data)
                }
            }
        })
    }, [])

    useEffect(() => {
        if (id !== null && id !== undefined) {

            const fetchData = async () => {
                try {
                    const [response1, response2] = await Promise.all([
                        SERVICES_STATE_MACHINES.Models.getStateMachineById(id),
                        SERVICES_STATE_SECTIONS.Models.getStateSections({ all: true }),
                    ]);

                    const data1 = response1.data;

                    const data2 = response2.data;


                    if (response1.success && data1 !== undefined && response2.success && data2 !== undefined) {


                        if (data1.state_transitions !== undefined && data1.state_transitions !== null) {
                            setStateTransitions(data1.state_transitions) 
                        }
                        const statesIds = [];

                        data1.states.forEach((state) => {
                            !statesIds.includes(state.state_section_id) ?
                                statesIds.push(state.state_section_id) : statesIds;
                        });

                        const sectionIdsArr = statesIds.sort();

                        setSelectParentStateOptions(data1.states.map((state) =>
                            ({ value: state.id, label: state.view_params?.name })))

                        const machineSections = data2
                            .filter((section) => sectionIdsArr.includes(section.id))
                            .sort((a, b) => a.id - b.id)

                        setStateAdminTableData([...machineSections])
                    }


                } catch (error) {
                    console.error('Ошибка при выполнении запросов', error);
                }
            };

            fetchData();

        }
    }, [id]);



    const onSubmit = async (data: IStateMachinePost) => {

        saveStateMachine({
            data,
            id,
            navigate,
            isContinue,
            setIsContinue,
            stateMachines
        })
    }



    return (
        <Form
            labelAlign="left"
            labelCol={{ span: 8 }}
            form={form}
            onFinish={onSubmit}
            onValuesChange={(_, values) => {
                setFormValues(values)
                form?.setFieldsValue(values)
            }}
        >
            <MemoStateMachineForm
                formValues={formValues}
                setFormValues={setFormValues}
                setIsContinue={setIsContinue}
                form={form}
                id={id}
                attributesEnable={attributesEnable}
                setAttributesEnable={setAttributesEnable}
                chosenDataType={chosenDataType}
                setChosenDataType={setChosenDataType}
            />

            <StateTablesOperationsButtons
                form={form}
                stateMachineId={id}
                stateAdminTableData={stateAdminTableData}
                setStateAdminTableData={setStateAdminTableData}
                addSectionButtonState={addSectionButtonState}
                setAddSectionButtonState={setAddSectionButtonState}
                stateTransitions={stateTransitions}

            />
            {stateAdminTableData
                .map((section, index) => (
                    <MemoStateStateAdminTable
                        attributesEnable={attributesEnable}
                        key={index}
                        idx={index}
                        form={form}
                        stateMachineId={id}
                        stateSection={section}
                        stateAdminTableData={stateAdminTableData}
                        setStateAdminTableData={setStateAdminTableData}
                        setAddSectionButtonState={setAddSectionButtonState}
                        selectParentStateOptions={selectParentStateOptions}
                        chosenDataType={chosenDataType}
                    />
                ))}
        </Form>
    )
}

export default StateMachineFormContainer
import { CheckBox } from '@shared/ui/forms'
import { Form, Modal } from 'antd'
import { FC, useEffect, useState } from 'react'
import { Typography } from 'antd'
import { SimpleTable } from '@shared/ui/tables'
import { ButtonSubmit } from '@shared/ui/buttons'
import { SERVICES_STATE_MACHINES } from '@shared/api/State-machines'
import { IStateMachineTransition } from '@shared/types/state-machines'

const { Title } = Typography

interface IStatesTransitionsTable {
    section: any
    form: any
    style: React.CSSProperties
    stateMachineId?: string | number
    setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>
    stateTransitions: IStateMachineTransition[]
}
const StatesTransitionsTable: FC<IStatesTransitionsTable> = ({
    section,
    form,
    style,
    stateMachineId,
    setIsModalVisible,
    stateTransitions,
}) => {
    const [columns, setColumns] = useState<any[]>([])
    const [rows, setRows] = useState<any[]>([])

    const saveButtonHandler = async () => {
        const dataForForm = form.getFieldsValue()
        const payload: any[] = []

        Object.keys(dataForForm)
            .filter((field) => field.includes('state_'))
            .forEach((item) => {
                if (dataForForm[item]) {
                    const targetStateId = item.split('-')[0].slice(6, item.length)
                    const sourceStateId = item.split('-')[1]

                    payload.push({
                        source_state_id: Number(sourceStateId),
                        target_state_id: Number(targetStateId),
                    })
                }
            })

        const response = await SERVICES_STATE_MACHINES.Models.postStateMachineTransitions(String(stateMachineId), {
            state_transitions: payload,
        })

        if (response.success) {
            Modal.success({
                content: 'Переходы успешно сохранены',
            })
            setIsModalVisible(false)
        } else {
            const error: any[] = []
            const responseData: { errors?: any } = response.error.response?.data || {}
            const chosenErrors = responseData.errors

            if (chosenErrors !== undefined) {
                Object.keys(chosenErrors)?.map((key) => {
                    error.push(chosenErrors[key])
                })
                Modal.warning({
                    title: 'Ошибка в сохранении переходов',
                    content: error[0],
                })
            } else {
                console.error(response.error.message)
                Modal.warning({
                    title: 'Ошибка в сохранении переходов',
                    content: response.error.message,
                })
            }
        }
    }

    useEffect(() => {
        const localColumns: any[] = []
        const localRows: any[] = []

        const childrenColumns: any[] = []

        section.states.forEach((state, index) => {
            childrenColumns.push({
                title: state?.view_params?.name,
                dataIndex: `state-${state?.id}`,
                key: `state-${state?.id}`,
            })

            localRows.push({
                key: `state-${state?.id}`,
                to: (
                    <Title style={{ margin: 0 }} level={5}>
                        К
                    </Title>
                ),
                state_name: state?.view_params?.name,
                rowSpan: index == 0 ? section.states.length : 0,
            })
            section.states.forEach((item) => {
                localRows[index][`state-${item?.id}`] =
                    state.id !== item.id ? (
                        <Form.Item valuePropName="checked" style={{ margin: 0 }} name={`state_${state.id}-${item?.id}`}>
                            <CheckBox />
                        </Form.Item>
                    ) : null
            })
        })

        localColumns.push(
            {
                title: section?.parent_state ? section?.parent_state.view_params?.name : '',
                dataIndex: 'parent_state',
                key: 'parent_state',
                children: [
                    {
                        title: '',
                        dataIndex: 'to',
                        key: 'to',
                        onCell: (item) => {
                            return { rowSpan: item.rowSpan.props?.title }
                        },
                    },
                    {
                        title: '',
                        dataIndex: 'state_name',
                        key: 'state_name',
                    },
                ],
            },
            {
                title: 'ОТ',
                dataIndex: 'from',
                key: 'from',
                children: childrenColumns,
            }
        )
        setColumns(localColumns)
        setRows(localRows)
    }, [section])

    useEffect(() => {
        if (stateTransitions?.length > 0 && rows.length > 0) {
            stateTransitions.forEach((item) => {
                form.setFieldsValue({
                    [`state_${item.target_state_id}-${item.source_state_id}`]: true,
                })
            })
        }
    }, [stateTransitions, rows])

    return (
        <>
            <ButtonSubmit
                style={{ background: 'green', marginBottom: '10px' }}
                onClick={saveButtonHandler}
                htmlType="submit"
            />
            <SimpleTable style={style} pagination={false} columns={columns} rows={rows} />
        </>
    )
}

export default StatesTransitionsTable
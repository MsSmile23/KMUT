import StatesTransitionsTable from '@entities/states/StatesTransitionsTable/StatesTransitionsTable'
import { postStateSection } from '@shared/api/State-sections/Models/postStateSection/postStateSection'
import { IStateMachineTransition } from '@shared/types/state-machines'
import { IStateSection } from '@shared/types/state-section'
import { ButtonAdd } from '@shared/ui/buttons'
import { DefaultModal2 } from '@shared/ui/modals'
import { Card, Col, Divider, Row, Space, Typography } from 'antd'
import { FC, useEffect, useState } from 'react'

interface ITableOperationsButtons {
    stateMachineId: number | string
    setStateAdminTableData: React.Dispatch<React.SetStateAction<any>>
    stateAdminTableData: IStateSection[]
    addSectionButtonState: boolean
    setAddSectionButtonState: React.Dispatch<React.SetStateAction<boolean>>
    form: any
    stateTransitions: IStateMachineTransition[]
}

const StateTablesOperationsButtons: FC<ITableOperationsButtons> = ({
    stateMachineId,
    stateAdminTableData,
    setStateAdminTableData,
    addSectionButtonState,
    setAddSectionButtonState,
    form,
    stateTransitions
}) => {
    const { Title } = Typography

    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)

    const newSection = {
        id: null,
        parent_state_id: null,
        parent_state: null,
        states: null,
    }

    const addSectionHandler = async () => {
        if (stateAdminTableData.length === 0) {
            try {
                const response = await postStateSection({ state_machine_id: stateMachineId, state_id: null })

                const newData = response?.data?.id

                if (newData) {
                    setStateAdminTableData([{ ...newSection, id: response?.data?.id }])
                    setAddSectionButtonState(true)
                }
            } catch (error) {
                console.error(error.data.message)
            }
        } else {
            setStateAdminTableData((prevData) => [...prevData, newSection])

            setAddSectionButtonState(true)
        }
    }


  
    
    return (
        <>
            <DefaultModal2
                title="Переходы"
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false)
                }}
                destroyOnClose
                footer={null}
            >
                {stateAdminTableData.map((section) => {
                    return (
                        <StatesTransitionsTable
                            style={{ marginBottom: '20px' }}
                            form={form}
                            key={section?.id}
                            section={section}
                            stateMachineId={stateMachineId}
                            setIsModalVisible={setIsModalVisible}
                            stateTransitions={stateTransitions}
                        />
                    )
                })}
            </DefaultModal2>

            <Row gutter={5} justify="space-between">
                {stateMachineId ? (
                    <Col style={{ width: '100%', marginTop: '1%' }}>
                        <Space style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                            <Col>
                                <ButtonAdd
                                    size="middle"
                                    onClick={addSectionHandler}
                                    customText="Добавить секцию"
                                    disabled={addSectionButtonState}
                                />
                            </Col>
                            <Col>
                                <ButtonAdd
                                    tooltipText="Открыть таблицу переходов"
                                    size="middle"
                                    customText="Переходы"
                                    icon={false}
                                    onClick={() => {
                                        setIsModalVisible(true)
                                    }}
                                />
                            </Col>
                        </Space>
                    </Col>
                ) : (
                    <Card style={{ width: '100%', marginTop: '2%', background: '#F5F5F5' }}>
                        <Title level={5} style={{ textAlign: 'center', width: '100%', marginTop: '1%' }}>
                            Управление Состояниями
                        </Title>
                        <Space style={{ width: '100%', justifyContent: 'center' }}>
                            Управление состояниями доступно только после создания Обработчика состояний. Заполните поля
                            формы и нажмите кнопку "Сохранить и продолжить" сверху.
                        </Space>
                    </Card>
                )}
            </Row>
        </>
    )
}

export default StateTablesOperationsButtons
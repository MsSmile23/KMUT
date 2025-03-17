import { ButtonDeleteRow, ButtonSave, Buttons } from '@shared/ui/buttons'
import { Card, Col, Modal, Popconfirm, Space, message } from 'antd'
import React, { FC, useEffect, useState } from 'react'
import { FormInstance } from 'antd/lib/form/Form'
import { SimpleTable } from '@shared/ui/tables'
import { useOpen } from '@shared/hooks/useOpen'
import ModalAddEditMachineRules from './ui/ModalAddEditMachineRules'
import {  operationsColumns } from '../StateMachineForm/data'
import { deleteStateById } from '@shared/api/States/Models/deleteStateById/deleteStateById'
import { SERVICES_STATE_SECTIONS } from '@shared/api/State-sections'
import { IState } from '@shared/types/states'
import { Forms } from '@shared/ui/forms'
import { postStateSection } from '@shared/api/State-sections/Models/postStateSection/postStateSection'
import { IStateSection } from '@shared/types/state-section'
import { IDataType } from '@shared/types/data-types'
import { DefaultModal2 } from '@shared/ui/modals'
import { StatePreview } from '@entities/states/StatePreview/StatePreview'


    interface ITableForLinkOperations {
        idx: number
        form?: FormInstance<any>
        stateMachineId: number | string
        stateSection: IStateSection
        stateAdminTableData: IStateSection[]
        setStateAdminTableData: React.Dispatch<React.SetStateAction<Array<any>>>;
        setAddSectionButtonState: React.Dispatch<React.SetStateAction<boolean>>;
        selectParentStateOptions: { value: number, label: string | React.ReactNode }[]
        attributesEnable: boolean
        chosenDataType: IDataType,
     }

const StateStateAdminTable: FC<ITableForLinkOperations> = ({ ...props }) => {


    const modal = useOpen()
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
    const [editedRowId, setEditedRowId] = useState<number>(null)

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys)
    }
    const [selectedOption, setSelectedOption] = useState <number>(null)

    const [rowSelection, setModalSelection] = useState({
        selectedRowKeys,
        onChange: onSelectChange,
        preserveSelectedRowKeys: false,
    })
    const [previewStateId, setPreviewStateId] = useState<number>(undefined)

    const [isPreviewModalVisible, setIsPreviewModalVisible] = useState<boolean>(false)


    const {
        idx,
        form,
        stateSection,
        stateMachineId,
        stateAdminTableData,
        setStateAdminTableData,
        selectParentStateOptions,
        setAddSectionButtonState,
        attributesEnable,
        chosenDataType,

    }
    = props

    useEffect(() => {
        setModalSelection({
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
            preserveSelectedRowKeys: false,
        })
    }, [selectedRowKeys])

   

    const deleteStateHandler = (id: number) => {

        deleteStateById(id).then((response) => {
            if (response?.success) {
                const filteredStates = (stateAdminTableData[idx]?.states as IState[]).filter((item) => item.id !== id)

                const newArr = stateAdminTableData
                    .map((item, index) => index === idx ? { ...item, states: filteredStates } : item);

                setStateAdminTableData([...newArr])

                Modal.success({
                    content: 'Состояние успешно удалено',
                })

                if (modal !== undefined) {
                    setTimeout(() => {modal.close()}, 500);
                }
            } else {
                const error: any[] = []

                const chosenErrors = response.error.response?.data as { errors?: { mnemo?: string } }

                if (chosenErrors !== undefined) {
                    Object.keys(chosenErrors)?.map((key) => {
                        error.push(response.error.response.data[key])
                    })
                    Modal.warning({
                        title: 'Ошибка в удалении состояния',
                        content: error[0],
                    })
                } else {

                    Modal.warning({
                        title: 'Ошибка в удалении состояния',
                        content: 'Не удалось удалить состояние.',
                    })
                }
            }
        }).catch((err) => {
            Modal.warning({
                title: 'Ошибка в удалении состояния',
                content: err.message
            })
        })

        return
    }


    const deleteSectionHandler = async (stateSectionId: number) => {

        if (stateSectionId) {
            try {
                const response = await SERVICES_STATE_SECTIONS.Models.deleteStateSectionById(stateSectionId)

                if (response.success && response.data.statusText === 'Deleted') {
                    const newData = stateAdminTableData.filter(section => section.id !== stateSectionId)

                    setStateAdminTableData([...newData])

                    setAddSectionButtonState(false)


                } else {
                    throw Error
                }
            } catch {
                message.error('Не удалось удалить секцию')
            }
        } else {
            const newData = stateAdminTableData.filter((_, index) => index !== idx);

            setStateAdminTableData([...newData])

            setAddSectionButtonState(false)

        }


    }


    const handleSaveParentState = async () => {
        try {

            const response = await postStateSection(
                {
                    state_machine_id: Number(stateMachineId),
                    state_id: selectedOption
                }
            );

            const responseData = response.data;


            if (responseData) {

                const newSection = stateAdminTableData
                    .map((item, index) => index === idx ?
                        {  id: responseData.id,
                            parent_state_id: responseData.parent_state_id,
                            parent_state: responseData.parent_state,
                            states: responseData.states ?? []
                        } : item);


                setStateAdminTableData([...newSection])

                setAddSectionButtonState(false)
            }

        } catch (error) {
            console.error(error.data);
        }

    }


    const handleChangeSelect = (value) => {
        setSelectedOption(Number(value))
    };



    const tableRowDts = (states: IState[]) => {
        return states?.map((item) => {
            return {
                key: item.id,
                state: item.view_params.name,
                actions: (
                    <Col style={{ display: 'flex', justifyContent: 'flex-end', margin: '2%' }}>
                        <Space >
                            <Buttons.ButtonLook
                            // hoverable
                                onClick={() => {
                                    setPreviewStateId(item?.id)
                                    setIsPreviewModalVisible(true)}}
                            />
                            <Buttons.ButtonEditRow
                                onClick={() => {
                                    setEditedRowId(item?.id)
                                    modal.open()
                                }}
                            />
                            <Popconfirm
                                title="Удаление"
                                description="Удалить состояние?"
                                okText="Да"
                                cancelText="Нет"
                                onConfirm={() => deleteStateHandler(item.id)}
                            >
                                <ButtonDeleteRow />
                            </Popconfirm>
                        </Space>
                    </Col>
                ),
            }
        })
    }


    return (
        <>
      
            <Card style={{ marginTop: '10px' }} >
                <SimpleTable
                    pagination={false}
                    rowSelection={{ ...rowSelection }}
                    columns={operationsColumns}
                    rows={tableRowDts(stateSection.states)}
                    locale={{
                        emptyText: idx === 0
                            ?
                            'Нет данных'
                            : stateSection.parent_state_id ? 'Нет данных' :
                                'Для добавления состояния выберете надсостояние и нажмите на иконку "Сохранить"'
                    }}
                    toolbar={{
                        left: (
                            <Col style={{ display: 'flex' }}>
                                <Space>
                                    <Col >
                                        <Buttons.ButtonAdd
                                            size="small"
                                            shape="circle"
                                            text={false}
                                            tooltipText="Добавить состояние"
                                            onClick={() => {
                                                modal.open()
                                            }}
                                            disabled={idx === 0 ? false : stateSection.parent_state_id ? false : true}
                                        />
                                    </Col>
                                    <Col >
                                        <Popconfirm
                                            title="Удаление"
                                            description="Удалить секцию?"
                                            okText="Да"
                                            cancelText="Нет"
                                            onConfirm={() => deleteSectionHandler(stateSection.id)}
                                        >
                                            <ButtonDeleteRow />
                                        </Popconfirm>
                                    </Col>
                                </Space>
                            </Col>

                        ),
                        right: (
                            <Col
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    alignItems: 'center',
                                    width: '29vw' }}
                            >
                                <Col span={14}>
                                    <Forms.Select
                                        options={selectParentStateOptions}
                                        style={{ width: '16vw' }}
                                        placeholder="Выберете надсостояние"
                                        onChange={handleChangeSelect}
                                        disabled={idx === 0 ? true : stateSection.parent_state_id ? true : false}
                                        defaultValue={stateSection.parent_state_id}
                                    />
                                </Col>
                                <Col >
                                    <ButtonSave
                                        onClick={handleSaveParentState}
                                        disabled={idx === 0 ? true : stateSection.parent_state_id ? true : false}
                                    />
                                </Col>

                            </Col>
                        ),
                    }}
                >
                </SimpleTable>
            </Card>
        

            <ModalAddEditMachineRules
                stateAdminTableData={stateAdminTableData}
                setStateAdminTableData={setStateAdminTableData}
                osForm={form}
                attributesEnable={attributesEnable}
                modal={modal}
                editedRowId={editedRowId}
                setEditedRowId={setEditedRowId}
                stateId={Number(stateMachineId)}
                stateSectionId={stateSection.id}
                // onSuccess={(state: IState) => {
                //     changeHandler(state)
                // }}
                chosenDataType={chosenDataType}
            />
            <DefaultModal2 
                onCancel={() => setIsPreviewModalVisible(false)}
                open={isPreviewModalVisible}
                tooltipText="Просмотр состояния"
                showFooterButtons={false}
            >
                <StatePreview stateId={previewStateId} />

            </DefaultModal2>
        </>
    )
}
const MemoStateStateAdminTable: FC<ITableForLinkOperations> = React.memo(StateStateAdminTable)

export default MemoStateStateAdminTable

import StateMachineStatesFormContainer from
    '@containers/state/StateMachineStatesFormContainer/StateMachineStatesFormContainer';
import { IDataType } from '@shared/types/data-types';
import { IState } from '@shared/types/states';
import { DefaultModal2 } from '@shared/ui/modals/DefaultModal2/DefaultModal2'
import { Row, Col, Divider, Form } from 'antd'
import { FC } from 'react'



interface IModalAddEditMachineRules {
    modal: any,
    editedRowId?: number | undefined
    setEditedRowId?: React.Dispatch<React.SetStateAction<any>>
    width?: string
    stateId: number | undefined
    onSuccess?: (state: IState) => void
    attributesEnable: boolean
    osForm: any
    chosenDataType: IDataType
    setStateAdminTableData: React.Dispatch<React.SetStateAction<any[]>>
    stateAdminTableData: any[]
    stateSectionId: number
}

const ModalAddEditMachineRules: FC<IModalAddEditMachineRules> = ({
    modal,
    editedRowId,
    setEditedRowId,
    onSuccess,
    attributesEnable,
    osForm,
    chosenDataType,
    setStateAdminTableData,
    stateAdminTableData,
    stateSectionId,
    ...props
}) => {
    const [ form ] = Form.useForm()

    return (

        <DefaultModal2
            title={editedRowId ? 'Редактирование состояния' : 'Создание состояния'}
            open={modal.isOpen}
            onCancel={() => {
                modal.close()
                form?.resetFields()
                setEditedRowId(undefined)
            }}
            destroyOnClose 
            footer={null}
            width="80%"
        >
            <Row gutter={[0, 12]}>
                <Col xs={24}>
                    <Divider style={{ margin: 0 }} />
                </Col>
                <Col xs={24}>
                    <StateMachineStatesFormContainer
                        stateAdminTableData = {stateAdminTableData}
                        setStateAdminTableData={setStateAdminTableData}
                        attributesEnable = {attributesEnable}
                        id={editedRowId}
                        form={form}
                        modal={modal}
                        onSuccess={onSuccess}
                        stateId={props.stateId}
                        stateSectionId={stateSectionId}
                        osForm={osForm}
                        chosenDataType={chosenDataType}
                        setEditedRowId={setEditedRowId}
                    />
                </Col>
            </Row>
        </DefaultModal2>)
}

export default ModalAddEditMachineRules
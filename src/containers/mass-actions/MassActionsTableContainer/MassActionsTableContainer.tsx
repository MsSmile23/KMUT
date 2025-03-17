/* eslint-disable react/jsx-no-useless-fragment */
import { deleteMassAction } from '@shared/api/Mass-actions/Models/deleteMassActions/deleteMassAction';
import { getMassAction } from '@shared/api/Mass-actions/Models/getMassActions/getMassAction';
import { useApi2 } from '@shared/hooks/useApi2';
import { ButtonAdd } from '@shared/ui/buttons';
import { EditTable } from '@shared/ui/tables/ECTable2/EditTable/EditTable';
import { Col, Row } from 'antd';
import { FC, ReactNode, useEffect,  useMemo, useState } from 'react';
import { columns } from './massActionsTableData';
import { IMassActions } from '@shared/types/mass-actions';
// import { mockData } from './massActionsTableData'
import { useNavigate } from 'react-router-dom';
import { getURL } from '@shared/utils/nav';
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths';
import { IInterfaceView, generalStore } from '@shared/stores/general';
import { ECModal } from '@shared/ui/modals/ECModal/ECModal';
import moment from 'moment-timezone';
import { ECColorfulText } from '@shared/ui/text/ECColorfulText/ECColorfulText';
import { massActionsStatus, massActionsTypes } from './utils';
import ActionsTableColumn from './ActionsTableColumn';
import { selectCheckPermission, useAccountStore } from '@shared/stores/accounts';

interface IMassActionTableRow {
    key: any,
    id: IMassActions['id'],
    name: IMassActions['names'],
    description: IMassActions['description'],
    type: IMassActions['type'],
    status: string,
    created_at: IMassActions['created_at'],
    updated_at: IMassActions['updated_at'],
    actions?: ReactNode
}

export const MassActionsTableContainer: FC = () => {
    const navigate = useNavigate();
    const interfaceView = generalStore(st => st.interfaceView)
    const massActions = useApi2(getMassAction, { autoUpdate: 60_000, onmount: false })
    const deletedMassAction = useApi2(deleteMassAction, { onmount: false })
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [modalData, setModalData] = useState<IMassActions>(null);
    const checkPermission = useAccountStore(selectCheckPermission)

    // const massActions = mockData

    // useEffect(() => {
    //     const test = apiQuery<any>({
    //         method: 'PUT',
    //         url: '/mass-actions/tasks/10182/run',
    //         data: {
    //             __status: 'checked'
    //         }
    //     })

    //     console.log('test', test)
    // }, [])

    useEffect(() => {
        massActions.request()
    }, [])

    const onLook = (massAction) => {
        setModalData(massAction)
        setOpenModal(true)
    }
    
    const rows = useMemo(() => massActions.data?.map(massAction => ({ // Поменять mockData на massActions.data
        key: massAction?.id,
        id: massAction?.id,
        name: massAction?.names,
        description: massAction?.description,
        type: massActionsTypes[massAction?.type],
        status: massActionsStatus[massAction?.status]?.name,
        created_at: moment(massAction?.created_at).format('YYYY-MM-DD HH:mm:ss'),
        updated_at: moment(massAction?.updated_at).format('YYYY-MM-DD HH:mm:ss'),
        actions:
         <ActionsTableColumn
             status={massActionsStatus[massAction?.status]}
             request={massActions.request}
             massAction={massAction}
             onLook={() => onLook(massAction)}
         />
    } as IMassActionTableRow)), [massActions.data])
    
    if (checkPermission(['get tasks'])) {
        return (
            <>
                <EditTable
                    tableId="mass-actions-table"
                    columns={columns.map((col) => ({ ...col, key: col?.dataIndex }))}
                    rows={rows}
                    loading={massActions.loading || deletedMassAction.loading}
                    virtual={true}
                    buttons={{
                        left: [
                            <>
                                {checkPermission(['create tasks'])
                                    &&  
                                    <ButtonAdd
                                        key="button-add-mass-action"
                                        shape="circle"
                                        text={false}
                                        onClick={() => {
                                            navigate(getURL(
                                                `${ROUTES.MASS_ACTIONS}/${ROUTES_COMMON.CREATE}`,
                                        interfaceView as Exclude<IInterfaceView, ''>
                                            ))
                                        }}
                                    />}
                            </>
                        ]
                    }}
                />
                <ECModal
                    title="Просмотр операции"
                    open={openModal}
                    onCancel={() => { setOpenModal(false) }}
                    footer={() => (<></>)}
                    width="max-content"
                >
                    <Row gutter={[18, 18]}>
                        <Col span={3}>
                            <h4>Название</h4>
                            {modalData?.names}
                        </Col>
                        <Col span={3}>
                            <h4>Описание</h4>
                            {modalData?.description}
                        </Col>
                        <Col span={3}>
                            <h4>Тип</h4>
                            {massActionsTypes[modalData?.type]}
                        </Col>
                    </Row>
                    <Row gutter={[18, 18]}>
                        <Col span={3}>
                            <h4>Статус</h4>
                            {massActionsStatus[modalData?.status]?.name}
                        </Col>
                        <Col span={3}>
                            <h4>Создан</h4>
                            {moment(modalData?.created_at).format('YYYY-MM-DD HH:mm:ss')}
                        </Col>
                        <Col span={3}>
                            <h4>Обработан</h4>
                            {moment(modalData?.updated_at).format('YYYY-MM-DD HH:mm:ss')}
                        </Col>
                    </Row>
                    <Row>
                    </Row>
                    <Row>
                        <h4>Отчёт о выполнении</h4>
                        <ECColorfulText 
                            content={<span dangerouslySetInnerHTML={{ __html: modalData?.report }} />}
                            backgroundColor="black"
                            textColor="white"
                        />
                    </Row>
                </ECModal>
            </>
        )
    }
    
    return (
        <>Нет доступа</>
    )
}
import { useOpen } from '@shared/hooks/useOpen'
import { DefaultModal2 } from '@shared/ui/modals'
import { Button, Col, Row, Table } from 'antd'
import { FC, useEffect } from 'react'
import { IIncident } from '@shared/types/incidents'
import { incidentColumnsKeysTitles, incidentStatuses } from '../IncidentTableContainer/prepare'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { useNavigate } from 'react-router-dom'
import { SelectOutlined, ExceptionOutlined } from '@ant-design/icons';
import { getLocalTimeFromUTC } from '@shared/utils/datetime'
import { ButtonShowObject } from '@shared/ui/buttons/ButtonShowObject/ButtonShowObject'
import { ECConfig } from '@shared/config';
import { getURL } from '@shared/utils/nav'
interface IIncidentModalProps {
    onClose: () => void
    incident?: IIncident
    incidents?: any[]
}

export const IncidentModal2: FC<IIncidentModalProps> = ({ onClose, incident = {} }) => {
    const modal = useOpen()
    const nav = useNavigate()
    
    useEffect(() => {
        if (incident?.id) {
            modal.open()
        } else {
            modal.close()
            onClose()
        }
    }, [incident?.id])

    const dataForIncident = Object.entries(incident).map(([key, value]) => {
        let modifiedValue = value;

        if (ECConfig.incidents.fieldsUTC.includes(key)) {
            modifiedValue = getLocalTimeFromUTC(value)
        } else if (key === 'sync_status') {
            modifiedValue = incidentStatuses?.[`${incident?.sync_status}`];
        }

        return { key, title: incidentColumnsKeysTitles[key], value: modifiedValue };
    }).filter(({ title }) => Boolean(title))

    return (
        <DefaultModal2
            title="Сборная информация об инциденте"
            open={modal.isOpen}
            onCancel={() => {
                onClose()
                modal.close()
            }}
            footer={null}
            centered
        >
            <Row gutter={[0, 8]}>
                <Col xs={24}>
                    <Row gutter={4}>
                        <Col>
                            <ButtonShowObject 
                                shape="circle"
                                title="Карточка объекта"
                                icon={<SelectOutlined />}
                                id={incident.object_id}
                            />
                        </Col>
                        <Col>  
                            <Button 
                                shape="circle"
                                title="Информация об инциденте"
                                icon={<ExceptionOutlined />} 
                                onClick={(ev) => {
                                    ev.stopPropagation()
                                    nav(getURL(
                                        `${ROUTES.INCIDENTS}/${ROUTES_COMMON.SHOW}/${incident.id}`,
                                        'showcase'
                                    ))
                                    // nav(`/${ROUTES.INCIDENTS}/${ROUTES_COMMON.SHOW}/${incident.id}`)
                                }}
                            />
                        </Col>
                    </Row>
                </Col>
                <Col xs={24}>
                    <Table
                        showHeader={false} 
                        columns={[
                            { key: 'title', dataIndex: 'title', title: 'Характеристика' }, 
                            { key: 'value', dataIndex: 'value', title: 'Описание' }
                        ]}
                        dataSource={dataForIncident}
                        pagination={false}
                    />
                </Col>
            </Row>
        </DefaultModal2>
    )
}
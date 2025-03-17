import { useOpen } from '@shared/hooks/useOpen'
import { IObject } from '@shared/types/objects'
import { DefaultModal2 } from '@shared/ui/modals'
import { Button, Col, Row, Table } from 'antd'
import { FC, useEffect } from 'react'
import { LineChartOutlined, EditOutlined } from '@ant-design/icons'
import { orderedInfo } from './data'
import { useObjectsStore } from '@shared/stores/objects'
import { OAView } from '@entities/objects/OAView/OAView'
import { findAttribute } from '../IncidentTableContainer/prepare'

interface IIncidentModalProps {
    id: number | undefined, 
    onClose: () => void
    monitoringObject?: IObject
    incident?: IObject
    data?: any[]
}

export const IncidentModal: FC<IIncidentModalProps> = ({ id, onClose, data = [] }) => {
    const modal = useOpen()

    useEffect(() => {
        if (id) {
            modal.open()
        } else {
            modal.close()
            onClose()
        }
    }, [id])
    const incident = useObjectsStore((st) => st.store.data.find((obj) => obj.id === id))

    const rows = orderedInfo
        .map((key) => data.find((el) => el?.key === key))
        .map((row) => {
            if (row?.key?.includes('10174') && incident) {
                return {
                    key: row?.key,
                    param: row?.title,
                    value: (
                        <OAView 
                            enableStateText 
                            objectAttribute={findAttribute(incident, 10174)} 
                        />
                    )
                }
            }

            return {
                key: row?.key,
                param: row?.title,
                value: row?.value
            }
        })

    return (
        <DefaultModal2
            title="Cборная информация об инциденте"
            open={modal.isOpen}
            onCancel={() => {
                onClose()
                modal.close()
            }}
            footer={null}
            height={720}
            
        >
            <Row gutter={[0, 8]}>
                <Col xs={24}>
                    <Row gutter={4}>
                        <Col><Button icon={<EditOutlined />} /></Col>
                        <Col><Button icon={<LineChartOutlined />} /></Col>
                    </Row>
                </Col>
                <Col xs={24}>
                    <Table
                        showHeader={false} 
                        columns={[
                            { key: 'param', dataIndex: 'param', title: 'Характеристика', width: 320 }, 
                            { key: 'value', dataIndex: 'value', title: 'Описание' }
                        ]}
                        dataSource={rows}
                        pagination={false}
                        scroll={{ y: 680 }}
                    />
                </Col>
            </Row>
        </DefaultModal2>
    )
}
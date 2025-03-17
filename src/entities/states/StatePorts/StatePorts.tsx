import { selectObjectStateEntity, useStateEntitiesStore } from '@shared/stores/state-entities'
import { selectState, useStatesStore } from '@shared/stores/states'
import { FC, useEffect, useState } from 'react'

import { useObjectsStore } from '@shared/stores/objects'
import { IObject } from '@shared/types/objects'
import { Col, Row } from 'antd'
import { ECTooltip } from '@shared/ui/tooltips'
import ObjectCardModal from '@features/objects/ObjectCardModal/ObjectCardModal'
import { PortIcon } from '@entities/states/StatePorts/PortIcon';

interface IStatePortsProps {
    objectIds?: number[]
    directionView?: 'horizontal' | 'vertical'
}

const StatePorts: FC<IStatePortsProps> = ({ objectIds, directionView = 'horizontal' }) => {
    const getState = useStateEntitiesStore(selectObjectStateEntity)
    const state = useStatesStore(selectState)
    const objectsStore = useObjectsStore()

    const [ports, setPorts] = useState([])
    const [modalOpen, setModalOpen] = useState<number | null>(null)


    const getObjectsById = () => {
        const objectsById: IObject[] = []
        
        objectIds.forEach((obj) => {
            const objectFull = objectsStore.getByIndex('id', obj)

            if (objectFull) { objectsById.push(objectFull) }
        })

        return objectsById
    }

    useEffect(() => {
        if (objectIds && objectIds?.length > 0) {
            setPorts(getObjectsById())
        }
    }, [objectIds])

    const handleClose = () => {
        setModalOpen(null)
    }
    
    return (
        <Row 
            style={{ 
                width: '100%',
                display: 'flex', 
                alignItems: 'flex-start',
                flexDirection: directionView === 'horizontal' ? 'row' : 'column',
                overflow: 'auto',
                height: '100%',
                minHeight: 75
            }} 
            gutter={[8, 8]}
        >
            {ports?.map((port) => {
                const getStateId = getState(port.id)
                const portState = state(getStateId?.state)
                
                return (
                    <ECTooltip 
                        key={port.id}
                        title={`[id${port.id}] ${port.name} - ${portState?.view_params?.name}`}
                        placement="top"
                    >
                        <Col 
                            style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                gap: 7 
                            }}
                            onClick={() => setModalOpen(port.id)}
                        >
                            <PortIcon />
                            <div 
                                style={{
                                    width: 30,
                                    height: 8,
                                    backgroundColor: portState?.view_params?.params[0].value,
                                }} 
                            >
                            </div>
                        </Col>
                    </ECTooltip>
                )
            })}
            <ObjectCardModal objectId={modalOpen} modal={{ open: !!modalOpen, onCancel: handleClose }} />
        </Row>
    )
}

export default StatePorts
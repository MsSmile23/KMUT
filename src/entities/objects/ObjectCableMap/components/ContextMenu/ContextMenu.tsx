import { CloseOutlined } from '@ant-design/icons'
import { ButtonCancel, ButtonSubmit } from '@shared/ui/buttons'
import { Input } from '@shared/ui/forms'
import { Space } from 'antd'
import { FC, useCallback, useEffect, useState } from 'react'
import { CoordinateContextType } from '../../types'
import { calcCoords } from '../../utils'

interface ContextMenuProps {
    coordinateContext: CoordinateContextType
    handleChangeContext: (name: string, e: string) => void
    cancelContextMenu: () => void
    closeContextMenu: () => void
    handleSaveChanges: (newPosition?: { x?: number; y?: number }) => void
    tempChanges: { x?: number; y?: number }
}

const ContextMenu: FC<ContextMenuProps> = (props) => {

    const { 
        coordinateContext, 
        handleChangeContext, 
        cancelContextMenu,  
        closeContextMenu, 
        handleSaveChanges,
        tempChanges
    } = props

    const [coord, setCoord] = useState<Record<string, number>>({})
    const [contextMenuRect, setContextMenuRect] = useState<DOMRect>(null);

    const contextMenuRef = useCallback((node) => {
        setContextMenuRect(node?.getBoundingClientRect());
    }, []);

    useEffect(() => {
        if (coordinateContext && contextMenuRect) {

            const coords = calcCoords(coordinateContext, contextMenuRect);

            setCoord(coords);
        }
    }, [contextMenuRect, coordinateContext]);


    const [localPosition, setLocalPosition] = useState<typeof tempChanges>({ ...tempChanges })

    useEffect(() => {
        setLocalPosition({ ...tempChanges })
    }, [tempChanges])
    const handleLocalChange = (key: string, value: string) => {
        setLocalPosition({ ...localPosition, [key]: Number(value) })
    }

    return (
        <div
            style={{
                position: 'fixed',
                top: coord && coord.y,
                left: coord && coord.x,
                backgroundColor: 'white',
                opacity: Object.keys(coord || {}).length ? 1 : 0,
                padding: 10,
                borderRadius: 5,
                boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                zIndex: 5001
            }}
            ref={contextMenuRef}
        >
            <div
                style={{ position: 'absolute', right: 5, top: 5, cursor: 'pointer' }}
                onClick={closeContextMenu}
            >
                <CloseOutlined />
            </div>

            <div style={{ marginTop: 15, width: 200 }}>
                <div style={{ marginBottom: 10 }}>{coordinateContext.name}</div>
                <Space style={{ display: 'flex' }}>
                    <div style={{ width: 50 }}>Ось Х</div>
                    <Input
                        //value={tempChanges?.x}
                        //onChange={(e) => handleChangeContext('left', e.target.value)}
                        value={localPosition?.x}
                        onChange={(e) => handleLocalChange('x', e.target.value)}
                        type="number"
                    />
                </Space>
                <Space style={{ display: 'flex' }}>
                    <div style={{ width: 50 }}>Ось У</div>
                    <Input
                        //value={tempChanges?.y}
                        //onChange={(e) => handleChangeContext('top', e.target.value)}
                        value={localPosition?.y}
                        onChange={(e) => handleLocalChange('y', e.target.value)}
                        type="number"
                    />
                </Space>
            </div>

            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: 5, marginTop: 10 }}>
                <ButtonCancel onClick={cancelContextMenu}>
                    Отменить
                </ButtonCancel>
                <ButtonSubmit 
                    customText="Сохранить" 
                    color="green" 
                    onClick={() => handleSaveChanges({ ...localPosition })}
                    //onClick={handleSaveChanges}
                />
            </div>
        </div>
    )
}

export default ContextMenu
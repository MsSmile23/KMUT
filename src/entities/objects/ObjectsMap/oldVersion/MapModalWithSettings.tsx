import { FC } from 'react'
import React, { useRef, useState } from 'react'
import type { DraggableData, DraggableEvent } from 'react-draggable'
import Draggable from 'react-draggable'
import { Modal } from 'antd'

interface IMapModalWithSettings {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    children: React.ReactNode
}

const MapModalWithSettings: FC<IMapModalWithSettings> = ({ open, setOpen, children }) => {
    const { clientWidth, clientHeight } = window.document.documentElement
    const [bounds, setBounds] = useState({
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
    })
    const draggleRef = useRef<HTMLDivElement>(null)

    const handleOk = () => {
        setOpen(false)
    }

    const handleCancel = () => {
        setOpen(false)
    }

    const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
        const targetRect = draggleRef.current?.getBoundingClientRect()

        if (!targetRect) {
            return
        }
        setBounds({
            left: -targetRect.left + uiData.x,
            right: clientWidth - (targetRect.right - uiData.x),
            top: -targetRect.top + uiData.y,
            bottom: clientHeight - (targetRect.bottom - uiData.y),
        })
    }

    return (
        <Modal
            title={
                <div
                    style={{
                        width: '100%',
                        cursor: 'move',
                    }}
                >
                    Настройки визуальных элементов карты
                </div>
            }
            open={open}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={null}
            mask={false}
            modalRender={(modal) => (
                <Draggable
                    defaultPosition={{ x: (clientWidth * 30) / 100, y: 170 }}
                    bounds={bounds}
                    nodeRef={draggleRef}
                    onStart={(event, uiData) => onStart(event, uiData)}
                >
                    <div ref={draggleRef}>{modal}</div>
                </Draggable>
            )}
        >
            {children}
        </Modal>
    )
}

export default MapModalWithSettings
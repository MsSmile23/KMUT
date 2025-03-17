import { Modal } from 'antd'
import { Buttons } from '@shared/ui/buttons'
import { FC, ReactNode, useRef, useState } from 'react'
import type { DraggableData, DraggableEvent } from 'react-draggable'
import Draggable from 'react-draggable'
import { ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
import './DefaultModal.css'
interface DefaultModalProps {
    isModalVisible?: boolean
    isDraggable?: boolean
    handleOk?: () => void
    handleCancel?: () => void
    title?: string
    width?: string | number
    footer?: any
    height?: any
    children: ReactNode
    style?: React.CSSProperties
    customCrossPosition?: boolean
}

export const DefaultModal: FC<DefaultModalProps> = ({
    isModalVisible,
    isDraggable = false,
    handleOk,
    handleCancel,
    title,
    children,
    width,
    footer,
    height,
    style,
    customCrossPosition
}) => {
    const { clientWidth, clientHeight } = window.document.documentElement
    const [bounds, setBounds] = useState({
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
    })
    const draggleRef = useRef<HTMLDivElement>(null)
    
    const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
        const targetRect = draggleRef.current?.getBoundingClientRect()

        if (!targetRect) {
            return
        }
        setBounds({
            left: -targetRect.left + uiData.x + 1,
            right: clientWidth - (targetRect.right - uiData.x) - 1,
            top: -targetRect.top + uiData.y + 1,
            bottom: clientHeight - (targetRect.bottom - uiData.y) - 1,
        })
    }

    return (
        <Modal
            destroyOnClose
            title={title}
            open={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={width ? width : '90vw'}
            style={{
                ...style,
                height: height ?? '90vh',
            }}
            className={customCrossPosition ? 'customCrossPosition' : ''}
            centered
            footer={
                footer
                    ? [
                        <Buttons.ButtonCancel key="1" onClick={() => handleCancel && handleCancel()}>
                            Отмена
                        </Buttons.ButtonCancel>,
                        <Buttons.ButtonAdd key="2" onClick={() => handleOk && handleOk()}>
                            Применить
                        </Buttons.ButtonAdd>,
                    ]
                    : null
            }
            modalRender={isDraggable 
                ? (modal) => (
                    <Draggable
                        // defaultPosition={{ x: (clientWidth * 30) / 100, y: 170 }}
                        handle=".drag"
                        bounds={bounds}
                        nodeRef={draggleRef}
                        onStart={(event, uiData) => onStart(event, uiData)}
                    >
                        <div ref={draggleRef}>{modal}</div>
                    </Draggable>
                ) : (modal) => { return <div>{modal}</div>}}
        >
            {isDraggable &&
            <div className="drag" style={{ width: '100%', height: '10px' }}>
                <ECIconView 
                    icon="DragOutlined" 
                    style={{
                        position: 'absolute',
                        top: 7,
                        left: 7,
                        cursor: 'grab', 
                        fontSize: 18
                    }} 
                />
            </div>            }
            <div 
                style={{ 
                    minWidth: '50%', 
                    maxWidth: '100%',
                }}
            >
                {children}
            </div>
        </Modal>
    )
}
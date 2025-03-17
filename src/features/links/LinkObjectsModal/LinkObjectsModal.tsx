import { Modal } from 'antd'
import { Buttons } from '@shared/ui/buttons'
import { FC, ReactNode } from 'react'
import { useModalWidth } from '@shared/ui/modals/DefaultModal2/useModalWidth'

interface DefaultModalProps {
    isModalVisible?: boolean
    handleOk?: () => void
    handleCancel?: () => void
    title?: string
    width?: string
    footer?: any
    height?: string| number
    children: ReactNode
    onOk?: (e?: React.MouseEvent<HTMLButtonElement>, ...arg: any) => void
    onCancel?: (e?: React.MouseEvent<HTMLButtonElement>) => void
}

export const LinksObjectModal: FC<DefaultModalProps> = ({
    isModalVisible,
    // handleOk,
    // handleCancel,
    title,
    children,
    width,
    footer,
    height,
    onOk,
    onCancel,
}) => {
    const modalWidth = useModalWidth(width)
    
    return (
        <Modal
            title={title}
            destroyOnClose
            open={isModalVisible}
            onOk={(e) => onOk(e)}
            onCancel={(e) => onCancel(e)}
            width={modalWidth}
            // width={width ? width : '80vw'}
            // bodyStyle={height ? { height: height } : { height: 'auto' }}
            styles={
                {
                    body: {
                        height: height ?  height  :  'auto' 
                    }
                }
            }
            centered
            footer={
                footer
                    ? [
                        <>
                            <Buttons.ButtonSubmit
                                color="green"
                                customText="Создать связь"
                                key="1"
                                onClick={() => onOk()}
                            />
                            <Buttons.ButtonClear customText="Отменить" key="2" onClick={() => onCancel()} />.
                        </>,
                    ]
                    : null
            }
        >
            <div style={{ minWidth: '50%', maxWidth: '100%' }}>{children}</div>
        </Modal>
    )
}
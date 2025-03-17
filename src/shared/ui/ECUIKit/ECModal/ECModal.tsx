import { ButtonCancel, ButtonSubmit } from '@shared/ui/buttons';
import { Modal } from 'antd';
import { useModalWidth } from './useModalWidth';
import { IModal } from './types/ECModal'

export const ECModal: React.FC<IModal> = ({
    children,
    onOk,
    onCancel,
    width,
    height,
    tooltipText,
    centered = false,
    showFooterButtons = true,
    loading = false,
    ...props
}) => {
    const modalWidth = useModalWidth(width)
    const footerButtons = (showFooterButtons)
        ?
        [
            <ButtonSubmit loading={loading} key="save" onClick={() => onOk?.()} />,
            <ButtonCancel loading={loading} key="cancel" onClick={() => onCancel()} />
        ]
        : []

    return (
        <Modal
            title={tooltipText ? tooltipText : 'Создание нового объекта'}
            destroyOnClose
            centered={centered}
            width={width ? width : modalWidth}
            styles={{ body: { height, ...props.style } }}
            onCancel={(e) => onCancel(e)}
            footer={footerButtons}
            transitionName=""
            maskTransitionName=""
            {...props}
        >
            <div style={{ height: '100%' }}>
                {children}
            </div>
        </Modal>
    )
}

export default ECModal
import { ButtonCancel, ButtonSubmit } from '@shared/ui/buttons';
import { Modal, ModalProps } from 'antd';
import { useModalWidth } from './useModalWidth';

export interface IModal extends ModalProps {
    onOk?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
    onCancel?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
    height?: string | number
    tooltipText?: string,
    showFooterButtons?: boolean,
    centered?: boolean
    loading?: boolean
}

export const DefaultModal2: React.FC<IModal & {
    contentStyles?: React.CSSProperties
}> = ({
    children,
    onOk,
    onCancel,
    width,
    height,
    tooltipText,
    centered = false,
    showFooterButtons = true,
    loading = false,
    contentStyles,
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
            // width={modalWidth}
            centered={centered}
            width={width ? width : modalWidth}
            // bodyStyle={height ? { height: height } : { height: '90vh' }}
            styles={{ body: { height, ...props.style } }}
            // bodyStyle={{ height, ...props.style }}
            // style={{height:500}}
            onCancel={(e) => onCancel(e)}
            footer={footerButtons}
            transitionName=""
            maskTransitionName=""
            {...props}
        >
            <div style={{ height: '100%', ...contentStyles }}>
                {children}
            </div>
        </Modal>
    )
}
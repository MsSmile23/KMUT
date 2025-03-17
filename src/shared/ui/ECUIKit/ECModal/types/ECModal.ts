import { ModalProps } from 'antd';

export interface IModal extends ModalProps {
    onOk?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
    onCancel: (e?: React.MouseEvent<HTMLButtonElement>) => void;
    height?: string | number
    tooltipText?: string,
    showFooterButtons?: boolean,
    centered?: boolean
    loading?: boolean
}
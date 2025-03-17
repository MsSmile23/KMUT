import { Popconfirm, message } from 'antd';
import { FC, ReactNode } from 'react';

interface ConfirmDialogProps {
    children: ReactNode,
    onConfirm?: (event?: React.MouseEvent<HTMLElement, MouseEvent>) => void,
    onConfirmMessage?: string,
    onCancelMessage?: string,
    title: string
    disablePopup?: boolean
    disableMessage?: boolean
}

export const ECConfirmationDialog: FC<ConfirmDialogProps> = ({
    children,
    onConfirm,
    onConfirmMessage = 'Click on Yes',
    onCancelMessage = 'Click on No',
    title = 'Вы точно хотите удалить объект?',
    disablePopup = false,
    disableMessage = false
}) => {

    const confirm = async () => {
        try {
            if (onConfirm) {
                // Ждем выполнения onConfirm, если он асинхронный
                const response = await onConfirm();

                if (!disableMessage) {
                    if (response?.success || !response && !disablePopup) {
                        message.success(onConfirmMessage)
    
                        return
                    }
    
                    if (!response?.success) {
                        message.error(`${response?.error?.errors?.id}`)
    
                        return
                    }
    
                    {if (!disablePopup) {
                        message.error(response?.error?.message || 'Неизвестная ошибка')
                    }}
                }

                return
            }

            // Если функция onConfirm не передана, выводим сообщение об ошибке
            message.error('Не указана функция для выполнения');
        } catch (error) {
            // Если происходит ошибка, выводим сообщение об ошибке
            console.error('Ошибка при выполнении onConfirm:', error);
            message.error(onCancelMessage);
        }
    };

    const cancel = () => {
        message.error(onCancelMessage);
    }

    return (
        <Popconfirm
            title={title}
            onConfirm={confirm}
            onCancel={cancel}
            okText="Да"
            cancelText="Нет"
        >
            {children}
        </Popconfirm>
    );
}
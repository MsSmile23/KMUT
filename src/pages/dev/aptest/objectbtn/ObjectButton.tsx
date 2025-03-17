import { ROUTES, ROUTES_COMMON } from "@shared/config/paths";
import { useToggle } from "@shared/hooks/useToggle";
import { BaseButton } from "@shared/ui/buttons";
import { getURL } from '@shared/utils/nav';
import { ButtonProps, Modal, ModalProps } from "antd";
import { FC, PropsWithChildren } from "react";
import { useHref, useNavigate } from "react-router-dom";

interface IObjectButton extends Omit<ButtonProps, 'onClick'> {
    to: string
    modalProps?: Omit<ModalProps, 'open'>,
}

/**
 * Компонент для отображения модального окна с карточкой объекта или перехода на нее по Ctrl+Click.
 * 
 * @param to - идентификатор объекта или свои параметры (пример '/123?class_id=1')
 * @param modalProps - настройки модального окна 
 * @param children - конент внутри кнопки  
 */
export const ObjectButton: FC<PropsWithChildren<IObjectButton>> = ({
    to,
    modalProps, 
    children,
    ...buttonProps
}) => {
    const go = useNavigate()
    const modal = useToggle()

    return (
        <>
            <BaseButton
                {...buttonProps}
                style={{ padding: 0 }}
                onClick={(ev) => {
                    if (ev.ctrlKey) {
                        go(getURL(
                            `${ROUTES.OBJECTS}/${ROUTES_COMMON.SHOW}${to}`,
                            'showcase'
                        ))
                        // go(`/${ROUTES.OBJECTS}/${ROUTES_COMMON.SHOW}${to}`)

                        return
                    }

                    modal.open()
                }}
            >
                {children}
            </BaseButton>
            <Modal 
                {...modalProps}
                footer={null} 
                open={modal.isOpen} 
                onCancel={(ev) => {
                    modalProps?.onCancel?.(ev)
                    modal.close()
                }}
            />
        </>
    )
}
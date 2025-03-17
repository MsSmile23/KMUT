import { useToggle } from '@shared/hooks/useToggle'
import { ButtonProps, Modal, ModalProps } from 'antd'
import { FC, PropsWithChildren } from 'react'
import { useNavigate } from 'react-router-dom'
import { BaseButton } from '..'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import VtemplateView from '@containers/vtemplates/VtemplateFormContainer/components/VtemplateView'
import ObjectCardContainer from '@containers/objects/ObjectCardContainer/ObjectCardContainer'
import { getURL } from '@shared/utils/nav'
import { useObjectVTemplate } from '@shared/hooks/useObjectVTemplate'

interface IButtonShowObject extends Omit<ButtonProps, 'onClick' | 'id'> {
    querySearch?: string
    id: number
    modalProps?: Omit<ModalProps, 'open'>,
    noToggle?: boolean
    noButton?: boolean
    disableNavigate?: boolean
    maxWidth?: boolean
}

/**
 * Кнопка для перехода на страницу показа объект по Ctrl + Mouse Click, либо открытия модального
 * окна с объектом при обычном клике
 * 
 * @param querySearch - запрос с параметрами, например (?class_id=100)
 * @param id - id объекта 
 * @param modalProps - пропсы модального стандартного модального окна
 * @param noToggle - отключает хук открытия/закрытия, если в modalProps.children передано модального окно 
 * @returns 
 */

export const ButtonShowObject: FC<PropsWithChildren<IButtonShowObject>> = ({
    querySearch,
    id,
    modalProps, 
    children,
    noToggle,
    noButton,
    disableNavigate,
    maxWidth,
    ...buttonProps
}) => {
    const go = useNavigate()
    const modal = useToggle()
    const vTemplate = useObjectVTemplate(Number(id))

    const handleClick = (ev: React.MouseEvent<HTMLElement, MouseEvent>) => {
                    
        if (ev.ctrlKey) {
            if (disableNavigate) {
                return
            }
            go(getURL(
                `${ROUTES.OBJECTS}/${ROUTES_COMMON.SHOW}/${id}${querySearch || ''}`,
                'showcase'
            ))
            // go(`/${ROUTES.OBJECTS}/${ROUTES_COMMON.SHOW}/${id}${querySearch || ''}`)

            return
        }

        if (noToggle) {
            return
        }

        modal.open()
    }

    return (
        <>
            {!noButton && (
                <BaseButton
                    style={{ padding: 0, cursor: 'pointer' }}
                    {...buttonProps}
                    onClick={handleClick}
                >
                    {children}
                </BaseButton>
            )}
            {noButton && (

                <div 
                    onClick={handleClick} 
                    style={{ display: 'flex', width: maxWidth ? '100%' : 'auto', cursor: 'pointer' }}
                >

                    {children}
                </div>
            )}
            <Modal
                destroyOnClose
                width="80%"
                title="Просмотр объекта"
                {...modalProps}
                footer={null} 
                open={modal.isOpen} 
                onCancel={(ev) => {
                    modalProps?.onCancel?.(ev)

                    if (noToggle) {
                        return
                    }

                    modal.close()
                }}
            >
                <div    
                    style={{
                        // maxHeight: 800,
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        height: '80vh',
                        minHeight: '800px',
                        minWidth: '600px',
                        paddingTop: 10
                    }} 
                >
                    {modalProps?.children ?? (
                        vTemplate 
                            ? <VtemplateView vtemplate={vTemplate.vTemplate} objectId={id} /> 
                            : <ObjectCardContainer id={id} />
                    )}
                </div>
            </Modal>
        </>
    )
}
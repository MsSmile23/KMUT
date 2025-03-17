import { Button } from 'antd'
import { FC } from 'react'
import { DeleteOutlined } from '@ant-design/icons'
import { IButtonRow } from '@shared/ui/buttons/types'
import ECConfirmationDialog from '@shared/ui/ECUIKit/modals'
import { ECTooltip } from '@shared/ui/tooltips'

interface IButtonDeleteRow {
    buttonTitle?: string
    disablePopup?: boolean
    disableMessage?: boolean
}

export const ButtonDeleteRow: FC<IButtonRow & IButtonDeleteRow> = (props) => {
    const { withConfirm, onClick, popupTitle, buttonTitle, baseSettings, disablePopup, disableMessage, ...arg } = props
    // const ButtonDelete = (
    //     <Button
    //         {...props}
    //         size="small"
    //         shape="circle"
    //         style={{ backgroundColor: '#FF0000', color: '#ffffff' }}
    //         type="primary"
    //         icon={<DeleteOutlined />}
    //     />
    // )

    return (
        <>
            {withConfirm && (
                <ECConfirmationDialog
                    title={popupTitle ? popupTitle : 'Удалить?'}
                    disablePopup
                    disableMessage
                    onConfirm={onClick}
                    onConfirmMessage="Элемент удален"
                    onCancelMessage="Ошибка удаления элемента"
                >
                    <ECTooltip title={buttonTitle || 'Удалить'}>
                        <Button
                            // {...props}
                            size="small"
                            shape="circle"
                            style={
                                !baseSettings && {
                                    backgroundColor: props?.disabled ? 'grey' : '#FF0000',
                                    color: '#ffffff',
                                }
                            }
                            type="primary"
                            icon={<DeleteOutlined />}
                            {...arg}
                        />
                    </ECTooltip>
                </ECConfirmationDialog>
            )}
            {!withConfirm && (
                <ECTooltip title="Удалить">
                    <Button
                        {...props}
                        size="small"
                        shape="circle"
                        style=
                            {!baseSettings && { backgroundColor: props?.disabled 
                                ? 'grey' 
                                : '#FF0000', color: '#ffffff' }}
                        type="primary"
                        icon={<DeleteOutlined />}
                        {...arg}
                    />
                </ECTooltip>
            )}
        </>
    )
}
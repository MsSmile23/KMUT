import { IButton } from '@shared/ui/buttons/types'
import { ECTooltip } from '@shared/ui/tooltips'
import { Button } from 'antd'
import { FC } from 'react'

export const ECButtonRowStatus: FC<IButton> = ({
    onClick,
    background = '#000000',
    color = '#ffffff',
    size = 'small'
}) => {

    return (
        <ECTooltip title="Выбрать статус">
            <Button
                size={size}
                style={{ backgroundColor: background, color: color, width: '40px' }}
                type="primary"
                onClick={onClick}
                icon={
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="24" viewBox="0 0 24 24">
                        <circle cx="0" cy="11" r="7" fill="green" enableBackground="false" />
                        <circle cx="7" cy="11" r="7" fill="yellow" enableBackground="false" />
                        <circle cx="14" cy="11" r="7" fill="orange" />
                        <circle cx="22" cy="11" r="7" fill="red" />
                    </svg>
                }
            />
        </ECTooltip>
    )
}
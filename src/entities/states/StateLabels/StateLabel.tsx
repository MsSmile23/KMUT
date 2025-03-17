import { selectState, useStatesStore } from '@shared/stores/states'
import { IState } from '@shared/types/states'
import { ECTooltip } from '@shared/ui/tooltips'
// import { IInputIcon, InputIcon } from '@shared/ui/icons/InputIcon'
import { IAccumState, getStateViewParamsWithDefault } from '@shared/utils/states'
import { Tag } from 'antd'
import { FC, PropsWithChildren } from 'react'

export interface IStateLAbelProps {
    stateId?: number
    state?: IState | IAccumState
    wrapperStyles?: React.CSSProperties
    title?: string
    onClick?: (id?: number) => void
    showStateName?: boolean, //Если true, то в качестве контента показываем название состояния
    maxWidth?: boolean
}

export const StateLabel: FC<PropsWithChildren<IStateLAbelProps>> = ({ 
    stateId,
    state,
    wrapperStyles,
    children,
    title,
    onClick,
    showStateName = false,
    maxWidth
}) => {
    const getState = useStatesStore(selectState)
    const stateFromId = getState(stateId)
    const currentState = stateFromId ?? state
    const viewParams = getStateViewParamsWithDefault(currentState)

    return (
        <ECTooltip
            title={title ? `${title} - ${viewParams.name}` : viewParams.name}
            color={viewParams.textColor}
        >
            <Tag
                style={{
                    marginRight: 0,
                    marginLeft: 2,
                    padding: '5px',
                    // lineHeight: '11px',
                    color: viewParams.textColor,
                    backgroundColor: viewParams.fill,
                    borderColor: viewParams.border,
                    userSelect: 'none',
                    width: maxWidth ?  '100%' : 'auto',
                    cursor: 'pointer',
                    ...wrapperStyles,
                }}
                onClick={onClick 
                    ? () => onClick() 
                    : null}
            >
                { showStateName ? viewParams.name : children }
            </Tag>
        </ECTooltip>
    )
}
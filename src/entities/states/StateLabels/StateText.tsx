import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { selectState, useStatesStore } from '@shared/stores/states'
import { IState } from '@shared/types/states'
import { IECIconView, ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
import { IAccumState, getStateViewParamsWithDefault, stateViewParamsDefault } from '@shared/utils/states'
import { FC, PropsWithChildren } from 'react'

export const StateText: FC<
    PropsWithChildren<{
        stateId?: number
        state?: IState | IAccumState
        styles?: React.CSSProperties
        underline?: boolean
        showStateName?: boolean //Если true, то в качестве контента показываем название состояния
        icon?: {
            enabled: boolean
            name: IECIconView['icon']
            style: React.CSSProperties
        }
        onClick: () => void
    }>
> = ({ styles, children, stateId, state, underline, showStateName = false, icon, onClick }) => {
    const getState = useStatesStore(selectState)
    const stateFromId = getState(stateId)
    const currentState = stateFromId ?? state
    const viewParams = getStateViewParamsWithDefault(currentState)
    const accountData = useAccountStore(selectAccount)
    const themeMode = accountData?.user?.settings?.themeMode

    //Так как дефолтный цвет фона бледно серый, используем дефолтный цвет текста, но только если светлая тема
    const newColor =
        viewParams.fill == stateViewParamsDefault.fill
            ? themeMode === 'dark'
                ? viewParams.fill
                : viewParams.textColor
            : viewParams.fill

    return (
        <span
            onClick={onClick}
            style={{
                ...styles,
                color: newColor,
                textDecoration: underline ? 'underline' : 'none',
            }}
        >
            {icon?.enabled && (
                <ECIconView
                    icon={icon?.name}
                    style={{
                        ...icon?.style,
                        color: newColor,
                    }}
                />
            )}
            {showStateName ? viewParams?.name : children}
        </span>
    )
}
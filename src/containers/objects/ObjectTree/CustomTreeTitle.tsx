import { FC, useMemo } from 'react'
import { ITreeObjectsStatesProps } from './treeTypes'
import { ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
import { StateLabel } from '@entities/states/StateLabels'
import { ECTooltip } from '@shared/ui/tooltips'
import { useTheme } from '@shared/hooks/useTheme'
import { useAccountStore } from '@shared/stores/accounts'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'

export const CustomTreeTitle: FC<ITreeObjectsStatesProps> = ({
    statuses,
    title = 'Все объекты',
    groupTitle,
    icon,
    color = '#000000',
    styles
}) => {

    const theme = useTheme()
    const accountData = useAccountStore((st) => st.store.data?.user)

    const themeMode = accountData?.settings?.themeMode
    // const color = createColorForTheme(theme?.sideBar?.textColor, theme?.colors, themeMode)
    // const background = createColorForTheme(theme?.sideBar?.background, theme?.colors, themeMode)


    const textColor = useMemo(() => {
        return (
            createColorForTheme(theme?.sideBar?.textColor, theme?.colors, themeMode) ||
      '#000000'
        )
    }, [theme, themeMode])

    const sortedStatuses = statuses.map(a => a)
        .sort((a, b) => {
            if (a?.state?.priority && b?.state?.priority) {
                return a?.state?.priority - b?.state?.priority
            } else {
                return a?.state?.states[0]?.priority - b?.state?.states[0]?.priority
            }
        })

    return (
        // <>
        <span style={{ ...styles, /* display: 'flex',  flexDirection: 'row' */ }}>
            <span>
                {icon && (
                    <ECIconView
                        icon={icon}
                        style={{
                            marginRight: '5px',
                            color: textColor ?? color
                        }}
                    />
                )}
            </span>
            <span
                style={{
                    marginRight: '5px',
                    color: textColor ?? color
                    // flex: 1,
                    // textOverflow: 'ellipsis',
                    // whiteSpace: 'nowrap',
                    // overflow: 'hidden',
                }}
            >
                <ECTooltip
                    title={groupTitle && groupTitle !== title ? `${groupTitle} - ${title}` : title}
                >
                    {title}
                </ECTooltip>
            </span>
            <span style={{}}>
                {sortedStatuses.map((status, idx) => {
                // {statuses.map((status, idx) => {
                    return (
                        <StateLabel
                            key={status.state.id ?? idx + status.state?.view_params?.name}
                            state={status.state}
                            wrapperStyles={{ lineHeight: '11px' }}
                        >
                            {status.count}
                        </StateLabel>
                    )
                })}
            </span>
            {/* </span> */}
        </span>
        // </>
    )
}
import { useTheme } from '@shared/hooks/useTheme'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { IECIconView, ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
import { ECTooltip } from '@shared/ui/tooltips'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import { Button } from 'antd'
import { FC, useMemo } from 'react'

export const TreeButton: FC<{
    title?: string
    icon?: IECIconView['icon']
    iconSize?: number
    onClickHandler?: () => void
}> = ({ onClickHandler, icon, title, iconSize }) => {
    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode

    const color = useMemo(() => {
        return (
            createColorForTheme(theme?.sideBar?.textColor, theme?.colors, themeMode) ||
            theme?.components?.tree?.showcase?.buttons?.color
        )
    }, [theme, themeMode])

    return (
        <ECTooltip title={title ?? 'Нажмите кнопку'}>
            <Button
                icon={<ECIconView icon={icon ?? 'FolderOutlined'} style={{ fontSize: iconSize ?? 16 }} />}
                style={{
                    color: color ?? '#ffffff',
                    border: 'none',
                    boxShadow: 'none',
                    minWidth: 24,
                    minHeight: 24,
                    background: 'transparent',
                }}
                onClick={onClickHandler}
            />
        </ECTooltip>
    )
}
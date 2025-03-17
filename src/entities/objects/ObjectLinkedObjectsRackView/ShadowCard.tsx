import { useTheme } from '@shared/hooks/useTheme'
import { useAccountStore, selectAccount } from '@shared/stores/accounts'
import { generalStore } from '@shared/stores/general'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import { Card } from 'antd'
import { FC, PropsWithChildren } from 'react'

export const ShadowCard: FC<PropsWithChildren> = ({ children }) => {
    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode

    const interfaceView = generalStore((st) => st.interfaceView)
    const isShowcase = interfaceView === 'showcase'

    const color = isShowcase
        ? createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode) || 'black'
        : '#000000'
    const background = isShowcase
        ? createColorForTheme(theme?.widget?.background, theme?.colors, themeMode) || '#ffffff'
        : 'white'

    return (
        <Card
            style={{
                boxShadow: 'rgba(0, 0, 0, 0.4) 0px 0px 8px',
                border: themeMode == 'dark' ? 'none' : 'initial',
                borderRadius: themeMode == 'dark' ? '0px' : '0px 0px 8px 8px',
            }}
            bodyStyle={{
                padding: 8,
                background: background ?? '#ffffff',
                color: color ?? '#ffffff',
                border: themeMode == 'dark' ? 'none' : 'initial',
                borderRadius: themeMode == 'dark' ? '0px' : '0px 0px 8px 8px',
            }}
        >
            {children}
        </Card>
    )
}
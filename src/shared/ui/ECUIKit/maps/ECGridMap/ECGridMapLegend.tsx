import { useTheme } from '@shared/hooks/useTheme'
import { useAccountStore, selectAccount } from '@shared/stores/accounts'
import { generalStore } from '@shared/stores/general'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import { FC } from 'react'

interface ECGridMapLegendProps {
    data: {
        text: string
        color: string
    }[]
}

const ECGridMapLegend: FC<ECGridMapLegendProps> = ({ data }) => {
    const interfaceView = generalStore((st) => st.interfaceView)
    const isShowcase = interfaceView === 'showcase'
    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode
    const textColor = isShowcase ? createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode) : 'black'

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {data?.map((el, idx) => {
                return (
                    <div key={idx} style={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center' }}>
                        <div style={{ width: 24, height: 24, backgroundColor: el.color, marginRight: 8 }} />
                        <span style={{ color: textColor }}> - {el.text}</span>
                    </div>
                )
            })}
        </div>
    )
}

export default ECGridMapLegend
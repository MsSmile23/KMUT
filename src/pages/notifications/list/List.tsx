import { ObjectNotificationTable } from '@containers/objects/ObjectNotificationTable/ObjectNotificationTable'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { useTheme } from '@shared/hooks/useTheme'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { generalStore } from '@shared/stores/general'
import { PageHeader } from '@shared/ui/pageHeader'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import { Card } from 'antd'
import { FC } from 'react'

export const List: FC = () => {
    const interfaceView = generalStore((st) => st.interfaceView)
    const isShowcase = interfaceView === 'showcase'
    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode

    const backgroundColor = isShowcase
        ? createColorForTheme(theme?.widget?.background, theme?.colors, themeMode)
        : 'white'

    return (
        <>
            <PageHeader
                title="Таблица уведомлений"
                routes={[
                    {
                        path: ROUTES.MAIN,
                        breadcrumbName: 'Главная',
                    },
                    {
                        path: `/${ROUTES.NOTIFICATIONS}/${ROUTES_COMMON.LIST}`,
                        breadcrumbName: 'Таблица уведомлений',
                    },
                ]}
            />
            <Card
                style={{
                    marginTop: '10px',
                    background: backgroundColor ?? 'transparent',
                    border: themeMode == 'dark' ? 'none' : '1px solid #f0f0f0',
                }}
            >
                <ObjectNotificationTable />
            </Card>
        </>
    )
}
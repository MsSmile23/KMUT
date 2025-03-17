import { DownloadOutlined } from '@ant-design/icons'
import ReportsCompactList from '@entities/reports/ReportsCompactList/ReportsCompactList'
import { Drawer } from 'antd/lib'
import { useState } from 'react'
import { generalStore } from '@shared/stores/general'
import { useTheme } from '@shared/hooks/useTheme'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import styles from './ReportsDownloadWithDrawer.module.css'
import { useApi2 } from '@shared/hooks/useApi2';
import { getReports2 } from '@shared/api/Reports/Models/getReports2/getReports2';
import { SERVICES_ACCOUNTS } from '@shared/api/Accounts';

const ReportsDownloadWithDrawer = () => {

    const reports = useApi2(getReports2, {
        autoUpdate: 60_000,
        onmount: true,
        payload: {
            sort: '-id',
            all: true
        }
    },
    )

    const interfaceView = generalStore(st => st.interfaceView)

    const isShowcase = interfaceView === 'showcase'
    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode
    const textColor = isShowcase ? createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode) : 'black'
    const backgroundColor = isShowcase
        ? createColorForTheme(theme?.widget?.background, theme?.colors, themeMode)
        : 'white'


    const forceUpdate = useAccountStore((st) => st.forceUpdate)
    const changeAccountSettings = async (last_report_id) => {
        const newSettings = {
            ...accountData?.user?.settings,
            last_report_id,
        }
        const response = await SERVICES_ACCOUNTS.Models.patchAccountMyself({
            settings: newSettings,
        })

        if (response?.success) {
            forceUpdate()
        }
    }

    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        changeAccountSettings(reports?.data[0]?.id)
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false)
    }

    // console.log('account', accountData)
    // console.log('reports', reports)

    // console.log('last', accountData?.user?.settings?.last_report_id)

    return (
        <div style={{ width: 30 }}>

            {
                reports?.data[0]?.id > (accountData?.user?.settings?.last_report_id ?? -1) &&

                <div
                    style={{
                        position: 'fixed',
                        fontSize: 10,
                        marginLeft: 30,
                        backgroundColor: 'orange',
                        borderRadius: 10,
                        width: 5,
                        height: 5,
                    }}

                />
            }
            <DownloadOutlined
                onClick={showDrawer}
                style={{
                    fontSize: 30,
                    color: textColor,
                    borderRadius: 20,
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                className={styles.icon}
            />
            <Drawer
                // title="Basic Drawer"
                placement="right"
                closable={false}
                onClose={onClose}
                open={open}
                style={{ padding: 0, margin: 0, backgroundColor }}
                styles={{ body: { padding: 0, margin: 0 } }}
            >
                <ReportsCompactList reports={reports} />
            </Drawer>
        </div>
    )
}

export default ReportsDownloadWithDrawer
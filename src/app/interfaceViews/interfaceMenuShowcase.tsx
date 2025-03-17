/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useState } from 'react'
import React from 'react'
import {
    PieChartOutlined,
    AppstoreAddOutlined,
    PartitionOutlined,
    AppstoreOutlined,
    LogoutOutlined,
    BgColorsOutlined,
    UserOutlined,
    UserSwitchOutlined,
    FormatPainterOutlined,
} from '@ant-design/icons'
import { Button, Menu, MenuProps } from 'antd'
import { /* IInterfaceView,  */ generalStore } from '@shared/stores/general'
import { useAccountStore, selectAccount, selectLogout } from '@shared/stores/accounts'
import { useNavigate } from 'react-router'
import { ROUTES, ROUTES_COMMON, ROUTES_SETTINGS } from '@shared/config/paths'
import { useTheme } from '@shared/hooks/useTheme'
import { IECIconView, ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
import { PasswordChangeModal } from './PasswordChangeModal'
import { getInterfaceRoute, getURL } from '@shared/utils/nav'
import { Link } from 'react-router-dom'
import { patchAccountById } from '@shared/api/Accounts/Models/patchAccountById/patchAccountById'
import { SERVICES_ACCOUNTS } from '@shared/api/Accounts'
interface InterfaceMenuProps {
    mode?: any
    color: string
    backgroundColor: string
    aside?: boolean
}

export const InterfaceMenuShowcase: FC<InterfaceMenuProps> = (props) => {
    const theme = useTheme()
    const { userMenu } = theme.layout.header
    const { mode = 'horizontal', backgroundColor, color, aside } = props

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [setInterfaceView, interfaceView] = generalStore((state) => [state.setInterfaceView, state.interfaceView])
    const accountData = useAccountStore(selectAccount)
    const logout = useAccountStore(selectLogout)

    const authUser = accountData?.user?.login
    const interfaces = accountData?.user?.role?.interfaces ?? [] /* ['constructor', 'manager', 'showcase'] */
    const navigate = useNavigate()
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode

    const { forceUpdate } = useAccountStore.getState()
    const changeThemeMode = async () => {
        const newSettings = {
            ...accountData?.user?.settings,
            themeMode: themeMode == 'dark' ? 'light' : 'dark',
        }

        // const response = await patchAccountById(`${accountData?.user?.id}`, {
        //     settings: newSettings,
        // })
        const response = await SERVICES_ACCOUNTS.Models.patchAccountMyself({
            settings: newSettings,
        })

        // SERVICES_ACCOUNTS.Models.patchAccountMyself

        if (response?.success) {
            // setState(StoreStates.FINISH)
            forceUpdate()
            // message.success(`Настройки дерева ${accountData?.id ?? ''} сохранены`)
        }
    }
    const handleLogout = () => {
        logout()
    }

    const interfaceItems = [
        {
            key: 'constructor',
            icon: <PartitionOutlined rev={undefined} />,
            label: <Link to={getInterfaceRoute('constructor')}>Конструктор</Link>,
            style: { marginTop: '5px' },
        },
        {
            key: 'manager',
            icon: <AppstoreAddOutlined rev={undefined} />,
            label: <Link to={getInterfaceRoute('manager')}>Менеджер</Link>,
        },
        {
            key: 'showcase',
            icon: <PieChartOutlined rev={undefined} />,
            label: <Link to={getInterfaceRoute('showcase')}>Витрина</Link>,
        },
    ]
    const itemStyle = {
        marginTop: '5px',
        marginLeft: '-7px',
        marginRight: '-10px',
    }

    const [openPasswordModal, setOpenPasswordModal] = useState(false)

    const items: MenuProps['items'] = [
        {
            key: '0',
            icon: '',
            label:
                userMenu.fullName && !aside ? (
                    <>
                        <Button
                            shape="circle"
                            style={{
                                background: userMenu.background ?? '#ffffff',
                                boxShadow: 'none',
                                border: `${userMenu.border.width}px solid ${userMenu.border.color}`,
                            }}
                        >
                            <ECIconView
                                icon={userMenu.icon as IECIconView['icon']}
                                style={{
                                    color: userMenu.iconBackground,
                                }}
                            />
                        </Button>
                        <span
                            style={{
                                marginLeft: '12px',
                                color: theme?.layout.header.fontColor ?? userMenu.font.color,
                                fontSize: `${userMenu.font.size}px`,
                            }}
                        >
                            {authUser}
                        </span>
                    </>
                ) : (
                    <Button
                        shape="circle"
                        style={{
                            background: '#0740AC',
                            color: 'white',
                        }}
                    >
                        {authUser.slice(0, 1).toUpperCase()}
                    </Button>
                ),
            style: { border: 'none' },
            children: [
                interfaces.length > 1 && {
                    key: '1',
                    icon: React.createElement(AppstoreOutlined),
                    label: 'Интерфейсы',
                    style: itemStyle,
                    popupOffset: [-10, -4],
                    children: interfaceItems.filter((item) => {
                        return interfaces.includes(item.key as 'constructor' | 'manager' | 'showcase')
                    }),
                },
                {
                    key: '2',
                    icon: <BgColorsOutlined rev={undefined} />,
                    label: 'Лайауты',
                    style: itemStyle,
                    popupOffset: [-10, -4],
                    children: [
                        {
                            key: '2.3',
                            label: 'Настройки проекта',
                            onClick: () => {
                                navigate(getURL(`${ROUTES.SETTINGS}/${ROUTES_SETTINGS.LAYOUT}`, 'showcase'))
                            },
                        },
                        {
                            key: '2.4',
                            label: `Включить ${themeMode == 'dark' ? 'светлую' : 'тёмную'} тему`,
                            icon: <FormatPainterOutlined />,
                            disabled: (theme?.projectThemeMode !== undefined && theme?.projectThemeMode !== 'default'),
                            onClick: () => {
                                changeThemeMode()
                                // navigate(`${ROUTES.SETTINGS}/${ROUTES_SETTINGS.LAYOUT}`)
                                // navigate(ROUTES.LAYOUT_SETTINGS)
                            },
                        },
                    ],
                },
                {
                    key: 'change-password',
                    icon: <UserSwitchOutlined />,
                    label: 'Смена пароля',
                    style: { marginTop: '15px', marginLeft: '-7px' },
                    onClick: () => setOpenPasswordModal(true),
                },
                interfaces.includes('constructor') && interfaceView == 'constructor'
                    ? {
                        key: '4',
                        icon: <UserOutlined />,
                        label: 'Аккаунты',
                        style: itemStyle,
                        onClick: () => {
                            navigate(getURL(`${ROUTES.ACCOUNTS}/${ROUTES_COMMON.LIST}`, 'constructor'))
                        },
                    }
                    : null,

                {
                    key: '3',
                    icon: <LogoutOutlined rev={undefined} />,
                    label: 'Выйти',
                    style: { ...itemStyle, marginRight: '-7px' },
                    onClick: () => {
                        handleLogout()
                    },
                },
            ],
        },
    ]

    return (
        <>
            <Menu
                mode={mode}
                items={items}
                disabledOverflow={true}
                style={{
                    flex: aside ? 0 : 1,
                    background: backgroundColor,
                    color: color,
                    border: 'none',
                }}
            />
            <PasswordChangeModal open={openPasswordModal} onCancel={() => setOpenPasswordModal(false)} />
        </>
    )
}
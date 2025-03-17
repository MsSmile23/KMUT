/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useMemo, useState } from 'react'
import React from 'react'
import {
    PieChartOutlined,
    AppstoreAddOutlined,
    PartitionOutlined,
    AppstoreOutlined,
    LogoutOutlined,
    BgColorsOutlined,
    DownOutlined,
    UserOutlined,
    UserSwitchOutlined,
} from '@ant-design/icons'
import { ConfigProvider, Flex, Menu, MenuProps } from 'antd'
import { /* IInterfaceView, */ generalStore } from '@shared/stores/general'
import { useAccountStore, selectAccount, selectLogout } from '@shared/stores/accounts'
import { useNavigate } from 'react-router'
import { ROUTES, ROUTES_COMMON, ROUTES_SETTINGS } from '@shared/config/paths'
import { useTheme } from '@shared/hooks/useTheme'
import { Link } from 'react-router-dom'
import { PasswordChangeModal } from './PasswordChangeModal'
import { ADMIN_PRIMARY_COLOR } from '@shared/config/const'
import { getInterfaceRoute, getURL } from '@shared/utils/nav'
import { zIndex } from '@shared/config/zIndex.config'
import { generateMenuInterface } from './menuInterfaces/menuManager'

interface InterfaceMenuProps {
    mode?: any,
    color?: string,
    backgroundColor?: string
}

const linkStyles = {
    active: { padding: '0 16px', color: 'rgba(255, 255, 255, 0.65)' },
    disabled: { padding: '0 16px', color: 'rgba(255, 255, 255, 0.3)' },
}

export const InterfaceMenu: FC<InterfaceMenuProps> = () => {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [permissionedInterfaces, setInterfaceView, changeLayout, interfaceView] = generalStore((state) => [
        state.permissionedInterfaces,
        state.setInterfaceView,
        state.changeLayout,
        state.interfaceView,
    ])
    const accountData = useAccountStore(selectAccount)

    const logout = useAccountStore(selectLogout)
    const checkPermission = useAccountStore.getState().checkPermission

    const authUser = accountData?.user?.login
    const interfaces = accountData?.user?.role?.interfaces ?? ['constructor', 'manager', 'showcase']
    const navigate = useNavigate()

    const isManagerInterface = generalStore((st) => st.interfaceView === 'manager')

    const [openPasswordModal, setOpenPasswordModal] = useState(false)

    const toggleLogout = () => {
        logout()
    }

    /* const buttonHandler = (iFace: Exclude<IInterfaceView, ''>) => {
        // setInterfaceView(iFace)
        navigate(getInterfaceRoute(iFace))
    } */

    const theme = useTheme()

    const menuManager = useMemo(() => generateMenuInterface(), [checkPermission, accountData])

    const MenuManager = () => {

        const themeMenuManager = theme?.menu?.manager;

        const [current, setCurrent] = useState<string>('');

        // if (themeMenuManager && themeMenuManager.length > 0) {
        //     return themeMenuManager.map((item, index) => {
        //         return (
        //             <Link style={linkStyles.active} to={getURL(menuManager[item].route, 'manager')} key={index}>
        //                 {menuManager[item].name}
        //             </Link>
        //         )
        //     })
        // }

        const onCLick = (e) => {
            const route = e.key

            navigate(getURL(route, 'manager'))
            setCurrent(e.key)
        }

        const items = useMemo(() => {
            return Object.keys(menuManager).map((item) => {
                // if (menuManager[item].rolesPermissions &&  
                //     !menuManager[item].rolesPermissions.includes(accountData.user.role.name)) {
                //     return null;
                // }

                return {
                    label: menuManager[item]?.name,
                    key: menuManager[item]?.key,
                    // style: menuManager[item].key == current ? linkStyles.active : linkStyles.disabled,
                    ...(menuManager[item]?.children && {
                        children: menuManager[item]?.children,
                        icon: React.createElement(DownOutlined),
                    }),
                };
            })
        }, [menuManager, accountData, current, interfaceView])

        return (
            <Menu
                style={{ width: '1000px' }}
                onClick={onCLick}
                items={items}
                mode="horizontal"
                theme="dark"
                selectedKeys={[current]}
                selectable={true}
            />
        )
    }

    const items: MenuProps['items'] = [
        {
            key: '0',
            icon: React.createElement(DownOutlined),
            label: `${authUser}`,
            style: { border: 'none' },
            children: [
                {
                    key: '1',
                    icon: React.createElement(AppstoreOutlined),
                    label: 'Интерфейсы',
                    style: { marginTop: '15px', marginLeft: '-7px', marginRight: '-10px' },
                    children: [
                        interfaces.includes('constructor')
                            ? {
                                key: '1.1',
                                icon: <PartitionOutlined rev={undefined} />,
                                label: (
                                    <Link to={getInterfaceRoute('constructor')}>
                                        Конструктор
                                    </Link>
                                ),
                                // label: 'Конструктор',
                                onClick: () => {
                                    // buttonHandler('constructor')
                                    document.title = 'Конструктор'
                                },
                                style: { marginTop: '10px' },
                            }
                            : null,
                        interfaces.includes('manager')
                            ? {
                                key: '1.2',
                                icon: <AppstoreAddOutlined rev={undefined} />,
                                label: (
                                    <Link to={getInterfaceRoute('manager')}>
                                        Менеджер
                                    </Link>
                                ),
                                // label: 'Менеджер',
                                onClick: () => {
                                    //     buttonHandler('manager')
                                    document.title = 'Менеджер'
                                },
                            }
                            : null,
                        interfaces.includes('showcase')
                            ? {
                                key: '1.3',
                                icon: <PieChartOutlined rev={undefined} />,
                                label: (
                                    <Link to={getInterfaceRoute('showcase')}>
                                        Витрина
                                    </Link>
                                ),
                                // label: 'Витрина',
                                // onClick: () => {
                                //     buttonHandler('showcase')
                                // },
                            }
                            : null,
                    ],
                },
                interfaces.includes('showcase') &&
                interfaceView == 'showcase' && {
                    key: '2',
                    icon: <BgColorsOutlined rev={undefined} />,
                    label: 'Лайауты',
                    style: { marginTop: '15px', marginLeft: '-7px', marginRight: '-10px' },
                    children: [
                        {
                            key: '2.3',
                            label: 'Настройки проекта',
                            onClick: () => {
                                navigate(getURL(`${ROUTES.SETTINGS}/${ROUTES_SETTINGS.LAYOUT}`, 'showcase'))
                                // navigate(`${ROUTES.SETTINGS}/${ROUTES_SETTINGS.LAYOUT}`)
                                // navigate(ROUTES.LAYOUT_SETTINGS)
                            },
                        },

                        {
                            key: '2.4',
                            label: 'Включить выбранную тему',
                            icon: <BgColorsOutlined rev={undefined} />,
                            onClick: () => {
                                navigate(getURL(`${ROUTES.SETTINGS}/${ROUTES_SETTINGS.LAYOUT}`, 'showcase'))
                                // navigate(`${ROUTES.SETTINGS}/${ROUTES_SETTINGS.LAYOUT}`)
                                // navigate(ROUTES.LAYOUT_SETTINGS)
                            },
                        }
                    ],
                },
                interfaces.includes('constructor') && interfaceView == 'constructor'
                    ? {
                        key: '4',
                        icon: <UserOutlined />,
                        label: 'Аккаунты',
                        style: { marginTop: '15px', marginLeft: '-7px', marginRight: '-10px' },
                        onClick: () => {
                            navigate(getURL(`${ROUTES.ACCOUNTS}/${ROUTES_COMMON.LIST}`, 'constructor'))
                            // navigate('/accounts/list')
                        },
                    }
                    : null,
                {
                    key: 'change-password',
                    icon: <UserSwitchOutlined />,
                    label: 'Смена пароля',
                    style: { marginTop: '15px', marginLeft: '-7px' },
                    onClick: () => setOpenPasswordModal(true)
                },
                {
                    key: '3',
                    icon: <LogoutOutlined rev={undefined} />,
                    label: 'Выйти',
                    style: { marginTop: '15px', marginLeft: '-7px' },
                    onClick: () => {
                        toggleLogout()
                    },
                },
            ],
        },
    ]

    return (
        <>
            <ConfigProvider
                direction="rtl"
                theme={{
                    token: {
                        fontFamily: theme?.font,
                        zIndexPopupBase: zIndex.modalIndex
                    }

                }}
            >
                {/* todo: почему flex перевернут? */}
                <Flex>
                    <Menu
                        triggerSubMenuAction="click"
                        selectable={true}
                        defaultSelectedKeys={['0, 1, 2']}
                        theme="dark"
                        items={items}
                        mode="horizontal"
                        style={{
                            background: interfaceView === 'constructor' ? (ADMIN_PRIMARY_COLOR ?? '') : '',
                        }}
                    />
                    {isManagerInterface && (<MenuManager />)}
                </Flex>

    
            </ConfigProvider>
            <PasswordChangeModal open={openPasswordModal} onCancel={() => setOpenPasswordModal(false)} />

        </>
    )
}
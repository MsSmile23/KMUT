import { InterfaceMenuShowcase } from '@app/interfaceViews/interfaceMenuShowcase'
import { useTheme } from '@shared/hooks/useTheme'
import { useLayoutSettingsStore } from '@shared/stores/settingsLayout'
import Sider from 'antd/es/layout/Sider'
import React, { FC, useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { TypeBlock, VisibleBlock } from '@containers/settings/layout/LayoutSettings'
import { generalStore, selectLastNotifications } from '@shared/stores/general'
import LocalStyle from './style.module.css'
import { selectAccount, selectCheckIEPerms, selectLogout, useAccountStore } from '@shared/stores/accounts'
import { useConfigStore } from '@shared/stores/config'
import { getURL } from '@shared/utils/nav'
import { IMenuItem } from '@pages/navigation-settings/menu/components/utils'
import SiderMenuItemWithChildren from './components/SiderMenu/SiderMenuItemWithChildren/SiderMenuItemWithChildren'
import SiderMenuItem from './components/SiderMenu/SiderMenuItem/SiderMenuItem'
import { addMenuItem } from './components/SiderMenu/utils'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'

const MAIN_TYPE = 'main'

export const SiderMenu: FC<{
    side: 'left' | 'right'
    siderMenuStyle?: React.CSSProperties
}> = ({ side, siderMenuStyle: siderStyle }) => {
    const theme = useTheme()
    const location = useLocation()
    const { dataLayout, setDataLayout } = useLayoutSettingsStore()
    const [items, setItems] = useState([]) //theme?.layout?.header?.routerLinks
    const [hoverItem, setHoverItem] = useState<number | null>(null)
    const userData = useAccountStore((st) => st.store.data.user)
    const logout = useAccountStore(selectLogout)
    const config = useConfigStore((st) => st.store.data)
    const pages = JSON.parse(config?.find((el) => el?.mnemo == 'front_pages')?.value ?? '[]')
    const checkIEPerms = useAccountStore(selectCheckIEPerms)
    const notifier = generalStore(selectLastNotifications)

    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode

    const toggleLogout = () => {
        logout()
    }
    const findConfig = useConfigStore((st) => st.getConfigByMnemo)
    const frontMenuConfig = findConfig('front_menu')

    //*Получаем меню из КОНФИГ
    useEffect(() => {
        if (frontMenuConfig) {
            const menuArray = JSON.parse(frontMenuConfig?.value ?? '[]')

            const mainMenu = menuArray.find((item) => item.type == MAIN_TYPE)?.menu

            if (mainMenu) {
                const localItems = []

                const filteredMenuArray: IMenuItem[] = mainMenu.filter(
                    (item) => item?.parentPseudoId == null && checkIEPerms('menues', item?.id, MAIN_TYPE)
                )

                filteredMenuArray.forEach((item) => {
                    addMenuItem(item, localItems, mainMenu, checkIEPerms)
                })
                setItems(localItems)
            }
        }
    }, [])
    //*Смена активного пункта меню при клике
    useEffect(() => {
        const isMenuItemPath = items.findIndex((item) => {
            return item.to === location.pathname
        })

        setItems((prev) => {
            return prev.map((item, idx) => {
                return {
                    ...item,
                    isActive: idx === isMenuItemPath ? true : false,
                }
            })
        })
    }, [location])

    //*Вывод на витрине доп условия
    useLayoutEffect(() => {
        let localItems = [...items]

        const empty = localItems.find((item) => item?.stereotype === 'delimiter_space')

        if (userData?.settings?.maketsOnlyAllowed) {
            localItems = localItems.filter((item) => item.title == 'Инфопанель')
            localItems.push(empty)
        }
        const logout = localItems.find((item) => item?.stereotype === 'logout')

        if (logout) {
            localItems.push({
                icon: 'LogoutOutlined',
                title: 'Выйти',
                onClick: () => {
                    toggleLogout()
                },
                isActive: false,
            })
        }

        if (userData?.settings?.maketsAllowed) {
            if (userData?.settings?.maketsDefault) {
                localItems.push({
                    icon: 'LogoutOutlined',
                    title: 'Выйти',
                    onClick: () => {
                        toggleLogout()
                    },
                    isActive: false,
                })
            }
        }

        setItems(localItems)
    }, [])

    //*Функция смены сторон бокового меню
    const handleOpenSidebar = useCallback(
        (side: string) => {
            if (side === 'left') {
                const tmp = JSON.parse(JSON.stringify(dataLayout))

                // if (dataLayout.leftSidebar.abilityToLeave) {

                tmp[TypeBlock.LEFT_SIDEBAR][VisibleBlock.VISIBILITY] =
                    !tmp[TypeBlock.LEFT_SIDEBAR][VisibleBlock.VISIBILITY]
                setDataLayout(tmp)
                // }
            }

            if (side === 'right') {
                // if (dataLayout.rightSidebar.abilityToLeave) {
                const tmp = JSON.parse(JSON.stringify(dataLayout))

                // eslint-disable-next-line max-len
                tmp[TypeBlock.RIGHT_SIDEBAR][VisibleBlock.VISIBILITY] =
                    !tmp[TypeBlock.RIGHT_SIDEBAR][VisibleBlock.VISIBILITY]
                setDataLayout(tmp)
                // }
            }
        },
        [dataLayout]
    )

    const checkChildren = (index: number, link: string) => {
        setItems((prev) => {
            return prev.map((item, idx) => {
                if (idx == index) {
                    return {
                        ...item,
                        children: item?.children?.map((child) => {
                            return child.to == link ? { ...child, isActive: true } : { ...child, isActive: false }
                        }),
                    }
                } else {
                    return {
                        ...item,
                        isActive: false,
                    }
                }
            })
        })
    }

    //*Функция создания левого меню
    const createMenuItem = (link, index) => {
        const vtemplate_id = pages?.find((page) => link?.page == page.id)?.vtemplate_id
        const menuArray = JSON.parse(frontMenuConfig?.value ?? '[]').find((item) => item.type == MAIN_TYPE)?.menu

        //*В случае наличия подпунтокв
        if (link.children && link.children.length > 0) {
            return (
                <SiderMenuItemWithChildren
                    link={link}
                    index={index}
                    theme={theme}
                    localStyle={LocalStyle}
                    setHoverItem={setHoverItem}
                    hoverItem={hoverItem}
                    notifier={notifier}
                    userData={userData}
                    checkChildren={checkChildren}
                    themeMode={themeMode}
                />
            )

            //*Для отображение разделителя
        } else if (link.stereotype == 'delimiter_space') {
            return <div key={`link-to-${index}`} style={{ opacity: 1, flex: 1 }}></div>
        } else {
            //*Обычный пункт с иконокй
            // * Проверка на наличие чилдренов у элемента меню, чтобы проверить разрешения и не выводить пустое меню
            let allowAllSubsMenu = true
            const anyChild = (allowAllSubsMenu = menuArray.filter((item) => item.parentPseudoId === link.pseudoId))

            if (anyChild.length > 0) {
                allowAllSubsMenu = anyChild
                    .map((el) => checkIEPerms('menues', el.id, MAIN_TYPE))
                    .some((child) => child == true)
            }

            return (
                checkIEPerms('vtemplates', vtemplate_id) &&
                checkIEPerms('pages', link.page) &&
                allowAllSubsMenu && (
                    <SiderMenuItem
                        link={link}
                        index={index}
                        theme={theme}
                        handleOpenSidebar={handleOpenSidebar}
                        setHoverItem={setHoverItem}
                        hoverItem={hoverItem}
                        notifier={notifier}
                        dataLayout={dataLayout}
                        side={side}
                        themeMode={themeMode}
                    />
                )
            )
        }
    }

    return (
        <Sider
            width={theme?.menu?.width || 80}
            // collapsed={true}
            style={{
                ...siderStyle,
                backgroundColor:
                    createColorForTheme(theme?.backgroundColor, theme?.colors, themeMode) ??
                    dataLayout[`${side}Sidebar`].background,
                height: '100%',
                float: side,
                zIndex: 1

                // width: '200px'
                // width: theme.layout.siderMenu.main.width,
                // flex: 1,
                // paddingTop: theme.layout.siderMenu.main.edgePadding,
                // padding: theme?.basePadding
                //     ? `${theme?.basePadding}px
                //     ${side === 'left' ? 0 : theme?.basePadding}px
                //     ${theme?.basePadding}px
                //     ${side === 'right' ? 0 : theme?.basePadding}px
                //     `
                //     : `
                //     14px
                //     ${side === 'left' ? 0 : theme.layout.siderMenu.main.edgePadding}px
                //     ${theme.layout.siderMenu.main.edgePadding}px
                //     ${side === 'right' ? 0 : theme.layout.siderMenu.main.edgePadding}px
                // `,
            }}
            // collapsedWidth={theme.layout.siderMenu.main.edgePadding + theme.layout.siderMenu.main.width}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'start',
                    gap: theme.layout.siderMenu.main.gap,
                    height: '100%',
                    backgroundColor:
                        createColorForTheme(theme?.menu?.background, theme?.colors, themeMode) ?? '#1B2E47',

                    // width: theme?.basePadding ? '100%' : theme.layout.siderMenu.main.width,
                    // width: theme.layout.siderMenu.main.width,
                    // width: 'max-content',
                    borderRadius: theme.layout.siderMenu.main.radius,
                    padding: theme.layout.siderMenu.main.padding,
                    // overflowY: 'auto',
                    // overflowX: 'hidden',
                    // scrollbarWidth: 'thin',
                    // scrollbarColor: 'unset',
                }}
            >
                {dataLayout[`${side}Sidebar`].logo && (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: 44,
                            height: 45,
                            color: theme.layout.siderMenu.items.color.active,
                            backgroundColor:
                                location.pathname === getURL('', 'showcase')
                                    ? // backgroundColor: location.pathname === ROUTES.MAIN
                                    theme.layout.siderMenu.items.background.active
                                    : theme.layout.siderMenu.items.background.inactive,
                            borderRadius: theme.layout.siderMenu.items.radius,
                            // flex: 1,
                            paddingTop: 10,
                            paddingBottom: 10,
                            cursor: 'pointer',
                        }}
                    >
                        <Link
                            to={getURL('', 'showcase')}
                            // to={ROUTES.MAIN}
                            style={{
                                textDecoration: 'none',
                                color:
                                    location.pathname === getURL('', 'showcase')
                                        ? // color: location.pathname === ROUTES.MAIN
                                        theme.layout.siderMenu.items.color.active
                                        : theme.layout.siderMenu.items.color.inactive,
                            }}
                        >
                            КМУТ
                        </Link>
                    </div>
                )}
                {dataLayout[`${side}Sidebar`].userMenu && (
                    <InterfaceMenuShowcase
                        mode="vertical"
                        color={dataLayout[`${side}Sidebar`].fontColor}
                        backgroundColor={dataLayout[`${side}Sidebar`].background}
                        aside={true}
                    />
                )}
                {items.map((link, i) => {
                    return <React.Fragment key={`key_${i}`}>{createMenuItem(link, i)}</React.Fragment>
                })}
            </div>
        </Sider>
    )
}
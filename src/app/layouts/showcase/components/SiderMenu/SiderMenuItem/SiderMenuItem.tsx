import { SiderMenuItemIcon } from '@app/layouts/showcase/SiderMenuItemIcon'
import { ILocalTheme, IThemeComponent, IThemeComponentMnemo } from '@app/themes/types'
import { INotificationWithUnread } from '@shared/stores/general'
import { ECTooltip } from '@shared/ui/tooltips'
import { FC } from 'react'
import { Link } from 'react-router-dom'
import { ILinkItem } from '../utils'
import { dataLayoutType } from '@containers/settings/layout/LayoutSettings'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'

interface ISiderMenuItem {
    link: ILinkItem
    index: number
    theme: ILocalTheme & {
        components: Record<IThemeComponentMnemo, Partial<IThemeComponent>>
    }
    handleOpenSidebar: (side: string) => void
    setHoverItem: (value: React.SetStateAction<number>) => void
    hoverItem: number
    notifier: {
        lastNotifications: INotificationWithUnread[]
        setLastNotifications: (value: INotificationWithUnread[]) => void
        toggleUnread: (id: number) => void
    }
    dataLayout: dataLayoutType
    side: 'left' | 'right',
    themeMode?: 'light' | 'dark'
}
const SiderMenuItem: FC<ISiderMenuItem> = ({
    link,
    index,
    theme,
    handleOpenSidebar,
    setHoverItem,
    hoverItem,
    notifier,
    dataLayout,
    side,
    themeMode
}) => {
    return (
        <ECTooltip
            key={`link-to-${index}`}
            title={
                link?.stereotype === 'lsidebar_toggle'
                    ? dataLayout.leftSidebar.visibility
                        ? 'Скрыть меню'
                        : 'Показать меню'
                    : link?.title
            }
            align={{
                offset: [side === 'left' ? 23 : -10, 0],
            }}
            // open={true}
            placement={side === 'left' ? 'right' : 'left'}
            color={theme.layout.siderMenu.items.tooltip.background}
            overlayInnerStyle={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '43px',
                // width: '200px',
                width: '156px',
                background: theme.layout.siderMenu.items.tooltip.background,
                color: theme.layout.siderMenu.items.tooltip.color,
                fontSize: 16,
                textAlign: 'center',
                lineHeight: '20px',
            }}
        >
            <Link
                to={link.to === '' ? location.pathname + location.search : link.to}
                target={link?.target}
                style={{
                    color:
                        link?.isActive || hoverItem === index
                            ? theme.layout.siderMenu.items.color.active
                            : theme.layout.siderMenu.items.color.inactive,
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        backgroundColor:
                            link?.isActive || hoverItem === index
                                ? createColorForTheme(theme?.menu?.activeMenu?.background, theme?.colors, themeMode) ??
                                  theme.layout.siderMenu.items.background?.active
                                : createColorForTheme(
                                    theme?.menu?.inactiveMenu?.background,
                                    theme?.colors,
                                    themeMode
                                ) ?? theme.layout.siderMenu.items.background?.inactive,
                        padding: 10,
                        fontSize: 16,
                        borderRadius: '8px',
                        cursor: 'pointer',
                    }}
                    onClick={() => {
                        if (link?.stereotype === 'lsidebar_toggle') {
                            handleOpenSidebar(side)
                        } else {
                            if (link?.onClick) {
                                link.onClick()
                            }
                        }
                    }}
                    onMouseEnter={() => {
                        setHoverItem(index)
                    }}
                    onMouseLeave={() => {
                        setHoverItem(null)
                    }}
                >
                    <SiderMenuItemIcon
                        icon={link.icon}
                        isActive={link.isActive || hoverItem === index}
                        activeColor={
                            createColorForTheme(theme?.menu?.activeMenu?.textColor, theme?.colors, themeMode) ??
                            theme.layout.siderMenu.items.color.active
                        }
                        inactiveColor={
                            createColorForTheme(theme?.menu?.inactiveMenu?.textColor, theme?.colors, themeMode) ??
                            theme.layout.siderMenu.items.color.inactive
                        }
                        stateCount=
                            {link.title === 'Уведомления'
                                ? notifier.lastNotifications.filter((n) => n.unread).length : 0}
                    />
                </div>
            </Link>
        </ECTooltip>
    )
}

export default SiderMenuItem
import { FC } from 'react'
import { SubMenu } from '../../SubMenu'
import { ILinkItem } from '../utils'
import { SiderMenuItemIcon } from '@app/layouts/showcase/SiderMenuItemIcon'
import { ILocalTheme, IThemeComponentMnemo, IThemeComponent } from '@app/themes/types'
import { INotificationWithUnread } from '@shared/stores/general'
import { IAccount } from '@shared/types/accounts'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'

interface ISiderMenuItemWithChildren {
    link: ILinkItem
    index: number
    theme: ILocalTheme & {
        components: Record<IThemeComponentMnemo, Partial<IThemeComponent>>
    }
    localStyle: CSSModuleClasses
    setHoverItem: (value: React.SetStateAction<number>) => void
    hoverItem: number
    notifier: {
        lastNotifications: INotificationWithUnread[]
        setLastNotifications: (value: INotificationWithUnread[]) => void
        toggleUnread: (id: number) => void
    }
    userData: IAccount
    checkChildren: (index: number, link: string) => void,
    themeMode?: 'dark' | 'light'
}

const SiderMenuItemWithChildren: FC<ISiderMenuItemWithChildren> = ({
    link,
    index,
    theme,
    localStyle,
    setHoverItem,
    hoverItem,
    notifier,
    userData,
    checkChildren,
    themeMode
}) => {
    return (
        <div className={localStyle.SubMenu} key={`link-to-${index}`}>
            <div
                className={localStyle.SubMenu_title}
                style={{
                    backgroundColor:
                    link?.isActive || hoverItem === index
                        ? createColorForTheme(theme?.menu?.activeMenu?.background, theme?.colors, themeMode) ??
                        theme.layout.siderMenu.items.background?.active
                        : createColorForTheme(
                            theme?.menu?.inactiveMenu?.background,
                            theme?.colors,
                            themeMode
                        ) ?? theme.layout.siderMenu.items.background?.inactive,
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
                    stateCount= {link.title === 'Уведомления' 
                        ? notifier.lastNotifications.filter((n) => n.unread).length 
                        : 0}
                />
            </div>
            <SubMenu
                link={link}
                key={`link-to-${index}`}
                checkChildren={checkChildren}
                parentIndex={index}
                //maketsAllowed={userData?.settings?.maketsAllowed}
            />
        </div>
    )
}

export default SiderMenuItemWithChildren
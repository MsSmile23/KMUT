import { IMenuItem } from '@pages/navigation-settings/menu/components/utils'

export interface ILinkItem {
    active: boolean
    icon: string
    isActive: boolean
    page: string
    title: string
    to: string
    children?: ILinkItem[]
    stereotype?: string
    target?: string
    onClick?: () => void
}

export const addMenuItem = (
    item: IMenuItem,
    array: any[],
    menuArray: IMenuItem[],
    checkIEPerms: (mnemo: string, element: string | number, submenu?: 'main' | 'mobile_bottom') => boolean
) => {
    const children = menuArray.filter(
        (menu) => menu?.parentPseudoId == item?.pseudoId && checkIEPerms('menues', menu.id, 'main')
    )

    const menuItem: {
        icon: string
        title: string
        to: string | number
        active: boolean
        page: string
        children?: IMenuItem[]
        target?: string
        stereotype?: string
        id: number
        pseudoId: number
        parentPseudoId: number
    } = {
        icon: item.icon,
        page: item.page,
        title: item.name,
        to: item.url,
        active: false,
        id: item.id,
        pseudoId: item.pseudoId,
        parentPseudoId: item.parentPseudoId
    }

    if (item?.target) {
        menuItem.target = '_blank'
    }

    if (item?.stereotype) {
        menuItem.stereotype = item.stereotype
    }

    if (children?.length > 0) {
        const localChildren = []

        menuItem.children = localChildren
        children.forEach((chl) => {
            addMenuItem(chl, localChildren, menuArray, checkIEPerms)
        })

        array.push(menuItem)
    } else {
        array.push(menuItem)
    }
}
import styles from './LayoutSettingsStyle.module.css'
import { useCallback, FC, useEffect } from 'react';
import OneColumn, { SchemaType } from './components/OneСolumn';
import { useLayoutSettingsStore } from '@shared/stores/settingsLayout';

export enum VisibleBlock {
    BACKGROUND = 'background',
    FONT_COLOR = 'fontColor',
    VISIBILITY = 'visibility',
    MENU_AVAILABILITY = 'menuAvailability',
    LOGO = 'logo',
    USER_MENU = 'userMenu',
    ABILITY_TO_LEAVE = 'abilityToLeave'
}

export enum TypeBlock {
    HEADER = 'header',
    LEFT_SIDEBAR = 'leftSidebar',
    RIGHT_SIDEBAR = 'rightSidebar',
    FOOTER = 'footer',
    MAIN = 'main'
}

export type LinkArr = Array<{ 
    icon: string, 
    title: string, 
    to?: string, 
    isActive: boolean,
    target?: string,
    id?: number,
    children?: LinkArr,
    onClick?: () => void
}>

export type LinkArrSing = { 
    icon: string, 
    title: string, 
    to?: string, 
    isActive: boolean,
    target?: string,
    children?: LinkArr,
    onClick?: () => void
}

export type dataLayoutType = {
    header: {
        background: string,
        font: {
            color: string,
            size: number
        },
        fontColor: string,
        visibility: boolean,
        menuAvailability: boolean,
        logo: {
            enabled: boolean,
            component: FC,
            src: string,
        },
        userMenu: {
            enabled: boolean,
            icon: string,
            iconBackground: string
            fullName: boolean,
            border: {
                color: string,
                width: number
                radius: number | string
            }
            background: string
            font: {
                color: string
                size: number
            }
        },
        menu: {
            background: string
            color: string
        }
        leftSidebarToggleButton: boolean
        rightSidebarToggleButton: boolean
        horizontalPadding: number
        verticalPadding: number
        search?: {
            background: string
            buttonColor: string
            placeholderColor: string
            iconColor: string
            text: string
            width: number|string
        }
        routerLinks?: LinkArr
    }
    footer: {
        background: string,
        fontColor: string,
        visibility: boolean,
        menuAvailability: boolean,
    }
    leftSidebar: {
        background: string,
        fontColor: string,
        visibility: boolean,
        menuAvailability: boolean,
        logo: boolean,
        userMenu: boolean,
        abilityToLeave: boolean,
        onlyVisibleOnMain: boolean
    }
    rightSidebar: {
        background: string,
        fontColor: string,
        visibility: boolean,
        menuAvailability: boolean,
        logo: boolean,
        userMenu: boolean,
        abilityToLeave: boolean
    }
    main: {
        background: string,
        fontColor: string,
    }
    siderMenu: {
        main: {
            gap: number
            width: number
            edgePadding: number
            radius: number
            background: string
            fontColor: string
            padding: string
        },
        items: {
            gap: number
            width: number
            edgePadding: number
            radius: number
            tooltip: {
                color: string
                background: string
            }
            background: {
                active: string
                inactive: string
            }
            color: {
                active: string
                inactive: string
            }
            notificationColor: string
        }
    }
}

const LayoutSettings = () => {
    const { dataLayout, setDataLayout } = useLayoutSettingsStore()



    // console.log('dataLayout', dataLayout)
    const handleChange = useCallback((type_block: TypeBlock, params: VisibleBlock, value: string | boolean) => {
        const tmp = JSON.parse(JSON.stringify(dataLayout))

        if (type_block === TypeBlock.HEADER && params === VisibleBlock.MENU_AVAILABILITY && !!value) {
            tmp[TypeBlock.FOOTER][VisibleBlock.MENU_AVAILABILITY] = !value
            tmp[TypeBlock.LEFT_SIDEBAR][VisibleBlock.MENU_AVAILABILITY] = !value
            tmp[TypeBlock.RIGHT_SIDEBAR][VisibleBlock.MENU_AVAILABILITY] = !value
            tmp[TypeBlock.HEADER][VisibleBlock.MENU_AVAILABILITY] = value
        }

        if (type_block === TypeBlock.FOOTER && params === VisibleBlock.MENU_AVAILABILITY && !!value) {
            tmp[TypeBlock.HEADER][VisibleBlock.MENU_AVAILABILITY] = !value
            tmp[TypeBlock.LEFT_SIDEBAR][VisibleBlock.MENU_AVAILABILITY] = !value
            tmp[TypeBlock.RIGHT_SIDEBAR][VisibleBlock.MENU_AVAILABILITY] = !value
            tmp[TypeBlock.FOOTER][VisibleBlock.MENU_AVAILABILITY] = value
        }

        if (type_block === TypeBlock.LEFT_SIDEBAR && params === VisibleBlock.MENU_AVAILABILITY && !!value) {
            tmp[TypeBlock.HEADER][VisibleBlock.MENU_AVAILABILITY] = !value
            tmp[TypeBlock.FOOTER][VisibleBlock.MENU_AVAILABILITY] = !value
            tmp[TypeBlock.RIGHT_SIDEBAR][VisibleBlock.MENU_AVAILABILITY] = !value
            tmp[TypeBlock.LEFT_SIDEBAR][VisibleBlock.MENU_AVAILABILITY] = value
        }

        if (type_block === TypeBlock.RIGHT_SIDEBAR && params === VisibleBlock.MENU_AVAILABILITY && !!value) {
            tmp[TypeBlock.HEADER][VisibleBlock.MENU_AVAILABILITY] = !value
            tmp[TypeBlock.FOOTER][VisibleBlock.MENU_AVAILABILITY] = !value
            tmp[TypeBlock.LEFT_SIDEBAR][VisibleBlock.MENU_AVAILABILITY] = !value
            tmp[TypeBlock.RIGHT_SIDEBAR][VisibleBlock.MENU_AVAILABILITY] = value
        }

        tmp[type_block][params] = value
        setDataLayout(tmp)
    }, [dataLayout])

    return (
        <div className={styles.setting_layout}>
            {/* HEADER */}
            <OneColumn
                title_header="HEADER"
                items={[
                    VisibleBlock.BACKGROUND,
                    VisibleBlock.FONT_COLOR,
                    VisibleBlock.VISIBILITY,
                    VisibleBlock.MENU_AVAILABILITY,
                    VisibleBlock.LOGO,
                    VisibleBlock.USER_MENU
                ]}
                type_schema={SchemaType.TOP}
                type_block={TypeBlock.HEADER}
                handleChange={handleChange}
                data={dataLayout}
            />
            {/* FOOTER */}
            <OneColumn
                title_header="FOOTER"
                items={[
                    VisibleBlock.BACKGROUND,
                    VisibleBlock.FONT_COLOR,
                    VisibleBlock.VISIBILITY,
                    VisibleBlock.MENU_AVAILABILITY
                ]}
                type_schema={SchemaType.BOTTOM}
                type_block={TypeBlock.FOOTER}
                handleChange={handleChange}
                data={dataLayout}
            />
            {/* LEFT SIDEBAR */}
            <OneColumn
                title_header="LEFT SIDEBAR"
                items={[
                    VisibleBlock.BACKGROUND,
                    VisibleBlock.FONT_COLOR,
                    VisibleBlock.VISIBILITY,
                    VisibleBlock.MENU_AVAILABILITY,
                    VisibleBlock.LOGO,
                    VisibleBlock.USER_MENU,
                    VisibleBlock.ABILITY_TO_LEAVE
                ]}
                type_schema={SchemaType.LEFT}
                type_block={TypeBlock.LEFT_SIDEBAR}
                handleChange={handleChange}
                data={dataLayout}
            />
            {/* RIGHT SIDEBAR */}
            <OneColumn
                title_header="RIGHT SIDEBAR"
                items={[
                    VisibleBlock.BACKGROUND,
                    VisibleBlock.FONT_COLOR,
                    VisibleBlock.VISIBILITY,
                    VisibleBlock.MENU_AVAILABILITY,
                    VisibleBlock.LOGO,
                    VisibleBlock.USER_MENU,
                    VisibleBlock.ABILITY_TO_LEAVE
                ]}
                type_schema={SchemaType.RIGHT}
                type_block={TypeBlock.RIGHT_SIDEBAR}
                handleChange={handleChange}
                data={dataLayout}
            />
            {/* MAIN */}
            {/* <OneColumn
                title_header="MAIN"
                items={[
                    VisibleBlock.BACKGROUND,
                    VisibleBlock.FONT_COLOR,
                    // VisibleBlock.VISIBILITY,
                    // VisibleBlock.MENU_AVAILABILITY,
                    // VisibleBlock.LOGO,
                    // VisibleBlock.USER_MENU,
                    // VisibleBlock.ABILITY_TO_LEAVE
                ]}
                type_schema={SchemaType.CENTER}
                type_block={TypeBlock.MAIN}
                handleChange={handleChange}
                data={dataLayout}
            /> */}
        </div>
    )
}

export default LayoutSettings
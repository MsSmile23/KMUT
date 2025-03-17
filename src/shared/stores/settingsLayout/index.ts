import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import _ from 'lodash';
import { dataLayoutType } from '@containers/settings/layout/LayoutSettings'
import { ForumLogo } from '@app/themes/forumTheme/forumLogo';

const LAYOUT_KEY = 'LAYOUT-SETTINGS_KMYT'

export interface ILayoutSettingsStore {
    fullScreen: boolean
    hideMenu: boolean
    dataLayout: dataLayoutType,
    setDataLayout: (value: dataLayoutType) => void
    setFullScreen: (value: boolean) => void
    setHideMenu: (value: boolean) => void
}

// export const useLayoutSettingsStore = (layout: ILocalTheme['layout']) => {
export const useLayoutSettingsStore = create<ILayoutSettingsStore>()(
    devtools(
        immer(
            persist((set) => ({
                // dataLayout: layout,
                fullScreen: false,
                hideMenu: false,
                dataLayout: {
                    header: {
                        background: '#FFFFFF',
                        font: {
                            color: '#2CA0CF',
                            size: 16
                        },
                        visibility: true,
                        menuAvailability: false,
                        logo: {
                            enabled: true,
                            component: ForumLogo,
                            src: '/png/KMUT_logo.png',
                        },
                        userMenu: {
                            enabled: true,
                            icon: 'UserOutlined',
                            fullName: true,
                            border: {
                                color: '#0740AC',
                                width: 0,
                                radius: '50%'
                            },
                            background: '#0740AC',
                            iconBackground: '#ffffff',
                            font: {
                                color: '#000000',
                                size: 14
                            }
                        },
                        menu: {
                            background: '#272E3D',
                            color: '#ffffff',
                        },
                        search: {
                            background: '#ffffff',
                            buttonColor: '#C9EAF8',
                            iconColor: '#2CA0CF',
                            placeholderColor: 'rgba(0, 0, 0, 0.25)',
                            text: '#000000',
                            width: '350px',
                        },
                        leftSidebarToggleButton: false,
                        rightSidebarToggleButton: false,
                        horizontalPadding: 24,
                        verticalPadding: 0,
                        routerLinks: []
                    },
                    footer: {
                        background: '#ffffff',
                        fontColor: 'white',
                        visibility: false,
                        menuAvailability: false
                    },
                    leftSidebar: {
                        background: '#ffffff',
                        fontColor: 'black',
                        visibility: true,
                        menuAvailability: true,
                        logo: false,
                        userMenu: false,
                        abilityToLeave: false
                    },
                    rightSidebar: {
                        background: '#ffffff',
                        fontColor: 'black',
                        visibility: false,
                        menuAvailability: false,
                        logo: true,
                        userMenu: false,
                        abilityToLeave: false
                    },
                    main: {
                        background: '#ffffff',
                        fontColor: '#000000',
                    },
                    siderMenu: {
                        main: {
                            gap: 20,
                            width: 64,
                            edgePadding: 24,
                            radius: 8,
                            background: '#ffffff',
                            fontColor: '#000000',
                            padding: '17px 10px',
                        },
                        items: {
                            gap: 20,
                            width: 64,
                            edgePadding: 24,
                            radius: 8,
                            tooltip: {
                                color: '#ffffff',
                                background: '#555D60',
                            },
                            background: {
                                active: '#C9EAF8',
                                inactive: '#ffffff',
                            },
                            color: {
                                active: 'rgba(44, 160, 207, 1)',
                                inactive: 'rgba(179, 210, 226, 1)',
                            },
                            notificationColor: 'rgba(255, 89, 89, 1)',
                        }
                    },
                },
                setFullScreen: (value: boolean) => {
                    set((state) => {
                        state.fullScreen = value
                    })  
                },
                setDataLayout: (value: dataLayoutType) => {
                    set((state) => {
                        state.dataLayout = value
                    })
                },
                setHideMenu: (value: boolean) => {
                    set((state) => {
                        state.hideMenu = value
                    })
                }
            }),
            {
                name: LAYOUT_KEY,
            })
        )
    )
)
// }
import { DefaultLogo } from '../../shared/ui/icons/DefaultLogo'
import { PreloadScreen } from '../../shared/ui/icons/PreloadScreen'
import { IProjectSettings, IThemes } from './types'
import mishkTheme from './mishkTheme/mishkTheme'
import defaultTheme from '@app/themes/defaultTheme/defaultTheme'
import zagsTheme from '@app/themes/zagsTheme/zagsTheme'
import siriusTheme from '@app/themes/siriusTheme/siriusTheme'
import { commonTheme } from '@app/themes/const'
import forumTheme from './forumTheme/forumTheme'
import fnsTheme from './fnsTheme/fnsTheme'
import vpnTheme from './vpnTheme/vpnTheme'


export const themes: Record<IThemes, IProjectSettings> = {
    [IThemes.DEFAULT]: defaultTheme,
    //[IThemes.MISHK]: mishkTheme,
    //[IThemes.ZAGS]: zagsTheme,
    //[IThemes.SIRIUS]: siriusTheme,
    //[IThemes.FORUM]: forumTheme,
    [IThemes.FNS]: fnsTheme,
    [IThemes.VPN]: vpnTheme,
    dark: {
        title: commonTheme.title ?? 'Главная',
        page: {
            login: {
                logo: commonTheme.page.login.logo ?? DefaultLogo,
                background: commonTheme.page.login.background ?? '#272E3D',
                color: commonTheme.page.login.color ?? '#ffffff',
            },
            interfaces: {
                logo: commonTheme.page.interfaces.logo ?? DefaultLogo,
                background: commonTheme.page.interfaces.background ?? '#ffffff',
                color: commonTheme.page.interfaces.color ?? '#000000',
            },
            preload: {
                logo: commonTheme.page.preload.logo ?? DefaultLogo,
                background: commonTheme.page.preload.background ?? '#272E3D',
                color: commonTheme.page.preload.color ?? '#ffffff',
                slides: commonTheme.page.preload.slides ?? [
                    {
                        id: 1,
                        element: PreloadScreen,
                    },
                ],
            },
            main: {
                logo: commonTheme.page.main.logo ?? DefaultLogo,
                header: {
                    background: commonTheme.page.main.header.background ?? '#ffffff',
                    color: commonTheme.page.main.header.color ?? '#272E3D',
                },
                main: {
                    background: commonTheme.page.main.main.background ?? '#ffffff',
                    color: commonTheme.page.main.main.color ?? '#272E3D',
                },
                footer: {
                    background: commonTheme.page.main.footer.background ?? '#ffffff',
                    color: commonTheme.page.main.footer.color ?? '#272E3D',
                },
            },
        },
        charts: commonTheme.charts ?? {},
    },
    light: {
        title: commonTheme.title ?? 'Главная',
        page: {
            login: {
                logo: commonTheme.page.login.logo ?? DefaultLogo,
                background: commonTheme.page.login.background ?? '#ffffff',
                color: commonTheme.page.login.color ?? '#000000',
            },
            interfaces: {
                logo: commonTheme.page.interfaces.logo ?? DefaultLogo,
                background: commonTheme.page.interfaces.background ?? '#ffffff',
                color: commonTheme.page.interfaces.color ?? '#000000',
            },
            preload: {
                logo: commonTheme.page.preload.logo ?? DefaultLogo,
                background: commonTheme.page.preload.background ?? '#ffffff',
                color: commonTheme.page.preload.color ?? '#000000',
                slides: commonTheme.page.preload.slides ?? [
                    {
                        id: 1,
                        element: PreloadScreen,
                    },
                ],
            },
            main: {
                logo: commonTheme.page.main.logo ?? DefaultLogo,
                header: {
                    background: commonTheme.page.main.header.background ?? '#ffffff',
                    color: commonTheme.page.main.header.color ?? '#000000',
                },
                main: {
                    background: commonTheme.page.main.main.background ?? '#ffffff',
                    color: commonTheme.page.main.main.color ?? '#000000',
                },
                footer: {
                    background: commonTheme.page.main.footer.background ?? '#ffffff',
                    color: commonTheme.page.main.footer.color ?? '#000000',
                },
            },
        },
        charts: commonTheme.charts ?? {},
    },
}
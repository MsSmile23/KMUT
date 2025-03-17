import { IProjectSettings, ITheme, IThemeComponent, IThemeComponentMnemo } from '@app/themes/types';
import { DefaultLogo } from '@shared/ui/icons/DefaultLogo';
import { PreloadScreen } from '@shared/ui/icons/PreloadScreen';

export const commonTheme: IProjectSettings = {
    title: 'Главная1',
    page: {
        login: {
            logo: DefaultLogo,
            background: '#ffffff',
            color: '#000000',
        },
        preload: {
            logo: DefaultLogo,
            background: '#F0F2F5',
            color: '#000000',
            slides: [
                {
                    id: 1,
                    element: PreloadScreen
                }
            ]
        },
        interfaces: {
            logo: DefaultLogo,
            background: '#ffffff',
            color: '#000000',
        },
        main: {
            logo: DefaultLogo,
            header: {
                background: '#272E3D',
                color: '#ffffff',
            },
            main: {
                background: '#ffffff',
                color: '#000000',
            },
            footer: {
                background: '#272E3D',
                color: '#ffffff',
            },
        }
    },
    charts: {
        pie: {
            legend: {
                units: '' as string,
                typeValues: 'both' as 'both'|'absolute'|'percentage',
                isEnabled: true,
                showNames: true,
                orientation: 'left' as 'left'|'right'|'top'|'bottom',
                type: 'callout' as 'callout'|'horizontal'|'vertical',
                width: 200 as number | string
            },
            donutType: {
                enabled: true,
                innerSize: '75%',
                thickness: '50%'
            },
            doubleRing: {
                enabled: true,
                innerBorder: {
                    background: '#ffffff', // от наружной границы до внутренней, если укзаан бэкграунд внутренней
                    radiusCoef: 0.89, // относительно внутреннего радиуса бублика
                    width: 0.25,
                    color: '#A28888',
                },
                outerBorder: {
                    background: '#ffffff', // внутри внутренней границы
                    radiusCoef: 1.07, // % относительно внешнего радиуса бублика
                    width: 0.25,
                    color: '#A28888',
                }

            },
            connectors: {
                enabled: true,
                padding: 10,
                width: 0.25,
                color: '#A28888',

            },
            title: {
                fontSize: '16px',
                color: '#000000'
            },
            hover: {
                background: '#ffffff',
                border: {
                    width: 0.25,
                    color: '#A28888',
                },
                title: {
                    fontSize: '16px',
                    color: '#000000'
                }
            }
        },
    }
}

export const commonTheme2: ITheme<IThemeComponentMnemo, IThemeComponent> = {
    title: 'КМУТ',
    components: {
        tables: {
            constructor: {},
            manager: {},
            showcase: {},
        },
        buttons: {
            constructor: {},
            manager: {},
            showcase: {},
        },
    }
}
import { useTheme } from '@shared/hooks/useTheme'
import { useAccountStore, selectAccount } from '@shared/stores/accounts'
import { generalStore } from '@shared/stores/general'
import { wrapperType } from '@shared/types/widgets'
import { FC, ReactNode, useEffect, useMemo } from 'react'

interface WrapperWidgetProps {
    children: ReactNode
    settings: wrapperType
}

const WrapperWidget: FC<WrapperWidgetProps> = ({ children, settings }) => {
    const theme: any = useTheme()
    const interfaceView = generalStore((st) => st.interfaceView)
    const isShowcase = interfaceView === 'showcase'
    const createColorForTheme = (mnemo: string, colors: any[], themeMode: 'light' | 'dark') => {
        const colorItem = colors?.find((color) => color?.mnemo === mnemo)

        const color = colorItem?.colors.find((color) => color?.mnemo == themeMode)?.color

        return color
    }

    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode

    const backGroundColor = useMemo(() => {
        if (theme?.widget !== undefined && isShowcase) {
            return createColorForTheme(theme?.widget?.background, theme?.colors, themeMode) ?? '#ffffff'
        } else {
            return '#ffffff'
        }
    }, [theme])

    const color = useMemo(() => {
        if (theme?.widget !== undefined && isShowcase) {
            return createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode) ?? '#000000'
        } else {
            return '#000000'
        }
    }, [theme])

    const positionLabel = useMemo(() => {
        if (settings?.style?.labelParams?.title_position === 'left') {
            return 'flex-start'
        }

        if (settings?.style?.labelParams?.title_position === 'right') {
            return 'flex-end'
        }

        if (settings?.style?.labelParams?.title_position === 'center') {
            return 'center'
        }

        return 'flex-start'
    }, [settings])

    const colorLabel = useMemo(() => {
        if (settings?.style?.labelParams?.title_color) {
            return settings?.style?.labelParams?.title_color
        }

        return '#000000'
    }, [settings])

    return (
        <div
            style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: backGroundColor ?? '#ffffff',
                color: color,
                flex: 1,
                border: `${settings?.style?.styleParams?.borderThickness || 0}px solid ${
                    settings?.style?.styleParams?.borderColor || 'transparent'
                }`,
                overflow: 'hidden',

                borderTopLeftRadius: settings?.style?.styleParams?.borderRadiusTopLeft || 0,
                borderTopRightRadius: settings?.style?.styleParams?.borderRadiusTopRight || 0,
                borderBottomLeftRadius: settings?.style?.styleParams?.borderRadiusBottomLeft || 0,
                borderBottomRightRadius: settings?.style?.styleParams?.borderRadiusBottomRight || 0,
                // background: settings?.style?.styleParams?.backgroundColor || '#ffffff'
            }}
        >
            {!!settings?.style?.labelParams?.title_show && (
                <div
                    style={{
                        display: 'flex',
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: positionLabel,
                        height: '100%',
                        paddingLeft: settings?.style?.styleParams?.paddingOutTitleLeft || 0,
                        paddingRight: settings?.style?.styleParams?.paddingOutTitleRight || 0,
                        paddingTop: settings?.style?.styleParams?.paddingOutTitleTop || 0,
                    }}
                >
                    <p
                        style={{ margin: 0, padding: 0, color: color ?? colorLabel }}
                        dangerouslySetInnerHTML={{
                            __html: settings?.style?.labelParams?.title_text?.replace(/<\/?p[^>]*>/g, '') || '',
                        }}
                    />
                </div>
            )}
            <div
                style={{
                    display: 'flex',
                    height: '100%',
                    marginTop: settings?.style?.styleParams?.paddingOutWidgetTop || 0,
                    marginLeft: settings?.style?.styleParams?.paddingOutWidgetLeft || 0,
                    marginRight: settings?.style?.styleParams?.paddingOutWidgetRight || 0,
                    marginBottom: settings?.style?.styleParams?.paddingOutWidgetBottom || 0,

                    paddingTop: settings?.style?.styleParams?.paddingInWidgetTop || 0,
                    paddingLeft: settings?.style?.styleParams?.paddingInWidgetLeft || 0,
                    paddingRight: settings?.style?.styleParams?.paddingInWidgetRight || 0,
                    paddingBottom: settings?.style?.styleParams?.paddingInWidgetBottom || 0,
                }}
            >
                {children}
            </div>
        </div>
    )
}

export default WrapperWidget
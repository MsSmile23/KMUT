import { FC } from 'react'
import { Card, CardProps } from 'antd'
import { useTheme } from '@shared/hooks/useTheme'
import { useAccountStore, selectAccount } from '@shared/stores/accounts'
import { generalStore } from '@shared/stores/general'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'

interface WrapperCardInterface extends CardProps {
    isWrapped?: boolean
    styleMode?: 'replace' | 'extend'
    style?: { [x: string]: string | number }
    bodyStyle?: { [x: string]: string | number }
    title?: string | React.ReactNode
}

const WrapperCard: FC<WrapperCardInterface> = ({
    children,
    isWrapped = true,
    styleMode,
    style,
    bodyStyle,
    title = '',
    ...props
}) => {
    const interfaceView = generalStore((st) => st.interfaceView)
    const isShowcase = interfaceView === 'showcase'
    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode

    const backgroundColor = isShowcase
        ? createColorForTheme(theme?.widget?.background, theme?.colors, themeMode)
        : 'white'

    const styleRender = () => {
        const data: any = {
            style: {
                borderRadius: 10,
                padding: '0 0 5px 0',
                marginBottom: 15,
                width: '100%',
                border: themeMode == 'dark' ? 'none' : '1px solid #f0f0f0',
            },
            bodyStyle: {
                padding: '5px 0 5px 0',
                width: '100%',
            },
        }

        switch (styleMode) {
            case 'replace':
                {
                    if (style) {
                        data.style = style
                    }

                    if (bodyStyle) {
                        data.bodyStyle = bodyStyle
                    }
                }
                break
            case 'extend':
                {
                    if (style) {
                        data.style = {
                            ...data.style,
                            ...style,
                        }
                    }

                    if (bodyStyle) {
                        data.bodyStyle = {
                            ...data.bodyStyle,
                            ...bodyStyle,
                        }
                    }
                }
                break
        }

        return data
    }

    return (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>
            {isWrapped == true ? (
                <Card title={title} {...props} {...styleRender()}>
                    {children}
                </Card>
            ) : (
                <>{children} </>
            )}
        </>
    )
}

export default WrapperCard
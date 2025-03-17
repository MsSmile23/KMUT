import { useTheme } from '@shared/hooks/useTheme'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { generalStore } from '@shared/stores/general'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import { Tag } from 'antd'
import React from 'react'
import { FC, ReactNode } from 'react'

interface CustomTabProps {
    activeKey: string
    currentKey: string
    tabsLength: number
    index: number
    children: ReactNode
    typeTabs?: 'vertical' | 'horizontal'
    preview?: boolean
}

const CustomTab: FC<CustomTabProps> = (props) => {
    const { activeKey, currentKey, tabsLength, index, children, typeTabs, preview } = props

    const fullTheme = useTheme()
    const interfaceView = generalStore((st) => st.interfaceView)
    const isShowcase = interfaceView === 'showcase'
    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode

    const color = isShowcase
        ? createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode) ?? '#000000'
        : '#000000'
    const background = isShowcase
        ? createColorForTheme(theme?.tabs?.activeTabBackgroundColor, theme?.colors, themeMode) ?? 'rgb(233, 247, 252)'
        : 'rgb(233, 247, 252)'

    const activeStateStyle: React.CSSProperties =
        activeKey === currentKey
            ? {
                backgroundColor:
                      themeMode == 'dark' ? background : fullTheme.components.tabs.showcase.backgroundColorActive,
                color: color ?? fullTheme.components.tabs.showcase.color,
            }
            : {
                backgroundColor: 'transparent',
                color: color,
            }

    const renderChildren = () => {
        if (typeTabs == 'vertical') {
            return (
                <>
                    <span
                        style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {preview ? children : children?.props?.children[0]}
                    </span>
                    {!preview && (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {children?.props?.children.slice(1)}
                        </div>
                    )}
                </>
            )
        } else {
            return children
        }
    }

    return (
        <Tag
            style={{
                ...activeStateStyle,
                display: 'flex',
                justifyContent: typeTabs == 'horizontal' ? 'center' : 'flex-start',
                alignItems: 'center',
                maxWidth: typeTabs == 'vertical' ? 250 : '100%',
                padding: fullTheme.components.tabs.showcase.padding,
                // marginLeft: index === 0 ? '10px' : 'auto',
                boxSizing: 'border-box',
                boxShadow: fullTheme.components.tabs.showcase.boxShadow,
                borderRadius: fullTheme.components.tabs.showcase.borderRadius,
                margin: fullTheme.components.tabs.showcase.margin,
                border: fullTheme.components.tabs.showcase.border,
                borderTopLeftRadius: index === 0 ? '8px' : '0',
                borderTopRightRadius: index === tabsLength ? '8px' : '0',
                fontSize: '16px',
                cursor: 'pointer',
            }}
        >
            {renderChildren()}
        </Tag>
    )
}

export default CustomTab
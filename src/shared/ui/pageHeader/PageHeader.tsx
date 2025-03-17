import { Button, Card } from 'antd'
import { FC, useEffect } from 'react'
import { FullscreenOutlined, QuestionOutlined, HomeOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import _ from 'lodash'
import ArrowLeftOutlined from '@ant-design/icons/lib/icons/ArrowLeftOutlined'
import { PageHeader as AntdPageHeader } from '@ant-design/pro-layout'
import { getURL } from '@shared/utils/nav'
import { IInterfaceView, generalStore } from '@shared/stores/general'
import { useTheme } from '@shared/hooks/useTheme'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'

//TODO: Поправить типизацию роутов(сменить с any)
export interface PageHeaderInterface {
    title?: string
    subtitle?: string
    routes?: any[]
    action?: 'widget'
}

export const PageHeader: FC<PageHeaderInterface> = ({ title, subtitle, routes = [], action }) => {
    const interfaceView = generalStore((st) => st.interfaceView)
    const isShowcase = interfaceView === 'showcase'
    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode
    const textColor = isShowcase
        ? createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode) ?? '#000000'
        : '#000000'
    const backgroundColor = isShowcase
        ? createColorForTheme(theme?.widget?.background, theme?.colors, themeMode) ?? '#ffffff'
        : '#ffffff'

    useEffect(() => {
        document.title = title
    }, [title])

    const navigate = useNavigate()

    const defaultBreadcrumbs: any[] = [
        {
            path: '',
            breadcrumbName: '',
        },
    ]
    let newRoutes = defaultBreadcrumbs

    newRoutes = [...defaultBreadcrumbs, ...routes]

    function itemRender(route: any, params: any, routes: any, paths: string[]) {
        const routeIndex = routes.indexOf(route)
        const routeLast = routes.length - 1

        if (action === 'widget') {
            return renderWidgetBreadcrumbs(route, routes, routeLast, routeIndex)
        }

        const absolutePaths: string[] = paths.map((path) => {
            return getURL(`${path}`, interfaceView as Exclude<IInterfaceView, ''>)
        })

        switch (routeIndex) {
            case 0: {
                return (
                    <button
                        onClick={() => {
                            goBack()
                        }}
                    >
                        <ArrowLeftOutlined style={{ fontSize: '12px', alignItems: 'center' }} />
                    </button>
                )
            }
            case routeLast: {
                return <span style={{ color: isShowcase && textColor }}>{route.breadcrumbName}</span>
            }
            default: {
                return (
                    <Link style={{ color: isShowcase && textColor }} to={_.last(absolutePaths) || '/'}>
                        {route.breadcrumbName}
                    </Link>
                )
            }
        }
    }

    //Рендер breadcrumbs виджета
    function renderWidgetBreadcrumbs(route: any, routes: any, routeLastIndex: number, currentRouteIndex: number) {
        if (routeLastIndex === currentRouteIndex) {
            return <span style={{ color: isShowcase && textColor }}>{route.breadcrumbName}</span>
        }

        if (routes.length < 1) {
            return
        }

        if (route.path === '{{home}}') {
            return (
                <button
                    onClick={() => {
                        navigate('/')
                    }}
                >
                    <HomeOutlined style={{ fontSize: '12px', alignItems: 'center' }} />
                </button>
            )
        }

        if (route.path === '{{back}}') {
            return (
                <button
                    onClick={() => {
                        goBack()
                    }}
                >
                    <ArrowLeftOutlined style={{ fontSize: '12px', alignItems: 'center' }} />
                </button>
            )
        }

        if (route.path) {
            return (
                <Link to={route.path} style={{ color: isShowcase && textColor }}>
                    {route.breadcrumbName}
                </Link>
            )
        }
    }

    const goBack = () => {
        navigate(-1)
    }

    const widgetCardStyle = () => {
        if (action === 'widget') {
            return {
                width: '100%',
                backgroundColor: isShowcase && backgroundColor,
                border: themeMode == 'light' ? '1px solid #f0f0f0' : 'none',
            }
        }

        return {
            backgroundColor: isShowcase && backgroundColor,
            border: themeMode == 'light' ? '1px solid #f0f0f0' : 'none',
        }
    }

    return (
        <Card style={widgetCardStyle()} className="ec-page-header">
            <AntdPageHeader
                style={{
                    paddingLeft: '0px',
                    paddingRight: '0px',
                    paddingBottom: 0,
                    backgroundColor: isShowcase && backgroundColor,
                }}
                className="site-page-header"
                title={<span style={{ color: isShowcase && textColor }}>{title}</span>}
                subTitle={<span style={{ color: isShowcase && textColor }}>{subtitle}</span>}
                breadcrumb={
                    {
                        items: newRoutes,
                        itemRender,
                        separator: <span style={{ color: isShowcase && textColor }}>/</span>,
                    } as any
                }
            />
        </Card>
    )
}
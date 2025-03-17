/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, PropsWithChildren } from 'react'
import React from 'react'
import {
    BarChartOutlined,
    VideoCameraOutlined,
    UserOutlined,
    PartitionOutlined,
    RobotOutlined,
    SwitcherOutlined,
    AppstoreAddOutlined,
    PieChartOutlined,
    WindowsOutlined
} from '@ant-design/icons'
import { Col, Divider, Layout, Menu, MenuProps, Row, theme } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { Header } from 'antd/es/layout/layout'
import { InterfaceMenu } from './InterfaceMenu'
import { useLayoutSettingsStore } from '@shared/stores/settingsLayout'
import { ADMIN_PRIMARY_COLOR } from '@shared/config/const'
import './ConstructorInterfaceView.css'
import { generalStore } from '@shared/stores/general'
import { getURL } from '@shared/utils/nav'

type MenuItem = Required<MenuProps>['items'][number];

const { Content, Sider } = Layout

export const ConstructorInterfaceView: FC<PropsWithChildren> = ({ children }) => {
    const navigate = useNavigate()
    const interfaceView = generalStore().interfaceView
    const {
        token: { colorBgHeader },
    } = theme.useToken();

    const menuItems: MenuItem[] = [
        {
            key: '1',
            icon: React.createElement(UserOutlined),
            label: (
                <div style={{ whiteSpace: 'pre-line', lineHeight: '1.5' }}>
                    Предметная область
                </div>
            ),
            children: [
                {
                    key: '2',
                    icon: React.createElement(BarChartOutlined),
                    label: 'Классы',
                    onClick: () => {
                        navigate(getURL(`${ROUTES.CLASSES}/${ROUTES_COMMON.LIST}`, 'constructor'))
                        // navigate(`/${ROUTES.CLASSES}/${ROUTES_COMMON.LIST}`)
                    }
                },
                {
                    key: '3',
                    icon: React.createElement(VideoCameraOutlined),
                    label: 'Атрибуты',
                    children: [
                        {
                            key: '3.1',
                            icon: React.createElement(VideoCameraOutlined),
                            label: 'Атрибуты',
                            onClick: () => {
                                navigate(getURL(`${ROUTES.ATTRIBUTES}/${ROUTES_COMMON.LIST}`, 'constructor'))
                                // navigate(`/${ROUTES.ATTRIBUTES}/${ROUTES_COMMON.LIST}`)
                            },
                        },
                        {
                            key: '3.2',
                            icon: React.createElement(VideoCameraOutlined),
                            label: 'Категории',
                            onClick: () => {
                                navigate(getURL(`${ROUTES.ATTRIBUTE_CATEGORIES}/${ROUTES_COMMON.LIST}`, 'constructor'))
                                // navigate(`/${ROUTES.ATTRIBUTE_CATEGORIES}/${ROUTES_COMMON.LIST}`)
                            }
                        },
                    
                    ]
                },
                {
                    key: '4',
                    icon: <VideoCameraOutlined />,
                    label: 'Связи',
                    onClick: () => {
                        navigate(getURL(`${ROUTES.RELATIONS}/${ROUTES_COMMON.LIST}`, 'constructor'))
                        // navigate(`/${ROUTES.RELATIONS}/${ROUTES_COMMON.LIST}`)
                    }
                },
                {
                    key: '5',
                    icon: <SwitcherOutlined />,
                    label: 'Макеты',
                    onClick: () => {
                        navigate(getURL(`${ROUTES.VTEMPLATES}/${ROUTES_COMMON.LIST}`, 'constructor'))
                        // navigate(`/${ROUTES.VTEMPLATES}/${ROUTES_COMMON.LIST}`)
                    }
                },
                {
                    key: '6',
                    icon: <RobotOutlined />,
                    label: 'Автоматы',
                    onClick: () => {
                        localStorage.setItem('currentPage', '1')
                        navigate(getURL(`${ROUTES.STATE_MACHINES}/${ROUTES_COMMON.LIST}`, 'constructor'))
                        // navigate(`/${ROUTES.STATE_MACHINES}/${ROUTES_COMMON.LIST}`)
                    }
                    
                },
                {
                    key: '7',
                    icon: <WindowsOutlined />,
                    label: 'Система',
                    onClick: () => {
                        navigate(getURL(`${ROUTES.SYSTEM}/${ROUTES_COMMON.LIST}`, 'constructor'))
                        // navigate(`/${ROUTES.STATE_MACHINES}/${ROUTES_COMMON.LIST}`)
                    }
                    
                },
            ],
        },


    ]

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const { fullScreen/* , setFullScreen */ } = useLayoutSettingsStore()

    const [setInterfaceView] = generalStore((state) => [
        state.setInterfaceView,
    ])

    const buttonHandler = (iFace: any) => {
        setInterfaceView(iFace)
    }


    return (
        <>
            {!fullScreen && (
                <Layout
                    hasSider
                    style={{
                        height: '100vh'
                    }}
                >
                    <Header
                        style={{
                            width: '100%',
                            background: ADMIN_PRIMARY_COLOR ?? colorBgHeader,
                            marginLeft: '3%',
                            color: 'whitesmoke',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            position: 'fixed',
                            zIndex: 2,
                            height: '64px',
                        }}
                    >
                        <InterfaceMenu />

                    </Header>
                    <Sider
                        style={{
                            // overflow: 'auto',
                            position: 'fixed',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            zIndex: 2,
                            background: ADMIN_PRIMARY_COLOR ?? ''
                        }}
                    >
                        <Row justify="center" gutter={10} style={{ height: '64px' }}>
                            <Col
                                onClick={() => navigate(
                                    getURL(ROUTES.MAIN, 'constructor')
                                )}
                                style={{
                                    cursor: 'pointer',
                                }}
                            >
                                {' '}
                                <Link
                                    to={getURL(ROUTES.MAIN, 'constructor')}
                                >
                                    <PartitionOutlined
                                        style={{
                                            color: 'white',
                                            fontSize: '32px',
                                            marginTop: '10px',
                                            marginBottom: '10px',
                                        }}
                                    />
                                    {interfaceView == 'constructor' && 
                                        <Divider style={{ margin: 0, background: '#ffffff' }} />}
                                </Link>
                            </Col>
                            <Col
                                onClick={() => {buttonHandler('manager') 
                                    document.title = 'Менеджер'}}
                                style={{
                                    cursor: 'pointer',
                                }}
                            >
                                {' '}
                                <Link
                                    to={getURL(ROUTES.MAIN, 'manager')}
                                >
                                    <AppstoreAddOutlined
                                        style={{
                                            color: 'white',
                                            fontSize: '32px',
                                            marginTop: '10px',
                                            marginBottom: '10px',
                                        }}
                                    />
                                </Link>
                            </Col>
                            <Col
                                onClick={() => buttonHandler('showcase')}
                                style={{
                                    cursor: 'pointer',
                                }}
                            >
                                {' '}
                                <Link
                                    to={getURL(ROUTES.MAIN, 'showcase')}
                                >
                                    <PieChartOutlined
                                        style={{
                                            color: 'white',
                                            fontSize: '32px',
                                            marginTop: '10px',
                                            marginBottom: '10px',
                                        }}
                                    />
                                </Link>
                            </Col>
                        </Row>
                        <Menu
                            theme={ADMIN_PRIMARY_COLOR ? 'light' : 'dark'}
                            mode="inline"
                            defaultOpenKeys={['1', '5']}
                            items={menuItems}
                            style={{ 
                                width: 200, 
                                color: ADMIN_PRIMARY_COLOR ? 'white' : '', 
                                background: ADMIN_PRIMARY_COLOR ?? '' }}
                            className={ADMIN_PRIMARY_COLOR ? 'constructor-white-text constructor-item-active' : ''}
                            inlineIndent={15}
                        />
                        <Row
                            justify="center"
                            style={{
                                position: 'absolute',
                                bottom: '10px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                            }}
                        >
                            {' '}
                            <UserOutlined
                                style={{
                                    color: 'white',
                                    fontSize: '32px',
                                    marginTop: '10px',
                                    marginBottom: '10px',
                                }}
                            />
                        </Row>
                    </Sider>
                    <Layout className="site-layout" style={{ marginLeft: 200 }}>
                        <Content
                            style={{
                                // margin: '10px 0px 0',
                                overflow: 'initial',
                                // height: '100vh',
                                background: colorBgContainer,
                                marginTop: '65px'
                            }}
                        >
                            {children}
                        </Content>
                    </Layout>
                </Layout>
            )}
            {fullScreen && (
                <Content
                    style={{
                        margin: '10px 0px 0',
                        overflow: 'initial',
                        height: '100vh',
                        background: colorBgContainer,
                        // marginTop: '64px'
                    }}
                >
                    {children}
                </Content>

            )}
        </>
    )
}
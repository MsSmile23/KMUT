/* eslint-disable react/jsx-max-depth */
import { FC, PropsWithChildren, useState } from 'react'
import { Col, Divider, Input, Layout, Menu, Row, Spin } from 'antd';
// import { PieChartOutlined, PartitionOutlined, AppstoreAddOutlined } from '@ant-design/icons'
import useManagerClassesMenu from '@shared/hooks/useManagerClassesMenu';
import { Header } from 'antd/es/layout/layout';
import { InterfaceMenu } from './InterfaceMenu';
import { Link/* , useNavigate */ } from 'react-router-dom';
import { ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView';
// import { ROUTES } from '@shared/config/paths';
import { generalStore } from '@shared/stores/general';
import { getInterfaceRoute, getURL } from '@shared/utils/nav';
import { useLicenseStore } from '@shared/stores/license';
import { InterfacePreloader } from '@pages/auth/preload/InterfacePreloader';


const { Content } = Layout

export const ManagerInterfaceView: FC<PropsWithChildren> = ({ children }) => {
    const [searchQuery, setSearchQuery] = useState('')
    const [/* openMenuGroups */, setOpenMenuGroups] = useState([])
    const menuItems = useManagerClassesMenu(searchQuery)
    // const navigate = useNavigate()
    const interfaceView = generalStore().interfaceView
    const isActiveLicense = useLicenseStore((state) => state.isActiveLicense)
    /* const [setInterfaceView] = generalStore((state) => [
        state.setInterfaceView,
    ]) */

    /* const buttonHandler = (iFace: any) => {
        setInterfaceView(iFace)
    } */

    const handleSearch = (e: any) => {
        setSearchQuery(e.target.value)

        if (e.target.value.length > 0) {
            setOpenMenuGroups(state => ({
                ...state,
                ...menuItems.data.map(it => String(it.key)),
            }))
        }
    }

    // console.log('openMenuGroups', openMenuGroups)
    
    const handleExpand = (keys) => {
        // console.log('keys', keys)

        setOpenMenuGroups(keys)
    }

    return (
        <InterfacePreloader>
            <Layout 
                hasSider 
                style={{ 
                    height: '100vh',
                    backgroundColor: '#001529',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'auto',
                        scrollbarGutter: 'stable',
                        height: '100%',
                        width: '20%',
                        zIndex: 2
                    }}
                >
        
                    <Row justify="center" gutter={10} style={{ height: '64px' }}>
                        {isActiveLicense &&   
                    <Col>
                        <Link to={getInterfaceRoute('constructor')}>
                            <ECIconView 
                                icon="PartitionOutlined" 
                                style={{ 
                                    color: 'white', 
                                    fontSize: '32px', 
                                    margin: '10px 0' 
                                }}
                            />
                        </Link>
                    </Col>}
                        <Col>
                            <Link to={getURL('/', 'manager')}>
                                <ECIconView 
                                    icon="AppstoreAddOutlined" 
                                    style={{ 
                                        color: 'white', 
                                        fontSize: '32px', 
                                        margin: '10px 0' 
                                    }}
                                />
                            </Link>
                            {interfaceView == 'manager' &&  <Divider style={{ margin: 0, background: '#ffffff' }} />}
                        </Col>
                        {isActiveLicense && 
                    <Col>
                        <Link to={getInterfaceRoute('showcase')}>
                            <ECIconView 
                                icon="PieChartOutlined" 
                                style={{ 
                                    color: 'white', 
                                    fontSize: '32px', 
                                    margin: '10px 0' 
                                }}
                            />
                        </Link>
                    </Col>}
                    </Row>
                    <Row justify="center" style={{ padding: '0 14px' }}>
                        <Input 
                            placeholder="Поиск классов"
                            type="search"
                            onChange={handleSearch}
                        />
                    </Row>
                    <Row style={{ flex: 1,  overflow: 'auto' }}>
                        {menuItems.loading 
                            ? (
                                <div 
                                    style={{ 
                                        display: 'flex', 
                                        justifyContent: 'center', 
                                        alignItems: 'start',
                                        width: '100%',
                                        marginTop: '50px',
                                    }}
                                >
                                    <Spin size="large" />
                                </div>
                            ) : (
                                menuItems.data.length > 0 && !menuItems.loading ? (
                                    <Menu
                                        theme="dark"
                                        mode="inline"
                                        items={menuItems.data}
                                        inlineIndent={10}
                                        // inlineCollapsed={true}
                                        style={{
                                            textAlign: 'left',
                                        }}
                                        onOpenChange={handleExpand}
                                    // openKeys={openMenuGroups}
                                    // openKeys={searchQuery.length > 0 && menuItems.data.map(it => String(it.key))}
                                    />
                                ) : (
                                    <div 
                                        style={{ 
                                            color: '#ffffff',
                                            padding: '10px 14px',
                                        }}
                                    >
                                    Нет классов для отображения
                                    </div>   
                                )

                            )}
                    </Row>
                    <Row justify="center">
                        <ECIconView 
                            icon="UserOutlined" 
                            style={{ 
                                color: 'white', 
                                fontSize: '32px', 
                                margin: '10px 0' 
                            }}
                        />
                    </Row>
                </div>
                <div 
                    className="site-layout" 
                    style={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        width: '80%', 
                        overflow: 'hidden', 
                    }}
                >
                    <Header
                        style={{
                            width: '100%',
                            color: 'whitesmoke',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            zIndex: 1,
                            height: '64px',
                        }}
                    >   
                        <InterfaceMenu color="black" backgroundColor="white" />
                        {/* <InputIcon 
                        icon="UserOutlined" 
                        style={{ 
                            color: 'white', 
                            fontSize: '32px', 
                            margin: '10px 0' 
                        }}
                    />  */}
                    </Header>
                    <Content
                        style={{
                            padding: '24px', 
                            overflow: 'auto', 
                            height: 'calc(100% - 64px)',
                            // height: '100%',
                            background: '#ffffff',
                            scrollbarGutter: 'stable',
                        }}
                    >
                        {children}
                    </Content>
                </div>
            </Layout>
        </InterfacePreloader>
    )
}
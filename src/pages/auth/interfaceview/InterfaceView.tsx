import { Button, Col, Row } from 'antd'
import { Typography } from 'antd'
import {
    PieChartOutlined,
    PartitionOutlined,
    AppstoreAddOutlined
} from '@ant-design/icons'
import { ReactNode } from 'react'
import { IInterfaceView, generalStore } from '@shared/stores/general'
import { TestNavigation } from '@shared/ui/test/TestNavigation'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
// import { useLocationStore } from '@shared/stores/locations'
import { Link, /* useNavigate */ } from 'react-router-dom'
import { getInterfaceRoute } from '@shared/utils/nav'

type IIfaces = Exclude<IInterfaceView, ''>

const { Title } = Typography

export const InterfaceView = () => {
    const [permissionedInterfaces, setInterfaceView] = generalStore((state) => [
        state.permissionedInterfaces,
        state.setInterfaceView
    ])
    
    // const locationStore = useLocationStore()
    // const navigate = useNavigate()

    const interfaces = useAccountStore(selectAccount)?.
        user?.role?.interfaces ?? [] // ['constructor', 'manager', 'showcase']

    const interfaceViewsData: Record<IIfaces, {
        id: number,
        label: IIfaces,
        name: string,
        icon: ReactNode
    }> = {
        constructor: {
            id: 1,
            label: 'constructor',
            name: 'Конструктор',
            icon: <PartitionOutlined rev={undefined} />,
        },
        manager: {
            id: 2,
            label: 'manager',
            name: 'Менеджер',
            icon: <AppstoreAddOutlined rev={undefined} />,
        },
        showcase: {
            id: 3,
            label: 'showcase',
            name: 'Витрина',
            icon: <PieChartOutlined rev={undefined} />,
        }
    }

    const buttonHandler = (iFace: IIfaces) => {
        setInterfaceView(iFace)
        // navigate(getInterfaceRoute(iFace))
    }

    const centerPos = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }

    // const wrongInterface = localStorage.getItem('wrongInterface')

    // switch (permissionedInterfaces.length) {
    //     case 0:
    //         return (
    //             <div
    //                 style={{
    //                     ...centerPos,
    //                     height: '100vh',
    //                     flexDirection: 'column'
    //                 }}
    //             >
    //                 <p>Ни один интерфейс недоступен</p>
    //                 <p>Обратитесь к администратору</p>
    //                 <p>
    //                     <Link to={ROUTES.LOGIN}>Вернуться на страницу авторизации</Link>
    //                 </p>
    //             </div>
    //         )
    //     case 1:
    //         buttonHandler(permissionedInterfaces[0])

    //         return
    //     default:
    //         return (
    //             <Row
    //                 align="middle"
    //                 justify="center"
    //                 style={{
    //                     height: '100vh',
    //                 }}
    //             >
    //                 <Col
    //                     span={24}
    //                     style={{
    //                         ...centerPos,
    //                         height: '100%',
    //                         width: '100%',
    //                         flexDirection: 'column',
    //                     }}
    //                 >
    //                     <Title level={2} >Выбор интерфейса</Title>
    //                     <Row
    //                         style={{
    //                             ...centerPos,
    //                             width: '100%',
    //                         }}
    //                     >
    //                         {permissionedInterfaces.map((iFace: string) => {
    //                             return (
    //                                 <Col
    //                                     key={interfaceViewsData[iFace].id}
    //                                     span={3}
    //                                     style={centerPos}
    //                                 >
    //                                     <Button
    //                                         size="large"
    //                                         onClick={() => {
    //                                             buttonHandler(iFace)
    //                                         }}
    //                                         icon={interfaceViewsData[iFace].icon}
    //                                     >
    //                                         {interfaceViewsData[iFace].name}
    //                                     </Button>{' '}
    //                                 </Col>
    //                             )
    //                         })}
    //                     </Row>
    //                     <Row>
    //                         {wrongInterface === 'notAvailable' && (
    //                             <div style={{ textAlign: 'center' }}>
    //                                 <p>Данный интерфейс недоступен</p>
    //                                 <p>Выберите интейфейс из списка доступных или обратитесь к администратору</p>
    //                                 <p>
    //                                     <Link to={ROUTES.LOGIN}>Вернуться на страницу авторизации</Link>
    //                                 </p>
    //                             </div>
    //                         )}
    //                         {wrongInterface === 'unknown' && (
    //                             <div style={{ textAlign: 'center' }}>
    //                                 <p>Вы перешли на неизвестный интейфейс</p>
    //                                 <p>Выберите интейфейс из списка доступных или обратитесь к администратору</p>
    //                                 <p>
    //                                     <Link to={ROUTES.LOGIN}>Вернуться на страницу авторизации</Link>
    //                                 </p>
    //                             </div>
    //                         )}
    //                     </Row>
    //                 </Col>
    //             </Row >
    //         )
    // }
    
    return (
        <>
            <TestNavigation />
            <Row
                align="middle"
                justify="center"
                style={{
                    height: '100vh',
                }}
            >
                <Col
                    span={24}
                    style={{
                        ...centerPos,
                        height: '100%',
                        width: '100%',
                        flexDirection: 'column',
                    }}
                >
                    <Title level={2} >Выбор интерфейса</Title>
                    <Row
                        style={{
                            ...centerPos,
                            width: '100%',
                        }}
                    >
                        {permissionedInterfaces.map((iFace) => {

                            
                            return (
                                interfaces.includes(iFace) ?
                                    <Col
                                        key={interfaceViewsData[iFace].id}
                                        span={3}
                                        style={centerPos}
                                    >
                                        <Link to={getInterfaceRoute(iFace)}>
                                            <Button
                                                // size="large"
                                                style={{ width: 200, height: 200 }}
                                                onClick={() => {
                                                    buttonHandler(iFace)
                                                }}
                                                icon={interfaceViewsData[iFace].icon}
                                            >
                                                {interfaceViewsData[iFace].name}
                                            </Button>{' '}
                                        </Link>
                                    </Col> : null
                            )
                        })}
                    </Row>
                    {/* <Row>
                    {wrongInterface === 'notAvailable' && (
                        <div style={{ textAlign: 'center' }}>
                            <p>Данный интерфейс недоступен</p>
                            <p>Выберите интейфейс из списка доступных или обратитесь к администратору</p>
                            <p>
                                <Link to={ROUTES.LOGIN}>Вернуться на страницу авторизации</Link>
                            </p>
                        </div>
                    )}
                    {wrongInterface === 'unknown' && (
                        <div style={{ textAlign: 'center' }}>
                            <p>Вы перешли на неизвестный интейфейс</p>
                            <p>Выберите интейфейс из списка доступных или обратитесь к администратору</p>
                            <p>
                                <Link to={ROUTES.LOGIN}>Вернуться на страницу авторизации</Link>
                            </p>
                        </div>
                    )}
                </Row> */}
                </Col>
            </Row >
        </>
    )
}
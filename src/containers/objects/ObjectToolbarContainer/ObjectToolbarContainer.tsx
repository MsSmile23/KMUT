/* eslint-disable indent */
import { toolsItem } from '@containers/widgets/WidgetObjectToolbar/WidgetObjectToolbar';
import { useObjectsStore } from '@shared/stores/objects';
import { ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView';
import { ECModal } from '@shared/ui/modals';
import { ECTooltip } from '@shared/ui/tooltips';
import { FC, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ObjectInfoModal from './ObjectInfoModal';
import HelpsShow from '@entities/helps/HelpsShow/HelpsShow';
import { Button, Dropdown, Form, Input } from 'antd';
import OAForceMeas from '@pages/dev/nikita/nikitaDev/OAForceMeas/OAForceMeas';
import { selectCheckPermission, useAccountStore } from '@shared/stores/accounts';
import { connectGuacamoleTerminal, disconnectGuacamole, guacErrorsCodesMessage } from './guacamole-setup';
import { ECLoader } from '@shared/ui/loadings';
import { getProtocols } from '@shared/api/Pud/Models/getProtocols/getProtocols';
import { createQuickConnection } from '@shared/api/Pud/Models/createQuickConnection/createQuickConnection';

interface ObjectToolbarContainerProps {
    objectId: number;
    buttonsSize: number;
    direction: 'vertical' | 'horizontal';
    tools: toolsItem[];
    websocketUrl: string;
    vtemplateId?: number;
}

// const fetchGuacamoleToken = async (server, proto, ip, port) => { //TODO заменить на бековский запрос 
//     const response = await fetch(`http://${server}/guac.php`, {
//         method: 'post',
//         body: JSON.stringify({
//             proto,
//             ip,
//             port,
//         }),
//         headers: {
//             'Content-Type': 'application/json',
//         },
//     });

//     return response.json();
// };

const ObjectToolbarContainer: FC<ObjectToolbarContainerProps> = ({
    objectId,
    buttonsSize,
    direction,
    tools,
    vtemplateId,
    websocketUrl
}) => {
    const delimeterId = useMemo(() => tools && tools.findIndex((el) => el.type === 'delimiter'), [tools]);
    let leftToolsArray: toolsItem[], rightToolsArray: toolsItem[] = [];
    const [modalData, setModalData] = useState({ title: '', modal: <></> });
    const [openModal, setOpenModal] = useState(false);
    const [authModal, setAuthModal] = useState(false);
    const [protocols, setProtocols] = useState([]);
    const objectAttribute = useMemo(() => useObjectsStore
        .getState().getByIndex('id', objectId)?.object_attributes, [objectId]);
    const navigate = useNavigate();
    const checkPermission = useAccountStore(selectCheckPermission);
    const [loading, setLoading] = useState(false);
    const [selectedProtocol, setSelectedProtocol] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const setGuacamoleErrorModal = (error) => {

        const message = error.code ? guacErrorsCodesMessage[error.code] : error.message

        disconnectGuacamole()
        setModalData({
            title: 'Ошибка',
            modal:
                <div>
                    {message}
                </div>
        })
    }

    useEffect(() => {
        const fetchProtocols = async () => {
            try {
                const resp = await getProtocols(objectId);

                if (resp.code === 200) {
                    setProtocols(resp?.data);
                } else {
                    setGuacamoleErrorModal(resp.error)
                    console.error('Unexpected response code:');
                }
            } catch (error) {
                setGuacamoleErrorModal(error)
                console.error('Error fetching protocols:', error);
            }
        };

        fetchProtocols();
    }, [objectId]);

    // console.log('Ошибка которую ловим', error)

    // useEffect(() => {
    //     if (error) {
    //         setModalData({
    //             title: `Ошибка: ${error.message || 'Произошла ошибка'}`,
    //             modal: (
    //                 <div>
    //                     <p>{error.message || 'Не удалось установить соединение.'}</p>
    //                 </div>
    //             ),
    //         });
    //         setOpenModal(true); // открываем модалку при возникновении ошибки
    //     }
    // }, [error]);

    const connectToProtocol = (protocol) => {
        setLoading(true);
        setModalData({
            title: `${protocol} клиент`,
            modal:
                <div
                    id={`${protocol}-terminal`}
                    style={{ width: 'inherit', height: window.innerHeight - 200, opacity: 0.99 }}
                >
                </div >,
        });
        setOpenModal(true);
        createQuickConnection({
            object_id: objectId,
            protocol,
            username,
            password
        })
            .then(resp => {

                console.log('resp', resp)

                if (resp.code === 200 && !!resp?.data?.token && !!resp?.data?.identifier) {
                    connectGuacamoleTerminal(
                        protocol,
                        resp?.data?.guacamole_host,
                        resp?.data?.guacamole_port,
                        resp?.data?.token,
                        resp?.data?.identifier,
                        setGuacamoleErrorModal,
                        setLoading
                    )
                } else {
                    setGuacamoleErrorModal(resp.error)
                    setLoading(false)
                }
            })
            .finally(() => {
                // setTimeout(() => setLoading(false), 2000)
                setUsername('')
                setPassword('')
            })
    };

    const openForceMeas = () => {
        setModalData({
            title: 'Опросить всё',
            modal: <OAForceMeas objectId={[objectId]} />,
        });
        setOpenModal(true);
    };

    const toolsItems = [
        checkPermission(['run probes']) && {
            key: 'force-meas-tool',
            label: <a onClick={() => openForceMeas()}>Опросить всё</a>,
        },
        ...protocols.map((protocol) => ({
            key: `${protocol}-client`,
            label: (
                <a
                    onClick={() => {
                        setSelectedProtocol(protocol.toLowerCase())

                        if (protocol.toLowerCase() === 'rdp' || protocol.toLowerCase() === 'vnc') {
                            setAuthModal(true)
                        } else {
                            connectToProtocol(protocol.toLowerCase())
                        }
                        // connectToProtocol(protocol.toLowerCase()); //TODO перенести
                    }}
                >
                    {protocol.toUpperCase()} клиент
                </a>
            ),
        })),
    ];

    let toolsArray = [];

    if (delimeterId !== -1) {
        leftToolsArray = tools && tools.slice(0, delimeterId);
        rightToolsArray = tools && tools.slice(delimeterId + 1, tools.length);
        toolsArray = [leftToolsArray, rightToolsArray];
    } else {
        toolsArray = [tools];
    }

    const toolActions = useMemo(() => ({
        objectInfo: () => {
            setModalData({
                title: 'Информация об объекте',
                modal: <ObjectInfoModal objectAttribute={objectAttribute} />,
            });
            setOpenModal(true);
        },
        pageInfo: () => {
            setModalData({
                title: 'Информация о странице',
                modal: <HelpsShow pageVtemplateId={vtemplateId} />,
            });
            setOpenModal(true);
        },
        edit: () => navigate(`/manager/objects/update/${objectId}`),
        multiCharts: () => console.log('MultiCharts'),
        tools: (e) => e.preventDefault(),
        forceMeas: () => openForceMeas(),
    }), [objectAttribute, vtemplateId, objectId]);

    const renderToolsItem = (selectedTools: toolsItem[]) => {
        return selectedTools?.map(
            (tool: toolsItem, idx: number) =>
                tool.type === 'button' && (
                    <ECTooltip key={idx} title={`${tool.name}. ${tool.description}`}>
                        {tool.functional !== 'tools' ? (
                            <Button
                                type="default"
                                shape="circle"
                                onClick={toolActions[tool.functional]}
                                style={{
                                    width: buttonsSize,
                                    height: buttonsSize,
                                    padding: 10,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                icon={<ECIconView icon={tool.icon} style={{ fontSize: buttonsSize * 0.5 }} />}
                            />
                        ) : (
                            <div>
                                {toolsItems?.length > 0 && (
                                    <>
                                        {' '}
                                        <Dropdown menu={{ items: toolsItems }} trigger={['click']}>
                                            <Button
                                                type="default"
                                                shape="circle"
                                                style={{
                                                    width: buttonsSize,
                                                    height: buttonsSize,
                                                    padding: 10,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                                icon={
                                                    <ECIconView
                                                        icon={tool.icon}
                                                        style={{ fontSize: buttonsSize * 0.5 }}
                                                    />
                                                }
                                            />
                                        </Dropdown>
                                    </>
                                )}
                            </div>
                        )}
                    </ECTooltip>
                )
        )
    };

    return (
        <>
            <div
                style={{
                    display: 'flex',
                    flexDirection: direction === 'vertical' ? 'column' : 'row',
                    justifyContent: delimeterId !== -1 ? 'space-between' : 'left',
                    width: '100%',
                }}
            >
                {toolsArray.map((tools, idx) => (
                    <div
                        key={idx}
                        style={{
                            display: 'flex',
                            flexDirection: direction === 'vertical' ? 'column' : 'row',
                            justifyContent: delimeterId !== -1 ? 'space-between' : 'left',
                            width: 'max-content',
                        }}
                    >
                        {renderToolsItem(tools)}
                    </div>
                ))}
            </div>
            {authModal && (
                <ECModal
                    width="500px"
                    title={`Введите данные для подключения по ${selectedProtocol} протоколу`}
                    open={authModal}
                    onCancel={() => {
                        setAuthModal(false);
                        setUsername('')
                        setPassword('')
                    }}
                    footer={null}
                >
                    {
                        selectedProtocol !== 'vnc' &&
                        <Form.Item
                            label="Логин"
                            labelCol={{ span: 24 }}
                        >
                            <Input
                                placeholder="Введите имя пользователя"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Form.Item>
                    }

                    <Form.Item
                        label={selectedProtocol == 'vnc' ? 'Ключ доступа' : 'Пароль'}
                        labelCol={{ span: 24 }}
                    >
                        <Input
                            placeholder="Введите пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Item>
                    <Button
                        onClick={() => {
                            connectToProtocol(selectedProtocol)
                            setAuthModal(false);
                        }}
                    >Подключиться
                    </Button>
                </ECModal>
            )}
            {openModal && (
                <ECModal
                    width="1330px"
                    title={modalData.title}
                    open={openModal}
                    onCancel={() => {
                        disconnectGuacamole();
                        setOpenModal(false);
                    }}
                    footer={null}
                >
                    <div style={{ position: 'relative', height: '100%' }}>
                        {loading && (
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                    zIndex: 10,
                                }}
                            >
                                <ECLoader size="large" />
                            </div>
                        )}
                        {modalData.modal}
                    </div>
                </ECModal>
            )}
        </>
    );
};

export default ObjectToolbarContainer;
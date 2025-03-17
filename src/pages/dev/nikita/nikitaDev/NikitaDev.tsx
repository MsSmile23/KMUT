import { FC, useState } from "react";
import Guacamole from 'guacamole-common-js';
import { Button } from "antd";
import { createQuickConnection } from "@shared/api/Pud/Models/createQuickConnection/createQuickConnection";
import ECGridMapObject from "@shared/ui/ECUIKit/maps/ECGridMap/ECGridMapObject";
import ECGridMap from "@shared/ui/ECUIKit/maps";
import ObjectsStatusList from "@entities/objects/ObjectsStatusList/ObjectsStatusList";
import ReportsCompactList from "@entities/reports/ReportsCompactList/ReportsCompactList";
import ReportsDownloadWithDrawer from "@features/reports/ReportsDownloadWithDrawer/ReportsDownloadWithDrawer";
import SimpleReports from "@containers/widgets/Projects/SimpleReports/SimpleReports";
import ECGridMapLegend from "@shared/ui/ECUIKit/maps/ECGridMap/ECGridMapLegend";

const guacConfig = {
    // token: '7BD062E5DE335187D1278DA37CC026D0DBA7ABB53BFA44307FBBDE186634F607',
    GUAC_DATA_SOURCE: 'quickconnect',
    // GUAC_ID: 0,
    GUAC_TYPE: 'c',
    GUAC_WIDTH: 1280,
    GUAC_HEIGHT: 720,
    GUAC_DPI: 96,
    GUAC_TIMEZONE: 'Europe/Moscow',
    GUAC_AUDIO: ['audio/L8', 'audio/L16'],
    GUAC_IMAGE: ['image/jpeg', 'image/png', 'image/webp'],
};


const NikitaDev: FC = () => {
    const [client, setClient] = useState<Guacamole.Client | null>(null);
    const [tunnel, setTunnel] = useState<Guacamole.WebSocketTunnel | null>(null);
    const [protocol, setProtocol] = useState('vnc')



    const connectGuac = async () => {

        const resp = await createQuickConnection({
            object_id: 34725,
            protocol
        })

        const token = resp?.data?.token
        const GUAC_ID = Number(resp?.data?.identifier)
        console.log('resp', resp)

        try {
            const url = 'ws://192.168.1.137:8081/guacamole/websocket-tunnel';
            const wssTunnel = new Guacamole.WebSocketTunnel(url);
            const guacClient = new Guacamole.Client(wssTunnel);

            const display = guacClient.getDisplay();
            const displayContainer = document.getElementById(`${protocol}-terminal`);

            if (!displayContainer) {
                console.error('Элемент для отрисовки не найден');
                return;
            }

            const displayElement = display.getElement();
            if (!displayElement) {
                console.error('Элемент дисплея не создан');
                return;
            }

            displayElement.style.width = `${displayContainer.clientWidth}px`;
            displayElement.style.height = `${displayContainer.clientHeight}px`;

            while (displayContainer.hasChildNodes()) {
                displayContainer.removeChild(displayContainer.lastChild);
            }
            displayContainer.appendChild(displayElement);

            const connParams = new URLSearchParams({
                token,
                GUAC_ID,
                ...guacConfig,
            });

            wssTunnel.onstatechange = function (state) {
                console.log('Состояние WebSocket:', state);
                if (state === Guacamole.Tunnel.State.OPEN) {
                    console.log('Соединение установлено');
                } else if (state === Guacamole.Tunnel.State.CLOSED) {
                    console.log('Соединение закрыто');
                }
            };

            wssTunnel.onerror = function (error) {
                console.error('Ошибка подключения wss:', error);
            };

            guacClient.onerror = function (error) {
                console.error('Ошибка подключения клиента:', error);
            };

            guacClient.connect(connParams);

            const mouse = new Guacamole.Mouse(displayElement);
            mouse.onEach(['mousedown', 'mousemove', 'mouseup'], function sendMouseEvent(e) {
                guacClient.sendMouseState(e.state, true);
            });

            mouse.on('mouseout', function hideCursor() {
                display.showCursor(false);
            });

            const keyboard = new Guacamole.Keyboard(document);
            keyboard.onkeydown = (keysym) => guacClient.sendKeyEvent(1, keysym);
            keyboard.onkeyup = (keysym) => guacClient.sendKeyEvent(0, keysym);

            // Сохраняем клиент и туннель в состоянии
            setClient(guacClient);
            setTunnel(wssTunnel);
        } catch (error) {
            console.error('Ошибка инициализации Guacamole:', error);
        }
    };

    const disconnectGuac = () => {
        if (client) {
            client.disconnect(); // Отключаем клиента
            console.log('Соединение закрыто');
        }
        if (tunnel) {
            tunnel.disconnect(); // Закрываем туннель
        }

        // Очищаем экран
        const displayContainer = document.getElementById(`${protocol}-terminal`);
        if (displayContainer) {
            while (displayContainer.hasChildNodes()) {
                displayContainer.removeChild(displayContainer.lastChild);
            }
        }

        // Сбрасываем состояние
        setClient(null);
        setTunnel(null);
    };

    const objects = [
        { id: 1, name: 'СПБ', color: 'green', x: 1, y: 1 },
        { id: 1, name: 'СПБ', color: 'green', x: 1, y: 2 },
        { id: 1, name: 'СПБ', color: 'green', x: 2, y: 1 },
        { id: 2, name: 'СПБ', color: 'green', x: 2, y: 2 },
        { id: 3, name: 'СПБ', color: 'green', x: 22, y: 11 },
        { id: 4, name: 'СПБ', color: 'red', x: 3, y: 1 },
        { id: 5, name: 'СПБ', color: 'red', x: 5, y: 4 },
        { id: 6, name: 'СПБ', color: 'red', x: 20, y: 5 },
        { id: 7, name: 'СПБ', color: 'red', x: 14, y: 2 },
        { id: 8, name: 'СПБ', color: 'red', x: 15, y: 1 },
    ]

    const legendData = [
        { text: 'Менее 50% муниципалитетов региона с доступностью менее 98%', color: 'green' },
        { text: '50% и более муниципалитетов региона с доступностью менее 98%', color: 'red' },
    ]

    return (
        // <ReportsCompactList />
        <ReportsDownloadWithDrawer />
        // <>
            // <ECGridMap objects={objects} viewType="square" />
            // <ECGridMapLegend data={legendData} />
        // </>
        // <SimpleReports />
    );
};

export default NikitaDev;
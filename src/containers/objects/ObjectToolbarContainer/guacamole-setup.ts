/* eslint-disable max-len */
import { websocketProtocolSelector } from '@shared/utils/Url/url.utils';
import Guacamole from 'guacamole-common-js'

const guac = {
    GUAC_DATA_SOURCE: 'quickconnect',
    GUAC_ID: 0,
    GUAC_TYPE: 'c',
    GUAC_WIDTH: 1280,
    GUAC_HEIGHT: 720,
    GUAC_DPI: 96,
    GUAC_TIMEZONE: 'Europe/Moscow',
    GUAC_AUDIO: ['audio/L8', 'audio/L16'],
    GUAC_IMAGE: ['image/jpeg', 'image/png', 'image/webp'],
}

export const guacErrorsCodesMessage = {
    256: 'Запрошенная операция не поддерживается.',
    512: 'Произошла внутренняя ошибка, и операция не может быть выполнена.',
    513: 'Операция не может быть выполнена, так как сервер занят.',
    514: 'Upstream-сервер не отвечает.',
    515: 'Upstream-сервер обнаружил ошибку.',
    516: 'Не удалось найти связанный ресурс, например файл или поток, поэтому операция не была выполнена.',
    517: 'Ресурс уже используется или заблокирован, что препятствует выполнению запрошенной операции.',
    518: 'Запрошенная операция не может быть продолжена, поскольку связанный с ней ресурс закрыт.',
    519: 'Upstream-сервер, похоже, не существует или недоступен по сети.',
    520: 'Upstream-сервер отказывается обслуживать соединения.',
    521: 'Сеанс на сервере upstream завершен, поскольку конфликтует с другим сеансом.',
    522: 'Сеанс на сервере upstream завершен, поскольку он оказался неактивным.',
    523: 'Сессия на сервере upstream была принудительно закрыта.',
    768: 'Параметры запроса являются незаконными или иным образом недействительными.',
    769: 'Ошибка при авторизации.',
    771: 'В доступе отказано.',
    776: 'Клиент отвечает слишком долго.',
    781: 'Клиент отправил больше данных, чем позволяет протокол.',
    783: 'Клиент отправил данные неожиданного или недопустимого типа.',
    797: 'Клиент уже использует слишком много ресурсов. Существующие ресурсы должны быть освобождены, прежде чем будут разрешены дальнейшие запросы.',
    800: 'Незивестная ошибка, проверьте введённые данные или обратитесь к администратору.'
}

let client;
let display;
let wssTunnel;
let mouse;
const keyboard = new Guacamole.Keyboard(document);

export const connectGuacamoleTerminal = async (protocol, guac_host, guacamole_port, token, guacId, setErrorModal, setLoading) => {
    try {
        const url = websocketProtocolSelector(`ws://${guac_host}:${guacamole_port}/guacamole/websocket-tunnel`)

        console.log('url', url)

        wssTunnel = new Guacamole.WebSocketTunnel(`${url}`);
        client = new Guacamole.Client(wssTunnel);

        display = client.getDisplay();
        const displayContainer = document.getElementById(`${protocol}-terminal`);
        const displayElement = client?.getDisplay().getElement();

        displayElement.style.width = `${displayContainer.clientWidth}px`;
        displayElement.style.height = `${displayContainer.clientHeight}px`;

        while (displayContainer.hasChildNodes()) {
            displayContainer?.removeChild(displayContainer.lastChild);
        }
        displayContainer.appendChild(displayElement);

        const guacConfig = {
            ...guac,
            token: token,
            GUAC_ID: Number(guacId),
        };

        const connParams = new URLSearchParams(guacConfig);
        
        // client.onreceive = function(data) {
        //     display.receive(data);
        // };

        wssTunnel.onstatechange = function(state) {
            console.log('Состояние WebSocket:', state);

            if (state === Guacamole.Tunnel.State.OPEN) {
                console.log('Соединение установлено');
            } else if (state === Guacamole.Tunnel.State.CLOSED) {
                setErrorModal({
                    code: 800
                })
                console.log('Соединение закрыто');
            }

            setTimeout(() => {
                setLoading(false)
            }, 2000)
        };

        wssTunnel.onerror = function(error) {
            console.error('Ошибка подключения wss:', error);
            setErrorModal(error)
        };

        client.onerror = function(error) {
            console.error('Ошибка подключения клиента:', error);
            setErrorModal(error)

        };
        
        await client.connect(connParams);

        const mouse = new Guacamole.Mouse(display.getElement());

        mouse.onEach(['mousedown', 'mousemove', 'mouseup'], function sendMouseEvent(e) {
            if (client) {
                client.sendMouseState(e.state, true);
            }
        });

        mouse.on('mouseout', function hideCursor() {
            display.showCursor(false);
        });

        if (client) {
            keyboard.onkeydown = (keysym) => client.sendKeyEvent(1, keysym);
            keyboard.onkeyup = (keysym) => client.sendKeyEvent(0, keysym);
        }
    } catch (error) {
        console.error('Ошибка инициализации Guacamole:', error);
        setErrorModal(error)
        
        return error
    }
};


export const disconnectGuacamole = () => {
    if (client) {
        client.disconnect(); // Отключение клиента Guacamole
        // console.log('Отключение клиента')
    }

    if (wssTunnel) {
        wssTunnel.disconnect()

    }

    if (mouse) {
        mouse.off(); // Отключение событий мыши
        mouse = null;
    }

    keyboard.onkeydown = null; // Очистка привязок клавиатуры
    keyboard.onkeyup = null;
};
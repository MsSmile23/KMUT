import React, { useCallback, useEffect, useRef, useState } from 'react';
import Guacamole from 'guacamole-common-js';
import { Button, Spin, Modal, Divider } from 'antd';
import { GUACAMOLE_CLIENT_STATES, GUACAMOLE_STATUS } from './const';

const GuacViewer = ({
    wspath,
    token,
    guacID,
    tabIndex,
    controlSize = true,
    controlInput = true,
    screenSize = null,
    // node,
    // nodeSelectCallback,
    // nodeDeleteCallback
}) => {
    const displayRef = useRef(null);
    const guacRef = useRef(null);
    const connectParamsRef = useRef({});
    const scale = useRef(1);
    const demandedScreenSize = useRef(0);
    const updateDisplaySizeTimerRef = useRef(0);

    const [clientState, setClientState] = useState(0);
    const [errorMessage, setErrorMessage] = useState(null);

    console.log('guac_id', guacID)
    console.log('token', token)

    const getConnectionString = () => {
        const params = {
            ...connectParamsRef.current,
            token: token,
            GUAC_ID: guacID,
            GUAC_DATA_SOURCE: 'quickconnect',
            GUAC_TYPE: 'c',
            GUAC_WIDTH: '1806',
            GUAC_HEIGHT: '743',
            GUAC_DPI: '96',
            GUAC_TIMEZONE: 'Europe/Moscow',
            GUAC_AUDIO: ['audio/L8', 'audio/L16'],
            GUAC_IMAGE: ['image/jpeg', 'image/png', 'image/webp'],
        };


        return Object.keys(params).map((key) => {
            if (Array.isArray(params[key])) {
                return params[key].map(item => encodeURIComponent(key) + '=' + encodeURIComponent(item)).join('&');
            }

            return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
        }).join('&');
    };

    const rescaleDisplay = useCallback(() => {
        const remoteDisplayWidth = guacRef.current.getDisplay().getWidth();
        const remoteDisplayHeight = guacRef.current.getDisplay().getHeight();

        if (!displayRef.current) {
            return;
        }

        const newWidth = displayRef.current.clientWidth;
        const newHeight = displayRef.current.clientHeight;

        const newScale = Math.min(newWidth / remoteDisplayWidth, newHeight / remoteDisplayHeight, 1);

        guacRef.current.getDisplay().scale(newScale);
        scale.current = newScale;
    }, []);

    const updateDisplaySize = useCallback((timeout?, widthparam?, heightparam?) => {
        if (!guacRef.current) { return; }

        if (updateDisplaySizeTimerRef.current) {
            clearTimeout(updateDisplaySizeTimerRef.current);
        }

        let newDisplayWidth = 0;
        let newDisplayHeight = 0;

        updateDisplaySizeTimerRef.current = setTimeout(() => {
            if (widthparam > 0 && heightparam > 0) {
                newDisplayWidth = widthparam;
                newDisplayHeight = heightparam;
            } else if (displayRef.current) {
                newDisplayWidth = displayRef.current.clientWidth;
                newDisplayHeight = displayRef.current.clientHeight;
            }

            connectParamsRef.current.width = newDisplayWidth;
            connectParamsRef.current.height = newDisplayHeight;

            if (newDisplayWidth > 1 && newDisplayHeight > 1) {
                if (controlSize) {
                    if (demandedScreenSize.current) {
                        guacRef.current.sendSize(demandedScreenSize.current.width, demandedScreenSize.current.height);
                    } else {
                        guacRef.current.sendSize(newDisplayWidth, newDisplayHeight);
                    }
                    setTimeout(rescaleDisplay, 500);
                } else {
                    rescaleDisplay();
                }
            }
        }, timeout > 0 ? timeout : 500);
    }, [controlSize, rescaleDisplay]);

    const parentOnClickHandler = () => {
        displayRef.current.focus();

        // if (nodeSelectCallback) {
        //     nodeSelectCallback(node._attributes.id);
        // }
    };

    // useEffect(() => {
    //     const visibilityChangedCallback = (p) => {
    //         if (p.visible) {
    //             setTimeout(() => {
    //                 displayRef.current.focus();
    //                 updateDisplaySize(50);
    //             }, 100);
    //         }
    //     };

    //     // node.setEventListener('visibility', visibilityChangedCallback);
    //     const updateDisplaySizeCallback = (rect) => {
    //         updateDisplaySize(0, rect.width, rect.height);
    //     };

    //     // node.setEventListener('resize', updateDisplaySizeCallback);

    //     return () => {
    //         // node.removeEventListener('visibility', visibilityChangedCallback);
    //         // node.removeEventListener('resize', updateDisplaySizeCallback);
    //     };
    // }, [updateDisplaySize]);

    useEffect(() => {
        const protocolPrefix = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const { host } = window.location;
        const webSocketFullUrl = wspath

        guacRef.current = new Guacamole.Client(new Guacamole.WebSocketTunnel(webSocketFullUrl));
        displayRef.current.appendChild(guacRef.current.getDisplay().getElement());

        guacRef.current.onerror = function(error) {
            let msg = error.message;

            if (GUACAMOLE_STATUS[error.code]) {
                msg = (
                    <p>
                        {error.message}<br />
                        {GUACAMOLE_STATUS[error.code].name}<br />
                        {GUACAMOLE_STATUS[error.code].text}
                    </p>
                );
            }
            setErrorMessage(msg);
        };

        guacRef.current.onstatechange = (newState) => {
            setClientState(newState);
        };

        const connectionParams = { audio: [] };

        if (controlSize) {
            connectionParams.width = displayRef.current.clientWidth;
            connectionParams.height = displayRef.current.clientHeight;
        }

        const supportedAudioTypes = Guacamole.AudioPlayer.getSupportedTypes();

        if (supportedAudioTypes.length > 0) {
            connectionParams.audio = supportedAudioTypes.map(item => item + ';rate=44100,channels=2');
        }

        connectParamsRef.current = new URLSearchParams(connectionParams);
        guacRef.current.connect(getConnectionString());

        return function cleanup() {
            guacRef.current.disconnect();
        };
    }, [wspath, updateDisplaySize, controlSize]);

    useEffect(() => {
        demandedScreenSize.current = screenSize;

        if (screenSize) {
            updateDisplaySize(100, demandedScreenSize.current.width, demandedScreenSize.current.height);
        } else {
            updateDisplaySize();
        }
    }, [updateDisplaySize, screenSize]);

    useEffect(() => {
        if (!controlInput) { return; }

        const keyboard = new Guacamole.Keyboard(displayRef.current);
        const fixKeys = (keysym) => (keysym === 65508 ? 65507 : keysym);

        keyboard.onkeydown = (keysym) => {
            guacRef.current.sendKeyEvent(1, fixKeys(keysym));
        };
        keyboard.onkeyup = (keysym) => {
            guacRef.current.sendKeyEvent(0, fixKeys(keysym));
        };

        const mouse = new Guacamole.Mouse(displayRef.current);

        mouse.onmousemove = (mouseState) => {
            mouseState.x = mouseState.x / scale.current;
            mouseState.y = mouseState.y / scale.current;
            guacRef.current.sendMouseState(mouseState);
        };
        mouse.onmousedown = mouse.onmouseup = (mouseState) => {
            guacRef.current.sendMouseState(mouseState);
        };
    }, [controlInput]);

    useEffect(() => {
        if (!controlSize) {
            guacRef.current.getDisplay().onresize = (x, y) => {
                console.log(`Server changed size: ${x} x ${y}`);
                updateDisplaySize(0, x, y);
            };
        }
    }, [controlSize, updateDisplaySize]);

    useEffect(() => {
        const handleServerClipboardChange = (stream, mimetype) => {
            if (document.activeElement !== displayRef.current) { return; }

            if (mimetype === 'text/plain') {
                stream.onblob = (data) => {
                    const serverClipboard = atob(data);

                    if (serverClipboard.trim() !== '') {
                        navigator.clipboard.writeText(serverClipboard);
                    }
                };
            } else {
                console.log('Unsupported mime type:' + mimetype);
            }
        };

        const onFocusHandler = () => {
            navigator.clipboard.readText().then((clientClipboard) => {
                const stream = guacRef.current.createClipboardStream('text/plain', 'clipboard');

                setTimeout(() => {
                    stream.sendBlob(btoa(unescape(encodeURIComponent(clientClipboard.replace(/[\r]+/gm, '')))));
                }, 200);
            });
        };

        if (navigator.clipboard) {
            displayRef.current.addEventListener('focus', onFocusHandler);
            guacRef.current.onclipboard = handleServerClipboardChange;
        }
    }, []);

    const reconnect = () => {
        setErrorMessage(null);
        guacRef.current.connect(getConnectionString());
    };

    return (
        <>
            <div
                ref={displayRef}
                onClick={parentOnClickHandler}
                style={{
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    cursor: 'none',
                }}
                tabIndex={tabIndex}
            />
            {/* <Modal
                visible={clientState < GUACAMOLE_CLIENT_STATES.STATE_CONNECTED}
                footer={null}
                closable={false}
                centered
            >
                <Spin tip="Connecting..." />
            </Modal>
            <Modal
                visible={clientState > GUACAMOLE_CLIENT_STATES.STATE_CONNECTED}
                footer={null}
                closable={false}
                centered
            >
                <p>Session disconnected</p>
                {errorMessage && (
                    <span style={{ color: 'red' }}>Error: {errorMessage}</span>
                )}
                <Divider />
                <Button type="primary" onClick={reconnect}>
                    Reconnect
                </Button>
                <Button type="primary" onClick={() => nodeDeleteCallback(node._attributes.id)}>
                    Close tab
                </Button>
            </Modal> */}
        </>
    );
};

export default GuacViewer;
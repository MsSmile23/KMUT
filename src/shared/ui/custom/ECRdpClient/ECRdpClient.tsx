import { Button, Form, Input } from 'antd';
import { useEffect, useRef, useState } from 'react';


const ECRdpClient = ({ ip, login, password }) => {
    // Ссылки на элементы DOM
    const canvasRef = useRef<HTMLCanvasElement | null>();
    const [client, setClient] = useState<any>(null);

    useEffect(() => {
        const loadScripts = async () => {
            const scriptPaths = [
                '/src/shared/lib/Mstsc/socket.io.js', // Импортировать socket.io из файлов, а не из сети
                '/src/shared/lib/Mstsc/mstsc.js',
                '/src/shared/lib/Mstsc/keyboard.js',
                '/src/shared/lib/Mstsc/rle.js',
                '/src/shared/lib/Mstsc/client.js',
                '/src/shared/lib/Mstsc/canvas.js',
            ];

            // Загружаем скрипты
            const loadScript = (src: string) => {
                return new Promise<void>((resolve, reject) => {
                    const script = document.createElement('script');

                    script.src = src;
                    script.async = true;
                    script.onload = () => resolve();
                    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
                    document.body.appendChild(script);
                });
            };

            try {
                for (const src of scriptPaths) {
                    await loadScript(src);
                }
                console.log('All scripts loaded successfully');
                initializeClient();
            } catch (error) {
                console.error('Error loading scripts:', error);
            }
        };

        const initializeClient = () => {
            const canvasElement = canvasRef.current;

            const Mstsc = (window as any).Mstsc;

            if (Mstsc && canvasElement) {
                try {
                    const newClient = Mstsc.client.create(Mstsc.$('myCanvas'));

                    setClient(newClient);
                    console.log('Client initialized successfully');
                } catch (error) {
                    console.error('Error initializing client:', error);
                }
            } else {
                console.error('Mstsc or canvas element is not available');
            }
        };

        loadScripts();

        return () => {
            // Очистка скриптов
            const scripts = document.querySelectorAll('script[src*="/src/shared/lib/Mstsc/"]');

            scripts.forEach(script => document.body.removeChild(script));
        };
    }, []);

    const handleConnect = (values: { ipAddress: string; domain: string; username: string; password: string }) => {
        const { ipAddress, domain, username, password } = values;
        const Mstsc = (window as any).Mstsc;

        if (!Mstsc) {
            console.error('Mstsc or client is not initialized');

            return;
        }

        const canvas = Mstsc.$('myCanvas') as HTMLCanvasElement;
        const host = '192.168.1.171:8080';

        if (!canvas) {
            console.error('Canvas element not found');

            return;
        }

        const canvasContainer = document.getElementById('canvasContainer')
        const rect = canvasContainer.getBoundingClientRect()

        Mstsc.$('main').style.display = 'none';
        canvasContainer.style.display = 'block'
        canvas.style.display = 'inline';
        canvas.width = rect.width;
        canvas.height = rect.height;

        client.connect(ipAddress, domain, username, password, host, (err: Error | null) => {
            if (err) {
                console.error('Connection error:', err);

                return;
            }

            Mstsc.$('myCanvas').style.display = 'none';
            canvasContainer.style.display = 'none'
            Mstsc.$('main').style.display = 'inline';
        });
    };

    return (
        <div>
            <div id="main" className="container">
                <Form
                    name="connectForm"
                    onFinish={handleConnect}
                    layout="vertical"
                    initialValues={{ ipAddress: '', domain: '', username: '', password: '' }}
                >
                    <Form.Item
                        name="ipAddress"
                        label="IP Address"
                        rules={[{ required: true, message: 'Please input your IP Address!' }]}
                    >
                        <Input placeholder="IP Address" />
                    </Form.Item>
                    <Form.Item
                        name="domain"
                        label="Domain"
                    >
                        <Input placeholder="Domain" />
                    </Form.Item>
                    <Form.Item
                        name="username"
                        label="Username"
                    >
                        <Input placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password placeholder="Password" />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{ backgroundColor: '#34A6FF', borderColor: '#34A6FF' }}
                        >
                            Connect
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            <div id="canvasContainer" style={{ width: 'inherit', height: 700, display: 'none' }}>
                <canvas id="myCanvas" ref={canvasRef} style={{ display: 'none' }}></canvas>
            </div>
        </div>
    );
};

export default ECRdpClient
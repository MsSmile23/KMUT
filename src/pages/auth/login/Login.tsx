import { FC, useState } from 'react'
import { Button, Col, Form, Input, Row } from 'antd'
import { Typography } from 'antd';

import { useAccountStore as accountStore } from '@shared/stores/accounts'

const { Title } = Typography;

const Login: FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const login = accountStore((state) => state.login)

    const stopLoading = () => {
        setIsLoading(false)
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSubmit = async (values: any) => {
    
        const username = values?.username
        const password = values?.password
        


        login(username, password, stopLoading)
     

        
        
        /* // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response: any = await SERVICES_LOGIN.Models.login(
            {
                username,
                password,
            })
    
        if (response?.success) {

            if (response?.data !== undefined) {
                // localStorage.setItem('username', response.data.user.login)
                localStorage.setItem('token', response.data.token)
                // localStorage.setItem('userId', response.data.user.id)
                setAuth(true)
                setToken(response.data.token)
                // navigate(ROUTES.PRELOAD)
            }
        }
        else {
            console.log('response.error', response)
            const error: string = response?.error?.response?.data?.message
            
            setAuth(false)
        
            Modal.error({
                title: 'Ошибка авторизации',
                content: `${error}`,
            });
        } */

    }
    
    return (
        <Row 
            align="middle"  
            justify="center"
            style={{ 
                height: '100vh', 
                // background: theme.page.login.background,
                // color: theme.page.login.color
            }}
        >
            <Col
                span={24} style={{ height: '100%', display: 'flex', 
                    flexDirection: 'column', justifyContent: 'center',
                    alignItems: 'center' }}
            >
                <Title level={2}>Авторизация</Title>
                <Form
                    title="Авторизация"
                    name="basic"
                    style={{ maxWidth: 600 }}
                    onFinish={handleSubmit}
                    // eslint-disable-next-line no-console
                    onFinishFailed={() => {console.log('Ошибка111')}}
                    autoComplete="off"
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: '' }]}
                    >
                        <Input size="large" placeholder="Введите логин" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: '' }]}
                    >
                        <Input.Password size="large" placeholder="Введите пароль" />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            // disabled={isLoading}
                            onClick={() => {setIsLoading(true)}}
                            loading={isLoading}
                            size="large"
                            type="primary" htmlType="submit"
                            style={{ width: '100%' }}
                        >
                        Войти
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    )
}

export default Login
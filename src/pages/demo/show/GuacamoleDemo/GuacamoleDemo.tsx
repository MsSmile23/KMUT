import { Buttons } from '@shared/ui/buttons'
import { Input } from '@shared/ui/forms'
import { Col, Form, Row } from 'antd'
import { useState } from 'react'
import { ECLoader } from '@shared/ui/loadings'

export const GuacamoleDemo = ({ initialSrc, initialHost }) => {
    const [src, setSrc] = useState(initialSrc)
    const [host, setHost] = useState(window.location.origin)
    const [form] = Form.useForm()
    const [loaded, setLoaded] = useState<boolean>(false)
    const [loadingData, setLoadingData] = useState<boolean>(false)
    const [errorLoading, setErrorLoading] = useState<boolean>(false)

    // const handleInputChange = (event) => {
    //     setSrc(event.target.value)
    // }

    const handleSubmitButton = () => {
        const values = form.getFieldsValue()
        const requestInit = {
            method: 'POST',
            body: JSON.stringify({
                username: values.username,
                password: values.password,
            }),
        }

        setSrc(values.src)
        setHost(values.host)


        fetch(`${values.host}/gua.php`, requestInit).then((response) => {
            if (response.ok) {
                response
                    .json() // Преобразуем ответ в JSON
                    .then((data) => {
                        if (data?.authToken) {
                            localStorage.setItem('GUAC_AUTH', JSON.stringify({ authToken: data?.authToken }))
                            setLoaded(true)
                        } else {
                            setErrorLoading(true)
                        }
                        setLoadingData(false)
                    })
            } else {
                setErrorLoading(true)
                setLoadingData(false)
            }
        })

    }

    return (
        <>
            <Form name="form" labelCol={{ span: 8 }} autoComplete="off" form={form} style={{ marginBottom: '20px' }}>
                <Row>
                    <Col span={12}>
                        <Form.Item
                            label="host"
                            name="host"
                            rules={[{ required: true, message: 'Обязательное поле' }]}
                            initialValue={window.location.origin}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="src"
                            name="src"
                            rules={[{ required: true, message: 'Обязательное поле' }]}
                            initialValue={initialSrc}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="username"
                            name="username"
                            rules={[{ required: true, message: 'Обязательное поле' }]}
                            initialValue="user3"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="password"
                            name="password"
                            rules={[{ required: true, message: 'Обязательное поле' }]}
                            initialValue="user3"
                        >
                            <Input type="password" />
                        </Form.Item>
                    </Col>
                </Row>

                <Buttons.ButtonAdd
                    loading={loadingData}
                    // onClick={handleMovingItemButton}
                    color="rgb(92, 184, 92)"
                    customText="Применить"
                    icon={null}
                    onClick={() => {
                        setLoadingData(true)
                        handleSubmitButton()
                    }}
                />
            </Form>
            {/* 
            <input
                type="text"
                value={src}
                onChange={handleInputChange}
                placeholder="Enter URL"
                style={{ marginBottom: '10px', width: '100%' }}
            /> */}
            {loadingData && (
                <>
                    <ECLoader />
                    Авторизуемся и загружаем интерфейс управления...
                </>
            )}
            {loaded &&
            <iframe src={`${host}${src}`} style={{ width: '100%', height: '600px' }} />}
            {errorLoading && <>Ошибка авторизации. Токен не получен</>}
        </>
    )
}
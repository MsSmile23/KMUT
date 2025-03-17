import { checkPasswordValidation } from '@containers/accounts/AccountFormContainer/utils'
import { SERVICES_ACCOUNTS } from '@shared/api/Accounts'
import { patchAccountById } from '@shared/api/Accounts/Models/patchAccountById/patchAccountById'
import { useAccountStore } from '@shared/stores/accounts'
import { responseErrorHandler } from '@shared/utils/common'
import { Button, Form, Input, Modal, ModalProps, message } from 'antd'
import { FC, useState } from 'react'

interface IChangePasswordModalProps extends Omit<ModalProps, 'onCancel' | 'onOk'> {
    onCancel: () => void
}

export const PasswordChangeModal: FC<IChangePasswordModalProps> = ({ 
    onCancel,
    ...props
}) => {
    const accountId = useAccountStore((st) => st.store.data?.user?.id)
    const logout = useAccountStore((st) => st.logout)
    const account = useAccountStore((st) => st.store.data?.user)

    const [ validated, setValidated ] = useState(false)
    const [ loading, setLoading ] = useState(false)
    const [ form ] = Form.useForm()

    const changePassword = async () => {
        try {
            setLoading(true)

            const password = form.getFieldValue('password')

            if (password) {
                // const response = await patchAccountById(`${accountId}`, { password })
                const response = await SERVICES_ACCOUNTS.Models.patchAccountMyself({ password })
                

                if (response?.success) {
                    onCancel()
                    logout()
                    message.success('Пароль изменен')
                }   
                else {
                    responseErrorHandler({
                        response: response,
                        modal: Modal,
                        errorText: 'Ошибка при смене пароля',
                    })
                }
            }
        } catch {
            message.error('Ошибка при смене пароля')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal 
            centered
            destroyOnClose
            title="Смена пароля"
            onCancel={onCancel}
            footer={(
                <>
                    <Button onClick={onCancel}>Закрыть</Button>
                    <Button 
                        loading={loading} 
                        type="primary" 
                        onClick={changePassword}
                        disabled={!validated}
                    >
                        Сохранить
                    </Button>
                </>
            )} 
            {...props}
        >
            <Form layout="vertical" labelAlign="left" form={form}>
                <Form.Item 
                    key="password" 
                    name="password" 
                    label="Новый пароль"
                    rules={[{ 
                        required: true, 
                        validator(_rule, value) {
                            const result = checkPasswordValidation(value, account?.role?.password_min_length)

                            if (result.status === 'error') {
                                return Promise.reject(result.message)
                            }

                            return Promise.resolve(result.message)
                        },
                    }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item 
                    key="confirm" 
                    name="confirm" 
                    label="Подтверждение пароля"
                    rules={[{ 
                        required: true, 
                        validator(_rule, value) {
                            const password = form.getFieldValue('password')
                            const errors = form.getFieldError('password')

                            if (value !== password) {
                                return Promise.reject('Пароли не совпадают')
                            }

                            setValidated(value && value === password && errors.length === 0)

                            return Promise.resolve()
                        },
                    }]}
                >
                    <Input.Password />
                </Form.Item>
            </Form>
        </Modal>
    )
}
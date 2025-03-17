import { Modal, Space } from 'antd';

export const showAccountFormModalError = (errors: Record<string, string[]>) => {
    return Modal.error({ 
        title: 'Ошибка в сохранении аккаунта',
        content: (
            <Space direction="vertical">
                {Object
                    .values(errors || {})
                    .flatMap((messages) => messages.map((msg) => <div key={msg}>{msg}</div>))}
            </Space>
        ),
        centered: true
    });
}
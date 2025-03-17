import { FC, PropsWithChildren } from 'react'

export const IsNotEmptyTree: FC<PropsWithChildren<{ isNotEmpty: boolean }>> = ({ children, isNotEmpty }) => {
    if (!isNotEmpty) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 16,
                    backgroundColor: '#ccc5c5',
                }}
            >
                Нет объектов для отображения
            </div>
        )
    }

    return children
}
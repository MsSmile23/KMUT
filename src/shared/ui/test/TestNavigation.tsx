import { useAccountStore as accountStore } from '@shared/stores/accounts'
import { generalStore } from '@shared/stores/general'
import { Button } from 'antd/lib'

export const TestNavigation = () => {
    const [logout] = accountStore((state) => [state.logout])
    const [changeLayout, interfaceView, setInterfaceView] = generalStore((state) => [
        state.changeLayout,
        state.interfaceView,
        state.setInterfaceView
    ])
    const changeInterface = () => {
        setInterfaceView('')
    }
    const toggleLayout = () => {
        changeLayout()
    }

    return (
        <div
            style={{
                padding: 10,
                position: 'absolute',
                width: '45%',
                marginLeft: '50%',
                zIndex: 1000,
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {interfaceView === 'showcase' && (
                    <button
                        onClick={toggleLayout}
                    >
                        Сменить лейаут
                    </button>
                )}
                {interfaceView !== '' && (
                    <button
                        onClick={changeInterface}
                        style={{
                        }}
                    >
                        Интерфейсы
                    </button>
                )}
                <Button
                    onClick={logout}
                    style={{
                    }}
                >
                    Выйти
                </Button>
            </div>
        </div>
    )
}
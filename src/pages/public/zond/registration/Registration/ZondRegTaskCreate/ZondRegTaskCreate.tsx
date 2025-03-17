/* eslint-disable react/jsx-max-depth */
import { runObjectsRegistration } from '@shared/api/Registration/Models/runObjectsRegistration/runObjectsRegistration'
import WrapperCard from '@shared/ui/wrappers/WrapperCard/WrapperCard'
import { Alert, Button, Divider } from 'antd'

const ZondRegTaskCreate = ({ object }) => {

    return (
        <div style={{ width: 700 }}>
            <WrapperCard>
                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', fontSize: 20 }}>
                    <p style={{ color: 'red', textAlign: 'center' }}>
                        Регистрация объекта при установке оборудования КМУТ
                    </p>
                    <Divider style={{ margin: 0 }} />
                    <p style={{ textAlign: 'center' }}>
                        Проверка соответствия параметров качества канала связи нормативным значениям
                    </p>
                    <Divider style={{ margin: 0 }} />
                </div>
                <Alert 
                    style={{ margin: '20px' }} 
                    type="warning" 
                    description="Перед началом выполнения проверки необходимо идентифицировать объект"
                />
                <div style={{ margin: '20px' }}>
                    <div style={{ fontSize: 16 }}>
                        <h3>Код объекта</h3>
                        <p>{object.code}</p>
                        <Divider style={{ margin: 0 }} />
                        <h3>Адрес</h3>
                        <p>{object.address}</p>
                        <Divider style={{ margin: 0 }} />
                        <h3>Способ организации КПД</h3>
                        <p>{object.organizationType}</p>
                        <Divider style={{ margin: 0 }} />
                    </div>
                    <Button
                        onClick={() => runObjectsRegistration()}
                        style={{ marginTop: 20 }}
                        type="primary"
                    >Подтвердить
                    </Button>
                </div>
            </WrapperCard>
        </div>
    )
}

export default ZondRegTaskCreate
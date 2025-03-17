import { getObjectsRegistrationReport } from '@shared/api/Registration/Models/getObjectsRegistrationReport/getObjectsRegistrationReport'
import { runObjectsRegistration } from '@shared/api/Registration/Models/runObjectsRegistration/runObjectsRegistration'
import WrapperCard from '@shared/ui/wrappers/WrapperCard/WrapperCard'
import { Button, Divider } from 'antd'
import moment from 'moment-timezone'
import { fieldColors } from '../utils'


const ZondRegTaskSuccess = ({ data }) => {

    const date = moment(data.result.meas_time).format('DD:MM:YYYY').split(':').join('.')

    const badResult = Object.values(data.result.meas_result).some(el => el === 'Не соответствует')

    const registrationInfo = {
        'Время проведения проверки': moment(data.result.meas_time).format('HH:mm:ss'),
        'Код объекта': data.object.code,
        'Адрес': data.object.address,
    }

    const resultRender = (items: object) => {
        const renderedItems = [];
    
        for (const [key, value] of Object.entries(items)) {
            renderedItems.push(
                <div key={key} style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                    <div style={{ margin: '5px 5px 5px 0', padding: '5px 5px 5px 0' }}>
                        {key}
                    </div>
                    <div style={{ backgroundColor: fieldColors[value as string], width: 130, padding: 5, margin: 5 }}>
                        {value as string}
                    </div>
                </div>
            );
        }
    
        return (
            <div>
                <Divider style={{ margin: 0 }} />
                {renderedItems}
                <Divider style={{ margin: 0 }} />
            </div>
        );
    }

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
                <div style={{ margin: 20 }}>
                    <h3>№3-{data.object.code} от {date}</h3>
                    {resultRender(registrationInfo)}
                    <h3>Результаты проверки</h3>
                    {resultRender(data.result.meas_result)}
                    <h3>Проверка завершена</h3>
                    <Divider style={{ margin: 10 }} /> 
                    <div style={{ fontSize: 16 }}>
                        {badResult 
                            ? 
                            <div style={{ color: 'red' }}>
                                Параметры качества канала связи не соответствует нормативным значениям
                            </div> 
                            : 
                            <div style={{ color: 'green' }}>
                                Параметры качества канала связи соответствует нормативным значениям
                            </div>}
                    </div>
                    <Divider style={{ margin: 10 }} />
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                        <Button 
                            style={{ width: '48%' }} 
                            onClick={() => runObjectsRegistration()}
                        >Повторить проверку
                        </Button>
                        <Button 
                            style={{ width: '48%' }}
                            onClick={() => getObjectsRegistrationReport()}
                        >Сохранить результаты на компьютер
                        </Button>
                    </div>
                </div>
            </WrapperCard>
        </div>
    )
}

export default ZondRegTaskSuccess
import { ECLoader } from '@shared/ui/loadings'
import WrapperCard from '@shared/ui/wrappers/WrapperCard/WrapperCard'
import { Divider } from 'antd'


const ZondRegTaskProcess = () => {
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
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '50px' }}>
                    <ECLoader size="large" />
                    <div>Идёт проверка</div>
                </div>
            </WrapperCard>
        </div>
    )
}

export default ZondRegTaskProcess
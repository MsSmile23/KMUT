import { ECLoader } from '@shared/ui/loadings'
import ZondRegTaskCreate from './ZondRegTaskCreate'
import ZondRegTaskProcess from './ZondRegTaskProcess'
import ZondRegTaskSuccess from './ZondRegTaskSuccess'
import ZondRegTaskError from './ZondRegTaskError'
import { mockData } from './utils'

const Registration = () => {

    // const registration = useApi2(getObjectsRegistration, { autoUpdate: 60_000 })

    return (
        <div
            style={{ 
                height: '100vh', 
                width: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                flexDirection: 'column' }}
        >
            {Object.keys(mockData).length === 0 // Заменить на registration?.data
                ? 
                <div>
                    <div>Получаем данные по состоянию регистрации объекта</div>
                    <ECLoader size="large" />
                </div>
                :
                <div>
                    {mockData.state === 1 && <ZondRegTaskCreate object={mockData.object} /> }
                    {mockData.state === 2 && <ZondRegTaskProcess /> }
                    {mockData.state === 3 && <ZondRegTaskSuccess data={mockData} /> }
                    {mockData.state === 4 && <ZondRegTaskError errors={mockData?.errors} /> }
                </div>}
        </div>
        
    )
}

export default Registration
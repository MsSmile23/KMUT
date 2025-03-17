import { useLocationStore } from '@shared/stores/locations'
import { getInterfaceRoute } from '@shared/utils/nav'
import { Link } from 'react-router-dom'

export const TestRouting = () => {
    const lastCRoute = useLocationStore(st => st.interfaces['constructor'])
    const lastMRoute = useLocationStore(st => st.interfaces['manager'])
    const lastSRoute = useLocationStore(st => st.interfaces['showcase'])
    const setROute = useLocationStore(st => st.setInterfacesRoute)
    const getLastRoute = useLocationStore(st => st.getLastRoute)
    
    return (
        <>
            <div
                onClick={(() => setROute('constructor', '/relations/list'))}
                style={{ cursor: 'pointer', background: 'lightblue', width: 'fit-content' }}
            >
                constructor route - {getLastRoute('constructor')}
            </div>
            <div
                onClick={(() => setROute('manager', '/objects/list?class_id=10097'))}
                style={{ cursor: 'pointer', background: 'lightsalmon', width: 'fit-content' }}
            >
                manager route - {getLastRoute('manager')}
            </div>
            <div
                onClick={(() => setROute('showcase', '/objects/show/10097'))}
                style={{ cursor: 'pointer', background: 'lightgrey', width: 'fit-content' }}
            >
                showcase route - {getLastRoute('showcase')}
            </div>
            <Link to={getInterfaceRoute('constructor')}>constructor last - {lastCRoute}</Link>
            <Link to={getInterfaceRoute('manager')}>manager last - {lastMRoute}</Link>
            <Link to={getInterfaceRoute('showcase')}>showcase last - {lastSRoute}</Link>
        </>
    )
}
import { IInterfaceView } from '@shared/stores/general'
import { useLocationStore } from '@shared/stores/locations'

export const getURL = (path: string, interfaceView: IInterfaceView) => {
    interfaceView = (interfaceView == '') ? 'showcase' : interfaceView
    path = path && path !== '/' ? path : ''

    //Проверка наличия имени интерфейса в начале path (обратная совместимость)
    const pathArr = path.split('/').filter(el => el != '')

    if (pathArr?.[0] === interfaceView) {
        pathArr.pop();
        path = pathArr.join('/')
    }

    if (path[0] == '/') {
        path = path.slice(1, path.length)
    }

    switch (true) {
        case ['constructor', 'manager'].includes(interfaceView):
            return `/${interfaceView}/${path}`;
        case interfaceView == 'showcase' && path !== '':
            return `/${path}`;
        default: return '/'
    }

    /*
    const checkedPath = path ?  path[0] === '/' 
        ? path.slice(1) 
        : path : '/'
    const newPath = interfaceView === 'showcase'
        ? `/${checkedPath}`
        : checkedPath.split('/')?.[0] === interfaceView // только для 'constructor' и 'manager'
            ? `/${checkedPath}` 
            : `/${interfaceView}/${checkedPath}`

    return newPath

     */
}

export const getInterfaceRoute = (interfaceView: Exclude<IInterfaceView, ''>) => {
    const lastRoute = useLocationStore.getState().getLastRoute(interfaceView)

    if (['constructor', 'manager'].includes(interfaceView)) {
        const newURL = lastRoute.includes(interfaceView)
            ? lastRoute
            : getURL(lastRoute, interfaceView)
        
        return newURL
    } else {
        const newURL = lastRoute !== ''
            ? lastRoute
            : getURL('', interfaceView)

        return newURL
    }        
}
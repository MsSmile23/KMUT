import { authStore } from '@shared/stores/auth';
import { useLicenseStore } from '@shared/stores/license';
import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_SERVER + '' + import.meta.env.VITE_API_PREFIX
    //baseURL: import.meta.env.VITE_API_PREFIX
});

instance.interceptors.request.use((config) => {
    if (!config?.headers) {
        throw new Error('Expected \'config\' and \'config.headers\' not to be undefined');
    } 

    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;

    return config;
});

// request
instance.interceptors.request.use(function(config) {
    return config;
},
function(error) {
    return Promise.reject(error);
}
);
// const logOut = () => {
//     accountStore.logOut()
//     AuthActionCreators.logout()(store.dispatch)
// }
const logoutErrors = [401]
const LICENSE_ERROR = 418

instance.interceptors.response.use(function(dataResponse) {
    return dataResponse;
}, function(error) {
    if (logoutErrors.includes(error?.response?.status)) {
        // eslint-disable-next-line no-console
        console.log('error?.response?.status', error?.response?.status)
        authStore.getState().setAuth(false)
        
        if (window.location.pathname === '/auth/login') {
            return;
        }
        localStorage.removeItem('token')
    }
    //*Добавление логики при ошибке лицензии 
    else if (error?.response?.status === LICENSE_ERROR) {
        useLicenseStore.getState().setActiveLicense(false)
    }
    
    return Promise.reject(error)

}
)

const instanceForTests = axios.create({
    baseURL: import.meta.env.VITE_API_SERVER + '' + import.meta.env.VITE_API_PREFIX
});

export default import.meta.env.NODE_ENV === 'test' ? instanceForTests : instance;
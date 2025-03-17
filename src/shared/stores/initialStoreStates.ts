import { IAccountStore } from './accounts';

export const initialAccountState: IAccountStore['store']['data']  = {
    token: '',
    user: {
        id: null,
        login: null,
        email: null,
        group_permission_id: null,
        role_id: null,
        role: null,
        user_group_id: null,
        settings: null,
        full_name: null, 
        company_name: null, 
        position: null, 
        phone_number: null
    }
}
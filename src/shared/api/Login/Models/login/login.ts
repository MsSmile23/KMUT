
import { API_LOGIN } from '@shared/api/Login/settings';
import { API } from '@shared/lib/ApiSPA'
import { IFullAccount } from '@shared/types/accounts';
interface ILocalPayload {
    username: string;
    password: string;
    data?: { token: string, user: { login: string, id: number, email: string } }
}
export const login = async (
    payload: ILocalPayload
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
    const endpoint = { ...API_LOGIN.login };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // const response:any= axios.post(endpoint.url, payload)
    const response = await API.apiQuery<IFullAccount>(
        {
            method: endpoint.method,
            url: endpoint.url,
            data: payload
        }
    )

    return {
        ...response,
        success: response?.success ?? false,
        data: response.data,
        error: response?.error,
    };
};
import { API, IApiReturn } from '@shared/lib/ApiSPA'
import { API_ACTIONS_SCHEME } from '../../settings'

interface ObjectAttribute {
    obj_attr_id: number;
    value: string;
}

export const runProbes = async ({
    id
}: {id: string}): Promise<IApiReturn<ObjectAttribute[] | undefined>> => {     

    const response = await API.apiQuery<ObjectAttribute[]>(
        { 
            method: API_ACTIONS_SCHEME.runProbes.method,
            url: API_ACTIONS_SCHEME.runProbes.url.replace(':id', id),
        }
    )

    return {
        ...response,
    }
}
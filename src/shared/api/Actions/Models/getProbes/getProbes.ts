import { API, IApiReturn } from '@shared/lib/ApiSPA'
import { API_ACTIONS_SCHEME } from '../../settings'

export interface ProbesData {
    object: {
        id: number;
        class_id: number;
        name: string;
        codename: string;
        deleted_at: string | null; 
    };
    probe: {
        id: number;
        class_id: number;
        name: string;
        codename: string;
        deleted_at: string | null; 
    };
    object_attributes: {
        id: number;
        attribute_id: number;
    }[];
    prid: number;
}

export const getProbes = async (
    ids: number[]
): Promise<IApiReturn<ProbesData[] | undefined>> => {  
    
    const response = await API.apiGetAsArray({
        endpoint: { ...API_ACTIONS_SCHEME.getProbes },
        payload: {
            filters: {
                id: ids
            }
        }
    })

    return {
        ...response,
    }
}
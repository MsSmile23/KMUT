import { API, IApiReturn } from '../../../../lib/ApiSPA'

import { IClassStereotype } from '../../../../types/classes-stereotypes'
import { API_CLASS_STEREOTYPE_SCHEME } from '../../settings'

export const getClassStereotypeById = async (
    id: string
): Promise<IApiReturn<IClassStereotype | undefined>> => {
    const url = API_CLASS_STEREOTYPE_SCHEME.getClassStereotypeById.url.replace(':id', id)
    
    const response = await API.apiQuery<IClassStereotype>({
        method: API_CLASS_STEREOTYPE_SCHEME.getClassStereotypeById.method,
        url: url,
    })

    return {
        ...response,
    }
}
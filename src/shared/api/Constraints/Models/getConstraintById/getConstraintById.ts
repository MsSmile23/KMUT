import { IConstraint } from '@shared/types/constraints'
import { API, IApiReturn } from '../../../../lib/ApiSPA'

import { IClass } from '../../../../types/classes'
import { API_CLASSES_SCHEME } from '../../../Classes/settings'
import { API_CONSTRAINTS_SCHEME } from '../../settings'

export const getConstraintById = async ({
    id
}: {id: string}): Promise<IApiReturn<IConstraint>> => {
    const url = API_CONSTRAINTS_SCHEME.getConstraintById.url.replace(':id', id)
    
    const response = await API.apiQuery<IConstraint>({
        method: API_CONSTRAINTS_SCHEME.getConstraintById?.method,
        url: url,
    })

    return {
        ...response,
    }
}
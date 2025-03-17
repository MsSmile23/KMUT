import { IStateSection } from '@shared/types/state-section'
import { API, IApiReturn } from '../../../../lib/ApiSPA'
import { API_STATE_SECTIONS_SCHEME } from '../../settings'


export const getStateSectionById = async (id: string | number): Promise<IApiReturn<IStateSection | undefined>> => {
    const url = API_STATE_SECTIONS_SCHEME.getStateSectionById.url.replace(':id', String(id))
    const response = await API.apiQuery<IStateSection>({
        method: API_STATE_SECTIONS_SCHEME.getStateSectionById.method,
        url: url,
    })

    return {
        ...response,
    }
}
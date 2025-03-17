import { API } from '@shared/lib/ApiSPA';

export const getFilters = async ({ ...props }) => {
    const result = await API.apiQuery({
        method: 'POST',
        url: '',
    })

    return result;
}
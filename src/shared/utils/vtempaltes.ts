import ObjectInfoContainer from '@containers/objects/ObjectCardContainer/ObjectInfoContainer/ObjectInfoContainer'
import ObjectCountWidget from '@containers/objects/ObjectCountWidget'
import LayoutSettingsPage from '@pages/settings/layout/LayoutSettingsPage'
import { SERVICES_VTEMPLATES } from '@shared/api/vtemplates'
import { FC } from 'react'

interface IGetVtemplate {
    type: {
        title: string
        default: {
            title: string
            component: FC
        }
        items?: any[]
    }
    id?: number
    ids?: number[]
    page: 'main' | 'object' | 'layout-settings'
}
export const getVtemplate = ({ type, id, page }: IGetVtemplate) => {

    if (type !== undefined) {
        if (id !== undefined) {
            const checkedView = type?.items.find((type) => type?.class_id == id || type?.class_ids?.includes(id) )

            if (checkedView !== undefined) {
                return checkedView
            }
        }

        return type.default
    } else {
        if (page == 'main') {
            return { component: ObjectCountWidget }
        }

        if (page == 'object') {
            return { component: ObjectInfoContainer }
        }
    }
}
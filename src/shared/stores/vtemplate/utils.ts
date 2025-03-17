import { MacroZoneType } from '@shared/types/vtemplates'
import { LAYOUT_TYPE } from '.'

export const updateVtemplate = (state, newZoneSettings, key, type = LAYOUT_TYPE.CONTENT) => {
    if (state.vtemplate.params.makroZone === MacroZoneType.UNMANAGE_ZONE || type === LAYOUT_TYPE.HEADER) {
        state.vtemplate.params.layoutContentUnmanageableZone = newZoneSettings
    } else {
        state.vtemplate.params.layoutContentManageZone[key] = newZoneSettings
    }
}

export const updateLayoutByType = (state, type, updatedLayout) => {
    if (type === LAYOUT_TYPE.HEADER) {
        state.headerLayout = updatedLayout
    } else {
        state.layout = updatedLayout
    }
}
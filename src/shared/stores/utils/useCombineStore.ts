import { selectClassesUpdateParams, useClassesStore } from '@shared/stores/classes'
// import { selectLinksUpdateParams, useLinksStore } from '@shared/stores/links'
import { selectObjectsUpdateParams, useObjectsStore } from '@shared/stores/objects'
import { useRelationsStore, selectRelationsUpdateParams } from '@shared/stores/relations'
import { useStateEntitiesStore, selectStateEntitiesUpdateParams } from '@shared/stores/state-entities'
import { useStatesStore, selectStatesUpdateParams } from '@shared/stores/states'
import { selectAttributesUpdateParams, useAttributesStore } from '@shared/stores/attributes'
import { useStateStereotypesStore, selectStateStereotypesUpdateParams } from '@shared/stores/statesStereotypes'
import { selectDataTypesUpdateParams, useDataTypes } from '@shared/stores/dataTypes'
import { selectAttributeCategoriesUpdateParams, useAttributeCategoryStore2 } from '@shared/stores/attributeCategories'
import { selectVTemplatesUpdateParams, useVTemplatesStore } from '../vtemplates'
import { selectAccountUpdateParams, useAccountStore } from '../accounts'
import { selectAttributeViewTypesUpdateParams, useAttributeViewTypesStore } from '../attributeViewTypes'
import { selectConfigUpdateParams, useConfigStore } from '../config'
import { generalStore, selectGeneralUpdateParams } from '../general'
import { selectMediaFilesUpdateParams, useMediaFiles } from '@shared/stores/mediaFiles'
import { selectRolesUpdateParams, useRolesStore } from '../roles/useRolesStore'
import { selectGroupPoliciesUpdateParams, useGroupPoliciesStore } from '../groupPolicies/useGroupPoliciesStore'
import { selectClassAttributesUpdateParams, useClassAttributesStore } from '../classAttributes'
import { selectClassStereotypesUpdateParams, useClassStereotypesStore } from '../classStereotypes/useClassStereotypes'
import { selectAttributeStereotypesUpdateParams, useAttributeStereotypesStore } from '../attributeStereotypes/useAttributeStereotypesStore'
import { selectObjectAttributesUpdateParams, useObjectAttributesStore } from '../objectAttributes/useObjectAttributesStore'
import { selectLicenseUpdateParams, useLicenseStore } from '../license'

export const useCombineStores = () => {
    return {
        roles: useRolesStore(selectRolesUpdateParams),
        objects: useObjectsStore(selectObjectsUpdateParams),
        classes: useClassesStore(selectClassesUpdateParams),
        states: useStatesStore(selectStatesUpdateParams),
        stateEntities: useStateEntitiesStore(selectStateEntitiesUpdateParams),
        relations: useRelationsStore(selectRelationsUpdateParams),
        generalStore: generalStore(selectGeneralUpdateParams),
        // links: useLinksStore(selectLinksUpdateParams),
        attributes: useAttributesStore(selectAttributesUpdateParams),
        stateStereotypes: useStateStereotypesStore(selectStateStereotypesUpdateParams),
        dataTypes: useDataTypes(selectDataTypesUpdateParams),
        attrCategories: useAttributeCategoryStore2(selectAttributeCategoriesUpdateParams),
        vtemplates: useVTemplatesStore(selectVTemplatesUpdateParams),
        accounts: useAccountStore(selectAccountUpdateParams),
        viewTypes: useAttributeViewTypesStore(selectAttributeViewTypesUpdateParams),
        config: useConfigStore(selectConfigUpdateParams),
        mediaFiles: useMediaFiles(selectMediaFilesUpdateParams),
        groupPolicies: useGroupPoliciesStore(selectGroupPoliciesUpdateParams),
        classAttributes: useClassAttributesStore(selectClassAttributesUpdateParams),
        objectAttributes: useObjectAttributesStore(selectObjectAttributesUpdateParams),
        classStereotypes: useClassStereotypesStore(selectClassStereotypesUpdateParams),
        attributeStereotypesStore: useAttributeStereotypesStore(selectAttributeStereotypesUpdateParams),
        license: useLicenseStore(selectLicenseUpdateParams)
    }
}
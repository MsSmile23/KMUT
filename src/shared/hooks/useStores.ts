import { useAccountStore } from '@shared/stores/accounts'
import { useAttributeCategoryStore } from '@shared/stores/attributeCategories'
import { useAttributeStereotypeStore } from '@shared/stores/attributeStereotypes'
import { useClasses } from '@shared/stores/classes/useClasses'
import { useDataTypeStore } from '@shared/stores/dataTypes'

// новые сторы всегда добавлять в конец списка!

/**
 * Содержит информацию о всех сторах приложения
 * 
 * @returns все сторы приложения
 */
export const useStores = () => {
    const dataTypeStore = useDataTypeStore()
    const attributeCategoryStore = useAttributeCategoryStore()
    const attributeStereotypeStore = useAttributeStereotypeStore()
    const accountStore = useAccountStore()
    const classes = useClasses()

    return {
        dataTypeStore,
        attributeCategoryStore,
        attributeStereotypeStore,
        accountStore,
        classes
    } as const
}
import { selectAccount, selectCheckPermission, useAccountStore } from '@shared/stores/accounts'
import { useEffect, useState } from 'react'

type TLogicType = 'OR' | 'AND'
type TPermissions = string []

/**
 * 
 * Хук для проверки пермишинов с реакцией на обновление стора аккаунта
 * 
 * @param {TPermissions} mnemos массив пермишинов, которые нужно проверить
 * @param {TLogicType} logic логический тип проверки (и/или)
 * 
 * @returns {boolean} разрешены ли пользователю указанные пермишены
 */

export const usePermissionsCheck = (
    mnemos: TPermissions, 
    rule: TLogicType = 'AND'
): boolean => {
    const account = useAccountStore(selectAccount)
    const checkPermissions = useAccountStore(selectCheckPermission)

    const [isAllowed, setIsAllowed] = useState(checkPermissions(mnemos, rule))

    useEffect(() => {
        const result = checkPermissions(mnemos, rule);

        setIsAllowed((prev) => (prev !== result ? result : prev));
    }, [mnemos, rule, account?.user?.role?.permissions])

    return isAllowed
}
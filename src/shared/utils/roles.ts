import { DEFAULT_PASSWORD_REQUIREMENTS } from '@shared/config/const'
import { IRole } from '@shared/types/roles'
/**
- Функция для добавления базовых правил составления пароля, в том случае, если в роли они не указаны
**/

export const updateRolePasswordRules = (role: IRole): IRole => {
    const localRole = { ...role }

    const newPasswordRules = Object.fromEntries(
        Object.entries(DEFAULT_PASSWORD_REQUIREMENTS).map(([key, value]) => [key, localRole[key] ?? value])
    )

    return ({ ...localRole, ...newPasswordRules })
}
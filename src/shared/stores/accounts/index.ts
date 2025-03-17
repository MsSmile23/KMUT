import { message } from './../../../pages/public/zond/registration/Registration/utils'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { IAccount, IFullAccount } from '@shared/types/accounts'
import { login } from '@shared/api/Login/Models/login'
import { authStore } from '../auth'
import { Modal } from 'antd'
import { generalStore } from '../general'
import { initialAccountState } from '../initialStoreStates'
import { getAccountById } from '@shared/api/Accounts/Models/getAccountById/getAccountById'
import { StoreStates } from '@shared/types/storeStates'
import _ from 'lodash'
import { useRolesStore } from '../roles/useRolesStore'
import { getAccountMyself } from '@shared/api/Accounts/Models/getAccountMyself/getAccountMyself'
import { DEFAULT_PASSWORD_REQUIREMENTS } from '@shared/config/const'
import { updateRolePasswordRules } from '@shared/utils/roles'
import { interceptorErrorsStore } from '../utils/interceptorErrorsStore'

export interface IAccountStore {
    store: {
        data: IFullAccount
        state: StoreStates
        error: string
    }
    params: {
        loadLoopTime: number
        updateLoop: any
        isLoadAtStart: boolean
        loadOrder: number
    }
    localeName: string
    checkPermission: (mnemos: string[], rule?: 'OR' | 'AND') => boolean
    checkPerms: (mnemo: string) => boolean
    checkIElPerms: (mnemo: string, element: string | number, submenu?: 'main' | 'mobile_bottom') => boolean
    fetchData: () => void
    forceUpdate: () => void
    setData: (value: IFullAccount) => void
    setUserData: (value: IAccount) => void
    setError: (error?: string) => void
    login: (username: string, password: string, stopLoading: () => void) => void
    logout: () => void
    setState: (value: IAccountStore['store']['state']) => void
    setStartApiUpdateLoop: (time?: number) => void
    setStopApiUpdateLoop: () => void
    setInitialStoreState: () => void
}
export const useAccountStore = create<IAccountStore>()(
    devtools(
        immer(
            persist(
                (set, get) => ({
                    store: {
                        data: initialAccountState,
                        state: StoreStates.NONE,
                        error: '',
                        globalPermissions: ['do all', 'get all', 'create all'],
                    },
                    params: {
                        loadLoopTime: 60000,
                        updateLoop: null,
                        isLoadAtStart: true,
                        loadOrder: 1,
                    },
                    localeName: 'Данные пользователя',
                    forceUpdate: () => {
                        get().fetchData()
                    },
                    setData: (value) => {
                        set((state) => {
                            state.store.data = value
                        })
                    },
                    setUserData: (value) => {
                        set((state) => {
                            state.store.data.user = value
                        })
                    },
                    setError: (error) => {
                        set((state) => {
                            state.store.error = error
                        })
                    },
                    setState: (value) => {
                        set((state) => {
                            state.store.state = value
                        })
                    },
                    checkPermission: (mnemos, rule = 'AND') => {
                        if (rule == 'AND') {
                            return mnemos.map((mnemo) => get().checkPerms(mnemo)).every((flag) => flag == true)
                        }

                        if (rule == 'OR') {
                            return mnemos.map((mnemo) => get().checkPerms(mnemo)).some((flag) => flag == true)
                        }

                        return get().checkPerms(mnemos[0])
                    },
                    checkPerms: (mnemo) => {
                        const userPermissions = get()
                            .store.data?.user?.role?.permissions// ?.reduce((accum, curr) => {
                            //     return [...accum, ...curr.permissions.map(perm => perm.name)]
                            // }, [])
                            ?.map((perm) => perm.name)

                        if (userPermissions?.includes('do all')) {
                            return true
                        }

                        if (userPermissions?.includes(`${mnemo.split(' ')[0]} all`)) {
                            return true
                        }

                        return userPermissions?.includes(mnemo)
                    },
                    checkIElPerms: (mnemo, element, submenu?) => {
                        const userInterfaceElements = get().store.data?.user?.role?.interface_elements
                        const maketsAllowed = get().store.data?.user.settings.maketsAllowed

                        const userPermissions = get().store.data?.user?.role?.permissions?.map((perm) => perm.name)

                        if (
                            userPermissions?.includes('do all') ||
                            userInterfaceElements?.['vtemplates']?.global ||
                            userInterfaceElements?.[mnemo]?.global
                        ) {
                            return true
                        }

                        const elementEnabled = submenu
                            ? userInterfaceElements?.[mnemo]?.elements?.[submenu].find((el) => el.id === element)
                                ?.enabled
                            : userInterfaceElements?.[mnemo]?.elements?.find((el) => el.id === element)?.enabled

                        if (mnemo === 'vtemplates') {
                            return maketsAllowed.includes(element) || (elementEnabled ?? true)
                        }

                        return elementEnabled ?? true
                    },
                    fetchData: async () => {
                        // get().setState(StoreStates.LOADING)
                        const id = get().store.data.user.id

                        try {
                            // const response = await getAccountById(String(id))
                            const response = await getAccountMyself()

                            if (response?.success) {
                                // const selectedRole = await useRolesStore.getState()
                                // .getRoleById(response.data.role_id)

                                const selectedRole = response?.data?.role

                                const responseWithNewRole = {
                                    ...response.data,
                                    role: updateRolePasswordRules(selectedRole),
                                }

                                const isEqualState = _.isEqual(get().store.state, StoreStates.FINISH)

                                if (!isEqualState) {
                                    get().setState(StoreStates.FINISH)
                                }

                                const isEqual = _.isEqual(get().store.data.user, responseWithNewRole)

                                if (!isEqual) {
                                    if (responseWithNewRole !== null || undefined || [] || {}) {
                                        get().setUserData(responseWithNewRole)
                                        get().setError(null)
                                    }
                                }
                            } else {
                                set((state) => {
                                    state.store.error = response?.error ?? 'Ошибка'
                                    state.store.state = StoreStates.ERROR
                                })

                                // if (response?.status === 403) {
                                //     get().setState(StoreStates.ERROR)
                                // }
                                interceptorErrorsStore({
                                    errorCode: response?.status,
                                    callBack: () => get().setState(StoreStates.FINISH),
                                })
                            }
                        } catch (error) {
                            set((state) => {
                                state.store.error = error ?? 'Ошибка'
                                state.store.state = StoreStates.ERROR
                            })
                        } finally {
                            // console.log('')
                        }
                    },
                    login: async (username, password, stopLoading) => {
                        try {
                            const response = await login({
                                username,
                                password,
                            })

                            if (response?.success) {
                                if (response?.data !== undefined) {
                                    localStorage.setItem('token', response.data.token)
                                    get().setData(response.data)
                                    set((state) => ({
                                        ...state,
                                        isAuth: true,
                                        token: response.data.token,
                                    }))

                                    authStore.setState((state) => ({
                                        ...state,
                                        isAuth: true,
                                    }))
                                } else {
                                    get().setError('Нет данных')
                                }
                            } else {
                                set((state) => ({
                                    ...state,
                                    isAuth: false,
                                    token: '',
                                }))
                                localStorage.removeItem('token')

                                const error = response?.error
                                    ? response?.error?.message
                                    : 'Проверьте введенные логин и пароль'

                                get().setError(error)
                                Modal.error({
                                    title: 'Ошибка авторизации',
                                    content: `${error}`,
                                })
                            }
                        } catch (error) {
                            const errorMessage = 'Сеть недоступна'

                            get().setError(errorMessage)
                            Modal.error({
                                title: 'Ошибка сети',
                                content: `${errorMessage}`,
                            })
                        } finally {
                            setTimeout(() => {
                                stopLoading()
                            }, 500)
                        }
                    },
                    logout: () => {
                        authStore.setState((state) => ({
                            ...state,
                            isAuth: false,
                        }))
                        localStorage.removeItem('token')
                        localStorage.removeItem('locationStore')
                        generalStore.getState().setInitialStoreState()
                        //TODO УБРАТЬ ВЫЗЫВАЕТ РЕРЕНДЕР. Необходима альтернатива.
                        // Добавлена перезагрузка страницы при logout
                        window.location.reload()
                    },
                    setStartApiUpdateLoop: (time = get().params.loadLoopTime) => {
                        const updateLoop = get().params.updateLoop

                        if (updateLoop !== null) {
                            set((state) => {
                                state.params.updateLoop = null
                            })
                        }

                        set((state) => {
                            state.params.updateLoop = setInterval(() => {
                                get().fetchData()
                            }, time)
                        })
                    },
                    setStopApiUpdateLoop: () => {
                        const updateLoop = get().params.updateLoop

                        if (updateLoop !== null) {
                            clearInterval(updateLoop)
                        }

                        set((state) => {
                            state.params.updateLoop = null
                        })
                    },
                    setInitialStoreState: () => {
                        set((state) => {
                            state.store = {
                                data: initialAccountState,
                                state: StoreStates.NONE,
                                error: '',
                            }
                        })
                    },
                }),
                { name: 'accountStore' }
            )
        )
    )
)

export const selectAccount = (state: IAccountStore) => state.store.data
export const selectLogout = (state: IAccountStore) => state.logout
export const selectCheckPermission = (state: IAccountStore) => state.checkPermission
export const selectCheckIEPerms = (state: IAccountStore) => state.checkIElPerms

export const selectAccountUpdateParams = (state: IAccountStore) => {
    return {
        store: state.store,
        name: state.localeName,
        params: state.params,
        fetchData: state.fetchData,
        setStartApiUpdateLoop: state.setStartApiUpdateLoop,
        setStopApiUpdateLoop: state.setStopApiUpdateLoop,
        setInitialStoreState: state.setInitialStoreState,
    }
}
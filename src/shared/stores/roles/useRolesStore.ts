import { create } from 'zustand'
import { devtools /* persist */ } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { StoreStates } from '@shared/types/storeStates'
import _ from 'lodash'
import { TBaseStore } from '../types/types'
import { createBaseStore } from '../utils/createBaseStore'
import { getIndexedData } from '@shared/utils/common'
import { IRole } from '@shared/types/roles'
import { getRoles } from '@shared/api/Roles/Models/getRoles/getRoles'
import { updateRolePasswordRules } from '@shared/utils/roles'
import { interceptorErrorsStore } from '../utils/interceptorErrorsStore'

export interface IRolesStore {
    store: {
        data: IRole[]
        state: StoreStates
        error: string
    }
    index: {
        id: Record<IRole['id'], number>
    }
    params: {
        loadLoopTime: number
        updateLoop: any
        isLoadAtStart: boolean
        loadOrder: number
    }
    localeName: string
    setIndexByMnemo: (
        indexMnemo: keyof IRolesStore['index'], // Заменить
        value: IRolesStore['index'][keyof IRolesStore['index']] // Заменить
    ) => void
    getByIndex: (indexMnemo: keyof IRolesStore['index'], key: number) => IRole
    forceUpdate: () => void
    fetchData: () => void
    setData: (value: IRolesStore['store']['data']) => void
    setState: (value: IRolesStore['store']['state']) => void
    setError: (error?: string) => void
    setStartApiUpdateLoop: (time?: number) => void
    setStopApiUpdateLoop: () => void
    setInitialStoreState: () => void
    getRoleById: (id: number) => IRole
}
export const useRolesStore = create<IRolesStore>()(
    devtools(
        immer((set, get) => ({
            store: {
                data: [],
                state: StoreStates.NONE,
                error: '',
            },
            index: {
                id: {},
            },
            params: {
                loadLoopTime: 60000,
                updateLoop: null,
                isLoadAtStart: true,
                loadOrder: 2,
            },
            localeName: 'Роли',
            setState: (value) => {
                set((state) => {
                    state.store.state = value
                })
            },
            setData: (value) => {
                set((state) => {
                    state.store.data = value
                })
            },
            setIndexByMnemo: (indexMnemo, value) => {
                set((state) => {
                    state.index[indexMnemo] = value
                })
            },
            getByIndex: (indexMnemo, key) => {
                switch (indexMnemo) {
                    case 'id': {
                        const index = get().index[indexMnemo][key] as number

                        return get().store.data[index] as IRole
                    }
                    default: {
                        return undefined
                    }
                }
            },
            forceUpdate: () => {
                get().fetchData()
            },
            fetchData: async () => {
                get().setState(StoreStates.LOADING)

                try {
                    const response = await getRoles({ all: true })

                    if (response?.success) {
                        const isEqual = _.isEqual(get().store.data, response.data)

                        if (!isEqual) {
                            if (response.data !== null || undefined || [] || {}) {
                                const indexed = getIndexedData<IRolesStore['index']>({
                                    sourceData: response.data,
                                    indexKeysRules: {
                                        id: 'value',
                                    },
                                })

                                indexed.keys.forEach((key) => {
                                    get().setIndexByMnemo(key, { ...indexed.data[key] })
                                })

                                //*Замешиваем базовые правила для пароля в роли
                                get().setData(response.data.map((role) => updateRolePasswordRules(role)))

                                get().setError(null)
                            }
                        }

                        get().setState(StoreStates.FINISH)
                    } else {
                        set((state) => {
                            state.store.error = response?.error ?? 'Ошибка'
                            state.store.state = StoreStates.ERROR
                        })

                        // if (response?.status === 418) {
                        //     get().setState(StoreStates.FINISH)
                        // }

                        interceptorErrorsStore({ errorCode: response?.status,
                            callBack: () => get().setState(StoreStates.FINISH) })
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
            setError: (error) => {
                set((state) => {
                    state.store.error = error
                })
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
                        data: [],
                        state: StoreStates.NONE,
                        error: '',
                    }
                })
            },
            getRoleById: (id) => {
                return get().store.data.find((item) => item.id === id)
            },
        }))
    )
)

export const selectRoles = (state: IRolesStore) => state.store.data
export const selectRole = (state: IRolesStore) => state.getRoleById
export const selectAllAttributesByIndex = (state: IRolesStore) => state.index.id
export const selectAttributeByIndex = (state: IRolesStore) => state.getByIndex
export const selectRoleByIndex = (state: IRolesStore) => state.getByIndex
export const selectRolesUpdateParams = (state: IRolesStore) => {
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
export const selectFindRole = (state: IRolesStore) => (id: number) => state.getByIndex('id', id)

type TRolesStore = TBaseStore<IRole[]>

export const useRoles = create(
    immer<TRolesStore>((set, get) => ({
        ...createBaseStore<IRole[]>(set, get),
        data: [],
        timer: 60_000,
        localeName: 'Роли',
        request: () => getRoles({ all: true }),
    }))
)
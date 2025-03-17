import { IBaseStore, TBaseStoreDefaultFields } from '../types/types'

/**
 * Создает базовый субстор с параметрами по умолчанию. 
 * Для работы необходимо поместить в родительский стор. 
 * 
 * @param name - название стора, по которому к нему идет обращение
 * @param endpoint - эндпоинт для запроса данных
 * @param set - функция экшенов стора
 * @returns функция создания стора
 */
export const createBaseStore = <T>(
    set: (createStore: (store?: IBaseStore<T>) => Partial<IBaseStore<T>> | void) => void, 
    get: () => IBaseStore<T>
): TBaseStoreDefaultFields<T> => {
    let timeouts: any[] = []

    return {
        data: undefined,
        cache: undefined,
        cached: false,
        status: 'init',
        timer: 60_000,
        loadOnStart: true,
        loadOrder: 0,
        loading: false,

        error: '',
        setError({ msg, status }) {
            // при ошибке запрос показываем, что есть ошибка, но статус стора должен
            // соответствовать статусу обновления
            set(() => ({
                error: msg,
                status: status,
                data: get().cache,
                cached: true,
                loading: false,
            }))
        },

        find(id) {
            const data = get().data

            if (Array.isArray(data)) {
                return data.find((item) => item.id === id)
            } else {
                return data[id] || undefined
            }
        },

        /**
         * Обновляет стор вне очереди, запрашивая данные с сервера
         */
        async update() {
            const status = get().status === 'idle' ? 'idle' : 'auto' 

            set((state: IBaseStore<T>) => {
                state.status = 'load'
                state.error = ''
                state.loading = true 

                if (Object.keys(state?.cache || {})?.length === 0) {
                    state.cache = state.data
                }
            })

            try {
                const response = await get().request?.()
                
                if (response?.success) {
                    set((state: IBaseStore<T>) => {
                        state.data = response.data
                        state.cache = undefined
                        state.status = status
                        state.cached = false
                    })
                } else {
                    get().setError({ msg: 'Ошибка при ответе', status })
                }
            } catch {
                get().setError({ msg: 'Ошибка при запросе', status })
            } finally {
                if (get().status !== 'idle') {
                    const id = setTimeout(() => {
                        get().update()
                    }, get().timer)

                    timeouts.push(id)

                    set((state: IBaseStore<T>) => {
                        state.loading = false
                    })
                }
            }
        },

        async add(payload: any) {
            const prev = get().status

            set((st: IBaseStore<T>) => {
                st.status = 'fresh'
                st.loading = true
            })
    
            const item = await get().addItem(payload) 

            set((st: IBaseStore<T>) => {
                st.status = prev === 'idle' ? 'idle' : 'auto'
                st.loading = false

                if (Array.isArray(st.data)) {
                    st.data = [...st.data, item] as T
                } else {
                    st.data[item.id] = item
                }
            })
        },

        /**
         * Запускает автообновление
         */
        run() {
            timeouts.forEach((id) => clearTimeout(id))
            timeouts = []

            set((state: IBaseStore<T>) => {
                state.status = 'auto'
                state.error = ''
            })

            get().update()
        },
        
        /**
         * Останавливает автообновление стора
         */
        stop() {
            timeouts.forEach((id) => clearTimeout(id))
            timeouts = []

            set((state: IBaseStore<T>) => {
                state.status = 'idle'
                state.error = ''
            })
        },

        /**
         * Инициализирует стор при загрузке приложения
         */
        init() {
            if (get().loadOnStart && get().status === 'init') {
                get().update()
            }
        },
    }
}
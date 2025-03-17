import { getHealth } from '@shared/api/System/Models/getHealth';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface IHealthStatus {
    status: number,
    message: string,
    date: number
}

interface IHealthStore {
    data: IHealthStatus[],
    isError?: boolean
    counters: { last: number, bad: number },
    lastItemMessage?: string,
    status: 'ok' | 'warn' | 'error' | 'success',
    getStatus: () => void
    updateIsError?: (status: boolean) => void
    request: (st?: number, msg?: string) => Promise<Awaited<ReturnType<typeof getHealth>>>
}

// Если в ответ 200 статус и внутри status: 1, значит сервер корректно работает
// Если в ответе есть понятная структура с { status: , message: }
// выводим большую блокирующую модалку типа danger с информацией
// Если нет понятной структуры то выводим такую же модалку но просто с "Сервер временно недоступен"

/**
 * Стор для опрашивания сервера на предмет его работы
 * 
 * @returns data // массив последних ответов по состоянию сервера
 * @returns isError // находится ли приложение в режиме блокировки
 * @returns counter.last // количеcтво последних проверяемых состояний
 * @returns counter.bad // количество пропускаемых плохих состояний
 * @returns status // ok - ok, warn - плохой запрос, error - несколько плохих запросов, success - статус после error
 * @returns getStatus // функция для формирования статуса в зависимости от настроек counters и элементов data
 * @returns request // функция для отправки запросов о состоянии сервера
 * @returns updateIsError // функция обновления состояния ошибки
 */
export const useHealthStore = create(immer<IHealthStore>((set, get) => ({
    data: [],
    isError: false,
    counters: { last: 3, bad: 1 },
    lastItemMessage: '',
    status: 'ok', 
    getStatus() {
        const lastItems = get().data.slice(-get().counters.last)
        const lastItem = [...lastItems].pop()
        const previousLastItem = lastItems[lastItems.length - 2]
        const isBad = (item: IHealthStatus) => Number(item?.status) !== 1
        const isGood = (item: IHealthStatus) => Number(item?.status) === 1

        if (isBad(lastItem)) {
            const potentiallyLostItems = get().data.slice(-get().counters.bad - 1, -1)

            if (potentiallyLostItems.length > 0 && potentiallyLostItems.every(isBad) ) {
                set(() => ({ status: 'warn' as const }))
            }

            if (lastItems.length === get().counters.last && lastItems.every(isBad)) {
                set(() => ({ status: 'error' as const }))
            }
        }

        if (isGood(lastItem)) {
            if (get().status === 'error') {
                set(() => ({ status: 'success' as const })) 
            }

            if (get().status === 'success' && isGood(previousLastItem)) {
                set(() => ({ status: 'ok' as const })) 
            }

            if (get().status === 'warn') {
                set(() => ({ status: 'ok' as const })) 
            }
        }
    },  
    async request() {
        // чистим историю
        const history = get().data.slice(-9)

        try {
            const response = await getHealth()

            const currentHealth = { ...(response?.data || {}), date: Date.now() }

            set(() => ({ 
                data: [...history, currentHealth],
                lastItemMessage: response?.data?.message
            }))

            return response
        } catch (err) {
            set(() => ({ data: [...history, { date: Date.now() }] }))
        } finally {
            get().getStatus()
        }
    },
    // todo: удалить? нигде не используется
    updateIsError: (isError) => set(() => ({ isError }))
})))
import { getAccountById } from '@shared/api/Accounts/Models/getAccountById/getAccountById'
import { patchAccountById } from '@shared/api/Accounts/Models/patchAccountById/patchAccountById'
import { useAccountStore } from '@shared/stores/accounts'
import { IAccount } from '@shared/types/accounts'
import { updateObjectByPath } from '@shared/utils/common'
import { useCallback, useEffect, useId, useState } from 'react'
import { themes } from '@app/themes/projectTheme'
import { IThemes } from '@app/themes/types'
import { useTheme } from '@shared/hooks/useTheme'
import { generalStore } from '@shared/stores/general'
import { TableRef } from 'antd/es/table'
import { SERVICES_ACCOUNTS } from '@shared/api/Accounts'
import { getAccountMyself } from '@shared/api/Accounts/Models/getAccountMyself/getAccountMyself'

/**
 * Хук для обновления настроек таблицы в текущем аккаунте

 * @property inited - существует ли такой пользователь
 * @returns inited (есть ли у пользователя id)
 * @returns data (настройки пользователя)
 * @returns loading (состояние загрузки при отправке новых настроек)
 * @returns patch (функция отправки новых настроек пользователя на сервер)
 */
export const usePatchAccountTableSettings = () => {
    const [ userData, setUserData ] = useState<IAccount | undefined>()

    const id = useAccountStore((st) => st.store.data?.user?.id)

    useEffect(() => {
        getAccountMyself().then((response) => {
            if (response?.success && response?.data) {
                setUserData(response.data)
            }
        })
        // getAccountById(`${id}`).then((response) => {
        //     if (response?.success && response?.data) {
        //         setUserData(response.data)
        //     }
        //     console.log('response', response.data)
        // })
    }, [id])

    const [ loading, setLoading ] = useState(false)

    /**
     * Отправка новых настроек текущей таблицы на сервер
     */
    const patch = useCallback(async (tableId: string, columns: any[]) => {
        try {
            setLoading(true)

            // return patchAccountById(`${userData.id}`, {
            //     settings: updateObjectByPath(userData?.settings || {}, `tables.${tableId}.columns`, columns)
            // })

            return   SERVICES_ACCOUNTS.Models.patchAccountMyself({
                settings: updateObjectByPath(userData?.settings || {}, `tables.${tableId}.columns`, columns)
            })        
        } finally {
            setLoading(false)
        }
    }, [SERVICES_ACCOUNTS.Models.patchAccountMyself, userData])

    return {
        inited: Boolean(userData?.id),
        data: userData?.settings,
        loading,
        patch
    }
}

/**
 * Хук для получения актуальных настроек темы
 * 
 * @param currentTheme - текущая тема (по умолчанию применяется дефолтная)
 * @returns themeName - название темы
 * @returns editTable - настройки темы для таблицы
 */
export const useEditTableTheme = (currentTheme?: IThemes) => {
    const themeName = generalStore((st) => st.interfaceView)
    const theme = useTheme()
    // todo: типизировать components?
    const baseTheme: any = currentTheme 
        ? themes[currentTheme] 
        : theme || themes.default

    return {
        themeName,
        editTable: baseTheme?.components?.tables?.[themeName]?.Edit,
        theme
    } as const
}

/**
 * Хук для перемещения горизонтального скролла наверх под хедер таблицы.
 * Перестает работать при включении scroll={{ y }} 
 * 
 * @param ref - реф таблицы
 */
export const useReversedTable = (ref: React.MutableRefObject<TableRef>) => {
    useEffect(() => {
        const table = ref.current?.nativeElement
        const tableContentElement = table?.querySelector('.ant-table-content')
        const tableElement = table?.querySelector('table')

        if (tableElement) {
            if (tableContentElement) {
                tableContentElement.classList.add('reversed')
                tableElement.classList.add('reversed')
            } else {
                tableElement.classList.remove('reversed')
            }
        }
    }, [])
}

/**
 * 
 * @param theme - текущая тема (отключение на витрине)
 * @param customHeight - высота для инициализации (затем рассчитывает относительно контейнера и элементов)
 * @param rows - ряды таблицы (используются в качестве зависимости для обновления высоты)
 * @returns 
 */
export const useTableHeight = ({
    theme,
    customHeight,
    rows,
    clientHeight
}: {
    theme: string, 
    customHeight?: number,
    rows?: any[],
    clientHeight?: number
}) => {
    // поиск высоты таблицы
    const tableContainerId = useId()
    const [ tableContainerHeight, setTableContainerHeight ] = useState(960)
    
    useEffect(() => {
        if (customHeight) {
            return setTableContainerHeight(customHeight)
        }

        if (theme === 'showcase') {
            return
        }

        const page = document.querySelector('.ant-layout-content')
        const header = document.querySelector('.ant-layout-header')
        const title = page.querySelector('.ec-page-header') || page.querySelector('.ant-tabs-top .ant-tabs-nav')
        const tableCard = page.querySelector(`[data-table-id="${tableContainerId}"`)

        if (page && header && title && tableCard) {
            const pageHeight = page.getBoundingClientRect().height
            const headerHeight = header.getBoundingClientRect().height
            const titleHeight = title.getBoundingClientRect().height
            const tableCardHeight = tableCard.getBoundingClientRect().height

            console.log(title)
    
            // todo: заменить паддинги (48) на getComputedStyle ?
            const titleHeightFull = titleHeight ? titleHeight + 48 + 24 : 0
            const tableCardHeightFull = tableCardHeight ? tableCardHeight + 48 : 0
            const height = pageHeight - headerHeight - titleHeightFull - tableCardHeightFull
    
            setTableContainerHeight(height)
        }
    

    }, [rows, theme, customHeight, clientHeight])

    return {
        height: tableContainerHeight,
        id: tableContainerId
    }
}

/**
 * Хук для скрытия встроенной пагинации таблицы Ant Design
 * 
 * @param tableRef - реф таблицы
 * @param editTable - настройки таблицы из темы
 */
export const useHiddenPagination = (tableRef: React.MutableRefObject<TableRef>, editTable: any) => {
    useEffect(() => {
        if (tableRef.current) {
            const paginationElement = tableRef.current?.nativeElement
                .querySelector?.('.ant-pagination') as HTMLDivElement
    
            if (editTable?.Paginator?.enabled && (paginationElement as HTMLDivElement)?.style) {
                paginationElement.style.visibility = 'hidden';
                paginationElement.style.height = '0px';
            }
        }
    }, [tableRef.current])
}
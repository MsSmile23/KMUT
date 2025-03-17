import { SelectProps, TableProps, ThemeConfig } from 'antd'
import { ColumnType } from 'antd/es/table'
import { CSSProperties, ReactNode } from 'react'
import { IThemes } from '@app/themes/types'
import { IAttribute } from '@shared/types/attributes'
import { IApiReturn } from '@shared/lib/ApiSPA'

export interface IEditTableFilterSettings<T = any> extends ColumnType<T> {
    key: string
    dataIndex: string
    title: string | ReactNode
    filterType?: TInputType
    filterSelectOptions?: SelectProps['options']
    filterValue?: string
    filterValueKey?: string
    serverFilterValueKey?: string
    valueIndex?: {
        print?: string
        filter?: string
        sort?: string 
    }
    attribute?: IAttribute
    disableSort?: boolean
    disableFilter?: boolean
    visible?: boolean
}
/**
 * @param view - указать в какому интерфейсу системы принадлежит таблица
 */
export interface IEditTableProps extends TableProps<any> {
    tableId: string
    columns: IEditTableFilterSettings[]
    // eslint-disable-next-line @typescript-eslint/ban-types
    rows: Array<Record<string, any> & { key: string } & {}>,
    buttons?: {
        left?: React.ReactNode[],
        right?: React.ReactNode[],
        columns?: { icon: React.ReactNode, enabled?: boolean },
        download?: { icon: React.ReactNode, url: string, format: string, statusPath?: string } 
    },
    paginator?: { 
        page?: number, 
        pageSize?: number, 
        total?: number 
        enablePageSelector?: boolean
    }
    forcePagination?: boolean
    initialPage?: number
    currentTheme?: IThemes
    hideSettingsButton?: boolean,
    customHeight?: number
    server?: {
        request?: (meta?: IApiReturn<any>['meta'] & { filterValue?: any }) => any
        filter?: (config: any) => any
        autoUpdate?: number
    }
    enableShowObjectModal?: boolean,
    hideDownloadButton?: boolean,
    enablePagination?: boolean
    hidePaginationHeader?: boolean
}

export type TInputType = 'text' | 'select' | 'multiselect'
export type TComponents = ThemeConfig['components']
export type TComponentKeys = keyof TComponents
export type TComponentsConfig = {
    [key in TComponentKeys]?: {
        design?: TComponents[key]
        style?: CSSProperties
        bodyStyle?: CSSProperties
    };
};
export type TRecordDesign = {
    [key in TComponentKeys]: TComponents[key] 
}
export type TRecordStyle = {
    [key in TComponentKeys]: CSSProperties
}
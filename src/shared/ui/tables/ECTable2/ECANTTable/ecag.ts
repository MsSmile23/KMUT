import { IThemes } from '@app/themes/types';
import { GridOptions } from 'ag-grid-community';

interface IColumn {
    key: string;
    field: string;
    headerName: string;
    [key: string]: any; 
}

export interface IECAGTable {
    buttons?: {
        left?: React.ReactNode[],
        right?: React.ReactNode[],
    },
    tableRow: Array<Record<string, any>>
    columns: IColumn[]
    pagination?: {
        page?: number, 
        pageSize?: number, 
        total?: number 
        enablePageSelector?: boolean
    }
    paginAdditional?: {
        status?: boolean, 
        button?: boolean,
        suppress?: boolean,
        layout?: boolean
    }
    server?: any
    autoUpdate?: boolean
    currentTheme?: IThemes
    tableId?: string
    tableCSS?: React.CSSProperties
    headerCSS?: React.CSSProperties
    showHeader?: boolean
    hideSettingsButton?: boolean
    initialPage?: number
    header?: string
    emptyText?: string
    gridOptions?: GridOptions
    additionalInfo?: string
    onRowClicked?: string
    supressHorizScroll?: boolean
    useTheme?: boolean
    classes?: any
    agGridCSS?: React.CSSProperties
    getExportRowStyle?: any
}
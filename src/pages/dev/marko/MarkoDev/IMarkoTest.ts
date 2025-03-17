import { IThemes } from "@app/themes/types";

export type IMarkoTestSelector<T extends { id: string} | null> = {
    options: T[];
    value: {
        id: string
        theme: any
    };
    setValue: (value: T) => void;
};

export interface IMarkoTestTable {
    ButtonAction: any
    tableRow: any
    colDefs: any
    tableStyle: any
}

export interface IMarkoTestTableServer {
    ButtonAction?: any
    tableRow: any
    pagination?: any
    colDefs: any
    tableStyle: any
    server?: any
    autoUpdate?: boolean
    currentTheme?: IThemes
    tableId?:string
    setColDefs?: any
}
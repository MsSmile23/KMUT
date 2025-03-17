export type TPageHeaderBreadcrumbs = {
    breadcrumbStereotype: number,
    breadcrumbPage: null | string,
    breadcrumbName: null | string,
    breadcrumbUrl: null | string
}

export interface IPageHeader {
    name: string
    breadcrumbs: TPageHeaderBreadcrumbs[],
    pageHeaderSortArray?: Array<number>
}

export interface IPage {
    name: string, 
    url: string,   
    vtemplate_id: number,
    isActive: boolean,
    id: number | string
}

export type TSelect = {
    label: string;
    value: number;
}
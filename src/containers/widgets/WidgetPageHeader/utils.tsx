import { TPageHeaderBreadcrumbs } from './types/WidgetPageHeaderTypes'

type TBreadcrumb = {
    path: string,
    breadcrumbName: string
}

export function preparationBreadcrumbsList(
    pageHeaderBreadcrumbs: TPageHeaderBreadcrumbs[], 
    pageHeaderSortArray?: Array<number>,
    objectName?: string): TBreadcrumb[] {

    let sortedPageHeader;

    if (!Array.isArray(pageHeaderBreadcrumbs) || pageHeaderBreadcrumbs.length < 1) {
        return [];
    }

    if (pageHeaderSortArray && pageHeaderSortArray.length > 0) {

        sortedPageHeader = pageHeaderSortArray.reduce((acc, item) => {
            acc.push(pageHeaderBreadcrumbs[item])

            return acc
        }, [])

        pageHeaderBreadcrumbs = sortedPageHeader;
    }


    return pageHeaderBreadcrumbs.map((item) => {

        if (item.breadcrumbStereotype === 2) {
            return {
                path: '{{back}}',
                breadcrumbName: 'Назад'
            }
        }

        if (item.breadcrumbStereotype === 3) {
            return {
                path: '{{home}}',
                breadcrumbName: 'Домой'
            }
        }

        if (item.breadcrumbName === '{object.name}') {
            return {
                path: item.breadcrumbUrl,
                breadcrumbName: objectName
            }
        }

        return {
            path: item.breadcrumbUrl,
            breadcrumbName: item.breadcrumbName || item.breadcrumbPage
        }
    });
}
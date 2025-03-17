import { PageHeader } from '@shared/ui/pageHeader'
import { FC, useEffect, useState } from 'react'
import { IPageHeader } from './types/WidgetPageHeaderTypes'
import { preparationBreadcrumbsList } from './utils'
import { useApi2 } from '@shared/hooks/useApi2'
import { getObjectById } from '@shared/api/Objects/Models/getObjectById/getObjectById'


type stateType = {
    widget: IPageHeader,
    vtemplate: {
        objectId?: number
    }
}

interface WidgetHeaderProps {
    settings: stateType
}

const WidgetHeaderForm: FC<WidgetHeaderProps> = (props) => {

    const [objectName, setObjectName] = useState<string>(null)

    const { settings } = props
    const widget = settings?.widget;

    const getObjectName = async () => {
        const { data } = await getObjectById(settings.vtemplate.objectId)

        return data?.name || null
    }

    useEffect(() => {
        if (!settings.vtemplate.objectId) {
            return setObjectName('')
        }
        getObjectName().then((data) => {
            setObjectName(data)
        })
    }, [])
    

    const breadcrumbsSort = widget?.pageHeaderSortArray
    const breadcrumbsList = preparationBreadcrumbsList(widget.breadcrumbs, breadcrumbsSort, objectName)

    return (
        <PageHeader 
            action="widget" 
            title={widget.name === '{object.name}' ? objectName : widget.name} 
            routes={breadcrumbsList} 
        />
    )
}

export default WidgetHeaderForm
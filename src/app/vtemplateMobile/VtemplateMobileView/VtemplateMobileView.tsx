import { TPage } from '@shared/types/common'
import { dataVtemplateProps, paramsVtemplate } from '@shared/types/vtemplates'
import { FC, useEffect } from 'react'
import VtemplateMobileDashboard from '../VtemplateMobileDashboard/VtemplateMobileDashboard'
import { useVtemplateStore } from '@shared/stores/vtemplate'
import { IObject } from '@shared/types/objects'


interface IVtemplateMobileViewProps {
    vtemplate: dataVtemplateProps<paramsVtemplate>
    page?: TPage
    preview?: boolean,
    objectId?: IObject['id']
}

const VtemplateMobileView: FC<IVtemplateMobileViewProps> = (props) => {
    const { vtemplate, preview = false, objectId } = props
    const { setVtemplate } = useVtemplateStore()

    useEffect(() => {
        setVtemplate(vtemplate, objectId)
    }, [vtemplate, objectId])

    return (
        <div style={{ width: '100%' }}>
            <VtemplateMobileDashboard 
                editable={preview} 
                isInterfaceShowcase={true} 
            />
        </div>
    )
}

export default VtemplateMobileView
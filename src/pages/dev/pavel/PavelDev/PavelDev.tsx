import VtemplateView from '@containers/vtemplates/VtemplateFormContainer/components/VtemplateView';
import { SERVICES_VTEMPLATES } from '@shared/api/vtemplates';
import { dataVtemplateProps, paramsVtemplate } from '@shared/types/vtemplates';
import CustomPreloader from '@shared/ui/preloader/CustomPreloader';
import { Card } from 'antd';
import { useEffect, useState } from 'react';
import { ButtonSettings } from '@shared/ui/buttons';
import { useLayoutSettingsStore } from '@shared/stores/settingsLayout';
import 'reactflow/dist/style.css';
import { forumThemeConfig } from '@app/themes/forumTheme/forumThemeConfig';
import ObjectCableMap from '@entities/objects/ObjectCableMap/ObjectCableMap';

const PavelDev = () => {

    const [dataVtemplate, setDataVtemplate] = useState<dataVtemplateProps<paramsVtemplate>>({} as dataVtemplateProps<paramsVtemplate>)
    const [loading, setLoading] = useState<boolean>(false)

    const { fullScreen, setFullScreen } = useLayoutSettingsStore()

    useEffect(() => {
        setLoading(true)
        SERVICES_VTEMPLATES.Models.getVtemplateById('10022')
            .then((res) => {
                try {
                    const params = JSON.parse(res.data.params || {})
                    setDataVtemplate({
                        ...res.data,
                        params: params || {}
                    })
                } catch (error) {
                    console.log('error')
                }
            })
            .finally(() => setLoading(false))
    }, [])

    const handleOpenFullScreen = () => {
        setFullScreen(!fullScreen)
    }

    return (
        <div>
            <ObjectCableMap
                parentObject={10176}
                relationsPortDevice={forumThemeConfig.build.cableTable.relationsPortDevice}
                relationsCablePort={forumThemeConfig.build.cableTable.relationsCablePort}
                cableClasses={forumThemeConfig.build.cableTable.cableClasses}
                childClassesIds={[
                    ...forumThemeConfig.classesGroups.floors,
                    ...forumThemeConfig.classesGroups.racks,
                    ...forumThemeConfig.classesGroups.rooms,
                    ...forumThemeConfig.classesGroups.units
                ]}
                targetClassesIds={[...forumThemeConfig.classesGroups.devices]}
            />
        </div>
    )
}

export default PavelDev


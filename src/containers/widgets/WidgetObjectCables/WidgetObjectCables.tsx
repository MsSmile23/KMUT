import { forumThemeConfig } from '@app/themes/forumTheme/forumThemeConfig'
import ObjectCableTable from '@entities/objects/ObjectCableTable/ObjectCableTable'
import { FC } from 'react'


interface WidgetObjectCablesProps {
    settings: {
        widget: any,
        view: any
    }
}


const WidgetObjectCables: FC<WidgetObjectCablesProps> = (props) => {

    const { settings } = props
    const { widget } = settings

    return (
        <ObjectCableTable
            // object={widget?.object?.id || 0} //Внимание, нужна прокидка объекта÷
            relationsPortDevice ={forumThemeConfig.build.cableTable.relationsPortDevice}
            relationsCablePort = {forumThemeConfig.build.cableTable.relationsCablePort}
            cableClasses = {forumThemeConfig.build.cableTable.cableClasses}
        />
    )
}

export default WidgetObjectCables
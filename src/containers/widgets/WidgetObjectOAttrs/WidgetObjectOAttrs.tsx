import ObjectOAttrs from '@entities/objects/ObjectOAttrs/ObjectOAttrs'
import { FC, useState } from 'react'
import { TWidgetSettings } from '../widget-types'
import { ECTooltip } from '@shared/ui/tooltips'
import { ButtonSettings } from '@shared/ui/buttons'
import { ProfileOutlined } from '@ant-design/icons'
import { DefaultModal2 } from '@shared/ui/modals'
import { selectAttributes, useAttributesStore } from '@shared/stores/attributes'
import { selectClasses, useClassesStore } from '@shared/stores/classes'
import { selectObjects, useObjectsStore } from '@shared/stores/objects'
import { useGetObjects } from '@shared/hooks/useGetObjects'

interface WidgetObjectAttributesProps {
    displayType: 'strings' | 'table'
    showLinks: boolean
    attributeCategory: number
    attributesIds: number[]
    height: number
    linkedClasses: number[]
    divided: boolean
    targetClasses: ITargetClass[]
    showId: boolean,
    customIdLabel: string,
    sort: 'label' | 'value',
    oaSortOrder: number[]
    showObjectName?: boolean
}

interface ITargetClass {
    class_id: number,
    showClassName: boolean, 
    attributeIds: number[],
}

const WidgetObjectOAttrs: FC<TWidgetSettings<WidgetObjectAttributesProps>> = (props) => {
    const { settings } = props
    const { widget } = settings
    const objectId = settings?.vtemplate?.objectId

    const object = useGetObjects()?.find((obj) => obj.id === objectId)
    const attributes = useAttributesStore(selectAttributes)?.map(attribute => attribute.id)
    const classes = useClassesStore(selectClasses)?.map(cls => cls.id)

    const [openModal, setOpenModal] = useState<boolean>(false)
    
    const targetClasses: ITargetClass[] = classes.reduce((acc: ITargetClass[], cls) => {

        return acc.concat({
            class_id: cls,
            showClassName: true,
            attributeIds: attributes,
        })
    }, [])

    return (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <div 
            style={{ 
                width: '100%', 
                // display: 'flex', 
                // flexDirection: 'column', 
                // justifyContent: 'space-between',
                height: '100%',
                position: 'relative',
                margin: 0,
                padding: 0
            }}
        >
            {/* <div style={{ overflowY: 'auto', height: '100%' }}> */}
            {objectId ? (
                <>
                    <div style={{ overflowY: 'auto', height: 'calc(100% - 50px)', minHeight: 170 }}>
                        <ObjectOAttrs
                            showLinks={widget?.showLinks}
                            objectId={objectId}
                            displayType={widget?.displayType}
                            attributeCategory={widget?.attributeCategory}
                            attributesIds={widget?.attributesIds?.length == 0 ? undefined : widget?.attributesIds}
                            height={widget?.height ?? undefined}
                            linkedObjects={{ 
                                targetClasses: widget?.targetClasses, 
                                connectingClasses: widget?.linkedClasses }}
                            // divided={widget?.divided}
                            sorting={widget?.sort}
                            idRow={{ show: widget?.showId, label: widget?.customIdLabel }}
                            oaSortOrder={widget?.oaSortOrder?.length > 0 ? widget?.oaSortOrder : undefined}
                            showObjectName={widget?.showObjectName}
                        />
                    </div>
                    <div style={{ width: '100%' }} >
                        <ECTooltip title="Показать все свойства" placement="bottom">
                            <ButtonSettings
                                style={{ width: 'calc(100% - 10px)', height: '32px', position: 'fixed', bottom: '0' }}
                                icon={false}
                                type="primary"
                                onClick={() => setOpenModal(true)}
                            >
                                <ProfileOutlined />
                            </ButtonSettings>
                        </ECTooltip> 
                    </div>
                </>
            ) : (
                <>Необходимо выбрать объект</>
            )}
            {/* </div> */}
            <DefaultModal2
                open={openModal}
                onCancel={() => setOpenModal(false)}
                showFooterButtons={false}
                tooltipText={`Атрибуты объекта ${object?.name ?? ''}`}
                height="80vh"
                width="80vw"
                centered
                style={{ overflowY: 'auto' }}
            >
                <ObjectOAttrs
                    showLinks={true}
                    objectId={objectId}
                    linkedObjects={{ 
                        targetClasses: targetClasses, 
                        connectingClasses: classes }}
                    divided={false}
                    idRow={{ show: true, label: `Идентификатор объекта ${object?.name ?? ''}` }}
                />
            </DefaultModal2>
        </div>
    )
}

export default WidgetObjectOAttrs
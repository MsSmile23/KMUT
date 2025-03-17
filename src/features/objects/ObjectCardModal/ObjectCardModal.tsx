import { IObject } from '@shared/types/objects'
import { DefaultModal2, IModal } from '@shared/ui/modals/DefaultModal2/DefaultModal2'
import { FC, Fragment, ReactNode, useEffect, useState } from 'react'
import ObjectCardContainer from '@containers/objects/ObjectCardContainer/ObjectCardContainer'
import { Card, Flex, Space, Spin } from 'antd'
import { StateLabel } from '@entities/states'
import { useStateEntitiesStore } from '@shared/stores/state-entities'
import { selectVTemplates, useVTemplatesStore } from '@shared/stores/vtemplates'
import { dataVtemplateProps, paramsVtemplate } from '@shared/types/vtemplates'
import { selectObjectByIndex, useObjectsStore } from '@shared/stores/objects'
import VtemplateView from '@containers/vtemplates/VtemplateFormContainer/components/VtemplateView'
import { useObjectVTemplate } from '@shared/hooks/useObjectVTemplate'
import { useTheme } from '@shared/hooks/useTheme'
import { useAccountStore, selectAccount } from '@shared/stores/accounts'
import { generalStore } from '@shared/stores/general'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'

/**
 * Модальное окно для показа объектов
 *
 * @param objectId - ID объекта, который необходимо передать в компонент
 * @param modal - объект остальных (необязательных) настроек Модального окна (см. interface IModal)
 * @param listObject - список названия и ID объектов (необязательных)
 * Для открытия окна необходимо передать значение в modal={{ open: Boolean }}
 * Для закрытия окна необходимо передать функцию в modal={{ onCancel: function() }}
 * Пример использования:
 * <ObjectCardModal objectId={id} modal={{ open: isOpen, onCancel: handleClose }} listObject={[] || undefined}/>
 */

//type listObjectType = Pick<IObject, 'name' | 'id'> | {extraComponent?: ReactNode}
type listObjectType = {
    id: IObject['id']
    name: IObject['name']
    extraComponent?: ReactNode
}

interface ObjectCardModalProps {
    objectId: IObject['id']
    listObject?: listObjectType[]
    modal?: IModal
}

//TODO: выпилить костыль для опорной сети в виде listObject!
const ObjectCardModal: FC<ObjectCardModalProps> = ({ objectId, modal, listObject }) => {
    const [subObjectModal, setSubObjectModal] = useState<{
        objectId: IObject['id'] | undefined
        modalOpen: boolean
    }>({
        objectId: undefined,
        modalOpen: false,
    })

    const stateEntities = useStateEntitiesStore((st) => st.store.data?.objects || [])
    const findStateId = (idObj: number) => stateEntities.find((se) => se.entity === idObj)?.state
    const vTemplate = useObjectVTemplate(objectId)

    const interfaceView = generalStore((st) => st.interfaceView)
    const isShowcase = interfaceView === 'showcase'
    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode
    const textColor = isShowcase ? createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode) : 'black'
    const backgroundColor = isShowcase
        ? createColorForTheme(theme?.widget?.background, theme?.colors, themeMode)
        : 'white'

    const generateStyle = () => {
        return `
        .ant-modal-content {
        background-color: ${backgroundColor ?? '#ffffff'} !important;
        }
        .ant-modal-title{
        background-color: ${backgroundColor ?? '#ffffff'} !important;
        color: ${textColor ?? '#000000'} !important;
        }
        .ant-modal-close-x {
            color: ${textColor ?? '#000000'} !important;
        }

        .ant-card-body{
            background-color: ${backgroundColor ?? '#ffffff'} !important;}

            `
    }

    return (
        <Fragment key={objectId}>
            <div>
                <style>{generateStyle()}</style>
                <DefaultModal2
                    destroyOnClose
                    width={modal?.width ?? '80%'}
                    title={
                        modal?.title ?? listObject?.length
                            ? 'Выбор объекта'
                            : `Просмотр объекта ${vTemplate.object?.name || ''}`
                    }
                    footer={modal?.footer ?? null}
                    centered={modal?.centered ?? true}
                    {...modal}
                >
                    {listObject?.length ? (
                        <Space direction="vertical" style={{ display: 'flex' }}>
                            {listObject?.map((item) => {
                                const stateId = findStateId(item.id)

                                return (
                                    <Space key={item.id}>
                                        <StateLabel
                                            key={item.id}
                                            stateId={stateId}
                                            onClick={() =>
                                                setSubObjectModal({
                                                    objectId: item.id,
                                                    modalOpen: true,
                                                })}
                                        >
                                            {item.name}
                                        </StateLabel>
                                        {item?.extraComponent}
                                    </Space>
                                )
                            })}
                        </Space>
                    ) : (
                        <Card
                            style={{
                                marginTop: 20,
                                overflowY: 'auto',
                                height: window.innerHeight - 160,
                                backgroundColor: backgroundColor,
                            }}
                        >
                            {vTemplate.isLoaded ? (
                                vTemplate.vTemplate !== undefined && vTemplate.vTemplate !== null ? (
                                    <VtemplateView vtemplate={vTemplate.vTemplate} objectId={vTemplate.object?.id} />
                                ) : vTemplate.object ? (
                                    <Card key={objectId} style={{ marginTop: 20 }}>
                                        <ObjectCardContainer id={objectId} />
                                    </Card>
                                ) : null
                            ) : (
                                <Flex
                                    justify="center"
                                    align="center"
                                    style={{
                                        height: '70vh',
                                    }}
                                >
                                    <Spin />
                                </Flex>
                            )}
                        </Card>
                    )}

                    <ObjectCardModal
                        objectId={subObjectModal.objectId}
                        listObject={undefined}
                        modal={{
                            open: subObjectModal.modalOpen,
                            //afterClose: () => setSubObjectModal({ objectId: undefined, modalOpen: false })
                            //afterClose: () => setSelectedDeviceId(undefined)
                            //onCancel: () => setSelectedDeviceId(undefined)
                        }}
                    />
                </DefaultModal2>
            </div>
        </Fragment>
    )
}

export default ObjectCardModal
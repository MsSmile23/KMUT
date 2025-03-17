import ObjectCardContainer from '@containers/objects/ObjectCardContainer/ObjectCardContainer'
import VtemplateView from '@containers/vtemplates/VtemplateFormContainer/components/VtemplateView'
import { useTheme } from '@shared/hooks/useTheme'
import { useToggle } from '@shared/hooks/useToggle'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { generalStore } from '@shared/stores/general'
import { useObjectsStore } from '@shared/stores/objects'
import { useVTemplatesStore } from '@shared/stores/vtemplates'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import { Modal } from 'antd'
import { FC, useEffect } from 'react'

/**
 * Модальное окно карточки объекта (появляется при нажатии на ряд)
 *
 * @param id - ключ объекта
 * @param onChangeId - экшн для обновления выбранного ключа объекта
 */
export const EditObjectShowModal: FC<{
    id: number
    onChangeId: React.Dispatch<React.SetStateAction<number>>
}> = ({ id, onChangeId }) => {
    const object = useObjectsStore((st) => st.getByIndex('id', id))
    const vTemplate = useVTemplatesStore((st) =>
        st.store.data.find((vt) => {
            return vt?.params?.dataToolbar?.classes?.includes(object?.class_id)
        })
    )
    const accountData = useAccountStore(selectAccount)
    const theme = useTheme()
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode

    const interfaceView = generalStore((st) => st.interfaceView)
    const isShowcase = interfaceView === 'showcase'

    const color = isShowcase ? createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode) : '#000000'
    const background = isShowcase ? createColorForTheme(theme?.widget?.background, theme?.colors, themeMode) : '#ffffff'

    const modal = useToggle()

    useEffect(() => {
        if (id) {
            modal.open()
        } else {
            modal.close()
        }
    }, [id])

    const generateStyle = () => {
        return `
        .ant-modal-content{
            background-color: ${background ?? '#ffffff'} !important;
            color: ${color ?? '#000000'} !important;
        }
            .ant-modal-header {
            background-color: ${background ?? '#ffffff'} !important;
            color: ${color ?? '#000000'} !important;
            }

            .ant-modal-title {
            color: ${color ?? '#000000'} !important;
            }
            .ant-form-item .ant-form-item-label > label {
                color: ${color ?? '#000000'} !important;
            }

            .ant-modal-close-x {
            color: ${themeMode == 'dark' && (color ?? '#000000')} !important;}
    `
    }

    return (
        <>
            <style>{generateStyle()}</style>
            <Modal
                destroyOnClose
                open={modal.isOpen}
                onCancel={() => {
                    modal.close()
                }}
                afterClose={() => {
                    onChangeId(0)
                }}
                width="80%"
                footer={null}
                title={object?.name}
            >
                <div
                    style={{
                        // maxHeight: 800,
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        height: '80vh',
                        minHeight: '800px',
                        minWidth: '600px',
                        // backgroundColor: 'black'
                    }}
                >
                    {vTemplate ? (
                        <VtemplateView vtemplate={vTemplate} objectId={id} />
                    ) : (
                        <ObjectCardContainer id={id} />
                    )}
                </div>
            </Modal>
        </>
    )
}
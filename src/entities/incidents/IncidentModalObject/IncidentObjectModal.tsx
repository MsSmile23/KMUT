import ObjectCardContainer from '@containers/objects/ObjectCardContainer/ObjectCardContainer'
import { useOpen } from '@shared/hooks/useOpen'
import { DefaultModal2 } from '@shared/ui/modals'
import { FC, useEffect } from 'react'

export const IncidentObjectModal: FC<{ id: number | undefined, onClose: () => void }> = ({ id, onClose }) => {
    const modal = useOpen()

    useEffect(() => {
        if (id) {
            modal.open()
        } else {
            modal.close()
            onClose()
        }
    }, [id])

    return (
        <DefaultModal2
            title="Карточка объекта мониторинга"
            open={modal.isOpen}
            onCancel={() => {
                onClose()
                modal.close()
            }}
            footer={null}
        >
            {id && <ObjectCardContainer id={id} />}
        </DefaultModal2>
    )
}
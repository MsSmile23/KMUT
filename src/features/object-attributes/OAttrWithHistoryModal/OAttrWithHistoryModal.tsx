import { FC, useState, ReactNode, Children, cloneElement, ReactElement, useEffect } from 'react'
import { DefaultModal } from '@shared/ui/modals'
import { ECDatePickerWithPresets } from '@shared/ui/ECUIKit/ECDatePickers'
import { IAttributeHistoryDateIntervalForGet } from '@shared/types/attribute-history'

type TOAttrWithHistoryModal = {
    showModal?: boolean,
    setShowModal?: () => void,
    children?: ReactNode, 
}

export const OAttrWithHistoryModal: FC<TOAttrWithHistoryModal> = ({ 
    showModal = false, 
    setShowModal, 
    children
}) => {

    const [dateInterval, setDateInterval] = useState<IAttributeHistoryDateIntervalForGet>([undefined, undefined])

    const OAttrHistoryComponent = Children.map(children, (child) => {
        return cloneElement(child as ReactElement<any>, { dateInterval: dateInterval });
    });

    useEffect(() => {
        setDateInterval([undefined, undefined])
    }, [showModal])

    return (
        <DefaultModal
            isModalVisible={showModal}
            isDraggable={true}
            width="80vw"
            height="auto"
            customCrossPosition={true}
            handleCancel={setShowModal}
        >
            <ECDatePickerWithPresets viewType="buttons" setDateInterval={setDateInterval} />
            {OAttrHistoryComponent}
        </DefaultModal>
    )
}
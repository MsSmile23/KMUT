import { usePermissionsCheck } from '@shared/hooks/usePermissionsCheck'
import { ButtonDeleteRow } from '@shared/ui/buttons'


const ClassesDeleteButton = ({ onClick, withConfirm, disablePopup }) => {

    const disabled = !usePermissionsCheck(['delete classes'])

    return (
        <ButtonDeleteRow
            disabled={disabled}
            withConfirm={withConfirm}
            onClick={onClick}
            disablePopup={disablePopup}
            buttonTitle={disabled ? 'Действие запрещено настройками роли' : 'Удалить'}
        />
    )
}

export default ClassesDeleteButton
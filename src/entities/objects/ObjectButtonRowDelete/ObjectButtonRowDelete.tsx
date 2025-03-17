import { useAccountStore } from '@shared/stores/accounts'
import { ButtonDeleteRow } from '@shared/ui/buttons'


const ObjectButtonRowDelete = ({ onClick, withConfirm, disablePopup }) => {

    const checkPermission = useAccountStore.getState().checkPermission
    const buttonDisable = !checkPermission(['delete objects'])
    
    return (
        <ButtonDeleteRow
            disabled={buttonDisable}
            withConfirm={withConfirm}
            onClick={onClick}
            disablePopup={disablePopup}
            buttonTitle={buttonDisable ? 'Действие запрещено настройками роли' : 'Удалить'}
        />
    )
}

export default ObjectButtonRowDelete
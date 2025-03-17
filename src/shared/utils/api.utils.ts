import { IApiReturn } from '@shared/lib/ApiSPA'
import { ModalStaticFunctions } from 'antd/es/modal/confirm'

export const responseHandler = (
    response: IApiReturn<any>,
    modal: ModalStaticFunctions,
    errorText: string, 
    successText: string, 
    cbSuccess?: () => void, 
    cbError?: () => void
): boolean => {

    const error: any[] = []
    const chosenErrors = response.error?.errors

    if (response.success) {
        modal.success({
            title: successText,
        })
        cbSuccess()
        
        return true
    }

    if (chosenErrors !== undefined) {
        Object.keys(chosenErrors)?.map((key) => {
            error.push(chosenErrors[key])
        })
        modal.warning({
            title: errorText,
            content: error[0] ?? 'Неизвестная ошибка',
            wrapClassName: 'error-modal',
            style: { zIndex: 99 },
            styles: {
                body: { zIndex: 999 },
                mask: { zIndex: 9999 },
            }
        })
    } else {
        modal.warning({
            title: errorText,
            content: response.error?.message ?? 'Неизвестная ошибка',
            wrapClassName: 'error-modal',
            style: { zIndex: 99 },
            styles: {
                body: { zIndex: 999 },
                mask: { zIndex: 9999 },
            }
        })
    }

    if (cbError) {
        cbError()
    }
    
    return false
}
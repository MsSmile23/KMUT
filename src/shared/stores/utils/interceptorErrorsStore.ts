const ERRORS = [403, 418] //*Список ошибок, которые не должны влиять на загрузку прелоадара


export const interceptorErrorsStore = ({ errorCode, callBack }) => {
    if (ERRORS.includes(errorCode)) {
        callBack()
    }
}
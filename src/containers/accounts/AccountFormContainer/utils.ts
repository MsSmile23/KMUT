

// export const checkPasswordValidation = (str: string | undefined, length) => {
//     const small = /(.*[a-z]){3,}/m.test(str)
//     const big = /(.*[A-Z]){3,}/m.test(str)
//     const nums = /(.*[0-9]){3,}/m.test(str)
//     const symbols = /(.*[$&+,:;=?@#|'<>.^*()%!-]){3,}/m.test(str)
//     const minLength = new RegExp(`^.{${length},}$`).test(str); // проверка на минимальную длину
//     const error = !small || !big || !nums || !symbols



//     return {
//         status: str === undefined ? undefined : (error ? 'error' : ''),
//         message: str === undefined ? '' : `
//             ${error ? 'Введите' : ''} ${!minLength ? `пароль длиной минимум ${length} символов,` : ''}
//             ${error ? 'Введите' : ''} ${!small ? 'минимум 3 латинские прописные буквы,' : ''}
//             ${!big ? 'минимум 3 латинские заглавные буквы,' : ''}
//             ${!nums ? 'минимум 3 цифры,' : ''}
//             ${!symbols ? 'минимум 3 спецсимвола' : ''}
//         `
//     } as const
// }

export const checkPasswordValidation = (str: string | undefined, length: number) => {
    if (!str) {
        return { status: undefined, message: '' };
    }
    
    const small = /(.*[a-z]){3,}/m.test(str);
    const big = /(.*[A-Z]){3,}/m.test(str);
    const nums = /(.*[0-9]){3,}/m.test(str);
    const symbols = /(.*[$&+,:;=?@#|'<>.^*()%!-]){3,}/m.test(str);
    const minLength = new RegExp(`^.{${length},}$`).test(str); // проверка на минимальную длину

    const errors: string[] = [];

    if (!minLength) {
        errors.push(`пароль длиной минимум ${length} символов`);
    }

    if (!small) {
        errors.push('минимум 3 латинские прописные строчные буквы');
    }

    if (!big) {
        errors.push('минимум 3 латинские заглавные буквы');
    }

    if (!nums) {
        errors.push('минимум 3 цифры');
    }

    if (!symbols) {
        errors.push('минимум 3 спецсимвола');
    }

    const message = errors.length > 0 ?
        `Введите ${errors.join(', ')}.` :
        '';

    return {
        status: errors.length > 0 ? 'error' : '',
        message: message,
    } as const;
};
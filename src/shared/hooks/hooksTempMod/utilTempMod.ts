export const tempModifArrayUnif = (array) => {
    const result = array.reduce((acc, obj) => {
        for (const key in obj) {
            if (obj[key] !== '' && obj[key] !== undefined) {
                acc[key] = acc[key] !== undefined ? acc[key] : obj[key];
            }
        }
        
        return acc;
    }, {});

    result.getValue = function(key) {
        return this[key];
    };

    return result
}
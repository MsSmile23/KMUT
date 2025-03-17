//Заготовка для хука отслеживания изменений объектового значения стора


// import { useEffect, useState } from 'react'
// import _ from 'lodash'
//
// export const useStoreObjectValue = (key) => {
//     const storeValue = useStore((state) => state?.[key]);
//     const [value, setValue] = useState({ ...storeValue })
//
//     useEffect(() => {
//         const isEqual = _.isEqual(value, storeValue)
//
//         if (!isEqual) {
//             setValue({ ...storeValue })
//         }
//     }, [value])
//
//     return value
// }
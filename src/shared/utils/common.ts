import { merge } from 'lodash'
import { IRelationsStore } from '@shared/stores/relations'
import { IApiReturn } from '@shared/lib/ApiSPA'
import { ModalStaticFunctions } from 'antd/es/modal/confirm'
import { IClass } from '@shared/types/classes'
import { useClassesStore } from '@shared/stores/classes'
import ErrorMessage from './ErrorMessage'


interface IResponseErrorHandler  {
    response: IApiReturn<any> 
    modal: ModalStaticFunctions,
    errorText: string
}

export const jsonParseAsObject = (data: any) => {
    try {
        if (typeof data === 'object') {return data}
        
        return JSON.parse(data)
    } catch {
        return {}
    }
}
export const getFrontSettingsSelect = (data: any[]) => {
    const frontSettingsItem = data.find(item => item.mnemo === 'front_settings');

    if (frontSettingsItem) {
        try {
            
            return JSON.parse(frontSettingsItem.value);
        } catch (error) {
            console.error('Ошибка при парсинге JSON:', error);
            
            return null; 
        }
    }
    
    return null; 
};
export const bestTextColor = (hexcolor) => {
    hexcolor = hexcolor?.replace('#', '')
    const r = parseInt(hexcolor?.substr(0, 2), 16)
    const g = parseInt(hexcolor?.substr(2, 2), 16)
    const b = parseInt(hexcolor?.substr(4, 2), 16)
    const yiq = (r * 299 + g * 587 + b * 114) / 1000
    const yiqPercent = yiq / 255

    return yiqPercent >= 0.6 ? '#000' : '#FFF'
}


/**
 * Мутирует значение в указанном поле объекта
 * 
 * @param initial - объект, который нужно мутировать
 * @param path - путь к обновляемому значению
 * @param value - значение для обновления
 * @returns мутированный объект с обновленным значением
 */
export const updateObjectByPath = (
    initial: Record<string, any>, 
    path: string | string[], 
    value: any
) => {
    const fields = Array.isArray(path) ? path : path.split('.')

    const updatedSettings = fields.reduceRight((hash, field, i, arr) => {
        return { [field]: i === arr.length - 1 ? hash : { ...hash } }
    }, value);

    return merge(initial, updatedSettings)
}

export const roundNumberToPoint = (val: number, count = 2) => {
    if (val - Math.floor(val) === 0) {
        return val
    }
    const coefficient = Math.pow(10, count)

    return Math.round(val * coefficient) / coefficient
}

/**
 * Функция создания индексов по ключам объектов переданного массива
 * @param sourceData
 * @param indexKeysRules
 */
//TODO: добавить обработку callback функции для возможности индексации в одном проходе с обработкой данных
export const getIndexedData = <TIndexedData /*, TReturnData*/>({
    sourceData,
    indexKeysRules,
    //callback: () => void
}: {
    sourceData: any[],
    indexKeysRules: Record<keyof TIndexedData, 'value' | 'array' >
}): {
    data: TIndexedData,
    keys: Array<keyof TIndexedData>
    //newData: TReturnData[]
} => {
    //sd - sourceData сокращение
    const keys = Object
        .keys(indexKeysRules) as Array<keyof TIndexedData>
    const sdLength = sourceData.length

    const data: TIndexedData = Object.fromEntries(keys.map( key => [key, {}])) as TIndexedData

    for (let sdIndx = 0; sdIndx < sdLength; sdIndx++) {
        const item = sourceData[sdIndx];

        keys.forEach( key => {
            const value = item[key]

            if (indexKeysRules?.[key] == 'value') {
                return data[key][value] = sdIndx
            }

            if (indexKeysRules?.[key] == 'array') {
                return (data[key]?.[value])
                    ? data[key][value].push(sdIndx)
                    : data[key][value] = [sdIndx]
            }
        })
    }

    return {
        data,
        keys
    }
}

// * Функция для изменения яркости цвета 
export function darkenColor(hex, percent) {
    // Убедимся, что hex — это строка без #
    hex = hex?.replace('#', '') ?? 'FFFFFF';

    // Преобразуем HEX в RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Затемняем каждый канал
    const darkenedR = Math.round(r * (1 - percent / 100));
    const darkenedG = Math.round(g * (1 - percent / 100));
    const darkenedB = Math.round(b * (1 - percent / 100));

    // Преобразуем обратно в HEX
    const toHex = (value) => value.toString(16).padStart(2, '0');

    
    return `#${toHex(darkenedR)}${toHex(darkenedG)}${toHex(darkenedB)}`;
}


//*Функция обработки ошибок API
export const responseErrorHandler = ({ response, modal, errorText }: IResponseErrorHandler) => {
    const error: any[] = []

    const chosenErrors = response.error?.errors

    if (chosenErrors !== undefined) {
        Object.keys(chosenErrors)?.map((key) => {
            error.push(chosenErrors[key])
        })

        modal.warning({
            title: errorText,
            content: ErrorMessage(error) ?? 'Неизвестная ошибка',
            style: { zIndex: '9999999999999999999999', },
        
        })
    } else {
        modal.warning({
            title: errorText,
            content: response.error?.message ?? 'Неизвестная ошибка',
            style: { zIndex: '999999999999999999999',  }
        })
    }
}

//*Функция обертки для получения данных о классе из стора по id класса

export const getClassFromClassesStore = (classId: IClass['id']) => {
    const getClassByIndex = useClassesStore.getState().getByIndex('id', classId)
    
    return getClassByIndex
}

//*Функция распарсивания json, которая поможет избежать падения
export const parseJSON = (data: any) => {
    let jsonData;

    try {
        jsonData = JSON.parse(data);
    } catch (error) {
        console.error(`Ошибка парсинга JSON: ${error.message}`);
        // Здесь можно обработать ситуацию с ошибкой
    }

    return jsonData
}
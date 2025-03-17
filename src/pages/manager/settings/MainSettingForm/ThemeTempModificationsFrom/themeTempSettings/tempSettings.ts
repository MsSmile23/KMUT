import { postMediaFiles } from '@shared/api/MediaFiles/Models/postMediaFiles/postMediaFiles';
import { ITempModificat } from '@shared/types/temp-modification';
import { responseErrorHandler } from '@shared/utils/common';
import { Modal } from 'antd';
import dayjs from 'dayjs';
// export const holydayData = [
//     {
//         name: 'Новый Год',
//         beginning: dayjs('12-30'),
//         end: dayjs('01-10'), 
//         picture: 'https://4eli.ru/upload/iblock/a19/a19beadec0607b6c00bb8ac026d0708e.jpg'
//     }, 
//     {
//         name: 'День победы',
//         beginning: dayjs('05-08'),
//         end: dayjs('05-10'), 
//         picture: 'https://kuban.spravedlivo.ru/depot/pict/314/31490214400900.jpg'
//     }
// ]

function isValidUrl(urlString) {
    try {
        new URL(urlString);

        return true; // Valid URL
    } catch (error) {
        return false; // Invalid URL
    }
}

export const validateHolidays = (values: undefined | ITempModificat[], tempModif: any[]) => {
    if (values === undefined) {
        return tempModif
    }
    const valid = values?.filter((el) => {
        if ( el !== null && el?.name.length > 0 && dayjs(el?.beginning).format('D-MMM') !== 'Invalid Date' 
        && dayjs(el?.end).format('D-MMM') !== 'Invalid Date' && isValidUrl(el?.pictureAfterTitle) !== false) {
            return el
        }

    })
    
    return valid
};


export const tempModPictireLoading = async (form) => { 
    const resp = await postMediaFiles({ files: [form.file] });

    if (resp.success) {

        return resp

    } else {
        responseErrorHandler({
            response: resp,
            modal: Modal,
            errorText: 'Ошибка при загрузке файла',
        })
    }
}
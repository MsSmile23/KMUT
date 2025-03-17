import { getMediaFilesById } from '@shared/api/MediaFiles/Models/getMediaFilesById/getMediaFilesById'
import { postMediaFiles } from '@shared/api/MediaFiles/Models/postMediaFiles/postMediaFiles'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { IApiReturn } from '@shared/lib/ApiSPA'
import { IConfig } from '@shared/types/config'
import { getURL } from '@shared/utils/nav'
import { message } from 'antd'
import { NavigateFunction } from 'react-router-dom'

// Обработка запроса
export const responseHandler = (
    resp: IApiReturn<IConfig>, 
    type: 'update' | 'create', 
    navigate: NavigateFunction,
    isHelpsPath?: boolean,
    closeModal?: () => void
) => {
    if (resp.success) {
        message.success(`Страница успешно ${type === 'update' ? 'обновлена' : 'создана'}`)
        isHelpsPath ? navigate(getURL(
            `${ROUTES.NAVIGATION}/${ROUTES.HELPS}/${ROUTES_COMMON.LIST}`,
            'manager'
        ))  : closeModal()
    } else {
        message.error(`Ошибка при ${type === 'update' ? 'обновлени' : 'создани'} страницы`)
    }
}

// Загрузка файла в стор
export const postMedia = async (data) => {
    try {
        const response = await postMediaFiles({ files: [data.file] })
        const id = response.data[0].id

        return id
    } catch (err) {
        console.log('Ошибка добавления: ', err)
        throw err
    }
}

//Скачивание файла
export const downLoadButtonHandler = async (mediaFileId: number, name: string ) => {
    if (mediaFileId) {
        getMediaFilesById({ id: mediaFileId }).then(file => {
            const blob = new Blob([file.data], { type: 'application/pdf' })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')

            a.href = url
            a.download = `Справка ${name}.pdf`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            window.URL.revokeObjectURL(url)
        }).catch(error => {
            console.error('Ошибка загрузки файла:', error)
        })
    } else {
        console.error('Данный файл отсутствует')
    }
}
import { SERVICES_VTEMPLATES } from '@shared/api/vtemplates';
import { requestVtemplate } from './types/types';

export const exportJson = (name: string, data: any) => {
    const fileName = `${name}.json`;
    const contentType = 'application/json;charset=utf-8;';
    const blob = new Blob([JSON.stringify(data)], { type: contentType })
   
    const a = document.createElement('a')

    a.download = fileName
    a.href = window.URL.createObjectURL(blob)
    const clickEvt = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
    })

    a.dispatchEvent(clickEvt)
    a.remove()
}

export const saveWidgetInTab = async (type: requestVtemplate, result: any, id?: number) => {
    try {
        if (type === requestVtemplate.POST) {
            const res = await SERVICES_VTEMPLATES.Models.postVtemplates(result)

            return res
        } else {
            const res = await SERVICES_VTEMPLATES.Models.patchVtemplates(result, id)

            return res
        }
    } catch (e) {
        return false
    }
}

export const trimName = (name: string) => {
    return name.replace(/ /g, '_')
}

export const readJsonFile = <T>(file: Blob) =>
    new Promise<Awaited<Promise<T>>>((resolve, reject) => {
        const fileReader = new FileReader()

        fileReader.onload = event => {
            if (event.target) {
                resolve(JSON.parse(event.target.result as string))
            }
        }

        fileReader.onerror = error => reject(error)
        fileReader.readAsText(file)
    })

export const formatName = (name: string, objectName?: string, id?: string) => {
    if (id === 'undefined') {

        return name.replace(/{object.name}|{object.id}/g, '');
    } else if (name?.includes('{object.name}')) {
        return name.replace('{object.name}', objectName)
    } else if (name?.includes('{object.id}')) {
        return name.replace('{object.id}', id)
    }

    return name
}
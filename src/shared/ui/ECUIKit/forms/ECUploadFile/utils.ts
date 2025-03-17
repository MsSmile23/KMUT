import { postMediaFiles } from '@shared/api/MediaFiles/Models/postMediaFiles/postMediaFiles'
import { addToMediaFilesStore } from '@shared/stores/mediaFiles';

export const findFieldIsImage = (values) => {
    for (const key in values) {
        if (typeof values[key] === 'object') {
            if (values[key]?.isImage && values[key].isImage === true) {
                return true;
            } else {
                if (findFieldIsImage(values[key])) {
                    return true;
                }
            }
        }
    }

    return false;
}

export const uploadImage = async (values, setFieldsValue) => {
    let newValues = null;
    const keysValues = Object.keys(values)

    const uploadedImagesFiles: File[] = keysValues.reduce((uploadedImagesFiles, item) => {

        if (values[item]?.isImage) {
            uploadedImagesFiles.push(values[item].file)   
        }

        return uploadedImagesFiles
    }, [])

    if (uploadedImagesFiles.length > 0) {

        const uploadMediaFiles = await postMediaFiles({ files: uploadedImagesFiles })

        if (uploadMediaFiles.success) {
            const listMediaFilesId = uploadMediaFiles.data.flatMap((mediaFile) => mediaFile.id)

            addToMediaFilesStore(uploadMediaFiles.data)
        
            newValues = keysValues.reduce((newVirtualValues, item) => {
                if (values[item]?.isImage) {
                    newVirtualValues[item] = String(listMediaFilesId.shift())
                } else {
                    newVirtualValues[item] = values[item]
                }

                return newVirtualValues
            }, {})
        }
    }

    if (newValues !== null)  {
        setFieldsValue(newValues)

        return newValues
    }

    return values;
}
import { Dispatch, FC, SetStateAction, useEffect, useMemo, useState } from 'react'
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, Upload } from 'antd';
import './ECUploadFile.scss'
import { useMediaFiles } from '@shared/stores/mediaFiles';

export const ECUploadFile: FC<{
    setFieldValue: (name, value) => void,
    fieldName: string,
    mediaFileId?: number,
    wordLength?: number,
    format?: string[] | undefined, 
    setDisable?: Dispatch<SetStateAction<boolean>>,
    disable?: boolean,
    getFieldValue?: (fieldName) => number
}> = ({ setFieldValue, fieldName, mediaFileId, getFieldValue, wordLength, setDisable, 
    disable, format }) => {

    let props: UploadProps = {};

    const documentFormat = ['.jpg', '.jpeg', '.png', '.svg', '.xls', '.xlsx', '.pdf', '.txt', '.json']

    props = {
        name: 'files',
        maxCount: 1,
        accept: format ? format.join(', ') : documentFormat.join(', '),
    }

    const mediaFilesStore = useMediaFiles()

    const [uploadProps, setUploadProps] = useState<UploadProps>(props)

    useEffect(() => {
        let values = mediaFileId

        if (getFieldValue) {
            values = getFieldValue(fieldName)
        }

        if (typeof values === 'object') {
            return
        }


        if (values && values !== null && typeof values !== 'object') {
            const mediaFileFromStore = mediaFilesStore.getMediaFileById(Number(values))
            const defaultList2 = { fileList: mediaFileFromStore && [{
                uid: `${mediaFileFromStore.id}_uid`,
                name: `${mediaFileFromStore.id}`,
                url: `${import.meta.env.VITE_API_SERVER}${mediaFileFromStore.url}`
            }] 
            }

            return setUploadProps({ ...props, ...defaultList2 })
        }
        
        return setUploadProps(props)
    }, [mediaFileId, mediaFilesStore.store.data.length])

    const onChangeHandler = (info) => {

        if (info.fileList.length > 0) {
            const newProps = { ...props }
          
            info.fileList[0].status = 'success'
            setFieldValue(fieldName, { 
                isImage: true, 
                file: info.file
            })
            newProps.fileList = info.fileList

            if (setDisable) {
                setDisable(false)
            }
            
            if (wordLength !== undefined && wordLength < newProps.fileList[0].name.length 
                || wordLength < newProps.fileList[0].name.length ) {
                const data = newProps.fileList[0].name
                const extensionIndex = data.lastIndexOf('.')
                const extension = extensionIndex !== -1 ? data.slice(extensionIndex) : 0

                newProps.fileList.map((file) => file.name = `${file.name.slice(0, wordLength)}...${extension}`)
            }

            return setUploadProps(newProps)
        }

        return onRemove()
    }
    
    const onRemove = () => {
        if (disable === false) {
            if (setDisable) {
                setDisable(true)
            }
        }
        setFieldValue(fieldName, null)
        setUploadProps({ ...props, ...{ fileList: [], defaultFileList: [] } })
    }

    return (
        <div className="ec-upload-file" key={fieldName}>
            <Upload
                {...uploadProps} 
                style={{ display: 'flex' }} 
                onChange={onChangeHandler}
                onRemove={onRemove}
                beforeUpload={() => false}              
            >
                <Button icon={<UploadOutlined />} />
            </Upload>
        </div>
    )
}
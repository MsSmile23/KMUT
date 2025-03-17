import { BaseButton, Buttons } from '@shared/ui/buttons'
import CodeEditor from '@shared/ui/CodeEditor/CodeEditor'
import { DefaultModal } from '@shared/ui/modals'
import { Divider } from 'antd'
import { FC, useEffect, useState } from 'react'
import { Typography } from 'antd'
import { ECUploadFile } from '@shared/ui/ECUIKit/forms'
import { postMediaFiles } from '@shared/api/MediaFiles/Models/postMediaFiles/postMediaFiles'
import { parseJSON } from '@shared/utils/common'



const { Text } = Typography


interface IOAGeoJSON {
    value?: string;
    onChange?: (value: string) => void;

}
const OAGeoJSON: FC<IOAGeoJSON> = ({ value, onChange }) => {
    const [localValue, setLocalValue] = useState<any>(null)
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [jsonFile, setJsonFile] = useState<any>(null)
    const [mediaFileId, setMediaFileId] = useState<number>(null)
    const handleCancel = () => {
        setIsModalVisible(false)
    }


    useEffect(() => {
        if (value) {
            const data = parseJSON(value)

            if (data?.type == 'file') {
                setMediaFileId(data?.id)
            }
            else {
                setLocalValue(value)
            }

        }
    }, [])


    const submitButtonHandler = () => {
        setIsModalVisible(false)

        if (jsonFile) {
            postMediaFiles({ files: [jsonFile] }).then(resp => {
                if (resp.success) {
                    if (resp.data) {
                        const data = resp?.data[0]

                        onChange(JSON.stringify({
                            type: 'file',
                            id: data.id,
                            url: data.url
                        }))

                        setMediaFileId(data?.id)
                    }
                }
            })
        }
        else {
            onChange(localValue)
        }
    }



    return (
        <>
            <DefaultModal
                width="auto"
                style={{ minWidth: 600 }}
                title="Редактирование координат"
                isModalVisible={isModalVisible}
                handleCancel={handleCancel}
            >
                <Text>Приложите файл с координатами </Text>

                <ECUploadFile
                    setFieldValue={(value, data) => {
                        setJsonFile(data?.file)
                        setLocalValue(null)
                    }}
                    fieldName="geoJSON"
                    mediaFileId={mediaFileId}
                    // getFieldValue={form.getFieldValue}
                />
                <Divider plain>ИЛИ</Divider>

                <Text>Введите координаты в текстовое поле</Text>

                <CodeEditor
                    mnemonic="json"
                    editable={true}
                    placeholder="Введите код"
                    value={localValue}
                    onChange={setLocalValue}
                />
            
                <Buttons.ButtonSubmit
                    style={{ marginTop: '20px', background: 'green' }}
                    color="green"
                    customText="Сохранить координаты"
                    onClick={submitButtonHandler}
                />
            </DefaultModal>
            <BaseButton onClick={() => setIsModalVisible(true)}>GeoJSON</BaseButton>
        </>
    )
}

export default OAGeoJSON
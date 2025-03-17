import { ECModal } from '@shared/ui/modals'
import { FC, useEffect, useRef, useState } from 'react'
import ECTextEditor from '../ECTextEditor/ECTextEditor'
import { Button } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import './ECTemplatedTextInput.css'
import { selectObjectByIndex, useObjectsStore } from '@shared/stores/objects'
import { formatText } from '../utils/utility'
import { selectGetClassById, useClassesStore } from '@shared/stores/classes'

interface IECTemplatedTextViewProps {
    classes: number[]
    object?: number,
    width?: number | string
    onChange?: (value: string) => void,
    preview?: boolean,
    value?: string
}

const ECTemplatedTextInput: FC<IECTemplatedTextViewProps> = ({ 
    classes, 
    object, 
    width = '100%', 
    onChange, 
    preview = false,
    value }) => {
    const classById = useClassesStore(selectGetClassById)
    const getObjectByIndex = useObjectsStore(selectObjectByIndex)

    const [currentValue, setCurrentValue] = useState<string>(value)
    const [openModal, setOpenModal] = useState<boolean>(false)
    const isFirstRender = useRef(true) //Отслеживание первого рендера, чтобы избежать сообщения валидации при открытии

    const formattedText = formatText(value, object, classes, getObjectByIndex, classById)

    //Обнуляем значения, если после форматирования ничего не приходит
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
        } else if (formattedText === '') {
            setCurrentValue('')
            onChange('')
        }
    }, [formattedText])

    useEffect(() => {
        if (value) {
            setCurrentValue(value)
        }
    }, [value])

    const changedValue = (data: string) => {
        setCurrentValue(data)
        onChange(data)
        setOpenModal(false)
    }

    return (
        <>
            <div className="text-input-wraper">
                <input
                    type="text"
                    value={formattedText}
                    style={{ width: width }}
                    // onChange={(e) => changedValue(e.target.value)}
                    className="text-input"
                    disabled={true}
                /> 
                {!preview && 
                    <Button 
                        title="Редактировать текст"
                        onClick={() => setOpenModal(true)}
                        type="primary"
                        color="green"
                        style={{ background: 'green' }}
                        icon={<EditOutlined />} 
                    />}
            </div>
            
            <ECModal 
                title="Редактирование текста" 
                open={openModal} 
                footer={false}
                width="60vw"
                closable={false}
            >
                <ECTextEditor 
                    changedValue={changedValue} 
                    classes={classes} 
                    textValue={currentValue} 
                    object={object} 
                />
            </ECModal>
        </>
    )
}

export default ECTemplatedTextInput
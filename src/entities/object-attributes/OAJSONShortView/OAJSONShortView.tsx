import { BaseButton } from '@shared/ui/buttons'
import CodeEditor from '@shared/ui/CodeEditor/CodeEditor'
import { DefaultModal } from '@shared/ui/modals'
import { ECTooltip } from '@shared/ui/tooltips'
import { Col } from 'antd'
import { FC, useState } from 'react'


interface IOAJSONShortView {
    value: string
}
const OAJSONShortView: FC<IOAJSONShortView> = ({ value }) => {

    const [localValue, setLocalValue] = useState<any>(value)
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const handleCancel = () => {
        setIsModalVisible(false)
    }

    return (

        <>
            <DefaultModal
                width="auto"
                style={{ minWidth: 600 }}
                title="Просмотр атрибута"
                isModalVisible={isModalVisible}
                handleCancel={handleCancel}
            >
                <CodeEditor
                    mnemonic="json"
                    editable={true}
                    placeholder="Введите код"
                    value={localValue}
                    onChange={setLocalValue}
                    disabled
                />
            </DefaultModal>
        
            <Col
                xxl={12}
                xl={18}
                style={{
                    display: 'flex', 
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                }}
            >

                <ECTooltip title="Просмотр атрибута формата JSON">
                    {' '}
                    <BaseButton
                        onClick={() => {
                            setIsModalVisible(true)
                        }}
                    >                 
        JSON
                    </BaseButton>{' '}
                </ECTooltip>
            </Col>

        </>
    )
}

export default OAJSONShortView
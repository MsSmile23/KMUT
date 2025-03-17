import { Col, Row } from 'antd'
import { FC } from 'react'
import { Buttons } from '..'

interface IButtonsFormRow {
    handleUndoChangesButton: () => void
    handleCancelButton: () => void
    handleSaveAndGoToListButton: () => void
    handleSaveAndContinueButton: () => void
    disabled?: boolean
}
export const ButtonsFormRow: FC<IButtonsFormRow> = ({
    handleCancelButton,
    handleSaveAndGoToListButton,
    handleUndoChangesButton,
    handleSaveAndContinueButton,
    disabled = false
}) => {
    return (
        <Row gutter={8}>
            <Col>
                <Buttons.ButtonSubmit
                    color="green"
                    customText="Сохранить и перейти в список"
                    onClick={handleSaveAndGoToListButton}
                    disabled={disabled}
                />
            </Col>
            <Col>
                <Buttons.ButtonSubmit 
                    color="#1890FF" 
                    customText="Сохранить и продолжить" 
                    onClick={handleSaveAndContinueButton}
                    disabled={disabled} 
                />
            </Col>
            <Col>
                <Buttons.ButtonClear 
                    customText="Отмена изменений" 
                    onClick={handleUndoChangesButton} 
                    disabled={disabled}
                />
            </Col>
            <Col>
                <Buttons.ButtonCancel customText="Очистить все поля" onClick={handleCancelButton} disabled={disabled} />
            </Col>
        </Row>
    )
}
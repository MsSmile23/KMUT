import { Button, Col, Row, Typography } from 'antd'
import { FC } from 'react'
import { CheckOutlined, EyeInvisibleOutlined } from '@ant-design/icons'

interface IStepButtonProps {
    openedSteps: Record<string, boolean>
    toggle: (formName: string) => void
    formName: string
    step: number
    title: string
    completed: boolean
    disabled?: boolean
}

/**
 *  Компонент для управления видимостью, завершением и блокировкой шага формы
 *   
 *  @param openedSteps - массив с открытыми шагами 
 *  @param toggle - функция для переключения видимости шага 
 *  @param formName - имя формы 
 *  @param step - номер текущего шага 
 *  @param title - заголовок шага 
 *  @param completed - флаг завершения
 *  @param disabled - флаг блокировки
 */
export const StepButton: FC<IStepButtonProps> = ({ 
    openedSteps, 
    toggle, 
    formName, 
    step, 
    title, 
    completed,
    disabled 
}) => {
    const isOpen = openedSteps[formName] 

    return (
        <Row 
            align="middle" 
            gutter={14} 
            onClick={() => { disabled ? undefined : toggle(formName)}} 
            style={{ userSelect: 'none', cursor: 'pointer', width: 'fit-content' }}
        >
            <Col>
                <Button 
                    shape="circle" 
                    type={completed ? 'default' : 'primary'} 
                    disabled={disabled}
                    style={{ 
                        borderColor: completed ? (disabled ? undefined : 'rgb(22, 119, 255)') : undefined,
                    }}
                >
                    {
                        isOpen
                            ? (completed ? (<CheckOutlined style={{ color: 'rgb(22, 119, 255)' }} />) : (step + 1))
                            : (
                                <EyeInvisibleOutlined 
                                    style={{ 
                                        color: disabled ? undefined : (completed ? 'rgb(22, 119, 255)' : undefined )
                                    }} 
                                />
                            )
                    }
                </Button>
            </Col>
            <Col>
                <Typography.Title level={4} style={{ margin: 0 }}>{title}</Typography.Title>
            </Col>
        </Row>
    )
}
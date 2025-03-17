import { ReportUnformalForm2 } from '@entities/reports/ReportUnformalForm/ReportUnformalForm2'
import { useUnformalStore } from '@entities/reports/ReportUnformalForm/unformalFormStore'
import { useOpen } from '@shared/hooks/useOpen'
import { IClass } from '@shared/types/classes'
import { Button, Modal, message } from 'antd'
import { FC } from 'react'

export const UnformalReportModal: FC<{ classes?: IClass[] } > = ({ classes = [] }) => {
    const modal = useOpen(true)

    const saveTemplate = useUnformalStore(st => st.saveTemplate)
    const [ templateName, templates ] = useUnformalStore(st => [ st.name, st.templateOptions ])
    
    return (
        <>
            <Button onClick={modal.toggle}>Открыть неформализованный отчет</Button>
            <Modal
                title="Настройки неформализованного отчета" 
                open={modal.isOpen}
                onCancel={modal.close}
                footer={[
                    <Button 
                        key="unformal-btn-save"
                        onClick={() => {
                            if (templates.find((t) => t.label === templateName)) {
                                message.error('Данный шаблон уже существует')
                            } else {
                                saveTemplate()
                                message.success('Отчет успешно сохранен')
                                modal.close()
                            }
                        }}
                    >
                        Сохранить
                    </Button>,
                    <Button 
                        key="unformal-btn-close" 
                        onClick={modal.close}
                    >
                        Закрыть
                    </Button>
                ]}
                bodyStyle={{ marginTop: 20 }}
                width="90vw"
            >
                <ReportUnformalForm2 classes={classes} />
            </Modal>
        </>
    )
}
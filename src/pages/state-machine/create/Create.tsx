import { FC } from 'react'
import { Card, Form } from 'antd'
import { PageHeader } from '@shared/ui/pageHeader'
import { breadCrumbs } from './prepare'
// import StateMachineForm from '@entities/state/StateMachineForm'
import StateMachineFormContainer from '@containers/state/StateMachineFormContainer/StateMachineFormContainer'

const Create: FC = () => {
    const [ form ] = Form.useForm()

    return (
        <>
            <PageHeader title="Создание обработчика состояний" routes={breadCrumbs} />
            <Card style={{ marginTop: '10px' }}>
                <StateMachineFormContainer form={form} />
            </Card>
        </>
    )
}

export default Create;
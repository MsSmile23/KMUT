import { Card, Form } from 'antd'
import { useParams } from 'react-router-dom'
import { breadCrumbs } from './prepare'
import { PageHeader } from '@shared/ui/pageHeader/PageHeader'
// import StateMachineForm from '@entities/state/StateMachineForm'
import StateMachineFormContainer from '@containers/state/StateMachineFormContainer/StateMachineFormContainer'

const Update: React.FC = () => {
    const params = useParams()

    const [ form ] = Form.useForm()

    return (
        <>
            <PageHeader title="Редактирование обработчика состояний" routes={breadCrumbs} />
            <Card style={{ marginTop: 20 }}>
                <StateMachineFormContainer form={form} id={Number(params?.id) || 0} />
            </Card>
        </>
    )
}

export default Update
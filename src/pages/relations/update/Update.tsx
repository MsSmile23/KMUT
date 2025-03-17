import RelationFormContainer from '@containers/relations/RelationFormContainer/RelationFormContainer'
import { Card } from 'antd'
import { useForm } from 'antd/es/form/Form'
import Title from 'antd/es/typography/Title'
import { useParams } from 'react-router-dom'
import { breadCrumbs } from './prepare'
import { PageHeader } from '@shared/ui/pageHeader/PageHeader'

const Update: React.FC = () => {
    const params = useParams()
    const id = Number(params?.id)

    const [ form ] = useForm()

    return (
        <>
            {/* <Card>
                <Title level={3}>Редактирование связи</Title>
            </Card> */}
            <PageHeader title="Редактирование связи" routes={breadCrumbs} />
            <Card style={{ marginTop: 20 }}>
                {
                    id 
                        ? (<RelationFormContainer form={form} id={id} /> )
                        : (<Title level={3}>Неправильный id</Title>)
                }
            </Card>
        </>
    )
}

export default Update
import RelationFormContainer from '@containers/relations/RelationFormContainer/RelationFormContainer'
import { PageHeader } from '@shared/ui/pageHeader/PageHeader'
import { Card } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { breadCrumbs } from './prepare'
import { FC } from 'react'

const Create: FC = () => {
    const [ form ] = useForm()

    return (
        <>
            <PageHeader title="Создание связи" routes={breadCrumbs} />
            <Card style={{ marginTop: 20 }}>
                <RelationFormContainer form={form} />
            </Card>
        </>
    )
}

export default Create
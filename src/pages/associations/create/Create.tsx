import RelationFormContainer from '@containers/relations/RelationFormContainer/RelationFormContainer'
import { Card } from 'antd'
import { useForm } from 'antd/es/form/Form'
import Title from 'antd/es/typography/Title'
import React from 'react'

const Create: React.FC = () => {
    const [ form ] = useForm()

    return (
        <>
            <Card>
                <Title level={3}>Создание связи</Title>
            </Card>
            <Card style={{ marginTop: 20 }}>
                <RelationFormContainer form={form} />
            </Card>
        </>
    )
}

export default Create
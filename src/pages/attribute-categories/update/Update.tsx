import AttributeCategoryFormContainer from 
    '@containers/attribute-categories/AttributeCategoryFormContainer/AttributeCategoryFormContainer'
import { Card } from 'antd'
import { FC } from 'react'
import { Typography } from 'antd'
import { useParams } from 'react-router-dom'
import { PageHeader } from '@shared/ui/pageHeader'
import { breadCrumbs } from './prepare'

const { Title } = Typography
const Update: FC = () => {
    const { id } = useParams<{ id?: string }>()

    return (
        <>
          

            <PageHeader title="Создание атрибута категории" routes={breadCrumbs} />
            <Card style={{ marginTop: '10px' }}>
                {/* <ClassesFormContainer /> */}
                <AttributeCategoryFormContainer id={id} />
            </Card>
        </>
    )
}

export default Update
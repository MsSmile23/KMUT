import AttributeCategoryFormContainer from 
    '@containers/attribute-categories/AttributeCategoryFormContainer/AttributeCategoryFormContainer'
import { Card } from 'antd'
import { FC } from 'react'
import { Typography } from 'antd'
import { PageHeader } from '@shared/ui/pageHeader'
import { breadCrumbs } from './prepare'

const { Title } = Typography

const Create: FC = () => {
    return (
        <>

            <PageHeader title="Создание атрибута категории" routes={breadCrumbs} />
            <Card style={{ marginTop: '10px' }}>
                {/* <ClassesFormContainer /> */}
                <AttributeCategoryFormContainer />
            </Card>
        </>
    )
}

export default Create
import { FC } from 'react'
import { Card } from 'antd'
import { PageHeader } from '@shared/ui/pageHeader'
import { breadCrumbs } from './prepare'
import ClassesFormContainer2 from '@containers/classes/ClassesFormContainer2/ClassesFormContainer2'

const Create: FC = () => {
    return (
        <>
            <PageHeader title="Создание класса" routes={breadCrumbs} />
            <Card style={{ marginTop: '10px' }}>
                {/* <ClassesFormContainer /> */}
                <ClassesFormContainer2 />
            </Card>
        </>
    )
}

export default Create
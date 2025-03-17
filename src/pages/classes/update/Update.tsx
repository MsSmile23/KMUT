import { FC } from 'react'
import { useParams } from 'react-router-dom'
import { Card } from 'antd'
import { breadCrumbs } from './prepare'
import { PageHeader } from '@shared/ui/pageHeader'
import ClassesFormContainer2 from '@containers/classes/ClassesFormContainer2/ClassesFormContainer2'

const Update: FC = () => {
    const { id } = useParams<{ id?: string }>()


    return (
        <>
            <PageHeader title="Редактирование класса" routes={breadCrumbs} />
            <Card style={{ marginTop: '10px' }}>
                {/* <ClassesFormContainer id={id} /> */}

                <ClassesFormContainer2 id={id} />
            </Card>
        </>
    )
}

export default Update
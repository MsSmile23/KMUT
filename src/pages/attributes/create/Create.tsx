import AttributesFormContainer from '@containers/attributes/AttributesFormContainer/AttributesFormContainer'
import { Card, Form } from 'antd'
import { breadCrumbs } from './prepare'
import { PageHeader } from '@shared/ui/pageHeader/PageHeader'
import { useNavigate } from 'react-router-dom'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { getURL } from '@shared/utils/nav'

const Create: React.FC = () => {
    const [ form ] = Form.useForm()

    const nav = useNavigate()

    return (
        <>
            <PageHeader title="Создание атрибута" routes={breadCrumbs} />
            <Card style={{ marginTop: 20 }}>
                <AttributesFormContainer 
                    form={form} 
                    onSubmit={() => nav(getURL(
                        `${ROUTES.ATTRIBUTES}/${ROUTES_COMMON.LIST}`,
                        'constructor'
                    ))} 
                    // onSubmit={() => nav(`/${ROUTES.ATTRIBUTES}/${ROUTES_COMMON.LIST}`)} 
                />
            </Card>
        </>
    )
}

export default Create
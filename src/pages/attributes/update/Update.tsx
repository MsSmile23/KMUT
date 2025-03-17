import AttributesFormContainer from '@containers/attributes/AttributesFormContainer/AttributesFormContainer'
import { Card, Form } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { breadCrumbs } from './prepare'
import { PageHeader } from '@shared/ui/pageHeader/PageHeader'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { getURL } from '@shared/utils/nav'

const Update: React.FC = () => {
    const params = useParams()
    const nav = useNavigate()

    const [ form ] = Form.useForm()

    return (
        <>
            <PageHeader title="Редактирование атрибута" routes={breadCrumbs} />
            <Card style={{ marginTop: 20 }}>
                <AttributesFormContainer 
                    form={form} 
                    id={Number(params?.id) || 0}
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

export default Update
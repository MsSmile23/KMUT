import { ButtonSubmit } from '@shared/ui/buttons'
import { FC, useState } from 'react'
import { IAttributeCategory } from '@shared/types/attribute-categories';
import { SERVICES_ATTRIBUTE_CATEGORIES } from '@shared/api/AttributeCategories';
import { FormInstance, Modal } from 'antd';
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths';
import { useNavigate } from 'react-router-dom';
import { getURL } from '@shared/utils/nav';
import { responseErrorHandler } from '@shared/utils/common';

interface IAttributeCategoriesSubmitButton {
    isLoading?: false,
    form: FormInstance<any> | undefined,
    id?: string | undefined,
}

const AttributeCategoriesSubmitButton: FC<IAttributeCategoriesSubmitButton> = ({
    isLoading,
    form,
    id,
}) => {
    const [localIsLoading, setLocalIsLoading] = useState(false)

    const navigate = useNavigate()
    const handleSubmit = async (values: IAttributeCategory) => {
        if (isLoading === undefined) { setLocalIsLoading(true) }


        const response = id
            ? await SERVICES_ATTRIBUTE_CATEGORIES.Models.patchAttributeCategoryById(id, values)
            : await SERVICES_ATTRIBUTE_CATEGORIES.Models.postAttributeCategories(values)

        if (response.success) {
            Modal.success({
                content: `Категория атрибута успешно ${
                    id ? 'отредактирована' : 'создана'
                } `,
            })
            navigate(getURL(
                `${ROUTES.ATTRIBUTE_CATEGORIES}/${ROUTES_COMMON.LIST}`, 
                'constructor'
            ))
            // navigate(`/${ROUTES.ATTRIBUTE_CATEGORIES}/${ROUTES_COMMON.LIST}`)
        }
        else {
            responseErrorHandler({
                response: response,
                modal: Modal,
                errorText: `Ошибка при ${id ? 'редактировании' : 'создании'} категории атрибута`,
            })
        }

        if (isLoading === undefined) { setLocalIsLoading(false) }
    }

    return (
        <ButtonSubmit
            loading={isLoading !== undefined ? isLoading : localIsLoading}
            onClick={() => form ? handleSubmit( form.getFieldsValue(true) ) : null}
        />
    )
}

export default AttributeCategoriesSubmitButton
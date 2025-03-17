import { useEffect, useState, FC } from 'react'
import { Form } from 'antd'

import { Forms } from '@shared/ui/forms'

import { SERVICES_CLASS_STEREOTYPES } from '@shared/api/ClassStereotypes'

interface IClassStereotypesSelect {
    package_id: number
    disabled?: boolean
    name: string
}

const ClassStereotypesSelect: FC<IClassStereotypesSelect> = ({
    package_id,
    disabled,
    ...props
}) => {
    const [packagesStereotypesOptions, setStereotypesOptions] = useState<any>([])

    useEffect(() => {
        const getStereotypes = async () => {
            const { data } = await SERVICES_CLASS_STEREOTYPES.Models.getClassStereotypes({ all: true })
            const filteredDataByPackageID = data?.filter(
                (item) => item.package_id === package_id
            )
            const options = filteredDataByPackageID?.map((item) => ({
                value: item.id,
                label: item.name,
            }))

            setStereotypesOptions(options)
        }

        getStereotypes()
    }, [package_id])

    return (
        <Form.Item label="Стереотип" {...props}>
            <Forms.Select
                options={packagesStereotypesOptions}
                placeholder="Стереотип"
                disabled={disabled}
            />
        </Form.Item>
    )
}

export default ClassStereotypesSelect
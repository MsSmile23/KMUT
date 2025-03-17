import { useEffect, useState, FC } from 'react'
import { Form } from 'antd'
import { Forms } from '@shared/ui/forms'

import { SERVICES_PACKAGES } from '@shared/api/Packages'

interface IPackageSelect {
    name?: string
    required?: boolean
    style?: any
}

const PackageSelect: FC<IPackageSelect> = ({ style, ...props }) => {
    const [packagesOptions, setPackagesOptions] = useState<any>([])

    useEffect(() => {
        const getPackages = async () => {
            const response = await SERVICES_PACKAGES.Models.getPackages()
            const options = response.data?.map((item) => ({
                value: item.id,
                label: item.name,
            }))

            setPackagesOptions(options)
        }

        getPackages()
    }, [])

    return (
        <Form.Item label="Пакет" {...props}>
            <Forms.Select options={packagesOptions} placeholder="Нет" style={style} />
        </Form.Item>
    )
}

export default PackageSelect
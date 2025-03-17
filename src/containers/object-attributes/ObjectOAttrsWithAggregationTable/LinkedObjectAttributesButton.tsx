import { InfoCircleOutlined } from '@ant-design/icons'
import { IAttr } from '@containers/attributes/ObjectOAttrsWithHistory/ObjectOAttrsWithHistory'
import { OAButtonInfo } from '@features/objects/OAButtonInfo/OAButtonInfo'
import { useToggle } from '@shared/hooks/useToggle'
import { IObjectAttribute } from '@shared/types/objects'
import { BaseButton } from '@shared/ui/buttons'
import { FC } from 'react'

export const LinkedObjectAttributesButton: FC<{
    oattributes?: IObjectAttribute[]
}> = ({ oattributes }) => {
    const modal = useToggle()

    const attrsIds: IAttr[] = oattributes.map((oa) => ({ 
        oa, 
        id: oa.id,
        sort_order: 0,
        viewTypeId: 0,
        viewType: '' 
    }))

    return (
        <>
            <BaseButton 
                shape="circle" size="small" 
                icon={<InfoCircleOutlined />}
                onClick={modal.open} 
            />
            <OAButtonInfo
                key="linked-object-modal-info"
                open={modal.isOpen} 
                toggleModalInfoIsVisible={modal.toggle}
                attrIds={attrsIds}                                                
            /> 
        </>
    )
}
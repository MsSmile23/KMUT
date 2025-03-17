import { DefaultModal2 } from '@shared/ui/modals/DefaultModal2/DefaultModal2'
import AttributesViewContainer from '../../AttributesViewContainer/AttributesViewContainer'

export const AttributeModal = ({ isObjectShow, setIsObjectShow }) => {

    const handleCancel = () => {
        setIsObjectShow({ ...isObjectShow, status: false })
    }

    const data = `${isObjectShow.objectName ?? ''} [${isObjectShow.id ?? ''}]
    класса ${isObjectShow.className ?? '' } [${isObjectShow.classId ?? '' }]`

    return (
        <DefaultModal2
            open={isObjectShow.status}
            onCancel={handleCancel}
            destroyOnClose
            footer={null}
            tooltipText={`Аттрибуты объекта ${data}`}
        >
            <AttributesViewContainer
                id={isObjectShow.id}
                classId={isObjectShow.classId}
            />
        </DefaultModal2>
    )
}
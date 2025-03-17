import { OAView } from '@entities/objects/OAView/OAView'

const ObjectInfoModal = ({ objectAttribute }) => {
    return (
        <>
            {objectAttribute.map(object_attribute => {
                return (
                    <div key={object_attribute.id}>
                        {object_attribute.attribute.name}: 
                        <OAView
                            enableStateText 
                            objectAttribute={object_attribute}
                        />
                    </div>
                )
            })}
        </>
    )
}

export default ObjectInfoModal
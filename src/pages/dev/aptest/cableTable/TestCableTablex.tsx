import ObjectCableTable from '@entities/objects/ObjectCableTable/ObjectCableTable'
import { useObjectsStore } from '@shared/stores/objects'
import WrapperWidget from '@shared/ui/wrappers/WrapperWidget/WrapperWidget'
import { FC } from 'react'

export const TestCableTable: FC = () => {
    const objects = useObjectsStore(st => st.store.data)

    return (
        <WrapperWidget>
            <ObjectCableTable
                cableClasses={[10066, 10064]}
                relationsCablePort={[10211, 10017, 10013]}
                relationsPortDevice={[
                    10012, 10057, 10058, 10059, 10060, 10061, 10062, 10063, 10064, 10065, 10066, 10067, 10068, 10069,
                    10070, 10071, 10072, 10073, 10074, 10075, 10142, 10143, 10144, 10145, 10146, 10147, 10148, 10149,
                    10150, 10151, 10152, 10153, 10154, 10155, 10156, 10157, 10158, 10159, 10160,
                ]}
                height={800}
                columnsAttributesIds={[10101, 10041, 207]}
                upDownAttributeId={10101}
                scroll={{ x: 3000 }}
                attributeIdPortName={47}
                parentObject={objects.find((obj) => obj.id === 10053)}
                childClsIds={[10056, 10105, 10058, 10082]}
                targetClsIds={[
                    10061, 10071, 10072, 10073, 10074, 10075, 10076, 10077, 10078, 10079, 10080, 42, 10084, 10085,
                    10087, 40, 10088, 10089, 10090, 10086,
                ]}
                locationVisibleClassesIds={[10056, 10105]}
            />
        </WrapperWidget>
    )
}
import { getProbes } from "@shared/api/Actions/Models/getProbes/getProbes"
import { useApi2 } from "@shared/hooks/useApi2"
import { ECLoader } from "@shared/ui/loadings"
import { useEffect, useMemo } from "react"
import './OAForceMeas.css'
import ObjectList from "./ObjectList/ObjectList"
import { transformData } from "./utils"

const OAForceMeas = ({
    objectAttributeIds,
    objectId
}: {
    objectAttributeIds?: number[] 
    objectId: number[] 
}) => {

    const getProbesById = useApi2(getProbes, { onmount: false })

    useEffect(() => {
        objectId && getProbesById.request(objectId)
    }, [objectId])

    const transformedData = useMemo(() => transformData(getProbesById?.data), [getProbesById.data])

    return (
        <>
            {((getProbesById?.data.length < 1) || getProbesById.loading)
                ?
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    margin: '50px'
                }}>
                    <div>Получаем данные по доступным измерениям</div>
                    <ECLoader size="large" />
                </div>
                : <ObjectList objectAttributeFilter={objectAttributeIds} data={transformedData || null} />
            }
        </>
    )
}

export default OAForceMeas
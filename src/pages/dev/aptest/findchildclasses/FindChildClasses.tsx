/* eslint-disable */

import { getClasses } from "@shared/api/Classes/Models/getClasses/getClasses"
import { getRelations } from "@shared/api/Relations/Models/getRelations/getRelations"
import { useApi2 } from "@shared/hooks/useApi2"
import { IClass } from "@shared/types/classes"
import { IRelation, relationsTypes } from "@shared/types/relations"
import { findChildsByBaseClasses } from "@shared/utils/classes"



export const FindChildClassesComponent: React.FC = () => {
    const relations = useApi2(getRelations)
    const classes = useApi2(getClasses)
    const found = findChildsByBaseClasses({ relations: relations.data, classIds: [10104], depth: 1 })
    const names = found.map((id) => {
        const f = classes.data.find((cls) => cls.id === id)

        return `${f?.name} - ${f?.id}`
    })

    console.log("found", found)
    console.log('found names', names)

    return (
        <div style={{ padding: 12 }}>
            findChildsByBaseClasses
        </div>
    )
}
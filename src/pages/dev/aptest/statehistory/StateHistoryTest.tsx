import { ObjectStateHistory } from "@entities/states/ObjectStateHistory/ObjectStateHistory"
import { FC } from "react"

export const TestHistoryTest: FC = () => {
    const settings = {
        "entityId": 12357,
        "targetEntity": "object"
    } as const

    return (
        <ObjectStateHistory settings={settings} />
    )
}
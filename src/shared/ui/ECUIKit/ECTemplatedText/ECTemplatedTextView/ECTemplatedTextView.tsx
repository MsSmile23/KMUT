import { FC } from 'react'
import { selectGetClassById, useClassesStore } from '@shared/stores/classes'
import { selectObjectByIndex, useObjectsStore } from '@shared/stores/objects'
import { formatText } from '../utils/utility'

interface IECTemplatedTextViewProps {
  classes: number[]
  object: number
  value: string
}

const ECTemplatedTextView: FC<IECTemplatedTextViewProps> = ({ classes, object, value }) => {
    const classById = useClassesStore(selectGetClassById)
    const getObjectByIndex = useObjectsStore(selectObjectByIndex)

    const formattedText = formatText(value, object, classes, getObjectByIndex, classById)

    return formattedText
}

export default ECTemplatedTextView
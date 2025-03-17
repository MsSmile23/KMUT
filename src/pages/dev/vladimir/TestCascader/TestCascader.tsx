import { TargetLinkingClassesForm } from '@containers/classes/TargetLinkingClassesForm/TargetLinkingClassesForm'
import { FC, useState } from 'react'

export const TestCascader: FC = () => {
    const classes = [
        {
            target: [10055],
            linking: [10056, 10105]
        },
        {
            target: [300],
            linking: [10105]
        },
    ]
    const [cls, setCls] = useState(classes)

    const getFormValues = (values) => {
        setCls(values.classes)
    }
    const buttonStyles: React.CSSProperties = {
        width: 64,
        height: 40,
        backgroundColor: '#26ADE4',
        color: 'white',
        fontSize: 25
    } 

    console.log('cls', cls)

    return (
        <div>
            <TargetLinkingClassesForm 
                classes={classes}   
                getFormValues={getFormValues} 
                styles={{
                    button: buttonStyles
                }}
            />
        </div>
    )
}
import { useEffect, useState } from 'react'

export const Timer = ({ title }: { title: string }) => {
    const [time, setTime ] = useState(0)

    useEffect(() => {
        const id: any = setInterval(() => {
            setTime(Date.now())
        }, 1000)

        return () => {
            clearInterval(id)
        }
    }, [])
    
    return (
        <div>
            {title} | {new Date(time).toLocaleString()}
        </div>

    )
}
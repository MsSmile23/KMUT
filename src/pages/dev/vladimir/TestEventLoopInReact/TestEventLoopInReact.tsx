import { FC, useEffect, useState } from 'react';

export const TestEventLoopInReact: FC = () => {

    const [loading, setLoading] = useState<'idle'|'loading'|'finished'>('idle')
    const [counter, setCounter] = useState(0)
    // console.log('counter', counter)

    const setCurrentLoading = (status: 'idle'|'loading'|'finished') => {
        console.log('status', status)
        setLoading(prev => status)
    }

    const increase = () => {
        setCurrentLoading('loading')
        // console.log('sync loading')
        longTask()
        setTimeout(() => {
            setCounter(prev => prev + 1)
            console.log('increase counter', counter)
        }, 2000)
    }
    const longTask = () => {
        setTimeout(() => {
            console.log('long task')
            console.log('long counter', counter)
            setCurrentLoading('finished')
        }, 2000)
    }

    // useEffect(() => {
    //     // queueMicrotask(() => setCurrentLoading('loading'))
    //     setCurrentLoading('loading')
    //     // console.log('sync loading')
    //     longTask()
    //     // queueMicrotask(() => setCurrentLoading('finished'))
    //     // setCurrentLoading('finished')
    //     // console.log('sync finished')
    // }, [counter])

    return (
        <>
            <div
                onClick={increase}
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 50,
                    height: 50,
                    backgroundColor: 'red',
                    fontSize: 40,
                    lineHeight: '50px',
                    cursor: 'pointer'
                }}
            >
                +
            </div>
            {loading !== 'idle' && loading === 'loading' 
                ? (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 200,
                        height: 50,
                        backgroundColor: 'green',
                        // fontSize: 40,
                        // lineHeight: '50px',
                    }}
                >
                    loading
                </div>
            ) : (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 50,
                        height: 50,
                        backgroundColor: 'blue',
                        fontSize: 40,
                        lineHeight: '50px',
                    }}
                >
                    {counter}
                </div>
            )}
        </>
    )
}
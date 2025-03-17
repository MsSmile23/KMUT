import { useState } from 'react'

export const useBool = (initial = false) => {
    const [ state, setState ] = useState(initial)
    
    return [
        state,
        {
            setTrue: () => setState(true),
            setFalse: () => setState(false),
            toggle: () => setState(o => !o)
        }
    ] as const
}
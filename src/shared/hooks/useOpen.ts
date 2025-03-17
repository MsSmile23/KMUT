import { useState } from 'react'

export const useOpen = (initial?: boolean) => {
    const [ isOpen, setOpen ] = useState(initial ?? false)
    
    const open = () => setOpen(true)
    const close = () => setOpen(false)
    const toggle = () => setOpen(o => !o)

    return {
        isOpen,
        open,
        close,
        toggle
    } as const
}
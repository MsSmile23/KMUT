import { useState, useEffect } from 'react'

export const useModalWidth = (width: string | number) => {
    const [ modalWidth, setModalWidth ] = useState(width)

    useEffect(() => {
        if (width) {
            return
        }

        const w = document.body.getBoundingClientRect().width

        setModalWidth(() => {
            if (w < 480) {
                return '90%'
            }

            if (w < 768) {
                return '90%'
            }

            if (w < 992) {
                return '80%'
            }

            if (w < 1200) {
                return '80%'
            }

            if (w < 1600) {
                return '80%'
            }

            if (w < 1920) {
                return '60%'
            }

            return '40%'
        })
    }, [width])

    return modalWidth
}
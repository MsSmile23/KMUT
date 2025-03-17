// import { themes } from '@app/themes/projectTheme'
// import { IThemes } from '@app/themes/types'
import { ROUTES } from '@shared/config/paths'
import { generalStore } from '@shared/stores/general'
import { selectSetThemeName, useThemeStore } from '@shared/stores/theme'
import CustomPreloader from '@shared/ui/preloader/CustomPreloader'
import { FC, PropsWithChildren, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const IntitalLoadProvider: FC<PropsWithChildren> = ({ children }) => {
    const [endGeneralLoad, setEndGeneralLoad] = generalStore((state) => [
        state.endGeneralLoad,
        state.setEndGeneralLoad
    ])
    const [fetchData, data] = generalStore((state) => [
        state.fetchData,
        state.store.data
    ])
    const setThemeName = useThemeStore(selectSetThemeName) 
    const navigate = useNavigate()

    useEffect(() => {
        fetchData()
        setEndGeneralLoad(true)
    }, [])

    useEffect(() => {
        setThemeName(data.project_mnemo)
    }, [data.project_mnemo])

    useEffect(() => {
        if (endGeneralLoad) {
            navigate(`/${ROUTES.AUTH}/${ROUTES.LOGIN}`)
        }
    }, [endGeneralLoad])

    if (!endGeneralLoad) {
        return (
            <div style={{ position: 'absolute', top: '50%', left: '50%' }}>
                <CustomPreloader size="large" /><br /><br />
                Идёт загрузка данных ...
            </div >
        )
    }

    return <div>{children}</div>
}
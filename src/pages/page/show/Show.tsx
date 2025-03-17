import VtemplateView from '@containers/vtemplates/VtemplateFormContainer/components/VtemplateView'
import { getThemeText } from '@shared/config/text'
import { selectThemeName, useThemeStore } from '@shared/stores/theme'
import { ECPage404 } from '@shared/ui/ECUIKit/errors/ECPage404/ECPage404'
import { FC, useEffect } from 'react'
import { useGetDynamicVtemplate } from '../../../shared/hooks/useGetDynamicVtemplate'
import { TPage } from '@shared/types/common'
import { useDocumentTitle } from '@shared/hooks/useDocumentTitle';
import { useLayoutSettingsStore } from '@shared/stores/settingsLayout'
import VtemplateMobileView from '@app/vtemplateMobile/VtemplateMobileView'

export const Show: FC = () => {
    const { isDynamicIdx, vtemplate, object, page } = useGetDynamicVtemplate()
    const theme = useThemeStore(selectThemeName)

    const ShowCaseComponent: FC = page?.component

    const { setFullScreen } = useLayoutSettingsStore()

    useEffect(() => {
        if (page?.fullScreen) {
            setFullScreen(true)
        } 
    }, [page])


    useDocumentTitle(page?.name ?? theme.title)

    const defaultWidget = () => {
        if (page?.component !== undefined) {
            return (
                <ShowCaseComponent />
            )
        } else if (vtemplate !== undefined) {
            const isMobileVtemplate = vtemplate?.params?.dataToolbar?.purpose === 3 
            || vtemplate?.params?.dataToolbar?.purpose === 4

            return isMobileVtemplate 
                ? <VtemplateMobileView vtemplate={vtemplate} /> 
                : (
                    <VtemplateView
                        vtemplate={vtemplate}
                        objectId={object?.id}
                        page={page as TPage}
                    />
                )
        } else {
            // Если нет макета, то показываем страницу 404 с информацией о макете
            return <ECPage404 text={getThemeText({ theme, message: 'vtemplate404' })} />
        }
    }

    // проверяем, есть ли настройка конкретной страницы (роута)
    return isDynamicIdx > -1
        ? defaultWidget()
        : (
            // Если нет страницы, то показываем страницу 404 с информацией о странице
            <ECPage404 text={getThemeText({ theme, message: 'page404' })} />

        )
}
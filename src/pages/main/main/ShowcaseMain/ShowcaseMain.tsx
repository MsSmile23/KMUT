import { Col } from 'antd'
import { getVtemplate } from '@shared/utils/vtempaltes'
import { FC, useLayoutEffect, useState } from 'react'
import { useTheme } from '@shared/hooks/useTheme'
import { useDocumentTitle } from '@shared/hooks/useDocumentTitle'
import { useAccountStore } from '@shared/stores/accounts';
import { useNavigate } from 'react-router-dom';
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths';
import { getURL } from '@shared/utils/nav'
import { useGetDynamicVtemplate } from '@shared/hooks/useGetDynamicVtemplate'
import VtemplateView from '@containers/vtemplates/VtemplateFormContainer/components/VtemplateView'
import { TPage } from '@shared/types/common'

export const ShowcaseMain = () => {
    const { isDynamicIdx, vtemplate, object, page } = useGetDynamicVtemplate()

    // const getCurrentTheme = generalStore((state) => state.getCurrentTheme)
    // const theme = themes.mishk.vtemplates
    // const [getThemeSettings] = themeStore((state) => [state.getThemeSettings])
    // const { dashboards } = theme
    const theme = useTheme()

    const ShowCaseComponent: FC = getVtemplate({ type: theme?.vtemplates?.dashboards, page: 'main' }).component

    useDocumentTitle(page?.name ?? theme.title)

    const userData = useAccountStore(st => st.store.data.user)
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(true)

    useLayoutEffect(() => {
        if (userData?.settings?.maketsDefault) {
            // navigate(`/${ROUTES.INFOPANELS}/${ROUTES_COMMON.SHOW}/${userData?.settings?.maketsDefault}`)
            navigate(getURL(
                `${ROUTES.INFOPANELS}/${ROUTES_COMMON.SHOW}/${userData?.settings?.maketsDefault}`,
                'showcase'
            ))

            return
        }
        setIsLoading(false)
    }, [])

    return (
        <Col span={24} style={{ /* padding: '10px' */ }}>
            {!isLoading && isDynamicIdx > -1 && vtemplate
                ? (
                    <VtemplateView
                        vtemplate={vtemplate}
                        objectId={object?.id}
                        page={page as TPage}
                    />
                ) : (
                    <ShowCaseComponent /> 
                )}
        </Col>
    )
}
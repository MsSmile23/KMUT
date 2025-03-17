import { PageHeader } from '@shared/ui/pageHeader'
import { FC, PropsWithChildren } from 'react'
import { useParams } from 'react-router'
import { breadCrumbs } from './prepare'
import ObjectCardContainer from '@containers/objects/ObjectCardContainer/ObjectCardContainer'
import { Card, Flex, Spin } from 'antd'
import VtemplateView from '@containers/vtemplates/VtemplateFormContainer/components/VtemplateView'
import { useObjectVTemplate } from '@shared/hooks/useObjectVTemplate'
import { useTheme } from '@shared/hooks/useTheme'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import vtemplates from '@containers/vtemplates'

const Show: FC = () => {
    const { id } = useParams<{ id?: string }>()

    const vTemplate = useObjectVTemplate(Number(id))

    // console.log('vtemplate888', vTemplate)

    const getTitle = () => {
        if (vTemplate.isLoaded && vTemplate.object?.name) {
            return vTemplate.object?.name
        }

        if (vTemplate.isLoaded) {
            return 'Объект не найден'
        }

        return `Загружаем данные по объекту ${id}`
    }

    if (vTemplate?.object?.name) {
        document.title = getTitle()
    }
    
    return (
        <VTemplateLoadingWrapper id={id} isLoaded={vTemplate.isLoaded}>
            <VTemplateChecking
                id={id}
                title={getTitle()}
                isVTemplateExist={vTemplate.vTemplate !== undefined && vTemplate.vTemplate !== null}
                isVtemplateObjectExist={vTemplate.object !== undefined && vTemplate.object !== null}
            >
                <VtemplateView key={id} vtemplate={vTemplate.vTemplate} objectId={vTemplate.object?.id} />
            </VTemplateChecking>
        </VTemplateLoadingWrapper>
    )

    /* return (
        vTemplate.isLoaded 
            ? vTemplate.vTemplate !== undefined && vTemplate.vTemplate !== null
                ? (
                    <VtemplateView
                        key={id}
                        vtemplate={vTemplate.vTemplate}
                        objectId={vTemplate.object?.id}
                    />
                )
                : vTemplate.object
                    ? (
                        <>
                            <PageHeader
                                title={getTitle()}
                                routes={breadCrumbs}
                            />
                            <Card key={id} style={{ marginTop: 20 }}>
                                <ObjectCardContainer id={id} />
                            </Card>
                        </>
                    ) 
                    : null

            : (
                <Flex
>>>>>>> 6cc4817f7a63e481a761c3601489afa69da4703a
                    key={id}
                    style={{ marginTop: 20, color: color ?? '#000000', background: background ?? '#ffffff' }}
                >

                    <Spin />
                </Flex>
            )
    ) */
}

const VTemplateLoadingWrapper: FC<
    PropsWithChildren<{
        id: string
        isLoaded: boolean
    }>
> = ({ children, isLoaded, id }) => {
    return isLoaded ? (
        children
    ) : (
        <Flex
            key={id}
            justify="center"
            align="center"
            style={{
                height: '70vh',
            }}
        >
            <Spin />
        </Flex>
    )
}

interface VTemplateCheckingProps extends VTemplateObjectCheckingProps {
    isVTemplateExist: boolean
}
const VTemplateChecking: FC<PropsWithChildren<VTemplateCheckingProps>> = ({
    children,
    isVTemplateExist,
    isVtemplateObjectExist,
    id,
    title,
}) => {
    return isVTemplateExist ? (
        children
    ) : (
        <VTemplateObjectChecking id={id} title={title} isVtemplateObjectExist={isVtemplateObjectExist} />
    )
}

interface VTemplateObjectCheckingProps {
    id: string
    title: string
    isVtemplateObjectExist: boolean
}
const VTemplateObjectChecking: FC<VTemplateObjectCheckingProps> = ({ id, title, isVtemplateObjectExist }) => {
    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode

    const color = createColorForTheme(theme?.textColor, theme?.colors, themeMode)
    const background = createColorForTheme(theme?.widget?.background, theme?.colors, themeMode)
    const marginTop = theme?.paddings?.verticalWidgetPadding?.value

    return isVtemplateObjectExist ? (
        <>
            <PageHeader title={title} routes={breadCrumbs} />
            <Card
                key={id}
                style={{
                    marginTop: marginTop || 20,
                    color: color ?? '#000000',
                    background: background ?? '#ffffff',
                    border: themeMode == 'dark' ? 'none' : '1px solid #f0f0f0',
                }}
            >
                <ObjectCardContainer id={id} />
            </Card>
        </>
    ) : null
}

export default Show
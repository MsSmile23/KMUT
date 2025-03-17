/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-max-depth */
import { Col, ConfigProvider, Image, Layout, Menu, Slider, Typography, } from 'antd';
import { useNavigate } from 'react-router';
import { FC, PropsWithChildren, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Footer, Header } from 'antd/es/layout/layout';
import { TestObjectTree } from '@pages/dev/vladimir/TestObjectTree/TestObjectTree';
import { UniversalSearch } from '@containers/search/UniversalSearch/UniversalSearch';
import Sider from 'antd/es/layout/Sider';
import { useLayoutSettingsStore } from '@shared/stores/settingsLayout';
import { TypeBlock, VisibleBlock } from '@containers/settings/layout/LayoutSettings';
import { InterfaceMenuShowcase } from '@app/interfaceViews/interfaceMenuShowcase';
import { useTheme } from '@shared/hooks/useTheme';
import { ButtonMenu } from '@shared/ui/buttons/ButtonMenuUnfold/ButtonMenuUnfold';
import { Link, useLocation } from 'react-router-dom';
import * as Icons from '@ant-design/icons';
import { treeWidgetHeight } from '@containers/objects/ObjectTree/utils';
import { Timer } from '@shared/ui/timer/Timer';
import { SiderMenu } from './SiderMenu';
import { DefaultLogo } from '@shared/ui/icons/DefaultLogo';
import { ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView';
import { isNewYearPeriod } from '@shared/utils/datetime';
import { ECTooltip } from '@shared/ui/tooltips/ECTooltip';
import { getURL } from '@shared/utils/nav';
import { patchAccountById } from '@shared/api/Accounts/Models/patchAccountById/patchAccountById';
import { zIndex } from '@shared/config/zIndex.config';
import { useDebounceCallback } from '@shared/hooks/useDebounce';
import { CustomDragIcon } from './CustomDragIcon';
// import { getPaddings } from '@shared/utils/Theme/theme.utils';
import { ECButtonReset } from '@shared/ui/ECUIKit/buttons/ECButtonReset/ECButtonReset';
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { useConfigStore } from '@shared/stores/config';
import { ILocalTheme } from '@app/themes/types';
import { jsonParseAsObject } from '@shared/utils/common'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils';
import { getMediaFileUrlById, selectMediaFile, useMediaFiles } from '@shared/stores/mediaFiles';
import { useWindowResizeCallback } from '@shared/hooks/useWindowResizeCallback';
import { selectThemeName, useThemeStore } from '@shared/stores/theme';
import { SERVICES_ACCOUNTS } from '@shared/api/Accounts';
import { LayoutQuickTreeWrapper } from './components/LayoutQuickTreeWrapper/LayoutQuickTreeWrapper';
import { useTreeStore } from '@shared/stores/trees';
import { ITreeStore } from '@containers/objects/ObjectTree/treeTypes';
import { LayoutChildTreeWrapper } from './components/LayoutChildTreeWrapper/LayoutChildTreeWrapper';
import ReportsDownloadWithDrawer from '@features/reports/ReportsDownloadWithDrawer/ReportsDownloadWithDrawer';
const { Content } = Layout

const getPaddings = (paddings, paddingMnemo: keyof Omit<ILocalTheme['paddings'], 'basePadding'>) => {
    if (paddings?.[paddingMnemo]?.isActive) {
        return paddings?.[paddingMnemo]?.value
    }

    return paddings?.basePadding ?? 0
}

const customDragIconSize = 15

export const DefaultLayout: FC<PropsWithChildren> = ({ children }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const windowSizes = useWindowResizeCallback()
    const accountData = useAccountStore(selectAccount)
    const currentTheme = useThemeStore(selectThemeName)
    const theme = useTheme()


    const themeWidth = theme?.sideBar?.width ?? 300
    const getFile = useMediaFiles(st => st.getMediaFileById)
    const themeMode = accountData?.user?.settings?.themeMode
    const getConfig = useConfigStore(st => st.getConfigByMnemo)
    const config = jsonParseAsObject(getConfig('front_settings')?.value)
    const getPaddingsFromStore = useCallback(() => {
        const frontSettings = jsonParseAsObject(useConfigStore.getState().getConfigByMnemo('front_settings')?.value)

        return frontSettings?.paddings
    }, [])

    // eslint-disable-next-line max-len
    const [paddings, setPaddings] = useState(getPaddingsFromStore())

    // Показывать ли дочернее дерево
    const showChildTree = config?.tree?.treeShowChildTree || false;

    const updatePaddings = async () => {
        await useConfigStore.getState().fetchData()
        setPaddings(getPaddingsFromStore())
    }

    const siderPaddingLeft = '24px'
    const headerFooterHeight = '60px'

    const { fullScreen, hideMenu, dataLayout, setDataLayout, setHideMenu } = useLayoutSettingsStore(st => ({
        fullScreen: st.fullScreen,
        hideMenu: st.hideMenu,
        dataLayout: st.dataLayout,
        setDataLayout: st.setDataLayout,
        setHideMenu: st.setHideMenu
    }))

    const siderRef = useRef<HTMLDivElement>(null)
    const [height, setHeight] = useState<number>(0)
    const [visibleSlider, setVisibleSlider] = useState<boolean>(false)


    const backToMain = () => {
        navigate(getURL('', 'showcase'))
        // navigate(ROUTES.MAIN)
    }


    useEffect(() => {
        const actualWidth = siderRef.current?.getBoundingClientRect()?.width
        const checkedWidth = actualWidth && actualWidth >= themeWidth
            ? actualWidth
            : themeWidth

        setLeftSiderWidth(checkedWidth)
    }, [])

    useLayoutEffect(() => {
        setHeight(siderRef.current?.clientHeight)

        if (theme.layout) {
            setDataLayout({
                ...theme.layout,
                leftSidebar: {
                    ...theme.layout.leftSidebar,
                    visibility: dataLayout.leftSidebar.visibility,
                }
            })
        }
    }, [theme])

    useEffect(() => {
        // При настройке отслеживать путь и отображать/не отображать сайдер с деревьями в зависимости от пути
        if (theme.layout.leftSidebar?.onlyVisibleOnMain) {
            location.pathname === getURL('', 'showcase')
                // location.pathname === ROUTES.MAIN
                ? setDataLayout({
                    ...dataLayout,
                    [TypeBlock.LEFT_SIDEBAR]: {
                        ...dataLayout[TypeBlock.LEFT_SIDEBAR],
                        visibility: true
                    }
                })
                : setDataLayout({
                    ...dataLayout,
                    [TypeBlock.LEFT_SIDEBAR]: {
                        ...dataLayout[TypeBlock.LEFT_SIDEBAR],
                        visibility: false
                    }
                })
        }
    }, [location.pathname])

    const handleOpenSidebar = useCallback((side: string) => {
        if (side === 'left') {
            const tmp = JSON.parse(JSON.stringify(dataLayout))

            tmp[TypeBlock.LEFT_SIDEBAR][VisibleBlock.VISIBILITY] = !tmp[TypeBlock.LEFT_SIDEBAR][VisibleBlock.VISIBILITY]
            setDataLayout(tmp)
        }

        if (side === 'right') {
            const tmp = JSON.parse(JSON.stringify(dataLayout))

            // eslint-disable-next-line max-len
            tmp[TypeBlock.RIGHT_SIDEBAR][VisibleBlock.VISIBILITY] = !tmp[TypeBlock.RIGHT_SIDEBAR][VisibleBlock.VISIBILITY]
            setDataLayout(tmp)
        }
    }, [dataLayout])

    // const Logo: FC<{ logoImage?: string }> =  <DefaultLogo logoImage={logoImage} />

    const treeCount = theme?.components?.tree?.showcase?.childrenTree?.enabled
        ? 2
        : 1

    const treePadding = currentTheme === 'fns'
        ? 0
        : config?.paddings?.upAndDownTreePadding?.value ?? 0
    // const treePadding = config?.paddings?.upAndDownTreePadding?.value ?? 0
    const headerPadding = config?.paddings?.headerPadding?.value ?? 0
    const headerContentPadding = config?.paddings?.headerContentPadding?.value ?? 0
    const headerHeight = currentTheme === 'fns'
        ? 64
        : 61
    const allTreeWidgetsHeight = useMemo(() => {
        return windowSizes.height - headerHeight - treePadding - headerPadding - headerContentPadding
    }, [
        config,
        windowSizes.height,
        theme?.components?.tree?.showcase?.childrenTree?.enabled,
    ])

    const [ratio, setRatio] = useState(currentTheme === 'fns'
        ? 0
        : accountData?.user?.settings?.trees?.treeRatio ?? 60)
    const [pxlTreeHeight, setPXLTreeHeight] = useState({
        top: allTreeWidgetsHeight * (1 - ratio / 100) ?? allTreeWidgetsHeight / 2,
        bottom: allTreeWidgetsHeight * ratio / 100 ?? allTreeWidgetsHeight / 2,
    })

    const forceUpdate = useAccountStore(st => st.forceUpdate)

    useEffect(() => {
        setPXLTreeHeight({
            top: allTreeWidgetsHeight * (1 - ratio / 100),
            bottom: allTreeWidgetsHeight * ratio / 100,
        })
    }, [
        allTreeWidgetsHeight,
        ratio,
    ])

    //*Функция сохранения в сторе аккаунта данных для выстраивание деревьев по высоте
    const addTreeHeightSettings = async () => {
        const newSettings = {
            ...accountData?.user?.settings,
            trees: { ...accountData?.user?.settings?.trees, treeRatio: ratio },
        }
        // const response = await patchAccountById(`${accountData?.user?.id}`, {
        //     settings: newSettings,
        // })
        const response = await SERVICES_ACCOUNTS.Models.patchAccountMyself({
            settings: newSettings,
        })

        if (response?.success) {
            forceUpdate()
        }
    }

    useEffect(() => {
        addTreeHeightSettings()
    }, [ratio])
    //*При монтировании компонента посылаем ранее выбранное соотнешение высоты деревьев
    useEffect(() => {
        if (currentTheme === 'fns') {
            setRatio(0)
        } else {
            if (accountData?.user?.settings?.trees?.treeRatio) {
                setRatio(accountData?.user?.settings?.trees?.treeRatio ?? 60)
            }
        }

    }, [])

    const [leftSiderWidth, setLeftSiderWidth] = useState<number>(300)
    const [activeDrag, setActiveDrag] = useState<boolean>(false)

    const resizeRef = useRef<HTMLSpanElement>(null)
    const startResizing = useDebounceCallback((startEvent: MouseEvent) => {
        let resizePhase = 'start'

        startEvent.preventDefault()
        // console.log('start', startEvent.type, resizePhase)
        const startWidth = leftSiderWidth ?? themeWidth
        const startRatio = ratio
        const startPosition = {
            x: startEvent.pageX,
            y: startEvent.pageY,
        }

        function resizing(resizeEvent: MouseEvent) {
            resizePhase = 'resize'
            resizeEvent.preventDefault()
            // console.log('resize', resizeEvent.type, resizePhase)

            const diffY = startPosition.y - resizeEvent.pageY
            const diffX = resizeEvent.pageX - startPosition.x
            const newRatio = Math.round((startRatio + diffY * 100 / allTreeWidgetsHeight) * 100) / 100
            const newWidth = Number(startWidth + diffX)
            const minWidth = themeWidth ?? 300

            // console.log('startWidth', startWidth)
            // console.log('diffX', diffX)
            // console.log('newWidth', newWidth)

            if (currentTheme !== 'fns') {
                if (newRatio >= 17 && newRatio <= 83) {
                    setRatio(prev => newRatio)
                }
            }


            if (startWidth < minWidth) {
                setLeftSiderWidth(prev => minWidth)
            } else if (newWidth >= minWidth && newWidth < 700) {
                setLeftSiderWidth(prev => startWidth + resizeEvent.pageX - startPosition.x)
            }
        }

        function endResizing(endEvent: MouseEvent) {
            resizePhase = 'end'
            endEvent.preventDefault()
            // console.log('end', endEvent.type, resizePhase)

            document.body.removeEventListener('mousemove', resizing)
            document.body.removeEventListener('mouseup', endResizing)
        }

        if (startEvent.type === 'mousedown') {
            document.body.addEventListener('mouseup', endResizing)
            document.body.addEventListener('mousemove', resizing)
        }
    }, 100)

    // console.log('padding', getPaddings(paddings, 'upAndDownTreePadding'))
    // console.log('leftSiderWidth', leftSiderWidth)

    //*Получаем url логотипа в шапке
    const getLogoImageUrl = () => {
        if (theme?.header?.logo) {
            const imageUrl = getFile(Number(theme?.header?.logo))?.url

            return import.meta.env.VITE_API_SERVER + imageUrl
        }
    }


    const headerTextColor = useMemo(() => {
        return  createColorForTheme(theme?.header?.textColor, theme?.colors, themeMode) ?? '#000000'
    }, [theme, themeMode])

    return (
        <Layout style={{ height: '100vh' }}>
            {dataLayout.header.visibility && (
                <Header
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: createColorForTheme(theme?.header?.background, theme?.colors, themeMode) ?? dataLayout.header.background,
                        gap: 10,
                        paddingTop: `${getPaddings(paddings, 'headerPadding')}px `,
                        paddingLeft: `${getPaddings(paddings, 'leftPaddingMenu')}px `,
                        zIndex: 0,
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1, gap: 12 }}>
                        {dataLayout.header.leftSidebarToggleButton && (
                            <ButtonMenu
                                open={dataLayout.leftSidebar.visibility}
                                onClick={() => handleOpenSidebar('left')}
                                style={{
                                    opacity: dataLayout.leftSidebar.abilityToLeave ? 1 : 0,
                                    visibility: dataLayout.leftSidebar.abilityToLeave ? 'visible' : 'hidden',
                                    backgroundColor: '#26ADE4',
                                    width: 64,
                                    height: 40,
                                }}
                            />
                        )}
                        {dataLayout.header.logo && (
                            <div>
                                <Link
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        color: dataLayout.header.font.color,
                                        fontSize: 22,
                                        cursor: 'pointer',
                                        opacity: dataLayout.header.logo ? 1 : 0,
                                        visibility: dataLayout.header.logo ? 'visible' : 'hidden',
                                    }}
                                    to={getURL('', 'showcase')}
                                    // to={ROUTES.MAIN}
                                    onClick={(e) => {
                                        if (fullScreen) {
                                            e.stopPropagation()
                                            e.preventDefault()
                                            setHideMenu(!hideMenu)
                                        }
                                    }}
                                >
                                    <div
                                        style={{

                                            marginRight: 16,
                                            width: theme?.menu?.width ? Number(theme?.menu?.width) : 80,
                                            height: 58,
                                            textAlign: 'center'
                                        }}
                                    >
                                        {dataLayout.header.logo && (

                                            <DefaultLogo logoImage={getLogoImageUrl() ?? dataLayout.header.logo.src} />
                                            // <Logo logoImage={getLogoImageUrl() ??  dataLayout.header.logo.src} />
                                            // <DefaultLogo logoImage={logo?.url ??  dataLayout.header.logo.src} />
                                            // <img 
                                            //     // ref={imgRef}
                                            //     src={import.meta.env.VITE_API_SERVER + logo?.url} 
                                            //     // style={{ display: 'block', position: 'absolute', width: '100%' }}
                                            // /> 
                                        )}
                                    </div>
                                    <div
                                        style={{
                                            //color: dataLayout.header.font.color,
                                            fontSize: theme.titleSettings.fontSize,
                                            fontWeight: theme.titleSettings.fontWeight,
                                            color: headerTextColor || themeMode == 'dark' ? '#ffffff' : '#000000',
                                            fontFamily: theme.font,
                                        }}
                                    >
                                        {theme.title ?? 'КМУТ'}
                                    </div>
                                    {theme.tempModifications?.getValue('pictureAfterTitle') && (
                                        <Col>
                                            <Image src={theme.tempModifications.getValue('pictureAfterTitle')} alt="Ничего" style={{ height: '64px', marginLeft: '10px' }} />
                                        </Col>
                                    )}
                                </Link>
                            </div>
                        )}
                        {!fullScreen && dataLayout.header.menuAvailability && (
                            <>
                                {theme.layout?.header?.routerLinks
                                    ?.filter((link) => !['empty', 'toggleTree'].includes(link.title))
                                    .map((link, i) => {
                                        const Icon = Icons[link.icon]

                                        return (
                                            <div key={`link-to-${i}`} style={{ display: 'flex', gap: 4 }}>
                                                <div>
                                                    <Icon style={{ color: dataLayout.header.font.color }} />
                                                </div>
                                                <div>
                                                    <Link
                                                        to={
                                                            link.title !== 'Service desk'
                                                                ? link.title !== 'Инфопанель'
                                                                    ? getURL(link.to, 'showcase')
                                                                    : '#'
                                                                : link.to
                                                        }
                                                        // to={link.to}
                                                        style={{ color: dataLayout.header.font.color }}
                                                    >
                                                        {link.title}
                                                    </Link>
                                                </div>
                                            </div>
                                        )
                                    })}
                                <Menu
                                    theme="light"
                                    mode="horizontal"
                                    items={dataLayout.header.menuAvailability ? [] : []}
                                    overflowedIndicator
                                    color="green"
                                    style={{
                                        flex: 1,
                                        maxWidth: '60%',
                                        width: '100%',
                                        background: dataLayout.header.background,
                                        color: dataLayout.header.font.color,
                                        height: headerFooterHeight,
                                    }}
                                />
                            </>
                        )}
                    </div>
                    {!fullScreen && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <ConfigProvider
                                theme={{
                                    components: {
                                        Input: {
                                            colorBgContainer: dataLayout?.header?.search?.background,
                                            colorBorder: dataLayout?.header?.search?.background,
                                            addonBg: dataLayout?.header?.search?.background,
                                            colorTextPlaceholder: dataLayout?.header?.search?.text,
                                            colorText: dataLayout?.header?.search?.text,
                                        },
                                    },
                                    token: {
                                        fontFamily: theme?.font,
                                    },
                                }}
                            >
                                {!theme?.header?.hideSearch &&


                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            boxShadow: '0 0 8px 0 rgba(0,0,0,0.4)',
                                            borderRadius: 6,
                                            // width: theme.layout.header.search.width
                                        }}
                                    >
                                        <UniversalSearch
                                            inputWidth={theme.layout.header.search.width}
                                            // inputWidth={250}
                                            dropdownWidth="50%"
                                            addonAfterStyle={{
                                                color: theme.layout.header.search.iconColor,
                                            }}
                                        />
                                    </div>}
                            </ConfigProvider>
                            {/* <ECButtonReset
                                onClick={updatePaddings}
                                size="middle"
                                tooltipText="Обновить тему"
                            /> */}
                            <ReportsDownloadWithDrawer />

                            {dataLayout.header.userMenu && (
                                <InterfaceMenuShowcase
                                    color={createColorForTheme(theme?.header?.textColor, theme?.colors, themeMode) ?? dataLayout.header.font.color}
                                    backgroundColor={createColorForTheme(theme?.header?.background, theme?.colors, themeMode) ?? dataLayout.header.background}
                                />
                            )}
                            {dataLayout.header.rightSidebarToggleButton && (
                                <ButtonMenu
                                    revert
                                    open={dataLayout.rightSidebar.visibility}
                                    onClick={() => handleOpenSidebar('right')}
                                    style={{
                                        opacity: dataLayout.rightSidebar.abilityToLeave ? 1 : 0,
                                        visibility: dataLayout.rightSidebar.abilityToLeave ? 'visible' : 'hidden',
                                        backgroundColor: '#26ADE4',
                                        width: 64,
                                        height: 40,
                                        padding: 2,
                                    }}
                                />
                            )}
                        </div>
                    )}
                </Header>
            )}
            <Layout
                hasSider
                style={{
                    backgroundColor: theme.layout.main.background,
                    color: theme.layout.main.fontColor,
                    padding: `
                        ${getPaddings(paddings, 'headerContentPadding')}px
                        ${getPaddings(paddings, 'rightPaddingContent')}px
                        ${getPaddings(paddings, 'bottomPaddingContent')}px
                        ${getPaddings(paddings, 'leftPaddingMenu')}px
                    `,
                    userSelect: 'none'
                }}
            >
                {!hideMenu && dataLayout.leftSidebar.menuAvailability && <SiderMenu side="left" />}
                {!fullScreen && !theme?.hideLeftSidebar &&
                    (

                        <Sider
                            collapsedWidth={0}
                            style={{
                                height: '100%',
                                flexDirection: 'row-reverse',
                                opacity: !dataLayout.leftSidebar.visibility ? 0 : 1,
                                // paddingLeft: getPaddings('menuSidebar'),
                                background: dataLayout.leftSidebar.background,
                                zIndex: 0
                            }}
                            ref={siderRef}
                            className="sider"
                            width={leftSiderWidth}
                            // width="25%"
                            trigger={null}
                            collapsible
                            collapsed={fullScreen ? fullScreen : !dataLayout.leftSidebar.visibility}
                        >
                            {!fullScreen && dataLayout?.leftSidebar?.visibility &&
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: '100%',
                                        // height: '90%',
                                        // padding: theme?.basePadding
                                        //     ? `0px ${theme?.basePadding - 10}px ${theme?.basePadding}px ${theme?.basePadding
                                        //     }px`
                                        //     : '0px 24px 24px 24px',
                                        gap: `${getPaddings(paddings, 'upAndDownTreePadding')}px`,
                                        paddingLeft: `${getPaddings(paddings, 'menuSidebar')}px`,
                                        // boxShadow: 'rgba(0, 0, 0, 0.4) 0px 0px 8px', 
                                        // gap: theme.basePadding ? Number(theme.basePadding) : siderPaddingLeft,
                                        // width: '300px',
                                        // minWidth: '300px',
                                    }}
                                >
                                    <div
                                        style={{
                                            position: 'relative'
                                        }}
                                    >
                                        <div
                                            style={{
                                                position: 'absolute',
                                                bottom: currentTheme === 'fns'
                                                    ? `calc(${allTreeWidgetsHeight / 2}px)`
                                                    : `calc(0px - ${customDragIconSize / 2}px - ${getPaddings(paddings, 'upAndDownTreePadding') / 2}px)`,
                                                // bottom: `calc(0px - ${customDragIconSize / 2}px - ${getPaddings(paddings, 'upAndDownTreePadding') / 2}px)`,
                                                right: `calc(0px - ${customDragIconSize / 2}px`,
                                                zIndex: 102,
                                            }}
                                        >
                                            <ECTooltip
                                                title={`Регулировать ${currentTheme !== 'fns' ? 'высоту виджетов и ' : ''}ширину сайдбара`}
                                                placement="top"
                                            >
                                                <span
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        cursor: 'move',
                                                        justifyContent: 'center',
                                                    }}
                                                    onMouseOver={(e) => {
                                                        setActiveDrag(true)
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        setActiveDrag(false)
                                                    }}
                                                    onClick={(e) => {
                                                        // Добавлено, чтобы отсечь на клик евенте срабатывание ресайза при помощи startResizing
                                                        startResizing(e)
                                                    }}
                                                    onMouseDown={(e) => {
                                                        startResizing(e)
                                                    }}
                                                    ref={resizeRef}
                                                >
                                                    <CustomDragIcon
                                                        styles={{
                                                            width: `${customDragIconSize}px`,
                                                            height: `${customDragIconSize}px`,
                                                            backgroundColor: activeDrag
                                                                ? 'rgb(44, 160, 207)'
                                                                : 'rgb(179, 210, 226)',
                                                        }}

                                                    />
                                                </span>
                                            </ECTooltip>
                                        </div>
                                        {config?.tree?.treeVersion !== 'simpleVersion' ? //!
                                            <TestObjectTree height={pxlTreeHeight.top} id={9023} />
                                            :
                                            <LayoutQuickTreeWrapper
                                                height={
                                                    showChildTree
                                                        ? pxlTreeHeight.top
                                                        : pxlTreeHeight.top + pxlTreeHeight.bottom
                                                }
                                            />}
                                    </div>
                                    <TestObjectTree
                                        height={pxlTreeHeight.bottom}
                                        emptyHeight={pxlTreeHeight.bottom}
                                        track="lastOpened"
                                        id={85636}
                                    />
                                    {(!['fns'].includes(currentTheme) && showChildTree &&
                                        theme?.components?.tree?.showcase?.childrenTree?.enabled) && (
                                    // <TestObjectTree
                                    //     height={pxlTreeHeight.bottom}
                                    //     emptyHeight={pxlTreeHeight.bottom}
                                    //     track="lastOpened"
                                    //     id={85636}
                                    // />
                                        <LayoutChildTreeWrapper
                                            height={pxlTreeHeight.bottom}
                                        />
                                    )}
                                </div>}
                        </Sider>

                    )}
                <Content
                    style={{
                        // padding: theme.basePadding
                        //     ? `${theme.basePadding}px ${theme.basePadding}px ${theme.basePadding}px 10px`
                        //     : '14px 24px 14px 24px',
                        padding: 10,
                        margin: -10,
                        // paddingLeft: `-${getPaddings(theme, 'sidebarPageContentPadding')}px`,
                        marginLeft: `${getPaddings(paddings, 'sidebarPageContentPadding') - 10}px`,
                        paddingRight: 10,
                        marginRight: 0,
                        // overflow: 'hidden',
                        // overflowY: 'auto',
                        flex: 1,
                        height: 'calc(100%)',
                        backgroundColor: dataLayout.main.background,
                        color: dataLayout.main.fontColor,
                        scrollbarGutter: 'stable',
                        overflow: 'auto'
                    }}
                    className="content"
                >
                    {children}
                </Content>

                <Sider
                    collapsedWidth={0}
                    style={{
                        height: '100%',
                        flexDirection: 'row-reverse',
                        opacity: !dataLayout.rightSidebar?.visibility ? 0 : 1,
                        background: dataLayout.rightSidebar?.background,
                    }}
                    // ref={siderRef}
                    width="25%"
                    trigger={null}
                    collapsible
                    collapsed={!dataLayout.rightSidebar?.visibility}
                >
                    <div
                        style={{
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            padding: '14px 24px 24px 24px',
                            // padding: dataLayout.rightSidebar.visibility ? siderPaddingLeft : 0,
                            // background: dataLayout.rightSidebar.background,
                            gap: theme.basePadding ? theme.basePadding : siderPaddingLeft,
                        }}
                    >
                        {/*
                        <TestObjectTree
                            height={treeWidgetHeight({
                                windowHeight: windowSizes.height,
                                count: 2,
                                treeContentHeight: 0.3,
                                headerEnabled: dataLayout.header.visibility,
                                footerEnabled: dataLayout.footer.visibility,
                            })}
                            id={35213}
                        />
                        <TestObjectTree
                            height={treeWidgetHeight({
                                windowHeight: windowSizes.height,
                                count: 2,
                                treeContentHeight: 0.7,
                                headerEnabled: dataLayout.header.visibility,
                                footerEnabled: dataLayout.footer.visibility,
                            })}
                            emptyHeight={treeWidgetHeight({
                                windowHeight: windowSizes.height,
                                count: 2,
                                treeContentHeight: 0.7,
                                empty: true,
                                headerEnabled: dataLayout.header.visibility,
                                footerEnabled: dataLayout.footer.visibility,
                            })}
                            track="lastOpened"
                            id={56147}
                        />
                        */}
                    </div>
                </Sider>
                {dataLayout.rightSidebar?.menuAvailability && <SiderMenu side="right" />}
            </Layout>
            {!fullScreen && dataLayout.footer.visibility && (
                <Footer
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        height: 60,
                        paddingLeft: 50,
                        paddingRight: 50,
                        paddingTop: 0,
                        paddingBottom: 0,
                        background: dataLayout.footer.background,
                    }}
                >
                    <div id="footer-menu">
                        <div
                            style={{
                                height: 60,
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <Menu
                                theme="light"
                                mode="horizontal"
                                items={dataLayout.footer.menuAvailability ? [] : []}
                                overflowedIndicator
                                color="green"
                                style={{
                                    flex: 1,
                                    maxWidth: '60%',
                                    width: '100%',
                                    background: dataLayout.footer.background,
                                    color: dataLayout.footer.fontColor,
                                    opacity: dataLayout.footer.menuAvailability ? 1 : 0,
                                    visibility: dataLayout.footer.menuAvailability ? 'visible' : 'hidden',
                                    // height: headerFooterHeight
                                }}
                            />
                        </div>
                    </div>
                    <div id="footer-time">
                        <Typography.Text style={{ color: dataLayout.footer.fontColor, fontSize: 16 }}>
                            <Timer title={theme.title} />
                        </Typography.Text>
                    </div>
                </Footer>
            )}
        </Layout>
    )
}
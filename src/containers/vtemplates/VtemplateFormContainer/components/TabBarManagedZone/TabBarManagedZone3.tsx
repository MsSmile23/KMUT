import { FC, useEffect, useState, MouseEvent, KeyboardEvent, useRef, useCallback, Fragment } from 'react'
import { TabsArrType } from '../../types/types'
import CustomPreloader from '@shared/ui/preloader/CustomPreloader'
import { useNavigate, useParams } from 'react-router-dom'
import { ECTooltip } from '@shared/ui/tooltips'
import { BaseButton, ButtonSettings } from '@shared/ui/buttons'
import { ArrowLeftOutlined, HomeOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons'
import { useOpen } from '@shared/hooks/useOpen'
import { Popover } from 'antd'
import { getURL } from '@shared/utils/nav'

type MainVTProps = {
    tabsArr: TabsArrType[],
    preview: boolean,
    onEdit?: (targetKey: MouseEvent | KeyboardEvent | string,
        action: 'add' | 'remove') => void;
    activeKey: string;
    onChangeTab?: (newActiveKey: string, index?: number) => void;
    settingZoneVT?: () => void;
    isInterfaceShowcase?: boolean;
    typeTabs?: 'vertical' | 'horizontal';
    isMiniHeader?: boolean
}

/**
 * 
 * @param tabsArr
 * @returns 
 */

const TabBarManagedZone3: FC<MainVTProps> = (props) => {
    const { id } = useParams<{ id?: string }>()
    const { 
        tabsArr, 
        activeKey, 
        onChangeTab, 
        settingZoneVT, 
        onEdit, 
        preview, 
        isInterfaceShowcase = false,
        typeTabs = 'horizontal',
        isMiniHeader,
    } = props
    const navigate = useNavigate()

    const [currentTab, setCurrenTab] = useState<TabsArrType>(null)
    const [isRGLLoaded, setRGLLoaded] = useState(false)
    const [tabsBlockWidth, setTabsBlockWidth] = useState(0)

    const tip = useOpen()
    const tabsBlockRef = useRef<HTMLDivElement>(null)
    const сontainerRef = useRef<HTMLDivElement>(null)
    const tabsForScrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setCurrenTab(tabsArr.find( item => item.key == activeKey))
    }, [activeKey, tabsArr])


    useEffect(() => {
        setRGLLoaded(false)
        const timer = setTimeout(() => {
            setRGLLoaded(true)
        }, 100)

        return () => clearTimeout(timer)
    }, [activeKey])

    // Отслеживание ширины блока табов
    useEffect(() => {
        if (tabsBlockRef.current) {
            const observer = new ResizeObserver(() => {
                setTabsBlockWidth(tabsBlockRef.current?.clientWidth || 0)
            })

            observer.observe(tabsBlockRef.current)

            return () => {
                observer.disconnect()
            }
        }
    }, [])

    // Горизонтальная прокрутка колесом мышки
    useEffect(() => {
        const handleWheel = (event) => {
            if (tabsForScrollRef.current) {
                event.preventDefault()
                tabsForScrollRef.current.scrollLeft += event.deltaY
            }
        }

        const tabsBlockElement = tabsForScrollRef.current;

        if (tabsBlockElement && typeTabs !== 'vertical') {
            tabsBlockElement.addEventListener('wheel', handleWheel)
        }

        return () => {
            if (tabsBlockElement) {
                tabsBlockElement.removeEventListener('wheel', handleWheel)
            }
        }
    }, [])

    const isOverflow = tabsBlockWidth >= сontainerRef?.current?.offsetWidth - 100

    // Определение неотображаемых вкладок
    const hiddenTabs = tabsArr.filter((item, index) => {
        // Получаем координаты и размеры блока вкладок
        const tabsBlockRect = tabsForScrollRef?.current?.getBoundingClientRect()
        // Получаем координаты и размеры каждой вкладки
        const tabRect = tabsForScrollRef?.current?.children[index]?.getBoundingClientRect()

        // Если вкладка находится вне видимой области блока вкладок, то она считается скрытой 
        if (typeTabs === 'vertical') {

            return tabRect?.bottom > tabsBlockRect?.bottom || tabRect?.top < tabsBlockRect?.top;
        } else {

            return tabRect?.right > tabsBlockRect?.right + 1 || tabRect?.left < tabsBlockRect?.left;
        }
    })

    const tabClickHandler = (key) => {
        const activeTabStorage = JSON.parse(localStorage.getItem('activeTabs'))

        const localActiveTabs = activeTabStorage?.filter((item) => item.id !== id) ?? []

        localActiveTabs.push({ id: id, tab: key })

        let newArray: any[] = []

        if (localActiveTabs.length >= 11) {
            newArray = localActiveTabs.slice(1, 11)
        } else {
            newArray = localActiveTabs
        }

        localStorage.setItem('activeTabs', JSON.stringify(newArray))
    }

    const renderTab = useCallback((item: TabsArrType, index: number) => {
        const tabContent = (
            <span
                onClick={() => {
                    // setRGLLoaded(false);
                    onChangeTab(item.key, index);
                    tabClickHandler(item.key)
                }}
            >
                {item.label}
            </span>
        )

        return item.currentLabel.length > (!preview && !isInterfaceShowcase ? 20 : 25) && typeTabs === 'vertical' ? (
            <ECTooltip 
                key={index} 
                title={item.currentLabel} 
                placement="top"
            >
                {tabContent}
            </ECTooltip>
        ) : (
            <Fragment key={index}>
                {tabContent}
            </Fragment>
        )
    }, [onChangeTab, preview, isInterfaceShowcase])

    //*Добавление активного таба при нахождении id объекта в локалСторадже
    useEffect(() => {

        if (localStorage.getItem('activeTabs')) {
            const activeTabStorage = JSON.parse(localStorage.getItem('activeTabs'))

            const tabFromLocalStorage = activeTabStorage.find(item => item.id == id)?.tab

            onChangeTab(tabsArr.find(item => item.key == tabFromLocalStorage)?.key ?? '1') 
        }
    }, [tabsArr])

    return (
        <div 
            className={`VtemplateSCForm__tabs-container ${typeTabs == 'vertical' 
                ? 'VtemplateSCForm__tabs-container_vertical' : ''}`}
        >
            <div 
                className={typeTabs == 'vertical' ? 'VtemplateSCForm__tabs-block_vertical' 
                    : 'VtemplateSCForm__tabs-block'}
                style={{ 
                    marginTop: typeTabs == 'vertical' && !preview && !isInterfaceShowcase ? 34 : 0,
                    gap: 10,
                    marginBottom: 16,
                }}
                ref={сontainerRef}
            >
                {isMiniHeader && (
                    <div 
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px', 
                            justifySelf: 'flex-start', 
                            marginRight: 'auto',
                            marginLeft: 10 }}
                    >
                        <BaseButton shape="circle" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} />
                        <BaseButton 
                            shape="circle" 
                            icon={<HomeOutlined />} 
                            onClick={() => navigate(getURL('/', 'showcase'))} 
                        />
                    </div>)}
                <div 
                    ref={tabsBlockRef} 
                    style={{
                        display: typeTabs == 'vertical' ? 'block' : 'flex', 
                        gap: typeTabs == 'vertical' ? 0 : 10,
                        overflowX: 'auto',
                    }}
                >
                    <div 
                        className={`VtemplateSCForm__tabs ${typeTabs == 'vertical' ? 'VtemplateSCForm__tabs_vertical' 
                            : ''}`}
                        ref={tabsForScrollRef}
                    >
                        {tabsArr.map(renderTab)}
                    </div>
                    
                    {hiddenTabs?.length > 0 &&
                    <div>
                        <Popover
                            placement={typeTabs == 'vertical' ? 'right' : 'bottom'}
                            content={() => hiddenTabs.map(renderTab)}
                            trigger="hover"
                        >
                            <ButtonSettings
                                icon={false}
                                size="large"
                                type="default"
                                disabled={false}
                                onMouseEnter={tip.open}
                                onMouseLeave={tip.close}
                                style={{ width: '100%' }}
                            >
                                ...
                            </ButtonSettings>
                        </Popover>
                    </div>}
                    
                </div>
                {!preview && !isInterfaceShowcase &&
                <>
                    <ButtonSettings
                        icon={false}
                        size="large"
                        type="default"
                        disabled={false}
                        onClick={() => onEdit('', 'add')}
                        style={{ width: typeTabs == 'vertical' ? '100%' : 'auto' }}
                    >
                        <PlusOutlined />
                    </ButtonSettings>
                    <ECTooltip title="Настройки зоны" placement="bottom">
                        <span>
                            <ButtonSettings
                                icon={false}
                                style={{ marginTop: 5 }}
                                className="tabs-extra-demo-button"
                                type="primary"
                                shape="circle"
                                disabled={false}
                                onClick={settingZoneVT}
                            >
                                <SettingOutlined />
                            </ButtonSettings>
                        </span>
                    </ECTooltip>
                </>}
            </div>
            
            {!tabsArr.length && (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 50,
                        cursor: 'pointer',
                        width: '100%'
                    }}
                    onClick={() => onEdit('', 'add')}
                >
                    <ButtonSettings
                        size="large"
                        icon={false}
                        type="primary"
                        onClick={() => onEdit('', 'add')}
                    >
                        Создайте первый таб
                    </ButtonSettings>
                </div>
            )}
            
            <div style={{ width: tabsArr.length ? '100%' : 'auto' }}>
                {isRGLLoaded
                    ? currentTab?.children ?? ((preview || isInterfaceShowcase) ? 'Нет данных' : '')
                    : <CustomPreloader size="large" />}
            </div>
        </div>
    )
}

export default TabBarManagedZone3
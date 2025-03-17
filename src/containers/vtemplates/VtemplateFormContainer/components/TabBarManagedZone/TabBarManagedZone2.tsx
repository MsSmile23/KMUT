import { FC, useEffect, useState, MouseEvent, KeyboardEvent, useLayoutEffect } from 'react'
import { TabsArrType } from '../../types/types'
import CustomPreloader from '@shared/ui/preloader/CustomPreloader'
import { useParams } from 'react-router-dom'

type MainVTProps = {
    tabsArr: TabsArrType[],
    preview: boolean,
    onEdit?: (targetKey: MouseEvent | KeyboardEvent | string,
        action: 'add' | 'remove') => void;
    activeKey: string;
    onChangeTab?: (newActiveKey: string) => void;
    settingZoneVT?: () => void;
    isInterfaceShowcase?: boolean;
}

const TabBarManagedZone2: FC<MainVTProps> = (props) => {
    const { id } = useParams<{ id?: string }>()
    const { tabsArr, activeKey, onChangeTab } = props
    const [currentTab, setCurrenTab] = useState<TabsArrType>(null)

    const [isRGLLoaded, setRGLLoaded] = useState(false)

    useEffect(() => {
        setCurrenTab(tabsArr.find( item => item.key == activeKey))
    }, [activeKey, tabsArr])

    useEffect(() => {
        setRGLLoaded(false)
        setTimeout(() => {
            setRGLLoaded(true)
        }, 100)
    }, [activeKey])


    //*Добавление активного таба при нахождении id объекта в локалСторадже
    // useLayoutEffect(() => {
    //     if (localStorage.getItem('activeTab')) {
    //         const activeTabStorage = JSON.parse(localStorage.getItem('activeTab'))

    //         if (activeTabStorage?.id == id && id !== undefined) {
    //             const newKey = activeTabStorage?.tab ?? tabsArr[0]?.key

    //             console.log('Новый ключ', newKey)

    //             onChangeTab(tabsArr.find( item => item.key == newKey) ? newKey : tabsArr[0]?.key)
    //         }
    //         else {
    //             console.log('Новый ключ2', tabsArr[0]?.key, tabsArr)
    //             onChangeTab( tabsArr[0]?.key)
    //         }
    //     }
    // }, [])

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            
                {tabsArr.map( (item, index) =>
                    <span
                        key={index}
                        style={{ backgroundColor: item.key == activeKey ? 'rgb(233, 247, 252)' : '#ffffff', 
                            padding: '10px',
                            color: '#000000',
                            display: 'flex',
                            alignItems: 'center', 
                            margin: '0',
                            borderRadius: index == 0 ? '8px 0px 0px' : '0px',
                            cursor: 'pointer',
                            border: '1px solid rgb(226, 226, 226)',
                            fontSize: '16px'
                        }}
                        onClick={() => {
                            setRGLLoaded(false)
                            onChangeTab(item.key)
                            // localStorage.setItem('activeTab', JSON.stringify({ id: id, tab: item.key }));

                        }}
                    >
                        {item.currentLabel}
                    </span>
                )}
            </div>
            <div>
                {isRGLLoaded
                    ? (currentTab?.children ?? 'Нет данных')
                    : <CustomPreloader size="large" />}
            </div>
        </>
    )
}

export default TabBarManagedZone2
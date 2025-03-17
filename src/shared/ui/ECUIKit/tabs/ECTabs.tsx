import React, { FC, ReactElement, useEffect, useState } from 'react';
import CustomPreloader from '@shared/ui/preloader/CustomPreloader';

interface ITabItem {
    key: string;
    label: string;
    children: ReactElement<any, any>;
    disabled?: boolean
}

type ECTabsProps = {
    items: ITabItem[];
    activeKey: string;
    onChange?: (newActiveKey: string) => void;
    renderTabsOnLoad?: boolean
    headerStyle?: CSSStyleValue
}

const ECTabs: FC<ECTabsProps> = (props) => {
    const { items, activeKey, onChange, renderTabsOnLoad } = props;
    const [currentTab, setCurrentTab] = useState(null)

    const [isRGLLoaded, setRGLLoaded] = useState(false)

    useEffect(() => {
        setCurrentTab(items.find(item => item.key == activeKey))
    }, [activeKey, items])

    useEffect(() => {
        setRGLLoaded(false)
        setTimeout(() => {
            setRGLLoaded(true)
        }, 100)
    }, [activeKey])

    return (
        <div style={{ display: 'flex', flexDirection: 'column',  }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', ...props?.headerStyle }}>
                {items.map((item, index) =>
                    <span
                        key={index}
                        style={{
                            backgroundColor: item.key === activeKey ? 'rgb(233, 247, 252)' : '#ffffff',
                            padding: '10px',
                            color: item.disabled ? '#aaa' : '#000', // Цвет текста для отключённых вкладок
                            display: 'flex',
                            alignItems: 'center',
                            margin: '0',
                            borderRadius: index === 0 ? '8px 0px 0px' : '0px',
                            cursor: item.disabled ? 'not-allowed' : 'pointer', // Изменение курсора
                            border: '1px solid rgb(226, 226, 226)',
                            fontSize: '16px',
                            opacity: item.disabled ? 0.6 : 1 // Прозрачность отключённых вкладок
                        }}
                        onClick={() => !item.disabled && onChange?.(item.key)} // Блокировка кликов
                    >
                        {item.label}
                    </span>
                )}
            </div>
            {renderTabsOnLoad
                ?
                <div>
                    {items.map(item => (
                        <div
                            key={item.key}
                            style={{ display: item.key === activeKey ? 'block' : 'none' }}
                        >
                            {React.cloneElement(item.children)}
                        </div>
                    ))}
                    {items.length === 0 && <CustomPreloader size="large" />}
                </div>
                :
                <div>
                    {isRGLLoaded
                        ? (currentTab?.children ?? 'Нет данных')
                        : <CustomPreloader size="large" />}
                </div>}
        </div>
    );
}

export default ECTabs;
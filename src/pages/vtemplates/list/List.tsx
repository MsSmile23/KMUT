import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Card, Typography } from 'antd';
import VtemplateFormContainerList from '@containers/vtemplates/VtemplateFormContainerList/VtemplateFormContainerList';
import { SERVICES_VTEMPLATES } from '@shared/api/vtemplates';
import { dataVtemplateProps, paramsVtemplate } from '@shared/types/vtemplates';
import { useWindowResize } from '@shared/hooks/useWindowResize';
import { useDocumentTitle } from '@shared/hooks/useDocumentTitle';
import { CustomTab } from '@shared/ui/CustomTabs/components/CustomTab';
import { selectVTemplates, useVTemplatesStore } from '@shared/stores/vtemplates';
import { useLocation } from 'react-router-dom';
import { useObjectsStore } from '@shared/stores/objects';
const { Title } = Typography;
const tableOffset = 320

const tabsTitle = [
    { key: '0', title: 'Браузерные' },
    { key: '1', title: 'Мобильные' }
]

const List: FC = () => {
    const windowDimensions = useWindowResize()
    const location = useLocation()
    const isMobile: boolean = location?.state?.isMobile ?? false

    const [dataVtemplate, setDataVtemplate] = useState<dataVtemplateProps<paramsVtemplate>[]>(
        [] as dataVtemplateProps<paramsVtemplate>[]
    )
    const [ loading, setLoading ] = useState(false)
    const [activeKey, setActiveKey] = useState<string>(isMobile ? tabsTitle[1]?.key : tabsTitle[0]?.key)

    const loadObjects = useObjectsStore.getState().fetchData
    const clearObjects = useObjectsStore.getState().setInitialStoreState

    useEffect(() => {
        loadObjects(true)

        return () => clearObjects()
    }, [])


    const ref = useRef(null)

    useEffect(() => {
        setLoading(true)

        SERVICES_VTEMPLATES.Models.getVtemplates({ all: true })
            .then((res) => {
                setDataVtemplate(res.data)
                setLoading(false)
            })
    }, [])

    const vtemplatesStore = useVTemplatesStore(selectVTemplates)

    // Фильтруем макеты для вывода на Браузерной и Мобильной вкладке
    const filteredVtemplate = useMemo(() => {
        return vtemplatesStore.filter(vtemplate => {
            const purpose = vtemplate?.params?.dataToolbar?.purpose

            if (activeKey === '0') {

                return purpose === 1 || purpose === 2
            } else {

                return purpose === 3 || purpose === 4
            }

        })
    }, [activeKey, vtemplatesStore])

    const onChangeDataVtemplate = (data: dataVtemplateProps<paramsVtemplate>[]) => {
        setDataVtemplate(data)
    }

    useDocumentTitle('Таблица макетов')
    
    return (
        <div
            style={{
                height: '100%',
                margin: 10,
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Card ref={ref}>
                <Title level={3}>Таблица макетов</Title>{' '}
            </Card>
            <div style={{ display: 'flex', alignSelf: 'flex-end', marginTop: '10px' }}>
                {tabsTitle.map((tab, i) => (
                    <span onClick={() => setActiveKey(tab.key)} key={tab.key} >
                        <CustomTab
                            activeKey={activeKey}
                            currentKey={tab.key}
                            tabsLength={tabsTitle.length - 1}
                            index={i}
                        >
                            {tab.title}
                        </CustomTab>
                    </span>
                ))}
            </div>
            <Card
                style={{
                    // marginTop: '10px',
                    flex: 1
                }}
                bodyStyle={{ height: '100%' }}
            >
                {/* <ClassesTableContainer /> */}
                <VtemplateFormContainerList
                    height={windowDimensions.height - tableOffset}
                    data={filteredVtemplate}
                    onChangeDataVtemplate={onChangeDataVtemplate}
                    loading={loading}
                    isMobile={activeKey === '1'}
                />
            </Card>
        </div>
    )
}

export default List
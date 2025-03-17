import { useECTheme } from '@shared/hooks/useECTheme';
import { Card, Form, Switch, Table } from 'antd';
import { changePagesSwitch, PAGES_TABLE_COLUMN, showModal } from '../utils';
import { useConfigStore } from '@shared/stores/config';
import { useMemo, useState, useEffect } from 'react';
import { IPage } from '@containers/widgets/WidgetPageHeader/types/WidgetPageHeaderTypes';

type SortedPages = Record<'С макетами' | 'Без макетов', IPage[]>

const PagesTableFormContainer = ({ form }) => {
    const pages = useMemo(() => {
        const data = useConfigStore.getState()?.store?.data;
        const frontPages = data?.find(el => el.mnemo === 'front_pages')?.value;

        return frontPages ? JSON.parse(frontPages) : [];
    }, []);

    const sortedPages: SortedPages = useMemo(() => {
        return pages.reduce((acc, page) => {
            const key = page?.vtemplate_id ? 'С макетами' : 'Без макетов';

            acc[key].push(page);
            
            return acc;
        }, { 'С макетами': [], 'Без макетов': [] });
    }, [pages]);

    const ecTheme = useECTheme();
    const bgColor = ecTheme.getColorFromConfig({ element: 'tableHeaderBackground', section: 'table' });
    const textColor = ecTheme.getColorFromConfig({ element: 'tableHeaderTextColor', section: 'table' });

    const [mainSwitchState, setMainSwitchState] = useState({});
    const global_vtemplates = Form.useWatch('global_vtemplates', form);
    const doAllItem = useMemo(() => Object.keys(form.getFieldsValue()).find(key => key.includes('global_do_all')), []);
    const global_do_all = Form.useWatch(`${doAllItem}`, form);

    const updateMainSwitchState = (pageKey: string) => {
        const allChecked = sortedPages[pageKey].every(page => form.getFieldValue(`pages_switch&${page.id}`));

        setMainSwitchState(prev => ({ ...prev, [pageKey]: allChecked }));
    };

    // const checkAllByVtemplatesMnemo = (value: boolean, pageKey: string) => {
        
    //     sortedPages[pageKey].forEach(page => {
    //         form.setFieldValue(`pages_switch&${page.id}`, value);
    //     });
    //     setMainSwitchState(prev => ({ ...prev, [pageKey]: value }));
    // };
    
    const checkAllByVtemplatesMnemo = (value: boolean, pageKey: string) => {
        sortedPages[pageKey].forEach(page => {
            const changedFormValue = {};

            changedFormValue[`pages_switch&${page.id}`] = value

            form.setFieldsValue({
                ...changedFormValue,
                ...changePagesSwitch(value, page.id),
            });
        });
        setMainSwitchState(prev => ({ ...prev, [pageKey]: value }));
    };

    useEffect(() => {
        const initialMainSwitchState = Object.keys(sortedPages).reduce((acc, pageKey) => {
            acc[pageKey] = sortedPages[pageKey].every(page => form.getFieldValue(`pages_switch&${page.id}`));
            
            return acc;
        }, {});

        setMainSwitchState(initialMainSwitchState);
    }, [global_vtemplates, global_do_all]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <h3>Страницы</h3>
            { sortedPages && Object.keys(sortedPages).length > 0 ?
                Object.keys(sortedPages).filter(key => sortedPages[key].length > 0).map(pageKey => (
                    <Card
                        key={pageKey}
                        style={{ marginBottom: 20 }}
                        title={
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                    color: textColor
                                }}
                            >
                                {pageKey}
                                <Switch
                                    checked={mainSwitchState[pageKey]}
                                    onChange={value => {
                                        if (global_do_all || global_vtemplates) {
                                            showModal('Снимите глобальные разрешения');
                                        
                                            return;
                                        }
                                        checkAllByVtemplatesMnemo(value, pageKey);
                                    }}
                                />
                            </div>
                        }
                        bodyStyle={{ margin: 0, padding: 0 }}
                        headStyle={{ backgroundColor: bgColor, padding: 10 }}
                    >
                        <Table
                            bordered
                            showHeader={false}
                            pagination={false}
                            columns={PAGES_TABLE_COLUMN}
                            dataSource={sortedPages[pageKey].map((page, index) => ({
                                key: `${page.id}-${index}`,
                                name: page.name,
                                url: page.url,
                                switch: (
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <Form.Item
                                            name={`pages_switch&${page.id}`}
                                            valuePropName="checked"
                                            style={{ margin: 0, marginRight: '5px' }}
                                            colon={false}
                                        >
                                            <Switch
                                                checked={form.getFieldValue(`pages_switch&${page.id}`)}
                                                onChange={value => {
                                                    if (global_do_all || global_vtemplates) {
                                                        showModal('Снимите глобальные разрешения');
                                                    
                                                        return;
                                                    }
                                                    // form.setFieldValue(`pages_switch&${page.id}`, value);
                                                    form.setFieldsValue(changePagesSwitch(value, page.id));
                                                    updateMainSwitchState(pageKey)
                                                }}
                                            />
                                        </Form.Item>
                                    </div>
                                )
                            }))} 
                        />
                    </Card>
                ))
                : <>Страницы не найдены</>}
        </div>
    );
};

export default PagesTableFormContainer;
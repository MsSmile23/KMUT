import { useECTheme } from '@shared/hooks/useECTheme';
import { Card, Form, Switch, Table } from 'antd';
import { useMemo, useState, useEffect } from 'react';
import { useConfigStore } from '@shared/stores/config';
import { IMenuConstructor } from '@pages/navigation-settings/menu/components/utils';
import { MENU_AND_VTEMPLATES_TABLE_COLUMNS, showModal } from '../utils';

const MenuTableFormContainer = ({ form }) => {
    const ecTheme = useECTheme();
    const bgColor = ecTheme.getColorFromConfig({ element: 'tableHeaderBackground', section: 'table' });
    const textColor = ecTheme.getColorFromConfig({ element: 'tableHeaderTextColor', section: 'table' });
    const config = useConfigStore.getState()?.store?.data
    const frontSettings = config?.find(el => el.mnemo === 'front_menu')?.value

    const menues = useMemo<IMenuConstructor[]>(() => {
        return frontSettings ? JSON.parse(frontSettings) : [];
    }, []);

    const [mainSwitchState, setMainSwitchState] = useState({});
    const global_vtemplates = Form.useWatch('global_vtemplates', form);
    const doAllItem = useMemo(() => Object.keys(form.getFieldsValue()).find(key => key.includes('global_do_all')), [])

    const global_do_all = Form.useWatch(`${doAllItem}`, form)

    const checkAllByVtemplatesMnemo = (value: boolean, menu: IMenuConstructor) => {
        menu.menu.forEach(submenu => {
            form.setFieldValue(`menues_switch/${menu.type}&${submenu.id}`, value);
        });
        setMainSwitchState(prev => ({ ...prev, [menu.type]: value }));
    };

    const updateMainSwitchState = (menu: IMenuConstructor) => {
        const allChecked = menu.menu.every(submenu => form.getFieldValue(`menues_switch/${menu.type}&${submenu.id}`));

        setMainSwitchState(prev => ({ ...prev, [menu.type]: allChecked }));
    };

    useEffect(() => {
        const initialMainSwitchState = {};

        if (menues) {
            menues?.forEach(menu => {
                initialMainSwitchState[menu.type] = menu.menu
                    .every(submenu => form.getFieldValue(`menues_switch/${menu.type}&${submenu.id}`));
            });
            setMainSwitchState(initialMainSwitchState);
        }

    }, [global_vtemplates, global_do_all]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <h3>Меню</h3>
            {menues && menues.length > 0 ?
                menues.map(menu => (
                    <Card
                        key={menu.id}
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
                                {menu.name}
                                <Switch
                                    checked={mainSwitchState[menu.type]}
                                    onChange={(value) => {
                                        if (global_do_all || global_vtemplates) {
                                            showModal('Снимите глобальные разрешения')

                                            return
                                        }
                                        checkAllByVtemplatesMnemo(value, menu)
                                    }}
                                />
                            </div>
                        }
                        bodyStyle={{ margin: 0, padding: 0 }}
                        headStyle={{ backgroundColor: bgColor, padding: 10 }}
                    >
                        <Table
                            key={menu.id}
                            bordered
                            showHeader={false}
                            pagination={false}
                            columns={MENU_AND_VTEMPLATES_TABLE_COLUMNS}
                            dataSource={menu?.menu?.map((submenu) => ({
                                key: submenu.id,
                                id: submenu.id,
                                name: submenu.name,
                                switch:
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <Form.Item
                                            name={`menues_switch/${menu.type}&${submenu.id}`}
                                            valuePropName="checked"
                                            style={{ margin: 0, marginRight: '5px' }}
                                            colon={false}
                                        >
                                            <Switch
                                                checked={form.getFieldValue(`menues_switch/${menu.type}&${submenu.id}`)}
                                                onChange={(value) => {
                                                    if (global_do_all || global_vtemplates) {
                                                        showModal('Снимите глобальные разрешения')

                                                        return
                                                    }
                                                    form.setFieldValue(
                                                        `menues_switch/${menu.type}&${submenu.id}`,
                                                        value
                                                    );
                                                    updateMainSwitchState(menu);
                                                }}
                                            />
                                        </Form.Item>
                                    </div>
                            }))}
                        />
                    </Card>
                ))
                : <>Элементы меню не найдены</>}
        </div>
    );
};

export default MenuTableFormContainer;
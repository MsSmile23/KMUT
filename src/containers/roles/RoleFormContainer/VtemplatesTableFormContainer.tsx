import { useECTheme } from '@shared/hooks/useECTheme';
import { Card, Form, Switch, Table } from 'antd';
import { useMemo, useState, useEffect } from 'react';
import { changeVtemplateSwitch, MENU_AND_VTEMPLATES_TABLE_COLUMNS, showModal, sortVtemplatesByPurpose } from '../utils';
import { purposeList } from '@containers/vtemplates/VtemplateFormContainer/data';

const VtemplatesTableFormContainer = ({
    form,
    vtemplates,
}) => {
    const vtempatesWithPurpose = vtemplates.map(item => ({
        ...item,
        purpose: purposeList.find((purpose) => purpose.value === item?.params.dataToolbar?.purpose)?.label,
    }));

    const doAllItem = useMemo(() => Object.keys(form.getFieldsValue()).find(key => key.includes('global_do_all')), [])

    const global_do_all = Form.useWatch(`${doAllItem}`, form)
    const global_vtemplates = Form.useWatch('global_vtemplates', form)

    const sortVtemplatesByType = useMemo(() => sortVtemplatesByPurpose(vtempatesWithPurpose), [vtempatesWithPurpose]);

    const [mainSwitchState, setMainSwitchState] = useState({});

    const checkAllByVtemplatesMnemo = (value, mnemo) => {
        sortVtemplatesByType[mnemo].forEach(vtemplate => {
            const changedFormValue = {};

            changedFormValue[`vtemplates_switch&${vtemplate.id}`] = value;
            form.setFieldsValue({
                ...changedFormValue,
                ...changeVtemplateSwitch(value, vtemplate.id),
            });
        });
        setMainSwitchState(prev => ({ ...prev, [mnemo]: value }));
    };

    const updateMainSwitchState = (mnemo) => {
        const allChecked = sortVtemplatesByType[mnemo]
            ?.every(vtemplate => form.getFieldValue(`vtemplates_switch&${vtemplate.id}`));

        setMainSwitchState(prev => ({ ...prev, [mnemo]: allChecked }));
    };

    const ecTheme = useECTheme();
    const bgColor = ecTheme.getColorFromConfig({ element: 'tableHeaderBackground', section: 'table' });
    const textColor = ecTheme.getColorFromConfig({ element: 'tableHeaderTextColor', section: 'table' });

    useEffect(() => {
        // Инициализируем состояние главного переключателя
        const initialMainSwitchState = {};

        // console.log('form', formValues)
        Object.keys(sortVtemplatesByType).forEach(mnemo => {
            initialMainSwitchState[mnemo] = sortVtemplatesByType[mnemo]
                ?.every(vtemplate => form.getFieldValue(`vtemplates_switch&${vtemplate.id}`));
        });
        setMainSwitchState(initialMainSwitchState);
    }, [global_do_all, global_vtemplates]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <h3>Макеты</h3>
            { sortVtemplatesByType && Object.keys(sortVtemplatesByType).length > 0 ?
                Object.keys(sortVtemplatesByType).map(vtemplateMnemo => (
                    <Card
                        bodyStyle={{ margin: 0, padding: 0 }}
                        key={vtemplateMnemo}
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
                                {vtemplateMnemo}
                                <Switch
                                    checked={mainSwitchState[vtemplateMnemo]}
                                    onChange={(value) => {
                                        if (global_do_all || global_vtemplates) {
                                            showModal('Снимите глобальные разрешения')

                                            return
                                        }
                                        checkAllByVtemplatesMnemo(value, vtemplateMnemo);
                                    }}
                                />
                            </div>
                        }
                        headStyle={{ backgroundColor: bgColor, padding: 10 }}
                    >
                        <Table
                            key={vtemplateMnemo}
                            bordered
                            showHeader={false}
                            pagination={false}
                            columns={MENU_AND_VTEMPLATES_TABLE_COLUMNS}
                            dataSource={sortVtemplatesByType[vtemplateMnemo]?.map((vtemplate) => ({
                                key: vtemplate.id,
                                id: vtemplate.id,
                                name: vtemplate.name,
                                switch:
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <Form.Item
                                            name={`vtemplates_switch&${vtemplate.id}`}
                                            valuePropName="checked"
                                            style={{ margin: 0, marginRight: '5px' }}
                                            colon={false}
                                        >
                                            <Switch
                                                onChange={(value) => {
                                                    if (global_do_all || global_vtemplates) {
                                                        showModal('Снимите глобальные разрешения')
                                                        
                                                        return
                                                    }
                                                    form.setFieldsValue(changeVtemplateSwitch(value, vtemplate.id))
                                                    updateMainSwitchState(vtemplateMnemo)
                                                }}
                                            />
                                        </Form.Item>
                                        {vtemplate.ID}
                                    </div>
                            }))}
                        />
                    </Card>
                ))
                : <>Макеты не найдены</>}
        </div>
    );
}

export default VtemplatesTableFormContainer;
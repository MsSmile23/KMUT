import { CheckBox } from '@shared/ui/forms';
import { Form, Modal, Switch } from 'antd';
import { useMemo } from 'react';
import { CRUD, GLOBAL_PERMISSIONS, checkboxOnclickHandler, required_perms_mnemo, showModal } from '../utils';
import { ECTooltip } from '@shared/ui/tooltips';
import { CloseSquareOutlined } from '@ant-design/icons';
import { Table } from '@shared/ui/tables';



const confirmMessage = 'Без данного разрешения пользователь не сможет войти в систему.' +
    'Отключение разрешено только в целях тестирования доступов роли.'

const PermissionsTableFormContainer = ({ permissions, form, permissionsGroup }) => {
    const groupMode = Form.useWatch('groupMode', form);

    // const global_do_all = Form.useWatch(`${doAllItem}`, form);
    const doAllItem = useMemo(() => Object.keys(form.getFieldsValue()).find(key => key.includes('global_do_all')), []);
    const roleName = form.getFieldValue('name')

    const handleCheckboxChange = (name, e) => {
        const global = form.getFieldValue(`${doAllItem}`)

        if (global) {
            showModal('Снимите глобальные разрешения');
            form.setFieldValue(name, !e.target.checked);

            return;
        }
        form.setFieldsValue(
            checkboxOnclickHandler('column', null, name, e.target.checked, form.getFieldsValue(), showModal)
        );
    };

    // const createColumn = (title, dataIndex) => {

    //     const element = GLOBAL_PERMISSIONS.find(el => el?.name.split(' ')[0] === dataIndex)

    //     const permissionName = element?.name?.split(' ').join('_')
    //     const permissionId = element?.id

    //     return {
    //         title: (
    //             <div
    //                 style={{
    //                     display: 'flex',
    //                     alignItems: 'center',
    //                     flexDirection: 'column',
    //                     justifyContent: 'center'
    //                 }}
    //             >
    //                 {title}
    //                 <Form.Item
    //                     key={`global_${permissionName}&${permissionId}`}
    //                     name={`global_${permissionName}&${permissionId}`}
    //                     valuePropName="checked" 
    //                     style={{ margin: 0, marginRight: '5px' }}
    //                 >
    //                     <CheckBox onChange={(e) => handleCheckboxChange(dataIndex, e)} />
    //                 </Form.Item>
    //             </div>
    //         ),
    //         dataIndex,
    //         width: '10%',
    //         align: 'center',
    //     }

    // };
    const createColumn = (title, dataIndex) => ({
        title: (
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
                {title}
                <Form.Item name={dataIndex} valuePropName="checked" style={{ margin: 0, marginRight: '5px' }}>
                    <CheckBox onChange={(e) => handleCheckboxChange(dataIndex, e)} />
                </Form.Item>
            </div>
        ),
        dataIndex,
        width: '10%',
        align: 'center',
    });

    const MATRIX_COLUMNS = [
        {
            title: 'Модуль',
            dataIndex: 'module',
            width: '20%',
        },
        createColumn('Получение', 'get'),
        createColumn('Создание', 'create'),
        createColumn('Обновление', 'update'),
        createColumn('Удаление', 'delete'),
        createColumn('Разное', 'other'),
        {
            title: '',
            dataIndex: 'actions',
        },
    ];

    // console.log('permissions', permissions)

    const rows = useMemo(() => {
        const localRows = [];
        const itteratedObject = groupMode ? permissionsGroup : permissions;

        itteratedObject?.forEach((perm) => {
            const row = {
                module: (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Form.Item
                            name={`${perm.mnemo}${groupMode && '_forGroup'}`}
                            valuePropName="checked"
                            style={{ margin: 0, marginRight: '5px' }}
                            colon={false}
                            labelAlign="right"
                        >
                            <CheckBox
                                onChange={(e) => {
                                    const doAllItem = Object
                                        .keys(form.getFieldsValue()).find(key => key.includes('global_do_all'))
                                    const global = form.getFieldValue(`${doAllItem}`)

                                    if (global) {
                                        showModal('Снимите глобальные разрешения');
                                        form.setFieldValue(
                                            `${perm.mnemo}${groupMode && '_forGroup'}`,
                                            !e.target.checked
                                        );

                                        return;
                                    }
                                    form.setFieldsValue(
                                        checkboxOnclickHandler('row',
                                            perm.mnemo,
                                            null,
                                            e.target.checked,
                                            form.getFieldsValue(),
                                            showModal)
                                    );
                                }}
                            />
                        </Form.Item>
                        {perm.name}
                    </div>
                ),
                key: `${perm.mnemo}_key`,
            };

            let otherPerms = perm.permissions;

            CRUD.forEach((item) => {
                const localPermission = groupMode
                    ? perm
                    : perm.permissions?.find((pr) => pr.name == `${item} ${perm.mnemo}`);

                if (localPermission) {
                    otherPerms = groupMode ? [] : otherPerms.filter((pr) => pr.id !== localPermission.id);
                }
                row[item] = (localPermission) ? (
                    <Form.Item
                        name={`${perm.mnemo}_${item}${!groupMode ? '&' + localPermission?.id : '_forGroup'}`}
                        valuePropName="checked"
                        style={{ margin: 0 }}
                    // initialValue={item == 'get' && required_perms_mnemo.includes(perm.mnemo) && 'checked'}
                    >
                        <CheckBox
                            onChange={(e) => {
                                const doAllItem = Object
                                    .keys(form.getFieldsValue()).find(key => key.includes('global_do_all'))
                                const global = form.getFieldValue(`${doAllItem}`)

                                if (global) {
                                    showModal('Снимите глобальные разрешения');
                                    form.setFieldValue(
                                        `${perm.mnemo}_${item}${!groupMode ? '&' + localPermission?.id : '_forGroup'}`,
                                        !e.target.checked
                                    );

                                    return;
                                }

                                if (item == 'get' && required_perms_mnemo.includes(perm.mnemo)) {
                                    Modal.confirm({
                                        title: 'Подтверждение',
                                        content: confirmMessage,
                                        okText: 'Да',
                                        cancelText: 'Нет',
                                        onOk: () => {
                                            form.setFieldsValue(
                                                checkboxOnclickHandler(
                                                    'cell',
                                                    perm.mnemo,
                                                    item,
                                                    e.target.checked,
                                                    form.getFieldsValue(),
                                                    showModal
                                                )
                                            );
                                        },
                                        onCancel: () => {
                                            form.setFieldValue(
                                                `${perm.mnemo}_${item}${!groupMode
                                                    ? '&' + localPermission?.id
                                                    : '_forGroup'}`,
                                                !e.target.checked
                                            );
                                        },
                                    });
                                } else {
                                    // Обычная логика, если perm.mnemo не в required_perms_mnemo
                                    form.setFieldsValue(
                                        checkboxOnclickHandler(
                                            'cell',
                                            perm.mnemo,
                                            item,
                                            e.target.checked,
                                            form.getFieldsValue(),
                                            showModal
                                        )
                                    );
                                }
                            }}
                        />
                    </Form.Item>
                ) : (
                    roleName == 'super-admin'
                        ? <CheckBox checked={true} />
                        :
                        <ECTooltip title="Запрещено для вашей роли">
                            <CloseSquareOutlined />
                        </ECTooltip>
                );
            });

            if (otherPerms?.length > 0 && !groupMode) {
                row.other = otherPerms.map((item) => (
                    <div key={`key_${item.id}`} style={{ display: 'flex', alignItems: 'center' }}>
                        <Form.Item
                            name={`${perm.mnemo}_other&${item.id}`}
                            valuePropName="checked"
                            style={{ margin: 0, marginRight: '5px' }}
                        >
                            <CheckBox
                                onChange={(e) => {
                                    const global = form.getFieldValue(`${doAllItem}`)

                                    if (global) {
                                        showModal('Снимите глобальные разрешения');
                                        form.setFieldValue(
                                            `${perm.mnemo}_other&${item.id}`,
                                            !e.target.checked
                                        );

                                        return;
                                    }
                                    form.setFieldsValue(
                                        checkboxOnclickHandler(
                                            'cell',
                                            perm.mnemo,
                                            'other',
                                            e.target.checked,
                                            form.getFieldsValue(),
                                            showModal)
                                    );
                                }}
                            />
                        </Form.Item>
                        {item.label}
                    </div>
                ));
            }
            localRows.push(row);
        });

        return localRows;
    }, [permissions, groupMode]);

    return (
        <>
            <div style={{ display: 'flex', alignItems: 'center', margin: '0 0 10px 0' }}>
                Тонкая настройка
                <Form.Item name="groupMode" valuePropName="checked" style={{ margin: '0 15px' }}>
                    <Switch />
                </Form.Item>
                Группа разрешений
            </div>
            <Table rows={rows} columns={MATRIX_COLUMNS} pagination={false} />
        </>
    );
};

export default PermissionsTableFormContainer;
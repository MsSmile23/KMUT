import { IPage } from '@containers/widgets/WidgetPageHeader/types/WidgetPageHeaderTypes'
import { IMenuConstructor } from '@pages/navigation-settings/menu/components/utils'
import { SERVICES_ROLES } from '@shared/api/Roles'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { useConfigStore } from '@shared/stores/config'
import { IPermissionsGroup } from '@shared/types/permissions'
import { responseErrorHandler } from '@shared/utils/common'
import { getURL } from '@shared/utils/nav'
import { Modal } from 'antd'
import { includes, isArray } from 'lodash'

type TableCellType = 'row' | 'column' | 'cell'

type MobileAndWebPermissionsObjectType = Record<'web'|'mobile', {
    id: number
    name: string
    title: string
}>

type Crud = 'all' | 'get' | 'create' | 'update' | 'delete'

type GlobalPermissions = Record<Crud, {
    title: string
    name: string
    id: number | null
}>

export const sortVtemplatesByPurpose = (vtempatesWithPurpose) => {
    const sortedVtemplates = {}

    vtempatesWithPurpose.forEach(vtemplate => {

        if (Object.keys(sortedVtemplates).includes(vtemplate.purpose)) {
            sortedVtemplates[vtemplate.purpose].push(vtemplate)
        } else {
            sortedVtemplates[vtemplate.purpose] = [vtemplate]
        }
    });

    return sortedVtemplates
}

export const changeVtemplateSwitch = (value: boolean, vtemplate_id: number) => {

    const pages: IPage[] = JSON.parse(useConfigStore.getState()?.store?.data?.
        find(el => el.mnemo == 'front_pages')?.value)
    
    const menues: IMenuConstructor[] = JSON.parse(useConfigStore.getState()?.store?.data?.
        find(el => el.mnemo == 'front_menu')?.value)

    const newFormData = {}

    pages?.forEach(page => {
        if (page.vtemplate_id == vtemplate_id) {
            newFormData[`${`pages_switch&${page.id}`}`] = value
            menues.forEach(menu => {
                menu.menu?.forEach(submenu => {
                    if (submenu?.page == page.id || submenu?.screen == page.id) {
                        newFormData[`${`menues_switch/${menu.type}&${submenu.id}`}`] = value
                    }
                })
            })
        }
    })
    
    return newFormData
}
export const changePagesSwitch = (value: boolean, page_id: number) => {

    const menues: IMenuConstructor[] = JSON.parse(useConfigStore.getState()?.store?.data?.
        find(el => el.mnemo == 'front_menu')?.value)

    const newFormData = {}

    newFormData[`${`pages_switch&${page_id}`}`] = value
    menues.forEach(menu => {
        menu.menu?.forEach(submenu => {
            if (submenu?.page == page_id || submenu?.screen == page_id) {
                newFormData[`${`menues_switch/${menu.type}&${submenu.id}`}`] = value
            }
        })
    })
    
    return newFormData
}

export const ROLES_TABLE_COLUMN = [
    {
        title: 'ID',
        dataIndex: 'id',
    },
    {
        title: 'Название',
        dataIndex: 'name',
    },

    {
        title: 'Действия',
        dataIndex: 'actions',
        key: 'actions',
        width: '5%',
    },
]

export const MENU_AND_VTEMPLATES_TABLE_COLUMNS = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 1,
        align: 'center' as const
    },
    {
        title: 'Название',
        dataIndex: 'name',
        key: 'name',
        width: '100%'
    },
    {
        title: 'Switch',
        dataIndex: 'switch',
        width: 1,
        key: 'switch',
        align: 'center' as const,
        disableFilter: true,
        disableSort: true
    }
]

export const PAGES_TABLE_COLUMN = [
    {
        title: 'Название',
        dataIndex: 'name',
        key: 'name',
        width: '50%'
    },
    {
        title: 'URL',
        dataIndex: 'url',
        key: 'url',
        width: '50%',
        align: 'left' as const
    },
    {
        title: 'Switch',
        dataIndex: 'switch',
        width: 1,
        key: 'switch',
        align: 'center' as const,
        disableFilter: true,
        disableSort: true
    }
]

export const INTERFACE_ELEMENTS = [
    {
        title: 'Макеты и страницы',
        name: 'vtemplates'
    }
]

export const INTERFACES_SECTION = [
    {
        title: 'Конструктор',
        name: 'constructors',
        value: 'constructor',
    },
    {
        title: 'Менеджер',
        name: 'manager',
        value: 'manager',
    },
    {
        title: 'Витрина',
        name: 'showcase',
        value: 'showcase',
    },
]

export const CRUD_SECTION = [
    {
        title: 'Получение',
        name: 'get',
    },
    {
        title: 'Создание',
        name: 'create',
    },
    {
        title: 'Обновление',
        name: 'update',
    },
    {
        title: 'Удаление',
        name: 'delete',
    },
]

export const GLOBAL_PERMISSIONS = [
    {
        title: 'Получение',
        name: 'get all',
    },
    {
        title: 'Создание',
        name: 'create all',
    },
    {
        title: 'Обновление',
        name: 'update all',
    },
    {
        title: 'Удаление',
        name: 'delete all',
    },
    {
        title: 'Разрешено всё',
        name: 'do all',
    }
]

export const CRUD = ['get', 'create', 'update', 'delete']

const getOtherPerms = (allPermissions: IPermissionsGroup[]): number[] => {
    const otherPerms: number[] = []

    allPermissions
        .forEach(permGroup => {
            permGroup.children.forEach(perm => {
                const mnemo = perm.mnemo

                const others = perm.permissions
                    .filter(el => (el.name !== `${el.name.split(' ')[0]} ${mnemo}` 
                    || !CRUD.includes(el.name.split(' ')[0]))  
                    && el.name !== 'login web' 
                    && el.name !== 'login mobile')

                if (others) {
                    others.forEach(perm => otherPerms.push(perm.id))
                }
            })
        })
    
    return otherPerms
}

const getPasswordRequirements = (form) => {
    const password_requirements = {}

    for (const [key, value] of Object.entries(form)) {
        if (key.split('_')[0] === 'password') {
            password_requirements[key] = value
        }
    }

    return password_requirements
}

export const prepareData = async (
    id: number,
    allPermissions, 
    permissions, 
    formFieldsValues, 
    MOBILE_AND_WEB_PERMISSIONS: MobileAndWebPermissionsObjectType,
    GLOBAL_PERMISSIONS: GlobalPermissions
) => {
    let formData: Record<string, boolean | string> = {};
    const otherPerms = getOtherPerms(allPermissions)

    const countOfType = (name, type) => {
        const methodPerm = []

        allPermissions.find(el => el.mnemo == name).children
            .forEach(permission => {
                permission.permissions.forEach(method => {
                    if (method.name == `${type} ${permission.mnemo}`) {
                        methodPerm.push(method.id)
                    }
                })
            });

        return methodPerm
    }

    const createPermissionsObject = (types) => {
        const actions = ['get', 'create', 'update', 'delete'];

        return types.reduce((acc, type) => {
            acc[type] = actions.reduce((actionAcc, action) => {
                actionAcc[action] = countOfType(type, action);
                
                return actionAcc;
            }, {});
            
            return acc;
        }, {});
    };
    
    // Список типов прав доступа
    const types = allPermissions.map(perm => perm.mnemo)

    const countOfPermissions = createPermissionsObject(types);

    // Выставляем необходимые разрешения при первом заходе в форму
    if (id == undefined && permissions.length > 0) {
        permissions?.forEach(perm => {
            if (required_perms_mnemo.includes(perm.mnemo)) {
                const permId = perm?.permissions?.find(el => el.name.includes('get'))?.id

                formData[`${perm.mnemo}_get&${permId}`] = true
            }
        })
    }
    
    if (id !== undefined && permissions.length > 0) {
        try {
            const res = await SERVICES_ROLES.Models.getRoleById(id);
            const mobileAndWebPermsIds = Object.values(MOBILE_AND_WEB_PERMISSIONS).map(el => el.id)
            const globalPermsIds = Object.values(GLOBAL_PERMISSIONS).map(el => el.id)

            if (res.data) {
                const data = res.data;
                const lengthOfPermsResponse = {}
                const lengthOfPermsStore = {}
                const permIds = data?.permissions.map(el => el.id)

                permissions.forEach(permSections => {
                    lengthOfPermsStore[permSections.mnemo] = permSections.permissions.length
                })

                data?.permissions
                    .forEach((permission) => {
                        const [type, ...name] = permission.name.split(' ')

                        const permName = name.join(' ')

                        if (!permissions.find(perm => perm.mnemo == permName)) {
                            permissions.forEach(perms => {
                                perms.permissions.forEach((perm) => {
                                    if (perm.name == `${type} ${permName}` || !CRUD.includes(perm.name.split(' ')[0])) {
                                        // console.log(perm.name)
                                        formData[`${perms.mnemo}_other&${permission.id}`] = true
                                    }
                                })
                            })
                        }

                        if (!CRUD.includes(type) 
                            && !mobileAndWebPermsIds.includes(permission.id)) {
                            formData[`${permName}_other&${permission.id}`] = true
                        }

                        if (mobileAndWebPermsIds.includes(permission.id)) {
                            const permObject = Object
                                .values(MOBILE_AND_WEB_PERMISSIONS)
                                .find((perm) => perm.id == permission.id)
                            const key = `${permObject?.name}&${permObject?.id}`

                            formData[key] = true
                        }

                        if (globalPermsIds.includes(permission.id)) {
                            const permObject = Object
                                .values(GLOBAL_PERMISSIONS)
                                .find((perm) => perm.id == permission.id)
                            const key = `global_${permObject?.name.split(' ').join('_')}&${permObject?.id}`

                            // console.log('permObject?.name.split()[0]', permObject?.name.split('_')[0])
                            formData[permObject?.name.split('_')[0]] = true
                            formData[key] = true
                        }

                        if (lengthOfPermsResponse[permName]) {
                            lengthOfPermsResponse[permName]++
                        } else {
                            lengthOfPermsResponse[permName] = 1
                        }

                        if (lengthOfPermsStore[permName] == lengthOfPermsResponse[permName]) {
                            formData[permName] = true;
                        }

                        formData[`${permName}_${type}&${permission.id}`] = true
                    });


                if (data?.interface_elements) {
                    const interfaceElementsKey = Object.keys(data.interface_elements)

                    interfaceElementsKey.forEach((key) => {

                        if (isArray(data.interface_elements[key]?.elements)) {
                            data.interface_elements[key]?.elements?.forEach((element) => {
                                formData[`${key}_switch&${element.id}`] = element.enabled
                            })
                            
                            return
                        }
 
                        if (data?.interface_elements[key]?.elements) {
                            Object.keys(data?.interface_elements[key]?.elements)?.forEach((key2) => {
                                data.interface_elements[key]?.elements[key2].forEach(element => {
                                    formData[`${key}_switch/${key2}&${element.id}`] = element.enabled
                                })
                            })
                        }  
                    })
                }

                if (otherPerms.every(perm => permIds.includes(perm))) {
                    formData['other'] = true
                }
                
                INTERFACES_SECTION.forEach((item) => {

                    if (data.interfaces.includes(item.value)) {
                        formData[`${item.name}_interfaces`] = true;
                    }
                });
                // Если каждый айдишник из permsIds есть в группе пермишинов, то ставим чекбокс

                // console.log(permIds)

                Object.keys(countOfPermissions).forEach(key => {
                    Object.keys(countOfPermissions[key]).forEach(item => {
                        if (countOfPermissions[key][item].every(id => permIds.includes(id))) {
                            const formKey = `${key}_${item}_forGroup`

                            formData[formKey] = true
                        }
                    })
                })


                formData.name = data.name;
                formData.get_all = data.permissions_flg.get;
                formData.create_all = data.permissions_flg.create;
                formData.update_all = data.permissions_flg.update;
                formData.delete_all = data.permissions_flg.delete;
                // Сюда добавляем остальные элементы интерфейса (попробовать оптимизировать)
                formData.global_vtemplatesAndPages = data.interface_elements?.vtemplates.global
                formData.global_vtemplates = data.interface_elements?.vtemplates.global
                
                //Требования к паролю
                formData.password_min_length = data.password_min_length
                formData.password_change_freq_max_days = data.password_change_freq_max_days
                formData.password_expiration_days = data.password_expiration_days
                formData.password_last_unique_count_min = data.password_last_unique_count_min

                // -------------------------

                Object.keys(data.permissions_flg)
                    .filter((key) => CRUD.includes(key))
                    .forEach((item) => {
                        if (data.permissions_flg[item]) {
                            formData = allowAllCheckboxes(item, formData, formFieldsValues);
                        }
                    });
                
                return formData;
            }
        } catch (error) {
            console.error('Error fetching role data:', error)
            throw error
        }
    }
    
    return formData;
};

const allowAllCheckboxes = (mnemo, formData, formFieldsValues) => {
    const columnCheckBoxes = Object.keys(formFieldsValues).filter((item) => item.includes(`${mnemo}`))

    const newFormData = { ...formData }

    columnCheckBoxes.forEach((item) => {
        newFormData[item] = true
    })
    
    return newFormData
}

export const saveRoleButtonHandler = async (formFieldsValues, id, navigate, allPermissions) => {
    const interfaces = []
    const permissions: number[] = []
    const otherPerms: number[] = getOtherPerms(allPermissions)
    const password_requirements = getPasswordRequirements(formFieldsValues)

    INTERFACES_SECTION.forEach((item) => {
        if (formFieldsValues[`${item.name}_interfaces`]) {
            interfaces.push(item.value)
        }
    })

    const menuesTypes = JSON.parse(useConfigStore.getState()?.store?.data?.
        find(el => el.mnemo == 'front_menu')?.value).map(menu => menu.type)

    const menuesElements = {}

    menuesTypes.forEach(type => menuesElements[type] = [])

    const vtemplates = {
        elements: [],
        global: formFieldsValues.global_vtemplates ?? formFieldsValues.global_vtemplatesAndPages
    }
    const menues = {
        elements: menuesElements,
        global: formFieldsValues.global_vtemplates ?? formFieldsValues.global_vtemplatesAndPages
    }
    const pages = {
        elements: [],
        global: formFieldsValues.global_vtemplates ?? formFieldsValues.global_vtemplatesAndPages
    }

    formFieldsValues.groupMode
        ? Object.keys(formFieldsValues)
            .filter((item) => item.includes('forGroup') || item.includes('switch') || item.includes('&'))
            .forEach((perm) => {

                if (perm.includes('vtemplates_switch')) {
                    vtemplates.elements.push({
                        id: Number(perm.split('&')[1]),
                        enabled: !!formFieldsValues[perm]
                    })
                    
                    return
                }

                if (perm.includes('menues_switch')) {
                    menues?.elements[perm.split('/')[1]]?.push({
                        id: Number(perm.split('&')[1]),
                        enabled: !!formFieldsValues[perm]
                    })
                    
                    return
                }

                if (perm.includes('pages_switch')) {
                    pages.elements.push({
                        id: perm.split('&')[1],
                        enabled: !!formFieldsValues[perm]
                    })
                    
                    return
                }
                const [permMnemo, permId] = perm.split('&')

                if (formFieldsValues[permMnemo] && perm.includes('&')) {

                    permissions.push(Number(permId))
                    
                    return
                }

                if (formFieldsValues[perm]) {
                    const [group, type] = perm.split('_')

                    // Отфильтровать от others
                    allPermissions.find(el => group == el.mnemo)?.children
                        ?.forEach(permGroup => {
                            const permId = permGroup.permissions.find(el => el.name.includes(type))?.id

                            if (permId) {
                                permissions.push(permId)
                            }
                        })
                }
            })
        : Object.keys(formFieldsValues)
            .filter((item) => item.includes('&'))
            .forEach((perm) => {
                const [permMnemo, permId] = perm.split('&')

                // Сделать универсально для vtemplates и всё что будет далее
                if (formFieldsValues[perm] && !permMnemo.includes('vtemplates_switch') 
                    && !permMnemo.includes('menues_switch') 
                    && !permMnemo.includes('pages_switch')) {
                    permissions.push(Number(permId))
                }

                if (permMnemo == 'vtemplates_switch') {
                    vtemplates.elements.push({
                        id: Number(permId),
                        enabled: !!formFieldsValues[perm]
                    })
                }

                if (permMnemo.includes('menues_switch')) {
                    menues.elements[permMnemo.split('/')[1]]?.push({
                        id: Number(permId),
                        enabled: !!formFieldsValues[perm]
                    })
                }

                if (permMnemo == 'pages_switch') {
                    pages.elements.push({
                        id: permId,
                        enabled: !!formFieldsValues[perm]
                    })
                }


            })
    

    if (formFieldsValues['other'] && formFieldsValues['groupMode']) {
        permissions.push(...otherPerms)
    }

    const payload: any = {
        name: formFieldsValues?.name,
        permissions_flg: {
            get: formFieldsValues?.get_all ?? false,
            create: formFieldsValues?.create_all ?? false,
            update: formFieldsValues?.update_all ?? false,
            delete: formFieldsValues?.delete_all ?? false,
            view: false,
            edit: false,
            mass_ops: false,
            export: false,
            interface_elements: true
        },
        interface_elements: {
            vtemplates,
            menues,
            pages,
        },
        interfaces: interfaces,
        permissions: permissions,
        ...password_requirements
    }

    const resp = id
        ? await SERVICES_ROLES.Models.putRoleById(String(id), payload)
        : await SERVICES_ROLES.Models.postRole(payload)

    if (resp.success) {
        Modal.success({
            content: 'Роль успешно сохранена',
        })
        navigate(getURL(`${ROUTES.ROLES}/${ROUTES_COMMON.LIST}`, 'manager'))
    } else {
        console.log({ response: resp, modal: Modal, errorText: 'Ошибка в сохранении роли' })
        responseErrorHandler({ response: resp, modal: Modal, errorText: 'Ошибка в сохранении роли' })
    }
}

export const allowAllCheckboxOnclickHandler = (column, checked, formValues) => {
    const newFormValues = { ...formValues }
    const columnCheckBoxes = Object.keys(newFormValues).filter((item) => item.includes(`${column}`))

    columnCheckBoxes.forEach((item) => {
        const mnemo = item.split('_')[0]

        if (!(column == 'get' && required_perms_mnemo.includes(mnemo))) {
            newFormValues[item] = checked
            const [key, value] = checkAllCheckboxes('column', checked, item, newFormValues)
    
            newFormValues[key] = value 
        }
    })
    
    return newFormValues
}

export const checkAllCheckboxes = (type: Omit<TableCellType, 'cell'>, value, mnemo, formValues) => {

    const checker = type == 'column' ? mnemo?.split('_')[0] : mnemo.split('_')[1].split('&')[0]

    const chosenCheckboxes = Object.keys(formValues).filter(
        (item) =>
            item.includes(type == 'column' ? `${checker}_` : `_${checker}`) && item.includes(`-${checker}`) == false
    )
    let flag = true

    chosenCheckboxes.forEach((item) => {
        if (formValues[item] !== value || value == false) {
            flag = false
        }
    })
    
    return [checker, flag]
}

const checkChangePermission = (type: Omit<TableCellType, 'cell'>, formValues, mnemo, checked) => {
    if (type == 'row') {
        const allAlowCheckbox = Object.keys(formValues).filter((item) => item.includes('_all'))
        let checker = false

        allAlowCheckbox.forEach((item) => {
            if (formValues[item] == true) {
                checker = true
            }
        })
        
        return checker && checked == false
    }
    
    return formValues[`${mnemo}_all`]
}

//TODO добавить обработку на наличие item в обязательных пермишенах!
const selectAllGroup = (group, type, formValues, checked) => {

    group.forEach((item) => {
        formValues[item] = checked
        const [key, value] = checkAllCheckboxes(type, checked, item, formValues)

        const mnemo = item.split('_')[0]
        const method = item.split('_')[1].split('&')[0]


        if (required_perms_mnemo.includes(mnemo) && method === 'get') {
            formValues[item] = true
           
            return
        }

        formValues[key] = value
    })

    return formValues
}

export const showModal = (content) => {
    Modal.warning({
        title: 'Внимание!',
        content
    });
}

export const required_perms_mnemo = [
    'roles', 'configs', 'data-type', 'attribute-stereotypes', 'classes',
    'attributes', 'links', 'attribute-categories', 'class-attributes', 
    'view-types', 'states', 'vtemplates', 'associations', 'relations']

export const checkboxOnclickHandler = (
    type: TableCellType, 
    rowMnemo: string, 
    columnMnemo: string, 
    checked: boolean, 
    formValues, 
    showModal: (content: string) => void,
) => {
    const newFormValue = { ...formValues }

    if (checkChangePermission(type, newFormValue, columnMnemo, checked)) {

        if (type == 'cell') {
            const cellMnemo = Object.keys(newFormValue).find(el => el.includes(`${rowMnemo}_${columnMnemo}`))

            newFormValue[cellMnemo] = !checked
        }
 
        if (type == 'row') {
            newFormValue[`${rowMnemo}`] = !checked
        }

        if (type == 'column') {
            newFormValue[`${columnMnemo}`] = !checked
        }
        showModal(`Для редактирования выбранного ${type} снимите галочку с Разрешить всё`)
        
        return newFormValue
    }
    const rowsCheckBoxes = Object.keys(newFormValue).filter(
        (item) => item.includes(`${rowMnemo}_`) 
            && item.split('_')[0] == rowMnemo 
            && !item.includes(`-${rowMnemo}`) 
            && item.split('_')[1] != 'interfaces'
    )
    const columnCheckBoxes = Object.keys(newFormValue).filter((item) => item.includes(`_${columnMnemo}`))

    if (type == 'column') {
        return selectAllGroup(columnCheckBoxes, 'column', newFormValue, checked)
    }

    if (type == 'row') {
        return selectAllGroup(rowsCheckBoxes, 'row', newFormValue, checked)
    }

    newFormValue[columnMnemo] = !columnCheckBoxes.some((item) => newFormValue[item] !== checked || checked == false)
    newFormValue[rowMnemo] = !rowsCheckBoxes.some((item) => newFormValue[item] !== checked || checked == false)

    return newFormValue
};
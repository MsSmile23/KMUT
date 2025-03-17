import { ROUTES } from '@shared/config/paths';
import { IObjectAttribute } from '@shared/types/objects';

export const breadCrumbs = [
    {
        path: ROUTES.MAIN,
        breadcrumbName: 'Главная',
    },

    {
        path: '/dev/ardev/',
        breadcrumbName: 'Тестовая страница Артёма',
    },
];


export const oa162: IObjectAttribute = {
    'id': 162,
    'object_id': 43,
    'attribute_id': 255,
    // eslint-disable-next-line max-len
    'attribute_value': '[[{"value":"C:\\USERS\\Димон\\Downloads\\302.xlsx"},{"value":"0.0284MB"}],[{"value":"C:\\USERS\\Димон\\Downloads\\310.xlsx"},{"value":"0.0087MB"}],[{"value":"C:\\USERS\\Димон\\Downloads\\4253.xlsx"},{"value":"0.1257MB"}],[{"value":"C:\\USERS\\Димон\\Downloads\\5121.xlsx"},{"value":"0.1868MB"}],[{"value":"C:\\USERS\\Димон\\Downloads\\amCharts.jpg"},{"value":"0.0779MB"}],[{"value":"C:\\USERS\\Димон\\Downloads\\amCharts.pdf"},{"value":"0.0916MB"}],[{"value":"C:\\USERS\\Димон\\Downloads\\data.xlsx"},{"value":"0.16MB"}],[{"value":"C:\\USERS\\Димон\\Downloads\\DbSchema_9_4_0.exe"},{"value":"146.3171MB"}],[{"value":"C:\\USERS\\Димон\\Downloads\\inventory-from-report-02.09.2022, 15_49_04.xlsx"},{"value":"0.0067MB"}],[{"value":"C:\\USERS\\Димон\\Downloads\\inventory-from-report-02.09.2022, 15_49_40.xlsx"},{"value":"0.0067MB"}],[{"value":"C:\\USERS\\Димон\\Downloads\\inventory-from-report-02.09.2022, 15_50_11.xlsx"},{"value":"0.0067MB"}],[{"value":"C:\\USERS\\Димон\\Downloads\\inventory-from-report-02.09.2022, 15_50_42.xlsx"},{"value":"0.0069MB"}],[{"value":"C:\\USERS\\Димон\\Downloads\\inventory-from-report-02.09.2022, 15_51_04.xlsx"},{"value":"0.007MB"}],[{"value":"C:\\USERS\\Димон\\Downloads\\inventory-from-report-02.09.2022, 16_28_17.xlsx"},{"value":"0.0067MB"}],[{"value":"C:\\USERS\\Димон\\Downloads\\inventory-from-report-25.08.2022, 16_27_23.xlsx"},{"value":"0.0076MB"}],[{"value":"C:\\USERS\\Димон\\Downloads\\inventory-from-report-25.08.2022, 16_27_38.xlsx"},{"value":"0.0076MB"}],[{"value":"C:\\USERS\\Димон\\Downloads\\LibreOffice_7.4.1_Win_x64.msi"},{"value":"338.9297MB"}],[{"value":"C:\\USERS\\Димон\\Downloads\\licence-001-13-10-2022.lic"},{"value":"0.001MB"}],[{"value":"C:\\USERS\\Димон\\Downloads\\massop-report-1 (1).xlsx"},{"value":"0MB"}],[{"value":"C:\\USERS\\Димон\\Downloads\\massop-report-1.xlsx"},{"value":"0MB"}],[{"value":"C:\\USERS\\Димон\\Downloads\\massop-report-2 (1).xlsx"},{"value":"0.0063MB"}],[{"value":"C:\\USERS\\Димон\\Downloads\\massop-report-2.xlsx"},{"value":"0.0063MB"}],[{"value":"C:\\USERS\\Димон\\Downloads\\massop-report-3 (1).xlsx"},{"value":"0.0066MB"}],[{"value":"C:\\USERS\\Димон\\Downloads\\massop-report-3 (2).xlsx"},{"value":"0.0066MB"}],[{"value":"C:\\USERS\\Димон\\Downloads\\massop-report-3.xlsx"},{"value":"0.0066MB"}],[{"value":"C:\\USERS\\Димон\\Downloads\\massop-report-5.xlsx"},{"value":"0.0066MB"}],[{"value":"C:\\USERS\\Димон\\Downloads\\massop-report-7.xlsx"},{"value":"0.0066MB"}],[{"value":"C:\\USERS\\Димон\\Downloads\\massop-report-8 (1).xlsx"},{"value":"0.0066MB"}],[{"value":"C:\\USERS\\Димон\\Downloads\\massop-report-8.xlsx"},{"value":"0.0066MB"}],[{"value":"C:\\USERS\\Димон\\Downloads\\metric_139_data_13.04.2023-13.04.2023.txt"},{"value":"0.3118MB"}],[{"value":"C:\\USERS\\Димон\\Downloads\\oKv8J_al.exe.part"},{"value":"2.7278MB"}],[{"value":"C:\\USERS\\Димон\\Downloads\\putty-64bit-0.78-installer.msi"},{"value":"3.5342MB"}],[{"value":"C:\\USERS\\Димон\\Downloads\\report-14.xlsx"},{"value":"0.0068MB"}],[{"value":"C:\\USERS\\Димон\\Downloads\\report-15.xlsx"},{"value":"0.0066MB"}],[{"value":"C:\\USERS\\Димон\\Downloads\\report-16.xlsx"},{"value":"0.0069MB"}],[{"value":"C:\\USERS\\Димон\\Downloads\\report-20.xlsx"},{"value":"0.0199MB"}],[{"value":"C:\\USERS\\Димон\\Downloads\\report-406.xlsx"},{"value":"0.1503MB"}],[{"value":"C:\\USERS\\Димон\\Downloads\\report-409.csv"},{"value":"0.0001MB"}],[{"value":"C:\\USERS\\Димон\\Downloads\\report-411.pdf"},{"value":"0.1298MB"}],[{"value":"C:\\USERS\\Димон\\Downloads\\report-411.xlsx"},{"value":"0.2098MB"}],[{"value":"C:\\USERS\\Димон\\Downloads\\report-412.xlsx"},{"value":"0.0062MB"}],[{"value":"C:\\USERS\\Димон\\Downloads\\SkrinshoterSetup_v3.11.2.17.exe"},{"value":"3.4147MB"}],[{"value":"C:\\USERS\\Димон\\Downloads\\system-id-1 (1).txt"},{"value":"0MB"}],[{"value":"C:\\USERS\\Димон\\Downloads\\system-id-1 (2).txt"},{"value":"0MB"}],[{"value":"C:\\USERS\\Димон\\Downloads\\system-id-1 (3).txt"},{"value":"0MB"}],[{"value":"C:\\USERS\\Димон\\Downloads\\system-id-1 (4).txt"},{"value":"0MB"}],[{"value":"C:\\USERS\\Димон\\Downloads\\system-id-1.txt"},{"value":"0MB"}],[{"value":"C:\\USERS\\Димон\\Downloads\\КМУТ АПИ v1.22.docx"},{"value":"0.1027MB"}]]',
    'attribute': {
        'id': 255,
        'name': 'Содержимое папки "Загрузки"',
        'visibility': 'private',
        'multiplicity_left': 0,
        'multiplicity_right': null,
        'attribute_category_id': null,
        'data_type_id': 6,
        'attribute_stereotype_id': 138,
        'classes_ids': [
            {
                'id': 43
            }
        ],
        'classes': [
            {
                'id': 43,
                'name': 'Пользователь АРМ',
                'package_id': 1,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 36,
                'pivot': {
                    'attribute_id': 255,
                    'class_id': 43
                }
            }
        ],
        'package_id': 1,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': true,
        'readonly': true,
        'initial_value': '',
        'static_feature': null,
        'view_type_id': 1
    }
}
export const oa163: IObjectAttribute = {
    'id': 163,
    'object_id': 43,
    'attribute_id': 254,
    // eslint-disable-next-line max-len
    'attribute_value': 'https://ru.wikipedia.org/wiki/%D0%A1%D0%B2%D1%8F%D1%89%D0%B5%D0%BD%D0%BD%D0%B0%D1%8F_%D0%A0%D0%B8%D0%BC%D1%81%D0%BA%D0%B0%D1%8F_%D0%B8%D0%BC%D0%BF%D0%B5%D1%80%D0%B8%D1%8F',
    attribute: {
        'id': 254,
        'name': 'История браузера',
        'visibility': 'private',
        'multiplicity_left': 0,
        'multiplicity_right': null,
        'attribute_category_id': null,
        'data_type_id': 3,
        'attribute_stereotype_id': 134,
        'classes_ids': [
            {
                'id': 43
            }
        ],
        'classes': [
            {
                'id': 43,
                'name': 'Пользователь АРМ',
                'package_id': 1,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 36,
                'pivot': {
                    'attribute_id': 254,
                    'class_id': 43
                }
            }
        ],
        'package_id': 1,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': true,
        'readonly': true,
        'initial_value': null,
        'static_feature': null,
        'view_type_id': 3
    }
}


export const oa164: IObjectAttribute = {
    'id': 164,
    'object_id': 43,
    'attribute_id': 253,
    'attribute_value': '2',
    'attribute': {
        'id': 253,
        'name': 'Активность пользователя',
        'visibility': 'private',
        'multiplicity_left': 0,
        'multiplicity_right': null,
        'attribute_category_id': null,
        'data_type_id': 1,
        'attribute_stereotype_id': 132,
        'classes_ids': [
            {
                'id': 43
            }
        ],
        'classes': [
            {
                'id': 43,
                'name': 'Пользователь АРМ',
                'package_id': 1,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 36,
                'pivot': {
                    'attribute_id': 253,
                    'class_id': 43
                }
            }
        ],
        'package_id': 1,
        'sort_order': 1,
        'unit': 'Значение',
        'history_to_cache': false,
        'history_to_db': true,
        'readonly': true,
        'initial_value': '',
        'static_feature': null,
        'view_type_id': 13
    }
}
/* eslint-disable max-len */
//!ЗАХАРДКОЖЕННЫЕ ДАННЫЕ ДЛЯ АТРИБУТА ВЕБ_АПП

import { IAttrData } from '@features/object-attributes/OAttrForm/OAttrFormForView'
import { IAttribute } from '@shared/types/attributes'

export  const ATTR_DATA: IAttrData[] = [
    {
        'id': 10060,
        'name': 'URL ресурса (Веб мониторинг)',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        'data_type_id': 3,
        'attribute_stereotype_id': 10060,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': {
            'syntax': 'postprocessing'
        },
        'codename': 'wam_request_url',
        'mnemo': 'wam_request_url',
        'description': '<p>Для пробы - базовый УРЛ, для шага - УРЛ конкретного шага. <br>\n                    Если базовый УРЛ указан в пробе - то УРЛ в шаге добавляется к базовому. <br>\n                    Если не указан - УРЛ в шаге воспринимается как полный УРЛ.</p>',
        'attribute_stereotype': {
            'id': 10060,
            'mnemo': 'wam_request_url',
            'name': 'URL ресурса',
            'package_id': 2,
            'description': null
        },
        'data_type': {
            'id': 3,
            'name': 'Строка',
            'inner_type': 'string',
            'history_table': 'attributes_history_string',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': true,
            'description': null,
            'mnemo': 'string',
            'params': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система',
            'created_at': '2024-10-22 12:36:39',
            'updated_at': '2024-10-22 12:36:39'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10016,
                'name': 'Шаблон Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10016,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon',
                'mnemo': 'template_web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10017,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10017,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': 'probe_web_app_mon_step',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10015,
                'name': 'Измерение сервисов (бывш. Веб-ресурсов)',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': true,
                'class_stereotype_id': 10015,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'web_app_mon',
                'mnemo': 'web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': null,
                    'static_feature': null,
                    'order': 99
                }
            },
            {
                'id': 10040,
                'name': 'Доступность веб-ресурса',
                'package_id': 1,
                'visibility': 'public',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': null,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'avail_web_resources',
                'mnemo': null,
                'pivot': {
                    'virtual': true,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10016,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10017,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10015,
                'initial_value': null,
                'static_feature': null,
                'order': 99
            },
            {
                'id': 10040,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            }
        ],
        'currentAmount': 1,
        'minAmount': 1,
        'maxAmount': 1,
        'objectAttributes': null
    },
    {
        'id': 10069,
        'name': 'Допустимые http-коды ответа',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        'data_type_id': 3,
        'attribute_stereotype_id': 10069,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': {
            'syntax': 'postprocessing'
        },
        'codename': 'wam_allowed_http_codes',
        'mnemo': 'wam_allowed_http_codes',
        'description': '<p>Коды (через запятую) и/или интервалы кодов (через тире), при которых измерение продолжается<br>\n                Пример: <strong>200-299,301,302</strong> - т.е. весь диапазон 2хх + два кода 301 и 302</p>',
        'attribute_stereotype': {
            'id': 10069,
            'mnemo': 'wam_allowed_http_codes',
            'name': 'Допустимые http-коды ответа',
            'package_id': 2,
            'description': null
        },
        'data_type': {
            'id': 3,
            'name': 'Строка',
            'inner_type': 'string',
            'history_table': 'attributes_history_string',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': true,
            'description': null,
            'mnemo': 'string',
            'params': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система',
            'created_at': '2024-10-22 12:36:39',
            'updated_at': '2024-10-22 12:36:39'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10016,
                'name': 'Шаблон Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10016,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon',
                'mnemo': 'template_web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10017,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10017,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': 'probe_web_app_mon_step',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10016,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10017,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            }
        ],
        'currentAmount': 1,
        'minAmount': 1,
        'maxAmount': 1,
        'objectAttributes': null
    }, {
        'id': 10391,
        'name': 'Правила обработки ответа',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        'data_type_id': 10010,
        'attribute_stereotype_id': 10102,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': null,
        'codename': 'wam_processing_rules',
        'description': '<p>Правила обработки результата ответа. <br />\n                    Каждое правило создает/переопределяет переменную, которая может использоваться в последующих правилах, а также в формировании финального результата анализа<br>\n                    в параметрах правила могут использоваться переменные, определенные в предыдущих правилах (или даже предыдущих шагах)</p>    <p>    \n        <h3>Доступные глобальные переменные (метрики последнего шага измерения):</h3>\n        <ul>\n            <li>~__http_code - код ответа</li>\n            <li>~__net_error_code - код сетевой ошибки</li>\n            <li>~__net_error - сетевая ошибка (текст)</li>\n            <li>~__headers - заголовки ответа</li>\n            <li>~__body - тело ответа</li>\n            <li>~__response - raw-ответ (хидер + заголовки)</li>\n            <li>~__time_connect - время соединения</li>\n            <li>~__time_namelookup - время ответа dns</li>\n            <li>~__time_total - общее время</li>\n        </ul>\n    </p>',
        'mnemo': null,
        'attribute_stereotype': {
            'id': 10102,
            'mnemo': 'wam_processing_rules',
            'name': 'Правила разбора для Мониторинга Веб-Приложений',
            'package_id': 2,
            'description': null
        },
        'data_type': {
            'id': 10010,
            'name': 'Правила разбора для Мониторинга Веб-Приложений',
            'inner_type': 'jsonb',
            'history_table': 'common',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': false,
            'mnemo': 'wam_processing_rules',
            'description': null,
            'params': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10342,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10026,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': null,
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10344,
                'name': 'Шаблон Шага Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10028,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon_step',
                'mnemo': null,
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10371,
                'name': 'Тест нового вида атрибутов',
                'package_id': 2,
                'visibility': 'public',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': null,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'test_attrs',
                'mnemo': null,
                'pivot': {
                    'virtual': false,
                    'initial_value': null,
                    'static_feature': null,
                    'order': 99
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10342,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10344,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10371,
                'initial_value': null,
                'static_feature': null,
                'order': 99
            }
        ],
        'currentAmount': 1,
        'minAmount': 1,
        'maxAmount': 1,
        'objectAttributes': null
    }
    ,
    {
        'id': 10070,
        'name': 'Метод запроса',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        'data_type_id': 3,
        'attribute_stereotype_id': 10070,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': {
            'select': {
                'enable': true,
                'options': [
                    {
                        'label': 'GET',
                        'value': 'GET'
                    },
                    {
                        'label': 'HEAD',
                        'value': 'HEAD'
                    },
                    {
                        'label': 'POST',
                        'value': 'POST'
                    },
                    {
                        'label': 'PUT',
                        'value': 'PUT'
                    },
                    {
                        'label': 'DELETE',
                        'value': 'DELETE'
                    },
                    {
                        'label': 'CONNECT',
                        'value': 'CONNECT'
                    },
                    {
                        'label': 'OPTIONS',
                        'value': 'OPTIONS'
                    },
                    {
                        'label': 'TRACE',
                        'value': 'TRACE'
                    },
                    {
                        'label': 'PATCH',
                        'value': 'PATCH'
                    }
                ]
            }
        },
        'codename': 'wam_request_method',
        'mnemo': 'wam_request_method',
        'description': null,
        'attribute_stereotype': {
            'id': 10070,
            'mnemo': 'wam_request_method',
            'name': 'Метод запроса',
            'package_id': 2,
            'description': null
        },
        'data_type': {
            'id': 3,
            'name': 'Строка',
            'inner_type': 'string',
            'history_table': 'attributes_history_string',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': true,
            'description': null,
            'mnemo': 'string',
            'params': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система',
            'created_at': '2024-10-22 12:36:39',
            'updated_at': '2024-10-22 12:36:39'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10016,
                'name': 'Шаблон Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10016,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon',
                'mnemo': 'template_web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10017,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10017,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': 'probe_web_app_mon_step',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10016,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10017,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            }
        ],
        'currentAmount': 1,
        'minAmount': 1,
        'maxAmount': 1,
        'objectAttributes': null
    },
    // {
    //     'id': 10071,
    //     'name': 'Тип формата',
    //     'visibility': 'public',
    //     'multiplicity_left': 1,
    //     'multiplicity_right': 1,
    //     'attribute_category_id': null,
    //     'data_type_id': 3,
    //     'attribute_stereotype_id': 10071,
    //     'package_id': 2,
    //     'sort_order': 1,
    //     'unit': null,
    //     'history_to_cache': false,
    //     'history_to_db': false,
    //     'readonly': false,
    //     'view_type_id': null,
    //     'icon': null,
    //     'params': {
    //         'select': {
    //             'enable': true,
    //             'options': [
    //                 {
    //                     'label': 'Целое число',
    //                     'value': 'integer'
    //                 },
    //                 {
    //                     'label': 'Число с плавающей точкой',
    //                     'value': 'float'
    //                 },
    //                 {
    //                     'label': 'Строка',
    //                     'value': 'string'
    //                 },
    //                 {
    //                     'label': 'JSON',
    //                     'value': 'JSON'
    //                 }
    //             ]
    //         }
    //     },
    //     'codename': 'wam_request_body_type',
    //     'mnemo': 'wam_request_body_type',
    //     'description': 'Определяет тип контента в заголовках (НЕ кодирует указанное тело запроса). Актуально для POST/PUT/PATCH... ',
    //     'attribute_stereotype': {
    //         'id': 10071,
    //         'mnemo': 'wam_request_body_type',
    //         'name': 'Формат тела запроса',
    //         'package_id': 2,
    //         'description': null
    //     },
    //     'data_type': {
    //         'id': 3,
    //         'name': 'Строка',
    //         'inner_type': 'string',
    //         'history_table': 'attributes_history_string',
    //         'multiplicity-right': null,
    //         'min_val': null,
    //         'max_val': null,
    //         'check_regexp': null,
    //         'array_length': null,
    //         'basic': true,
    //         'description': null,
    //         'mnemo': 'string',
    //         'params': null
    //     },
    //     'package': {
    //         'id': 2,
    //         'mnemo': 'measuring_system',
    //         'name': 'Измерительная система',
    //         'created_at': '2024-10-22 12:36:39',
    //         'updated_at': '2024-10-22 12:36:39'
    //     },
    //     'attribute_category': null,
    //     'view_type': null,
    //     'classes': [
    //         {
    //             'id': 10016,
    //             'name': 'Шаблон Мониторинга Веб-Ресурса',
    //             'package_id': 2,
    //             'visibility': 'package',
    //             'multiplicity_right': null,
    //             'multiplicity_left': 0,
    //             'is_abstract': false,
    //             'class_stereotype_id': 10016,
    //             'icon': null,
    //             'has_anonymous_objects': false,
    //             'codename': 'template_web_app_mon',
    //             'mnemo': 'template_web_app_mon',
    //             'pivot': {
    //                 'virtual': false,
    //                 'initial_value': '',
    //                 'static_feature': null,
    //                 'order': 0
    //             }
    //         },
    //         {
    //             'id': 10017,
    //             'name': 'Шаг Мониторинга Веб-Ресурса',
    //             'package_id': 2,
    //             'visibility': 'package',
    //             'multiplicity_right': null,
    //             'multiplicity_left': 0,
    //             'is_abstract': false,
    //             'class_stereotype_id': 10017,
    //             'icon': null,
    //             'has_anonymous_objects': false,
    //             'codename': 'probe_web_app_mon_step',
    //             'mnemo': 'probe_web_app_mon_step',
    //             'pivot': {
    //                 'virtual': false,
    //                 'initial_value': '',
    //                 'static_feature': null,
    //                 'order': 0
    //             }
    //         }
    //     ],
    //     'secondary_view_types': [],
    //     'classes_ids': [
    //         {
    //             'id': 10016,
    //             'initial_value': '',
    //             'static_feature': null,
    //             'order': 0
    //         },
    //         {
    //             'id': 10017,
    //             'initial_value': '',
    //             'static_feature': null,
    //             'order': 0
    //         }
    //     ],
    //     'currentAmount': 1,
    //     'minAmount': 1,
    //     'maxAmount': 1,
    //     'objectAttributes': null
    // },
    {
        'id': 10071,
        'name': 'Формат тела запроса',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        'data_type_id': 3,
        'attribute_stereotype_id': 10071,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': {
            'select': {
                'enable': true,
                'options': [
                    {
                        'label': 'RAW',
                        'value': 'RAW'
                    },
                    {
                        'label': 'XML',
                        'value': 'XML'
                    },
                    {
                        'label': 'JSON',
                        'value': 'JSON'
                    }
                ]
            }
        },
        'codename': 'wam_request_body_type',
        'mnemo': 'wam_request_body_type',
        'description': 'Определяет тип контента в заголовках (НЕ кодирует указанное тело запроса). Актуально для POST/PUT/PATCH... ',
        'attribute_stereotype': {
            'id': 10071,
            'mnemo': 'wam_request_body_type',
            'name': 'Формат тела запроса',
            'package_id': 2,
            'description': null
        },
        'data_type': {
            'id': 3,
            'name': 'Строка',
            'inner_type': 'string',
            'history_table': 'attributes_history_string',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': true,
            'description': null,
            'mnemo': 'string',
            'params': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система',
            'created_at': '2024-10-22 12:36:39',
            'updated_at': '2024-10-22 12:36:39'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10016,
                'name': 'Шаблон Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10016,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon',
                'mnemo': 'template_web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10017,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10017,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': 'probe_web_app_mon_step',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10016,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10017,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            }
        ],
        'currentAmount': 1,
        'minAmount': 1,
        'maxAmount': 1,
        'objectAttributes': null
    },
    {
       
        'id': 10573,
        'name': 'Шапка запроса',
        'icon': null,
        'visibility': 'public',
        'multiplicity_left': 0,
        'multiplicity_right': null,
        'attribute_category_id': null,
        'attribute_category': null,
        'data_type_id': 10004,
        'data_type': {
            'id': 10004,
            'name': 'Мультистрока',
            'inner_type': 'string',
            'history_table': 'common',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': false,
            'mnemo': 'multistring',
            'description': null,
            'params': null
        },
        'attribute_stereotype_id': null,
        'attribute_stereotype': null,
        'classes_ids': [],
        'classes': [],
        'package_id': 1,
        'package': {
            'id': 1,
            'mnemo': 'subject_area',
            'name': 'Предметная область'
        },
        'sort_order': 99,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'view_type': null,
        'secondary_view_type_ids': [],
        'secondary_view_types': [],
        'params': {
            'syntax': '',
            'formLayout': {
                'cols': ''
            }
        },
        'codename': 'wam_request_headers',
        'description': null,
        'currentAmount': 1,
        'minAmount': 1,
        'maxAmount': 1,
        'objectAttributes': null
        
    },
    {
       
        'id': 10574,
        'name': 'Шапка запроса прокси',
        'icon': null,
        'visibility': 'public',
        'multiplicity_left': 0,
        'multiplicity_right': null,
        'attribute_category_id': null,
        'attribute_category': null,
        'data_type_id': 10004,
        'data_type': {
            'id': 10004,
            'name': 'Мультистрока',
            'inner_type': 'string',
            'history_table': 'common',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': false,
            'mnemo': 'multistring',
            'description': null,
            'params': null
        },
        'attribute_stereotype_id': null,
        'attribute_stereotype': null,
        'classes_ids': [],
        'classes': [],
        'package_id': 1,
        'package': {
            'id': 1,
            'mnemo': 'subject_area',
            'name': 'Предметная область'
        },
        'sort_order': 99,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'view_type': null,
        'secondary_view_type_ids': [],
        'secondary_view_types': [],
        'params': {
            'syntax': '',
            'formLayout': {
                'cols': ''
            }
        },
        'codename': 'wam_request_proxy_headers',
        'description': null, 
        'currentAmount': 1,
        'minAmount': 1,
        'maxAmount': 1,
        'objectAttributes': null
    
    },
    {
        'id': 10072,
        'name': 'Тело запроса',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        'data_type_id': 14,
        'data_type': {
            'id': 14,
            'name': 'Мультистрока',
            'inner_type': 'string',
            'history_table': 'common',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': false,
            'description': null,
            'mnemo': 'multistring',
            'params': null
        },
        'attribute_stereotype_id': 10072,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': {
            'syntax': 'postprocessing'
        },
        'codename': 'wam_request_body',
        'mnemo': 'wam_request_body',
        'description': null,
        'attribute_stereotype': {
            'id': 10072,
            'mnemo': 'wam_request_body',
            'name': 'Тело запроса',
            'package_id': 2,
            'description': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система',
            'created_at': '2024-10-22 12:36:39',
            'updated_at': '2024-10-22 12:36:39'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10016,
                'name': 'Шаблон Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10016,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon',
                'mnemo': 'template_web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10017,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10017,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': 'probe_web_app_mon_step',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10016,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10017,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            }
        ],
        'currentAmount': 1,
        'minAmount': 1,
        'maxAmount': 1,
        'objectAttributes': null
    },
    {
        'id': 10073,
        'name': 'Таймаут запроса, сек',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        'data_type_id': 3,
        'attribute_stereotype_id': 10073,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': {
            'syntax': 'postprocessing'
        },
        'codename': 'wam_request_timeout',
        'mnemo': 'wam_request_timeout',
        'description': null,
        'attribute_stereotype': {
            'id': 10073,
            'mnemo': 'wam_request_timeout',
            'name': 'Таймаут запроса, сек',
            'package_id': 2,
            'description': null
        },
        'data_type': {
            'id': 3,
            'name': 'Строка',
            'inner_type': 'string',
            'history_table': 'attributes_history_string',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': true,
            'description': null,
            'mnemo': 'string',
            'params': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система',
            'created_at': '2024-10-22 12:36:39',
            'updated_at': '2024-10-22 12:36:39'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10016,
                'name': 'Шаблон Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10016,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon',
                'mnemo': 'template_web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10017,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10017,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': 'probe_web_app_mon_step',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10016,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10017,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            }
        ],
        'currentAmount': 1,
        'minAmount': 1,
        'maxAmount': 1,
        'objectAttributes': null
    },
    {
        'id': 10074,
        'name': 'Разрешить перенаправления (не возвращать 3хх)',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        'data_type_id': 4,
        'attribute_stereotype_id': 10074,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': null,
        'codename': 'wam_request_follow_redirects',
        'mnemo': 'wam_request_follow_redirects',
        'description': null,
        'attribute_stereotype': {
            'id': 10074,
            'mnemo': 'wam_request_follow_redirects',
            'name': 'Разрешить перенаправления (не возвращать 3хх)',
            'package_id': 2,
            'description': null
        },
        'data_type': {
            'id': 4,
            'name': 'Булево значение',
            'inner_type': 'boolean',
            'history_table': 'attributes_history_boolean',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': true,
            'description': null,
            'mnemo': 'boolean',
            'params': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система',
            'created_at': '2024-10-22 12:36:39',
            'updated_at': '2024-10-22 12:36:39'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10016,
                'name': 'Шаблон Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10016,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon',
                'mnemo': 'template_web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10017,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10017,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': 'probe_web_app_mon_step',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10016,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10017,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            }
        ],
        'currentAmount': 1,
        'minAmount': 1,
        'maxAmount': 1,
        'objectAttributes': null
    },
    {
        'id': 10075,
        'name': 'SSL-верификация (хост)',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        'data_type_id': 4,
        'attribute_stereotype_id': 10075,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': null,
        'codename': 'wam_request_ssl_verifyhost',
        'mnemo': 'wam_request_ssl_verifyhost',
        'description': null,
        'attribute_stereotype': {
            'id': 10075,
            'mnemo': 'wam_request_ssl_verifyhost',
            'name': 'SSL-верификация (хост)',
            'package_id': 2,
            'description': null
        },
        'data_type': {
            'id': 4,
            'name': 'Булево значение',
            'inner_type': 'boolean',
            'history_table': 'attributes_history_boolean',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': true,
            'description': null,
            'mnemo': 'boolean',
            'params': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система',
            'created_at': '2024-10-22 12:36:39',
            'updated_at': '2024-10-22 12:36:39'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10016,
                'name': 'Шаблон Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10016,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon',
                'mnemo': 'template_web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10017,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10017,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': 'probe_web_app_mon_step',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10016,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10017,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            }
        ],
        'currentAmount': 1,
        'minAmount': 1,
        'maxAmount': 1,
        'objectAttributes': null
    },
    {
        'id': 10076,
        'name': 'SSL-cert (содержимое)',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        'data_type_id': 18,
        'attribute_stereotype_id': 10076,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': {
            'syntax': 'postprocessing'
        },
        'codename': 'wam_request_ssl_cert',
        'mnemo': 'wam_request_ssl_cert',
        'description': null,
        'attribute_stereotype': {
            'id': 10076,
            'mnemo': 'wam_request_ssl_cert',
            'name': 'SSL-cert (содержимое)',
            'package_id': 2,
            'description': null
        },
        'data_type': {
            'id': 18,
            'name': 'Мультистрока (в 1 строку)',
            'inner_type': 'string',
            'history_table': 'common',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': false,
            'description': null,
            'mnemo': 'multistring_inline',
            'params': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система',
            'created_at': '2024-10-22 12:36:39',
            'updated_at': '2024-10-22 12:36:39'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10016,
                'name': 'Шаблон Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10016,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon',
                'mnemo': 'template_web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10017,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10017,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': 'probe_web_app_mon_step',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10016,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10017,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            }
        ],
        'currentAmount': 1,
        'minAmount': 1,
        'maxAmount': 1,
        'objectAttributes': null
    },
    {
        'id': 10077,
        'name': 'SSL-cacert (содержимое)',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        'data_type_id': 18,
        'attribute_stereotype_id': 10077,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': {
            'syntax': 'postprocessing'
        },
        'codename': 'wam_request_ssl_cacert',
        'mnemo': 'wam_request_ssl_cacert',
        'description': null,
        'attribute_stereotype': {
            'id': 10077,
            'mnemo': 'wam_request_ssl_cacert',
            'name': 'SSL-cacert (содержимое)',
            'package_id': 2,
            'description': null
        },
        'data_type': {
            'id': 18,
            'name': 'Мультистрока (в 1 строку)',
            'inner_type': 'string',
            'history_table': 'common',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': false,
            'description': null,
            'mnemo': 'multistring_inline',
            'params': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система',
            'created_at': '2024-10-22 12:36:39',
            'updated_at': '2024-10-22 12:36:39'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10016,
                'name': 'Шаблон Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10016,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon',
                'mnemo': 'template_web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10017,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10017,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': 'probe_web_app_mon_step',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10016,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10017,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            }
        ],
        'currentAmount': 1,
        'minAmount': 1,
        'maxAmount': 1,
        'objectAttributes': null
    },
    {
        'id': 10078,
        'name': 'SSL-key (содержимое)',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        'data_type_id': 18,
        'attribute_stereotype_id': 10078,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': {
            'syntax': 'postprocessing'
        },
        'codename': 'wam_request_ssl_key',
        'mnemo': 'wam_request_ssl_key',
        'description': null,
        'attribute_stereotype': {
            'id': 10078,
            'mnemo': 'wam_request_ssl_key',
            'name': 'SSL-key (содержимое)',
            'package_id': 2,
            'description': null
        },
        'data_type': {
            'id': 18,
            'name': 'Мультистрока (в 1 строку)',
            'inner_type': 'string',
            'history_table': 'common',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': false,
            'description': null,
            'mnemo': 'multistring_inline',
            'params': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система',
            'created_at': '2024-10-22 12:36:39',
            'updated_at': '2024-10-22 12:36:39'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10016,
                'name': 'Шаблон Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10016,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon',
                'mnemo': 'template_web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10017,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10017,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': 'probe_web_app_mon_step',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10016,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10017,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            }
        ],
        'currentAmount': 1,
        'minAmount': 1,
        'maxAmount': 1,
        'objectAttributes': null
    },
    {
        'id': 10079,
        'name': 'SSL-key password',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        'data_type_id': 17,
        'attribute_stereotype_id': 10079,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': null,
        'codename': 'wam_request_ssl_key_pass',
        'mnemo': 'wam_request_ssl_key_pass',
        'description': null,
        'attribute_stereotype': {
            'id': 10079,
            'mnemo': 'wam_request_ssl_key_pass',
            'name': 'SSL-key password',
            'package_id': 2,
            'description': null
        },
        'data_type': {
            'id': 17,
            'name': 'Пароль',
            'inner_type': 'string',
            'history_table': 'common',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': false,
            'description': null,
            'mnemo': 'password',
            'params': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система',
            'created_at': '2024-10-22 12:36:39',
            'updated_at': '2024-10-22 12:36:39'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10016,
                'name': 'Шаблон Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10016,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon',
                'mnemo': 'template_web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10017,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10017,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': 'probe_web_app_mon_step',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10016,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10017,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            }
        ],
        'currentAmount': 1,
        'minAmount': 1,
        'maxAmount': 1,
        'objectAttributes': null
    },
    {
        'id': 10080,
        'name': 'Метод аутентификации',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        'data_type_id': 3,
        'attribute_stereotype_id': 10080,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': {
            'select': {
                'enable': true,
                'options': [
                    {
                        'label': '- нет -',
                        'value': ''
                    },
                    {
                        'label': 'BASIC',
                        'value': 'basic'
                    },
                    {
                        'label': 'NTLM',
                        'value': 'ntlm'
                    },
                    {
                        'label': 'KERBEROS',
                        'value': 'kerberos'
                    },
                    {
                        'label': 'DIGEST',
                        'value': 'digest'
                    }
                ]
            }
        },
        'codename': 'wam_request_auth_method',
        'mnemo': 'wam_request_auth_method',
        'description': 'Если указано - обязательно заполните поля ЛОГИН и ПАРОЛЬ',
        'attribute_stereotype': {
            'id': 10080,
            'mnemo': 'wam_request_auth_method',
            'name': 'Метод аутентификации',
            'package_id': 2,
            'description': null
        },
        'data_type': {
            'id': 3,
            'name': 'Строка',
            'inner_type': 'string',
            'history_table': 'attributes_history_string',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': true,
            'description': null,
            'mnemo': 'string',
            'params': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система',
            'created_at': '2024-10-22 12:36:39',
            'updated_at': '2024-10-22 12:36:39'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10016,
                'name': 'Шаблон Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10016,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon',
                'mnemo': 'template_web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10017,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10017,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': 'probe_web_app_mon_step',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10016,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10017,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            }
        ],
        'currentAmount': 1,
        'minAmount': 1,
        'maxAmount': 1,
        'objectAttributes': null
    },
    {
        'id': 10081,
        'name': 'Логин',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        'data_type_id': 3,
        'attribute_stereotype_id': 10081,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': {
            'syntax': 'postprocessing'
        },
        'codename': 'wam_request_auth_user',
        'mnemo': 'wam_request_auth_user',
        'description': '(если выбран метод аутентификации)',
        'attribute_stereotype': {
            'id': 10081,
            'mnemo': 'wam_request_auth_user',
            'name': 'Логин',
            'package_id': 2,
            'description': null
        },
        'data_type': {
            'id': 3,
            'name': 'Строка',
            'inner_type': 'string',
            'history_table': 'attributes_history_string',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': true,
            'description': null,
            'mnemo': 'string',
            'params': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система',
            'created_at': '2024-10-22 12:36:39',
            'updated_at': '2024-10-22 12:36:39'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10016,
                'name': 'Шаблон Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10016,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon',
                'mnemo': 'template_web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10017,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10017,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': 'probe_web_app_mon_step',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10016,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10017,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            }
        ],
        'currentAmount': 1,
        'minAmount': 1,
        'maxAmount': 1,
        'objectAttributes': null
    },
    {
        'id': 10082,
        'name': 'Пароль',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        'data_type_id': 17,
        'attribute_stereotype_id': 10082,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': null,
        'codename': 'wam_request_auth_password',
        'mnemo': 'wam_request_auth_password',
        'description': '(если выбран метод аутентификации)',
        'attribute_stereotype': {
            'id': 10082,
            'mnemo': 'wam_request_auth_password',
            'name': 'Пароль',
            'package_id': 2,
            'description': null
        },
        'data_type': {
            'id': 17,
            'name': 'Пароль',
            'inner_type': 'string',
            'history_table': 'common',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': false,
            'description': null,
            'mnemo': 'password',
            'params': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система',
            'created_at': '2024-10-22 12:36:39',
            'updated_at': '2024-10-22 12:36:39'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10016,
                'name': 'Шаблон Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10016,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon',
                'mnemo': 'template_web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10017,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10017,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': 'probe_web_app_mon_step',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10016,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10017,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            }
        ],
        'currentAmount': 1,
        'minAmount': 1,
        'maxAmount': 1,
        'objectAttributes': null
    },
    {
        'id': 10083,
        'name': 'Адрес прокси-сервера',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        'data_type_id': 3,
        'attribute_stereotype_id': 10083,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': {
            'syntax': 'postprocessing'
        },
        'codename': 'wam_request_proxy',
        'mnemo': 'wam_request_proxy',
        'description': null,
        'attribute_stereotype': {
            'id': 10083,
            'mnemo': 'wam_request_proxy',
            'name': 'адрес прокси-сервера',
            'package_id': 2,
            'description': null
        },
        'data_type': {
            'id': 3,
            'name': 'Строка',
            'inner_type': 'string',
            'history_table': 'attributes_history_string',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': true,
            'description': null,
            'mnemo': 'string',
            'params': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система',
            'created_at': '2024-10-22 12:36:39',
            'updated_at': '2024-10-22 12:36:39'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10016,
                'name': 'Шаблон Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10016,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon',
                'mnemo': 'template_web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10017,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10017,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': 'probe_web_app_mon_step',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10016,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10017,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            }
        ],
        'currentAmount': 1,
        'minAmount': 1,
        'maxAmount': 1,
        'objectAttributes': null
    },
    {
        'id': 10084,
        'name': 'SSL-верификация (хост) для прокси',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        'data_type_id': 4,
        'attribute_stereotype_id': 10084,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': null,
        'codename': 'wam_request_proxy_ssl_verifyhost',
        'mnemo': 'wam_request_proxy_ssl_verifyhost',
        'description': null,
        'attribute_stereotype': {
            'id': 10084,
            'mnemo': 'wam_request_proxy_ssl_verifyhost',
            'name': 'SSL-верификация (хост) для прокси',
            'package_id': 2,
            'description': null
        },
        'data_type': {
            'id': 4,
            'name': 'Булево значение',
            'inner_type': 'boolean',
            'history_table': 'attributes_history_boolean',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': true,
            'description': null,
            'mnemo': 'boolean',
            'params': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система',
            'created_at': '2024-10-22 12:36:39',
            'updated_at': '2024-10-22 12:36:39'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10016,
                'name': 'Шаблон Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10016,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon',
                'mnemo': 'template_web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10017,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10017,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': 'probe_web_app_mon_step',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10016,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10017,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            }
        ],
        'currentAmount': 1,
        'minAmount': 1,
        'maxAmount': 1,
        'objectAttributes': null
    },
    {
        'id': 10085,
        'name': 'SSL-cert (содержимое) для прокси',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        'data_type_id': 18,
        'attribute_stereotype_id': 10085,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': {
            'syntax': 'postprocessing'
        },
        'codename': 'wam_request_proxy_ssl_cert',
        'mnemo': 'wam_request_proxy_ssl_cert',
        'description': null,
        'attribute_stereotype': {
            'id': 10085,
            'mnemo': 'wam_request_proxy_ssl_cert',
            'name': 'SSL-cert (содержимое) для прокси',
            'package_id': 2,
            'description': null
        },
        'data_type': {
            'id': 18,
            'name': 'Мультистрока (в 1 строку)',
            'inner_type': 'string',
            'history_table': 'common',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': false,
            'description': null,
            'mnemo': 'multistring_inline',
            'params': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система',
            'created_at': '2024-10-22 12:36:39',
            'updated_at': '2024-10-22 12:36:39'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10016,
                'name': 'Шаблон Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10016,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon',
                'mnemo': 'template_web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10017,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10017,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': 'probe_web_app_mon_step',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10016,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10017,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            }
        ],
        'currentAmount': 1,
        'minAmount': 1,
        'maxAmount': 1,
        'objectAttributes': null
    },
    {
        'id': 10086,
        'name': 'SSL-cacert (содержимое) для прокси',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        'data_type_id': 18,
        'attribute_stereotype_id': 10086,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': {
            'syntax': 'postprocessing'
        },
        'codename': 'wam_request_proxy_ssl_cacert',
        'mnemo': 'wam_request_proxy_ssl_cacert',
        'description': null,
        'attribute_stereotype': {
            'id': 10086,
            'mnemo': 'wam_request_proxy_ssl_cacert',
            'name': 'SSL-cacert (содержимое) для прокси',
            'package_id': 2,
            'description': null
        },
        'data_type': {
            'id': 18,
            'name': 'Мультистрока (в 1 строку)',
            'inner_type': 'string',
            'history_table': 'common',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': false,
            'description': null,
            'mnemo': 'multistring_inline',
            'params': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система',
            'created_at': '2024-10-22 12:36:39',
            'updated_at': '2024-10-22 12:36:39'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10016,
                'name': 'Шаблон Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10016,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon',
                'mnemo': 'template_web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10017,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10017,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': 'probe_web_app_mon_step',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10016,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10017,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            }
        ],
        'currentAmount': 1,
        'minAmount': 1,
        'maxAmount': 1,
        'objectAttributes': null
    },
    {
        'id': 10087,
        'name': 'SSL-key (содержимое) для прокси',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        'data_type_id': 18,
        'attribute_stereotype_id': 10087,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': {
            'syntax': 'postprocessing'
        },
        'codename': 'wam_request_proxy_ssl_key',
        'mnemo': 'wam_request_proxy_ssl_key',
        'description': null,
        'attribute_stereotype': {
            'id': 10087,
            'mnemo': 'wam_request_proxy_ssl_key',
            'name': 'SSL-key (содержимое) для прокси',
            'package_id': 2,
            'description': null
        },
        'data_type': {
            'id': 18,
            'name': 'Мультистрока (в 1 строку)',
            'inner_type': 'string',
            'history_table': 'common',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': false,
            'description': null,
            'mnemo': 'multistring_inline',
            'params': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система',
            'created_at': '2024-10-22 12:36:39',
            'updated_at': '2024-10-22 12:36:39'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10016,
                'name': 'Шаблон Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10016,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon',
                'mnemo': 'template_web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10017,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10017,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': 'probe_web_app_mon_step',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10016,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10017,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            }
        ],
        'currentAmount': 1,
        'minAmount': 1,
        'maxAmount': 1,
        'objectAttributes': null
    },
    {
        'id': 10088,
        'name': 'SSL-key password для прокси',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        'data_type_id': 17,
        'attribute_stereotype_id': 10088,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': null,
        'codename': 'wam_request_proxy_ssl_key_pass',
        'mnemo': 'wam_request_proxy_ssl_key_pass',
        'description': null,
        'attribute_stereotype': {
            'id': 10088,
            'mnemo': 'wam_request_proxy_ssl_key_pass',
            'name': 'SSL-key password для прокси',
            'package_id': 2,
            'description': null
        },
        'data_type': {
            'id': 17,
            'name': 'Пароль',
            'inner_type': 'string',
            'history_table': 'common',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': false,
            'description': null,
            'mnemo': 'password',
            'params': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система',
            'created_at': '2024-10-22 12:36:39',
            'updated_at': '2024-10-22 12:36:39'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10016,
                'name': 'Шаблон Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10016,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon',
                'mnemo': 'template_web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10017,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10017,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': 'probe_web_app_mon_step',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10016,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10017,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            }
        ],
        'currentAmount': 1,
        'minAmount': 1,
        'maxAmount': 1,
        'objectAttributes': null
    },
    {
        'id': 10089,
        'name': 'Метод аутентификации для прокси',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        'data_type_id': 3,
        'attribute_stereotype_id': 10089,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': {
            'select': {
                'enable': true,
                'options': [
                    {
                        'label': '- нет -',
                        'value': ''
                    },
                    {
                        'label': 'BASIC',
                        'value': 'basic'
                    },
                    {
                        'label': 'NTLM',
                        'value': 'ntlm'
                    },
                    {
                        'label': 'KERBEROS',
                        'value': 'kerberos'
                    },
                    {
                        'label': 'DIGEST',
                        'value': 'digest'
                    }
                ]
            }
        },
        'codename': 'wam_request_proxy_auth_method',
        'mnemo': 'wam_request_proxy_auth_method',
        'description': 'Если указано - обязательно заполните поля ЛОГИН и ПАРОЛЬ для прокси',
        'attribute_stereotype': {
            'id': 10089,
            'mnemo': 'wam_request_proxy_auth_method',
            'name': 'Метод аутентификации для прокси',
            'package_id': 2,
            'description': null
        },
        'data_type': {
            'id': 3,
            'name': 'Строка',
            'inner_type': 'string',
            'history_table': 'attributes_history_string',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': true,
            'description': null,
            'mnemo': 'string',
            'params': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система',
            'created_at': '2024-10-22 12:36:39',
            'updated_at': '2024-10-22 12:36:39'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10016,
                'name': 'Шаблон Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10016,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon',
                'mnemo': 'template_web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10017,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10017,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': 'probe_web_app_mon_step',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10016,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10017,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            }
        ],
        'currentAmount': 1,
        'minAmount': 1,
        'maxAmount': 1,
        'objectAttributes': null
    },
    {
        'id': 10090,
        'name': 'Логин для прокси',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        'data_type_id': 3,
        'attribute_stereotype_id': 10090,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': {
            'syntax': 'postprocessing'
        },
        'codename': 'wam_request_proxy_auth_user',
        'mnemo': 'wam_request_proxy_auth_user',
        'description': '(если выбран метод аутентификации для прокси)',
        'attribute_stereotype': {
            'id': 10090,
            'mnemo': 'wam_request_proxy_auth_user',
            'name': 'Логин для прокси',
            'package_id': 2,
            'description': null
        },
        'data_type': {
            'id': 3,
            'name': 'Строка',
            'inner_type': 'string',
            'history_table': 'attributes_history_string',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': true,
            'description': null,
            'mnemo': 'string',
            'params': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система',
            'created_at': '2024-10-22 12:36:39',
            'updated_at': '2024-10-22 12:36:39'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10016,
                'name': 'Шаблон Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10016,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon',
                'mnemo': 'template_web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10017,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10017,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': 'probe_web_app_mon_step',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10016,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10017,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            }
        ],
        'currentAmount': 1,
        'minAmount': 1,
        'maxAmount': 1,
        'objectAttributes': null
    },
    {
        'id': 10091,
        'name': 'Пароль для прокси',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        'data_type_id': 17,
        'attribute_stereotype_id': 10091,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': null,
        'codename': 'wam_request_proxy_auth_password',
        'mnemo': 'wam_request_proxy_auth_password',
        'description': '(если выбран метод аутентификации для прокси)',
        'attribute_stereotype': {
            'id': 10091,
            'mnemo': 'wam_request_proxy_auth_password',
            'name': 'Пароль для прокси',
            'package_id': 2,
            'description': null
        },
        'data_type': {
            'id': 17,
            'name': 'Пароль',
            'inner_type': 'string',
            'history_table': 'common',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': false,
            'description': null,
            'mnemo': 'password',
            'params': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система',
            'created_at': '2024-10-22 12:36:39',
            'updated_at': '2024-10-22 12:36:39'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10016,
                'name': 'Шаблон Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10016,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon',
                'mnemo': 'template_web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10017,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10017,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': 'probe_web_app_mon_step',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10016,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10017,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            }
        ],
        'currentAmount': 1,
        'minAmount': 1,
        'maxAmount': 1,
        'objectAttributes': null
    }
]

export const ATTRIBUTES: IAttribute[] = [
    {
        'id': 10060,
        'name': 'URL ресурса (Веб мониторинг)',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        'data_type_id': 3,
        'attribute_stereotype_id': 10060,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': {
            'syntax': 'postprocessing'
        },
        'codename': 'wam_request_url',
        'mnemo': 'wam_request_url',
        'description': '<p>Для пробы - базовый УРЛ, для шага - УРЛ конкретного шага. <br>\n                    Если базовый УРЛ указан в пробе - то УРЛ в шаге добавляется к базовому. <br>\n                    Если не указан - УРЛ в шаге воспринимается как полный УРЛ.</p>',
        'attribute_stereotype': {
            'id': 10060,
            'mnemo': 'wam_request_url',
            'name': 'URL ресурса',
            'package_id': 2,
            'description': null
        },
        'data_type': {
            'id': 3,
            'name': 'Строка',
            'inner_type': 'string',
            'history_table': 'attributes_history_string',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': true,
            'description': null,
            'mnemo': 'string',
            'params': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система',
            'created_at': '2024-10-22 12:36:39',
            'updated_at': '2024-10-22 12:36:39'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10016,
                'name': 'Шаблон Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10016,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon',
                'mnemo': 'template_web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10017,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10017,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': 'probe_web_app_mon_step',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10015,
                'name': 'Измерение сервисов (бывш. Веб-ресурсов)',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': true,
                'class_stereotype_id': 10015,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'web_app_mon',
                'mnemo': 'web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': null,
                    'static_feature': null,
                    'order': 99
                }
            },
            {
                'id': 10040,
                'name': 'Доступность веб-ресурса',
                'package_id': 1,
                'visibility': 'public',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': null,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'avail_web_resources',
                'mnemo': null,
                'pivot': {
                    'virtual': true,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10016,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10017,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10015,
                'initial_value': null,
                'static_feature': null,
                'order': 99
            },
            {
                'id': 10040,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            }
        ]
    },
    {
        'id': 10069,
        'name': 'Допустимые http-коды ответа',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        'data_type_id': 3,
        'attribute_stereotype_id': 10069,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': {
            'syntax': 'postprocessing'
        },
        'codename': 'wam_allowed_http_codes',
        'mnemo': 'wam_allowed_http_codes',
        'description': '<p>Коды (через запятую) и/или интервалы кодов (через тире), при которых измерение продолжается<br>\n                Пример: <strong>200-299,301,302</strong> - т.е. весь диапазон 2хх + два кода 301 и 302</p>',
        'attribute_stereotype': {
            'id': 10069,
            'mnemo': 'wam_allowed_http_codes',
            'name': 'Допустимые http-коды ответа',
            'package_id': 2,
            'description': null
        },
        'data_type': {
            'id': 3,
            'name': 'Строка',
            'inner_type': 'string',
            'history_table': 'attributes_history_string',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': true,
            'description': null,
            'mnemo': 'string',
            'params': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система',
            'created_at': '2024-10-22 12:36:39',
            'updated_at': '2024-10-22 12:36:39'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10016,
                'name': 'Шаблон Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10016,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon',
                'mnemo': 'template_web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10017,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10017,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': 'probe_web_app_mon_step',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10016,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10017,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            }
        ]
    }, {
        'id': 10391,
        'name': 'Правила обработки ответа',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        'data_type_id': 10010,
        'attribute_stereotype_id': 10102,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': null,
        'codename': 'wam_processing_rules',
        'description': '<p>Правила обработки результата ответа. <br />\n                    Каждое правило создает/переопределяет переменную, которая может использоваться в последующих правилах, а также в формировании финального результата анализа<br>\n                    в параметрах правила могут использоваться переменные, определенные в предыдущих правилах (или даже предыдущих шагах)</p>    <p>    \n        <h3>Доступные глобальные переменные (метрики последнего шага измерения):</h3>\n        <ul>\n            <li>~__http_code - код ответа</li>\n            <li>~__net_error_code - код сетевой ошибки</li>\n            <li>~__net_error - сетевая ошибка (текст)</li>\n            <li>~__headers - заголовки ответа</li>\n            <li>~__body - тело ответа</li>\n            <li>~__response - raw-ответ (хидер + заголовки)</li>\n            <li>~__time_connect - время соединения</li>\n            <li>~__time_namelookup - время ответа dns</li>\n            <li>~__time_total - общее время</li>\n        </ul>\n    </p>',
        'mnemo': null,
        'attribute_stereotype': {
            'id': 10102,
            'mnemo': 'wam_processing_rules',
            'name': 'Правила разбора для Мониторинга Веб-Приложений',
            'package_id': 2,
            'description': null
        },
        'data_type': {
            'id': 10010,
            'name': 'Правила разбора для Мониторинга Веб-Приложений',
            'inner_type': 'jsonb',
            'history_table': 'common',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': false,
            'mnemo': 'wam_processing_rules',
            'description': null,
            'params': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10342,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10026,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': null,
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10344,
                'name': 'Шаблон Шага Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10028,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon_step',
                'mnemo': null,
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10371,
                'name': 'Тест нового вида атрибутов',
                'package_id': 2,
                'visibility': 'public',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': null,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'test_attrs',
                'mnemo': null,
                'pivot': {
                    'virtual': false,
                    'initial_value': null,
                    'static_feature': null,
                    'order': 99
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10342,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10344,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10371,
                'initial_value': null,
                'static_feature': null,
                'order': 99
            }
        ],
        'currentAmount': 1,
        'minAmount': 1,
        'maxAmount': 1,
        'objectAttributes': null
    }
    ,
 
    {
        'id': 10070,
        'name': 'Метод запроса',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        'data_type_id': 3,
        'attribute_stereotype_id': 10070,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': {
            'select': {
                'enable': true,
                'options': [
                    {
                        'label': 'GET',
                        'value': 'GET'
                    },
                    {
                        'label': 'HEAD',
                        'value': 'HEAD'
                    },
                    {
                        'label': 'POST',
                        'value': 'POST'
                    },
                    {
                        'label': 'PUT',
                        'value': 'PUT'
                    },
                    {
                        'label': 'DELETE',
                        'value': 'DELETE'
                    },
                    {
                        'label': 'CONNECT',
                        'value': 'CONNECT'
                    },
                    {
                        'label': 'OPTIONS',
                        'value': 'OPTIONS'
                    },
                    {
                        'label': 'TRACE',
                        'value': 'TRACE'
                    },
                    {
                        'label': 'PATCH',
                        'value': 'PATCH'
                    }
                ]
            }
        },
        'codename': 'wam_request_method',
        'mnemo': 'wam_request_method',
        'description': null,
        'attribute_stereotype': {
            'id': 10070,
            'mnemo': 'wam_request_method',
            'name': 'Метод запроса',
            'package_id': 2,
            'description': null
        },
        'data_type': {
            'id': 3,
            'name': 'Строка',
            'inner_type': 'string',
            'history_table': 'attributes_history_string',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': true,
            'description': null,
            'mnemo': 'string',
            'params': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система',
            'created_at': '2024-10-22 12:36:39',
            'updated_at': '2024-10-22 12:36:39'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10016,
                'name': 'Шаблон Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10016,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon',
                'mnemo': 'template_web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10017,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10017,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': 'probe_web_app_mon_step',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10016,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10017,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            }
        ]
    },
    {
        'id': 10071,
        'name': 'Формат тела запроса',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        'data_type_id': 3,
        'attribute_stereotype_id': 10071,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': {
            'select': {
                'enable': true,
                'options': [
                    {
                        'label': 'RAW',
                        'value': 'RAW'
                    },
                    {
                        'label': 'XML',
                        'value': 'XML'
                    },
                    {
                        'label': 'JSON',
                        'value': 'JSON'
                    }
                ]
            }
        },
        'codename': 'wam_request_body_type',
        'mnemo': 'wam_request_body_type',
        'description': 'Определяет тип контента в заголовках (НЕ кодирует указанное тело запроса). Актуально для POST/PUT/PATCH... ',
        'attribute_stereotype': {
            'id': 10071,
            'mnemo': 'wam_request_body_type',
            'name': 'Формат тела запроса',
            'package_id': 2,
            'description': null
        },
        'data_type': {
            'id': 3,
            'name': 'Строка',
            'inner_type': 'string',
            'history_table': 'attributes_history_string',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': true,
            'description': null,
            'mnemo': 'string',
            'params': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система',
            'created_at': '2024-10-22 12:36:39',
            'updated_at': '2024-10-22 12:36:39'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10016,
                'name': 'Шаблон Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10016,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon',
                'mnemo': 'template_web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10017,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10017,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': 'probe_web_app_mon_step',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10016,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10017,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            }
        ],
        'currentAmount': 1,
        'minAmount': 1,
        'maxAmount': 1,
        'objectAttributes': null
    },
    // {
    //     'id': 10071,
    //     'name': 'Тип формата',
    //     'visibility': 'public',
    //     'multiplicity_left': 1,
    //     'multiplicity_right': 1,
    //     'attribute_category_id': null,
    //     'data_type_id': 3,
    //     'attribute_stereotype_id': 10071,
    //     'package_id': 2,
    //     'sort_order': 1,
    //     'unit': null,
    //     'history_to_cache': false,
    //     'history_to_db': false,
    //     'readonly': false,
    //     'view_type_id': null,
    //     'icon': null,
    //     'params': {
    //         'select': {
    //             'enable': true,
    //             'options': [
    //                 {
    //                     'label': 'Целое число',
    //                     'value': 'integer'
    //                 },
    //                 {
    //                     'label': 'Число с плавающей точкой',
    //                     'value': 'float'
    //                 },
    //                 {
    //                     'label': 'Строка',
    //                     'value': 'string'
    //                 },
    //                 {
    //                     'label': 'JSON',
    //                     'value': 'JSON'
    //                 }
    //             ]
    //         }
    //     },
    //     'codename': 'wam_request_body_type',
    //     'mnemo': 'wam_request_body_type',
    //     'description': 'Определяет тип контента в заголовках (НЕ кодирует указанное тело запроса). Актуально для POST/PUT/PATCH... ',
    //     'attribute_stereotype': {
    //         'id': 10071,
    //         'mnemo': 'wam_request_body_type',
    //         'name': 'Формат тела запроса',
    //         'package_id': 2,
    //         'description': null
    //     },
    //     'data_type': {
    //         'id': 3,
    //         'name': 'Строка',
    //         'inner_type': 'string',
    //         'history_table': 'attributes_history_string',
    //         'multiplicity-right': null,
    //         'min_val': null,
    //         'max_val': null,
    //         'check_regexp': null,
    //         'array_length': null,
    //         'basic': true,
    //         'description': null,
    //         'mnemo': 'string',
    //         'params': null
    //     },
    //     'package': {
    //         'id': 2,
    //         'mnemo': 'measuring_system',
    //         'name': 'Измерительная система',
    //         'created_at': '2024-10-22 12:36:39',
    //         'updated_at': '2024-10-22 12:36:39'
    //     },
    //     'attribute_category': null,
    //     'view_type': null,
    //     'classes': [
    //         {
    //             'id': 10016,
    //             'name': 'Шаблон Мониторинга Веб-Ресурса',
    //             'package_id': 2,
    //             'visibility': 'package',
    //             'multiplicity_right': null,
    //             'multiplicity_left': 0,
    //             'is_abstract': false,
    //             'class_stereotype_id': 10016,
    //             'icon': null,
    //             'has_anonymous_objects': false,
    //             'codename': 'template_web_app_mon',
    //             'mnemo': 'template_web_app_mon',
    //             'pivot': {
    //                 'virtual': false,
    //                 'initial_value': '',
    //                 'static_feature': null,
    //                 'order': 0
    //             }
    //         },
    //         {
    //             'id': 10017,
    //             'name': 'Шаг Мониторинга Веб-Ресурса',
    //             'package_id': 2,
    //             'visibility': 'package',
    //             'multiplicity_right': null,
    //             'multiplicity_left': 0,
    //             'is_abstract': false,
    //             'class_stereotype_id': 10017,
    //             'icon': null,
    //             'has_anonymous_objects': false,
    //             'codename': 'probe_web_app_mon_step',
    //             'mnemo': 'probe_web_app_mon_step',
    //             'pivot': {
    //                 'virtual': false,
    //                 'initial_value': '',
    //                 'static_feature': null,
    //                 'order': 0
    //             }
    //         }
    //     ],
    //     'secondary_view_types': [],
    //     'classes_ids': [
    //         {
    //             'id': 10016,
    //             'initial_value': '',
    //             'static_feature': null,
    //             'order': 0
    //         },
    //         {
    //             'id': 10017,
    //             'initial_value': '',
    //             'static_feature': null,
    //             'order': 0
    //         }
    //     ]
    // },
    {
        'id': 10072,
        'name': 'Тело запроса',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        data_type: {
            'id': 14,
            'name': 'Мультистрока',
            'inner_type': 'string',
            'history_table': 'common',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': false,
            'description': null,
            'mnemo': 'multistring',
            'params': null
        },
        'data_type_id': 14,
        'attribute_stereotype_id': 10072,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': {
            'syntax': 'postprocessing'
        },
        'codename': 'wam_request_body',
        'mnemo': 'wam_request_body',
        'description': null,
        'attribute_stereotype': {
            'id': 10072,
            'mnemo': 'wam_request_body',
            'name': 'Тело запроса',
            'package_id': 2,
            'description': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система',
            'created_at': '2024-10-22 12:36:39',
            'updated_at': '2024-10-22 12:36:39'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10016,
                'name': 'Шаблон Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10016,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon',
                'mnemo': 'template_web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10017,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10017,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': 'probe_web_app_mon_step',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10016,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10017,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            }
        ]
    },
    {
        'id': 10073,
        'name': 'Таймаут запроса, сек',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        'data_type_id': 3,
        'attribute_stereotype_id': 10073,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': {
            'syntax': 'postprocessing'
        },
        'codename': 'wam_request_timeout',
        'mnemo': 'wam_request_timeout',
        'description': null,
        'attribute_stereotype': {
            'id': 10073,
            'mnemo': 'wam_request_timeout',
            'name': 'Таймаут запроса, сек',
            'package_id': 2,
            'description': null
        },
        'data_type': {
            'id': 3,
            'name': 'Строка',
            'inner_type': 'string',
            'history_table': 'attributes_history_string',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': true,
            'description': null,
            'mnemo': 'string',
            'params': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система',
            'created_at': '2024-10-22 12:36:39',
            'updated_at': '2024-10-22 12:36:39'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10016,
                'name': 'Шаблон Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10016,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon',
                'mnemo': 'template_web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10017,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10017,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': 'probe_web_app_mon_step',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10016,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10017,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            }
        ]
    },
    {
        'id': 10074,
        'name': 'Разрешить перенаправления (не возвращать 3хх)',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        'data_type_id': 4,
        'attribute_stereotype_id': 10074,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': null,
        'codename': 'wam_request_follow_redirects',
        'mnemo': 'wam_request_follow_redirects',
        'description': null,
        'attribute_stereotype': {
            'id': 10074,
            'mnemo': 'wam_request_follow_redirects',
            'name': 'Разрешить перенаправления (не возвращать 3хх)',
            'package_id': 2,
            'description': null
        },
        'data_type': {
            'id': 4,
            'name': 'Булево значение',
            'inner_type': 'boolean',
            'history_table': 'attributes_history_boolean',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': true,
            'description': null,
            'mnemo': 'boolean',
            'params': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система',
            'created_at': '2024-10-22 12:36:39',
            'updated_at': '2024-10-22 12:36:39'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10016,
                'name': 'Шаблон Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10016,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon',
                'mnemo': 'template_web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10017,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10017,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': 'probe_web_app_mon_step',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10016,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10017,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            }
        ]
    },
    {
        'id': 10075,
        'name': 'SSL-верификация (хост)',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        'data_type_id': 4,
        'attribute_stereotype_id': 10075,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': null,
        'codename': 'wam_request_ssl_verifyhost',
        'mnemo': 'wam_request_ssl_verifyhost',
        'description': null,
        'attribute_stereotype': {
            'id': 10075,
            'mnemo': 'wam_request_ssl_verifyhost',
            'name': 'SSL-верификация (хост)',
            'package_id': 2,
            'description': null
        },
        'data_type': {
            'id': 4,
            'name': 'Булево значение',
            'inner_type': 'boolean',
            'history_table': 'attributes_history_boolean',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': true,
            'description': null,
            'mnemo': 'boolean',
            'params': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система',
            'created_at': '2024-10-22 12:36:39',
            'updated_at': '2024-10-22 12:36:39'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10016,
                'name': 'Шаблон Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10016,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon',
                'mnemo': 'template_web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10017,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10017,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': 'probe_web_app_mon_step',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10016,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10017,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            }
        ]
    },
    {
        'id': 10076,
        'name': 'SSL-cert (содержимое)',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        'data_type_id': 18,
        'attribute_stereotype_id': 10076,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': {
            'syntax': 'postprocessing'
        },
        'codename': 'wam_request_ssl_cert',
        'mnemo': 'wam_request_ssl_cert',
        'description': null,
        'attribute_stereotype': {
            'id': 10076,
            'mnemo': 'wam_request_ssl_cert',
            'name': 'SSL-cert (содержимое)',
            'package_id': 2,
            'description': null
        },
        'data_type': {
            'id': 18,
            'name': 'Мультистрока (в 1 строку)',
            'inner_type': 'string',
            'history_table': 'common',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': false,
            'description': null,
            'mnemo': 'multistring_inline',
            'params': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система',
            'created_at': '2024-10-22 12:36:39',
            'updated_at': '2024-10-22 12:36:39'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10016,
                'name': 'Шаблон Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10016,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon',
                'mnemo': 'template_web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10017,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10017,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': 'probe_web_app_mon_step',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10016,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10017,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            }
        ]
    },
    {
        'id': 10077,
        'name': 'SSL-cacert (содержимое)',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        'data_type_id': 18,
        'attribute_stereotype_id': 10077,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': {
            'syntax': 'postprocessing'
        },
        'codename': 'wam_request_ssl_cacert',
        'mnemo': 'wam_request_ssl_cacert',
        'description': null,
        'attribute_stereotype': {
            'id': 10077,
            'mnemo': 'wam_request_ssl_cacert',
            'name': 'SSL-cacert (содержимое)',
            'package_id': 2,
            'description': null
        },
        'data_type': {
            'id': 18,
            'name': 'Мультистрока (в 1 строку)',
            'inner_type': 'string',
            'history_table': 'common',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': false,
            'description': null,
            'mnemo': 'multistring_inline',
            'params': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система',
            'created_at': '2024-10-22 12:36:39',
            'updated_at': '2024-10-22 12:36:39'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10016,
                'name': 'Шаблон Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10016,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon',
                'mnemo': 'template_web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10017,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10017,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': 'probe_web_app_mon_step',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10016,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10017,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            }
        ]
    },
    {
        'id': 10078,
        'name': 'SSL-key (содержимое)',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        'data_type_id': 18,
        'attribute_stereotype_id': 10078,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': {
            'syntax': 'postprocessing'
        },
        'codename': 'wam_request_ssl_key',
        'mnemo': 'wam_request_ssl_key',
        'description': null,
        'attribute_stereotype': {
            'id': 10078,
            'mnemo': 'wam_request_ssl_key',
            'name': 'SSL-key (содержимое)',
            'package_id': 2,
            'description': null
        },
        'data_type': {
            'id': 18,
            'name': 'Мультистрока (в 1 строку)',
            'inner_type': 'string',
            'history_table': 'common',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': false,
            'description': null,
            'mnemo': 'multistring_inline',
            'params': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система',
            'created_at': '2024-10-22 12:36:39',
            'updated_at': '2024-10-22 12:36:39'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10016,
                'name': 'Шаблон Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10016,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon',
                'mnemo': 'template_web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10017,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10017,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': 'probe_web_app_mon_step',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10016,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10017,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            }
        ]
    },
    {
        'id': 10079,
        'name': 'SSL-key password',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        'data_type_id': 17,
        'attribute_stereotype_id': 10079,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': null,
        'codename': 'wam_request_ssl_key_pass',
        'mnemo': 'wam_request_ssl_key_pass',
        'description': null,
        'attribute_stereotype': {
            'id': 10079,
            'mnemo': 'wam_request_ssl_key_pass',
            'name': 'SSL-key password',
            'package_id': 2,
            'description': null
        },
        'data_type': {
            'id': 17,
            'name': 'Пароль',
            'inner_type': 'string',
            'history_table': 'common',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': false,
            'description': null,
            'mnemo': 'password',
            'params': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система',
            'created_at': '2024-10-22 12:36:39',
            'updated_at': '2024-10-22 12:36:39'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10016,
                'name': 'Шаблон Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10016,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon',
                'mnemo': 'template_web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10017,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10017,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': 'probe_web_app_mon_step',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10016,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10017,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            }
        ]
    },
    {
        'id': 10080,
        'name': 'Метод аутентификации',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        'data_type_id': 3,
        'attribute_stereotype_id': 10080,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': {
            'select': {
                'enable': true,
                'options': [
                    {
                        'label': '- нет -',
                        'value': ''
                    },
                    {
                        'label': 'BASIC',
                        'value': 'basic'
                    },
                    {
                        'label': 'NTLM',
                        'value': 'ntlm'
                    },
                    {
                        'label': 'KERBEROS',
                        'value': 'kerberos'
                    },
                    {
                        'label': 'DIGEST',
                        'value': 'digest'
                    }
                ]
            }
        },
        'codename': 'wam_request_auth_method',
        'mnemo': 'wam_request_auth_method',
        'description': 'Если указано - обязательно заполните поля ЛОГИН и ПАРОЛЬ',
        'attribute_stereotype': {
            'id': 10080,
            'mnemo': 'wam_request_auth_method',
            'name': 'Метод аутентификации',
            'package_id': 2,
            'description': null
        },
        'data_type': {
            'id': 3,
            'name': 'Строка',
            'inner_type': 'string',
            'history_table': 'attributes_history_string',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': true,
            'description': null,
            'mnemo': 'string',
            'params': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система',
            'created_at': '2024-10-22 12:36:39',
            'updated_at': '2024-10-22 12:36:39'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10016,
                'name': 'Шаблон Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10016,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon',
                'mnemo': 'template_web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10017,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10017,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': 'probe_web_app_mon_step',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10016,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10017,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            }
        ]
    },
    {
        'id': 10081,
        'name': 'Логин',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        'data_type_id': 3,
        'attribute_stereotype_id': 10081,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': {
            'syntax': 'postprocessing'
        },
        'codename': 'wam_request_auth_user',
        'mnemo': 'wam_request_auth_user',
        'description': '(если выбран метод аутентификации)',
        'attribute_stereotype': {
            'id': 10081,
            'mnemo': 'wam_request_auth_user',
            'name': 'Логин',
            'package_id': 2,
            'description': null
        },
        'data_type': {
            'id': 3,
            'name': 'Строка',
            'inner_type': 'string',
            'history_table': 'attributes_history_string',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': true,
            'description': null,
            'mnemo': 'string',
            'params': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система',
            'created_at': '2024-10-22 12:36:39',
            'updated_at': '2024-10-22 12:36:39'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10016,
                'name': 'Шаблон Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10016,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon',
                'mnemo': 'template_web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10017,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10017,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': 'probe_web_app_mon_step',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10016,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10017,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            }
        ]
    },
    {
        'id': 10082,
        'name': 'Пароль',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        'data_type_id': 17,
        'attribute_stereotype_id': 10082,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': null,
        'codename': 'wam_request_auth_password',
        'mnemo': 'wam_request_auth_password',
        'description': '(если выбран метод аутентификации)',
        'attribute_stereotype': {
            'id': 10082,
            'mnemo': 'wam_request_auth_password',
            'name': 'Пароль',
            'package_id': 2,
            'description': null
        },
        'data_type': {
            'id': 17,
            'name': 'Пароль',
            'inner_type': 'string',
            'history_table': 'common',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': false,
            'description': null,
            'mnemo': 'password',
            'params': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система',
            'created_at': '2024-10-22 12:36:39',
            'updated_at': '2024-10-22 12:36:39'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10016,
                'name': 'Шаблон Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10016,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon',
                'mnemo': 'template_web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10017,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10017,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': 'probe_web_app_mon_step',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10016,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10017,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            }
        ]
    },
    {
        'id': 10083,
        'name': 'Адрес прокси-сервера',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        'data_type_id': 3,
        'attribute_stereotype_id': 10083,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': {
            'syntax': 'postprocessing'
        },
        'codename': 'wam_request_proxy',
        'mnemo': 'wam_request_proxy',
        'description': null,
        'attribute_stereotype': {
            'id': 10083,
            'mnemo': 'wam_request_proxy',
            'name': 'адрес прокси-сервера',
            'package_id': 2,
            'description': null
        },
        'data_type': {
            'id': 3,
            'name': 'Строка',
            'inner_type': 'string',
            'history_table': 'attributes_history_string',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': true,
            'description': null,
            'mnemo': 'string',
            'params': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система',
            'created_at': '2024-10-22 12:36:39',
            'updated_at': '2024-10-22 12:36:39'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10016,
                'name': 'Шаблон Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10016,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon',
                'mnemo': 'template_web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10017,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10017,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': 'probe_web_app_mon_step',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10016,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10017,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            }
        ]
    },
    {
        'id': 10084,
        'name': 'SSL-верификация (хост) для прокси',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        'data_type_id': 4,
        'attribute_stereotype_id': 10084,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': null,
        'codename': 'wam_request_proxy_ssl_verifyhost',
        'mnemo': 'wam_request_proxy_ssl_verifyhost',
        'description': null,
        'attribute_stereotype': {
            'id': 10084,
            'mnemo': 'wam_request_proxy_ssl_verifyhost',
            'name': 'SSL-верификация (хост) для прокси',
            'package_id': 2,
            'description': null
        },
        'data_type': {
            'id': 4,
            'name': 'Булево значение',
            'inner_type': 'boolean',
            'history_table': 'attributes_history_boolean',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': true,
            'description': null,
            'mnemo': 'boolean',
            'params': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система',
            'created_at': '2024-10-22 12:36:39',
            'updated_at': '2024-10-22 12:36:39'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10016,
                'name': 'Шаблон Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10016,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon',
                'mnemo': 'template_web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10017,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10017,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': 'probe_web_app_mon_step',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10016,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10017,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            }
        ]
    },
    {
        'id': 10085,
        'name': 'SSL-cert (содержимое) для прокси',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        'data_type_id': 18,
        'attribute_stereotype_id': 10085,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': {
            'syntax': 'postprocessing'
        },
        'codename': 'wam_request_proxy_ssl_cert',
        'mnemo': 'wam_request_proxy_ssl_cert',
        'description': null,
        'attribute_stereotype': {
            'id': 10085,
            'mnemo': 'wam_request_proxy_ssl_cert',
            'name': 'SSL-cert (содержимое) для прокси',
            'package_id': 2,
            'description': null
        },
        'data_type': {
            'id': 18,
            'name': 'Мультистрока (в 1 строку)',
            'inner_type': 'string',
            'history_table': 'common',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': false,
            'description': null,
            'mnemo': 'multistring_inline',
            'params': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система',
            'created_at': '2024-10-22 12:36:39',
            'updated_at': '2024-10-22 12:36:39'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10016,
                'name': 'Шаблон Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10016,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon',
                'mnemo': 'template_web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10017,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10017,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': 'probe_web_app_mon_step',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10016,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10017,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            }
        ]
    },
    {
        'id': 10086,
        'name': 'SSL-cacert (содержимое) для прокси',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        'data_type_id': 18,
        'attribute_stereotype_id': 10086,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': {
            'syntax': 'postprocessing'
        },
        'codename': 'wam_request_proxy_ssl_cacert',
        'mnemo': 'wam_request_proxy_ssl_cacert',
        'description': null,
        'attribute_stereotype': {
            'id': 10086,
            'mnemo': 'wam_request_proxy_ssl_cacert',
            'name': 'SSL-cacert (содержимое) для прокси',
            'package_id': 2,
            'description': null
        },
        'data_type': {
            'id': 18,
            'name': 'Мультистрока (в 1 строку)',
            'inner_type': 'string',
            'history_table': 'common',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': false,
            'description': null,
            'mnemo': 'multistring_inline',
            'params': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система',
            'created_at': '2024-10-22 12:36:39',
            'updated_at': '2024-10-22 12:36:39'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10016,
                'name': 'Шаблон Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10016,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon',
                'mnemo': 'template_web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10017,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10017,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': 'probe_web_app_mon_step',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10016,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10017,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            }
        ]
    },
    {
        'id': 10087,
        'name': 'SSL-key (содержимое) для прокси',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        'data_type_id': 18,
        'attribute_stereotype_id': 10087,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': {
            'syntax': 'postprocessing'
        },
        'codename': 'wam_request_proxy_ssl_key',
        'mnemo': 'wam_request_proxy_ssl_key',
        'description': null,
        'attribute_stereotype': {
            'id': 10087,
            'mnemo': 'wam_request_proxy_ssl_key',
            'name': 'SSL-key (содержимое) для прокси',
            'package_id': 2,
            'description': null
        },
        'data_type': {
            'id': 18,
            'name': 'Мультистрока (в 1 строку)',
            'inner_type': 'string',
            'history_table': 'common',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': false,
            'description': null,
            'mnemo': 'multistring_inline',
            'params': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система',
            'created_at': '2024-10-22 12:36:39',
            'updated_at': '2024-10-22 12:36:39'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10016,
                'name': 'Шаблон Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10016,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon',
                'mnemo': 'template_web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10017,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10017,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': 'probe_web_app_mon_step',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10016,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10017,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            }
        ]
    },
    {
        'id': 10088,
        'name': 'SSL-key password для прокси',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        'data_type_id': 17,
        'attribute_stereotype_id': 10088,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': null,
        'codename': 'wam_request_proxy_ssl_key_pass',
        'mnemo': 'wam_request_proxy_ssl_key_pass',
        'description': null,
        'attribute_stereotype': {
            'id': 10088,
            'mnemo': 'wam_request_proxy_ssl_key_pass',
            'name': 'SSL-key password для прокси',
            'package_id': 2,
            'description': null
        },
        'data_type': {
            'id': 17,
            'name': 'Пароль',
            'inner_type': 'string',
            'history_table': 'common',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': false,
            'description': null,
            'mnemo': 'password',
            'params': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система',
            'created_at': '2024-10-22 12:36:39',
            'updated_at': '2024-10-22 12:36:39'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10016,
                'name': 'Шаблон Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10016,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon',
                'mnemo': 'template_web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10017,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10017,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': 'probe_web_app_mon_step',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10016,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10017,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            }
        ]
    },
    {
        'id': 10089,
        'name': 'Метод аутентификации для прокси',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        'data_type_id': 3,
        'attribute_stereotype_id': 10089,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': {
            'select': {
                'enable': true,
                'options': [
                    {
                        'label': '- нет -',
                        'value': ''
                    },
                    {
                        'label': 'BASIC',
                        'value': 'basic'
                    },
                    {
                        'label': 'NTLM',
                        'value': 'ntlm'
                    },
                    {
                        'label': 'KERBEROS',
                        'value': 'kerberos'
                    },
                    {
                        'label': 'DIGEST',
                        'value': 'digest'
                    }
                ]
            }
        },
        'codename': 'wam_request_proxy_auth_method',
        'mnemo': 'wam_request_proxy_auth_method',
        'description': 'Если указано - обязательно заполните поля ЛОГИН и ПАРОЛЬ для прокси',
        'attribute_stereotype': {
            'id': 10089,
            'mnemo': 'wam_request_proxy_auth_method',
            'name': 'Метод аутентификации для прокси',
            'package_id': 2,
            'description': null
        },
        'data_type': {
            'id': 3,
            'name': 'Строка',
            'inner_type': 'string',
            'history_table': 'attributes_history_string',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': true,
            'description': null,
            'mnemo': 'string',
            'params': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система',
            'created_at': '2024-10-22 12:36:39',
            'updated_at': '2024-10-22 12:36:39'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10016,
                'name': 'Шаблон Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10016,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon',
                'mnemo': 'template_web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10017,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10017,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': 'probe_web_app_mon_step',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10016,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10017,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            }
        ]
    },
    {
        'id': 10090,
        'name': 'Логин для прокси',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        'data_type_id': 3,
        'attribute_stereotype_id': 10090,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': {
            'syntax': 'postprocessing'
        },
        'codename': 'wam_request_proxy_auth_user',
        'mnemo': 'wam_request_proxy_auth_user',
        'description': '(если выбран метод аутентификации для прокси)',
        'attribute_stereotype': {
            'id': 10090,
            'mnemo': 'wam_request_proxy_auth_user',
            'name': 'Логин для прокси',
            'package_id': 2,
            'description': null
        },
        'data_type': {
            'id': 3,
            'name': 'Строка',
            'inner_type': 'string',
            'history_table': 'attributes_history_string',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': true,
            'description': null,
            'mnemo': 'string',
            'params': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система',
            'created_at': '2024-10-22 12:36:39',
            'updated_at': '2024-10-22 12:36:39'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10016,
                'name': 'Шаблон Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10016,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon',
                'mnemo': 'template_web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10017,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10017,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': 'probe_web_app_mon_step',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10016,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10017,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            }
        ]
    },
    {
        'id': 10091,
        'name': 'Пароль для прокси',
        'visibility': 'public',
        'multiplicity_left': 1,
        'multiplicity_right': 1,
        'attribute_category_id': null,
        'data_type_id': 17,
        'attribute_stereotype_id': 10091,
        'package_id': 2,
        'sort_order': 1,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'icon': null,
        'params': null,
        'codename': 'wam_request_proxy_auth_password',
        'mnemo': 'wam_request_proxy_auth_password',
        'description': '(если выбран метод аутентификации для прокси)',
        'attribute_stereotype': {
            'id': 10091,
            'mnemo': 'wam_request_proxy_auth_password',
            'name': 'Пароль для прокси',
            'package_id': 2,
            'description': null
        },
        'data_type': {
            'id': 17,
            'name': 'Пароль',
            'inner_type': 'string',
            'history_table': 'common',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': false,
            'description': null,
            'mnemo': 'password',
            'params': null
        },
        'package': {
            'id': 2,
            'mnemo': 'measuring_system',
            'name': 'Измерительная система',
            'created_at': '2024-10-22 12:36:39',
            'updated_at': '2024-10-22 12:36:39'
        },
        'attribute_category': null,
        'view_type': null,
        'classes': [
            {
                'id': 10016,
                'name': 'Шаблон Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10016,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'template_web_app_mon',
                'mnemo': 'template_web_app_mon',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            },
            {
                'id': 10017,
                'name': 'Шаг Мониторинга Веб-Ресурса',
                'package_id': 2,
                'visibility': 'package',
                'multiplicity_right': null,
                'multiplicity_left': 0,
                'is_abstract': false,
                'class_stereotype_id': 10017,
                'icon': null,
                'has_anonymous_objects': false,
                'codename': 'probe_web_app_mon_step',
                'mnemo': 'probe_web_app_mon_step',
                'pivot': {
                    'virtual': false,
                    'initial_value': '',
                    'static_feature': null,
                    'order': 0
                }
            }
        ],
        'secondary_view_types': [],
        'classes_ids': [
            {
                'id': 10016,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            },
            {
                'id': 10017,
                'initial_value': '',
                'static_feature': null,
                'order': 0
            }
        ]
    },
    {
       
        'id': 10573,
        'name': 'Шапка запроса',
        'icon': null,
        'visibility': 'public',
        'multiplicity_left': 0,
        'multiplicity_right': null,
        'attribute_category_id': null,
        'attribute_category': null,
        'data_type_id': 10004,
        'data_type': {
            'id': 10004,
            'name': 'Мультистрока',
            'inner_type': 'string',
            'history_table': 'common',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': false,
            'mnemo': 'multistring',
            'description': null,
            'params': null
        },
        'attribute_stereotype_id': null,
        'attribute_stereotype': null,
        'classes_ids': [],
        'classes': [],
        'package_id': 1,
        'package': {
            'id': 1,
            'mnemo': 'subject_area',
            'name': 'Предметная область'
        },
        'sort_order': 99,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'view_type': null,
        'secondary_view_type_ids': [],
        'secondary_view_types': [],
        'params': {
            'syntax': '',
            'formLayout': {
                'cols': ''
            }
        },
        'codename': 'wam_request_headers',
        'description': null,
        'currentAmount': 1,
        'minAmount': 1,
        'maxAmount': 1,
        'objectAttributes': null
        
    },
    {
       
        'id': 10574,
        'name': 'Шапка запроса прокси',
        'icon': null,
        'visibility': 'public',
        'multiplicity_left': 0,
        'multiplicity_right': null,
        'attribute_category_id': null,
        'attribute_category': null,
        'data_type_id': 10004,
        'data_type': {
            'id': 10004,
            'name': 'Мультистрока',
            'inner_type': 'string',
            'history_table': 'common',
            'multiplicity-right': null,
            'min_val': null,
            'max_val': null,
            'check_regexp': null,
            'array_length': null,
            'basic': false,
            'mnemo': 'multistring',
            'description': null,
            'params': null
        },
        'attribute_stereotype_id': null,
        'attribute_stereotype': null,
        'classes_ids': [],
        'classes': [],
        'package_id': 1,
        'package': {
            'id': 1,
            'mnemo': 'subject_area',
            'name': 'Предметная область'
        },
        'sort_order': 99,
        'unit': null,
        'history_to_cache': false,
        'history_to_db': false,
        'readonly': false,
        'view_type_id': null,
        'view_type': null,
        'secondary_view_type_ids': [],
        'secondary_view_types': [],
        'params': {
            'syntax': '',
            'formLayout': {
                'cols': ''
            }
        },
        'codename': 'wam_request_proxy_headers',
        'description': null, 
        'currentAmount': 1,
        'minAmount': 1,
        'maxAmount': 1,
        'objectAttributes': null
    
    },
]
//!ЗАХАРДКОЖЕННЫЕ ДАННЫЕ ДЛЯ АТРИБУТА ВЕБ_АПП
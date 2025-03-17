const mockData = `{
    "data": [
        {
            "id": 1,
            "name": "Супер-админ",
            "super_admin": true,
            "created_at": "2024-07-15T08:39:33.000000Z",
            "updated_at": "2024-07-15T08:39:33.000000Z",
            "accounts": [
                {
                    "id": 10020,
                    "login": "ivanov.ev",
                    "email": "eduard@ed-it.ru",
                    "settings": {
                        "enabled": true
                    },
                    "created_at": "2024-01-19T18:53:24.000000Z",
                    "updated_at": "2024-02-02T12:28:52.000000Z",
                    "last_message_id": null,
                    "full_name": "Эдуард Иванов",
                    "company_name": null,
                    "position": null,
                    "phone_number": null,
                    "pivot": {
                        "group_policy_id": 1,
                        "account_id": 10020
                    }
                }
            ],
            "group_policy_rules": []
        },
        {
            "id": 3,
            "name": "TEST",
            "super_admin": false,
            "created_at": "2024-07-15T12:01:07.000000Z",
            "updated_at": "2024-07-15T12:01:07.000000Z",
            "accounts": [],
            "group_policy_rules": []
        },
        {
            "id": 4,
            "name": "TEST",
            "super_admin": false,
            "created_at": "2024-07-15T12:07:58.000000Z",
            "updated_at": "2024-07-15T12:07:58.000000Z",
            "accounts": [],
            "group_policy_rules": [
                {
                    "id": 2,
                    "group_policy_id": 4,
                    "target_class_id": 40,
                    "path_direction_up": false,
                    "filter_class_id": 42,
                    "created_at": "2024-07-15T12:07:58.000000Z",
                    "updated_at": "2024-07-15T12:07:58.000000Z"
                }
            ]
        },
        {
            "id": 5,
            "name": "TEST",
            "super_admin": false,
            "created_at": "2024-07-15T12:11:05.000000Z",
            "updated_at": "2024-07-15T12:11:05.000000Z",
            "accounts": [],
            "group_policy_rules": [
                {
                    "id": 3,
                    "group_policy_id": 5,
                    "target_class_id": 40,
                    "path_direction_up": false,
                    "filter_class_id": 42,
                    "created_at": "2024-07-15T12:11:05.000000Z",
                    "updated_at": "2024-07-15T12:11:05.000000Z"
                },
                {
                    "id": 4,
                    "group_policy_id": 5,
                    "target_class_id": 10142,
                    "path_direction_up": false,
                    "filter_class_id": 10143,
                    "created_at": "2024-07-15T12:11:05.000000Z",
                    "updated_at": "2024-07-15T12:11:05.000000Z"
                }
            ]
        },
        {
            "id": 6,
            "name": "TEST6",
            "super_admin": false,
            "created_at": "2024-07-15T12:07:58.000000Z",
            "updated_at": "2024-07-15T12:07:58.000000Z",
            "accounts": [],
            "group_policy_rules": [
                {
                    "id": 2,
                    "group_policy_id": 4,
                    "target_class_id": 40,
                    "path_direction_up": false,
                    "filter_class_id": 42,
                    "created_at": "2024-07-15T12:07:58.000000Z",
                    "updated_at": "2024-07-15T12:07:58.000000Z"
                }
            ]
        },
        {
            "id": 7,
            "name": "TEST7",
            "super_admin": false,
            "created_at": "2024-07-15T12:07:58.000000Z",
            "updated_at": "2024-07-15T12:07:58.000000Z",
            "accounts": [],
            "group_policy_rules": [
                {
                    "id": 2,
                    "group_policy_id": 4,
                    "target_class_id": 40,
                    "path_direction_up": false,
                    "filter_class_id": 42,
                    "created_at": "2024-07-15T12:07:58.000000Z",
                    "updated_at": "2024-07-15T12:07:58.000000Z"
                }
            ]
        },
        {
            "id": 8,
            "name": "TEST8",
            "super_admin": false,
            "created_at": "2024-07-15T12:07:58.000000Z",
            "updated_at": "2024-07-15T12:07:58.000000Z",
            "accounts": [],
            "group_policy_rules": [
                {
                    "id": 2,
                    "group_policy_id": 4,
                    "target_class_id": 40,
                    "path_direction_up": false,
                    "filter_class_id": 42,
                    "created_at": "2024-07-15T12:07:58.000000Z",
                    "updated_at": "2024-07-15T12:07:58.000000Z"
                }
            ]
        },
        {
            "id": 9,
            "name": "TEST9",
            "super_admin": false,
            "created_at": "2024-07-15T12:07:58.000000Z",
            "updated_at": "2024-07-15T12:07:58.000000Z",
            "accounts": [],
            "group_policy_rules": [
                {
                    "id": 2,
                    "group_policy_id": 4,
                    "target_class_id": 40,
                    "path_direction_up": false,
                    "filter_class_id": 42,
                    "created_at": "2024-07-15T12:07:58.000000Z",
                    "updated_at": "2024-07-15T12:07:58.000000Z"
                }
            ]
        },
        {
            "id": 10,
            "name": "TEST10",
            "super_admin": false,
            "created_at": "2024-07-15T12:07:58.000000Z",
            "updated_at": "2024-07-15T12:07:58.000000Z",
            "accounts": [],
            "group_policy_rules": [
                {
                    "id": 2,
                    "group_policy_id": 4,
                    "target_class_id": 40,
                    "path_direction_up": false,
                    "filter_class_id": 42,
                    "created_at": "2024-07-15T12:07:58.000000Z",
                    "updated_at": "2024-07-15T12:07:58.000000Z"
                }
            ]
        },
        {
            "id": 11,
            "name": "TEST11",
            "super_admin": false,
            "created_at": "2024-07-15T12:07:58.000000Z",
            "updated_at": "2024-07-15T12:07:58.000000Z",
            "accounts": [],
            "group_policy_rules": [
                {
                    "id": 2,
                    "group_policy_id": 4,
                    "target_class_id": 40,
                    "path_direction_up": false,
                    "filter_class_id": 42,
                    "created_at": "2024-07-15T12:07:58.000000Z",
                    "updated_at": "2024-07-15T12:07:58.000000Z"
                }
            ]
        },
        {
            "id": 12,
            "name": "TEST12",
            "super_admin": false,
            "created_at": "2024-07-15T12:07:58.000000Z",
            "updated_at": "2024-07-15T12:07:58.000000Z",
            "accounts": [],
            "group_policy_rules": [
                {
                    "id": 2,
                    "group_policy_id": 4,
                    "target_class_id": 40,
                    "path_direction_up": false,
                    "filter_class_id": 42,
                    "created_at": "2024-07-15T12:07:58.000000Z",
                    "updated_at": "2024-07-15T12:07:58.000000Z"
                }
            ]
        },
        {
            "id": 13,
            "name": "TEST13",
            "super_admin": false,
            "created_at": "2024-07-15T12:07:58.000000Z",
            "updated_at": "2024-07-15T12:07:58.000000Z",
            "accounts": [],
            "group_policy_rules": [
                {
                    "id": 2,
                    "group_policy_id": 4,
                    "target_class_id": 40,
                    "path_direction_up": false,
                    "filter_class_id": 42,
                    "created_at": "2024-07-15T12:07:58.000000Z",
                    "updated_at": "2024-07-15T12:07:58.000000Z"
                }
            ]
        }
    ]
}`

export default mockData
export const defaultAxisOptions = {

}
export const defaultMultipleChartProps = {
    widgetId: '1713864948763',
    baseHistoryForm: {
        items: [
            {
                id: 'own-form',
                mnemo: 'own',
                label: 'Измерения текущего объекта',
                formProps: {
                    objectsWithAttrs: [
                        {
                            fieldId: 'own0',
                            classId: null,
                            targetClassIds: [],
                            linkedClassIds: [],
                            objectId: 11469,
                            attributeIds: [
                                10119,
                                10138,
                                10139,
                                10140,
                                10141,
                                10142,
                                10144,
                                10156,
                                10157,
                                10165,
                                10166,
                                10167,
                                10194,
                                10195,
                                10200,
                                10208,
                                10218,
                                10219,
                                10220,
                                10221,
                                10236,
                                10237,
                                10248,
                                10249,
                                10250,
                                10251,
                                10261,
                                10278
                            ],
                            showAttrValue: null
                        }
                    ],
                    mnemo: 'own',
                    styles: {
                        button: {
                            cursor: 'pointer'
                        }
                    },
                    optionsListAll: {
                        namesWithObject: true
                    },
                    objectId: 11469,
                    isSingle: true,
                    showForm: [
                        'attribute'
                    ]
                }
            },
            {
                id: 'linked-form',
                mnemo: 'linked',
                label: 'Измерения связанных объектов',
                formProps: {
                    objectsWithAttrs: [
                        {
                            fieldId: 'linked0',
                            classId: null,
                            targetClassIds: [],
                            linkedClassIds: [],
                            objectId: null,
                            attributeIds: [],
                            showAttrValue: null
                        }
                    ],
                    mnemo: 'linked',
                    styles: {
                        button: {
                            cursor: 'pointer'
                        }
                    },
                    optionsListAll: {
                        namesWithObject: true
                    },
                    showForm: [
                        'targetClassIds',
                        'linkedClassIds',
                        'object',
                        'attribute'
                    ],
                    objectId: 11469
                }
            },
            {
                id: 'other-form',
                mnemo: 'other',
                label: 'Измерения набора объектов',
                formProps: {
                    objectsWithAttrs: [
                        {
                            fieldId: 'other0',
                            classId: null,
                            targetClassIds: [],
                            linkedClassIds: [],
                            objectId: null,
                            attributeIds: [],
                            showAttrValue: null
                        }
                    ],
                    mnemo: 'other',
                    styles: {
                        button: {
                            cursor: 'pointer'
                        }
                    },
                    optionsListAll: {
                        namesWithObject: true
                    },
                    showForm: [
                        'class',
                        'object',
                        'attribute'
                    ]
                }
            }
        ],
        countInARow: 2,
        own: {
            enabled: true,
            OASettings: [
                {
                    fieldId: 'own0',
                    classId: null,
                    targetClassIds: [],
                    linkedClassIds: [],
                    objectId: 11469,
                    attributeIds: [
                        10119,
                        10138,
                        10139,
                        10140,
                        10141,
                        10142,
                        10144,
                        10156,
                        10157,
                        10165,
                        10166,
                        10167,
                        10194,
                        10195,
                        10200,
                        10208,
                        10218,
                        10219,
                        10220,
                        10221,
                        10236,
                        10237,
                        10248,
                        10249,
                        10250,
                        10251,
                        10261,
                        10278
                    ],
                    showAttrValue: null
                }
            ]
        },
        linked: {
            enabled: false,
            OASettings: [
                {
                    fieldId: 'linked0',
                    classId: null,
                    targetClassIds: [],
                    linkedClassIds: [],
                    objectId: null,
                    attributeIds: [],
                    showAttrValue: null
                }
            ]
        },
        other: {
            enabled: false,
            OASettings: [
                {
                    fieldId: 'other0',
                    classId: null,
                    targetClassIds: [],
                    linkedClassIds: [],
                    objectId: null,
                    attributeIds: [],
                    showAttrValue: null
                }
            ]
        }
    },
    multipleHistoryForm: [
        {
            axisID: '6ccd8196-0359-4629-af61-8207b64dfbc3',
            attributeIds: [
                10140
            ],
            unit: '°C',
            axisName: 'Температура'
        },
        /* {
            axisID: '3da0f59f-aea5-4718-8c6f-33cff4b925e5',
            axisName: 'Доступность',
            unit: '',
            attributeIds: [
                10119,
                10220,
                10221
            ]
        },
        {
            axisID: '03607477-b72a-42a8-96b0-aacb6dccb239',
            axisName: 'Загрузка',
            unit: '',
            attributeIds: [
                10145,
                10139,
                10278,
                10209,
                10210,
                10138
            ]
        },
        {
            axisID: '69e9198e-9d86-4791-b127-7e2b299d33ba',
            axisName: 'Статус',
            unit: '',
            attributeIds: [
                10142,
                10208,
                10218,
                10219
            ]
        } */
    ],
    attrsFromBaseForm: []
}
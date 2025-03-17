import { BarChartOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES, ROUTES_COMMON } from '@shared/config/paths'
import { IPackage } from '@shared/types/packages'
import { getClasses } from '@shared/api/Classes/Models/getClasses/getClasses'
import { getRelations } from '@shared/api/Relations/Models/getRelations/getRelations'
import { getMainAddsClasses } from '@shared/utils/classes'
import { getPackages } from '@shared/api/Packages/Models/getPackages/getPackages'
import { useEffect, useState } from 'react'
import { MenuItemType, ItemType } from 'antd/es/menu/hooks/useItems'
import { useDebounceCallback } from './useDebounce'
import { selectClasses, useClassesStore } from '@shared/stores/classes'
import { selectRelations, useRelationsStore } from '@shared/stores/relations'
import { IClass } from '@shared/types/classes'
import { getURL } from '@shared/utils/nav'
import { useConfigStore } from '@shared/stores/config'

const useManagerClassesMenu = (searchQuery?: string) => {
    const [ loading, setLoading ] = useState(false)
    const [ data, setData ] = useState<ItemType<MenuItemType>[]>([])
    const navigate = useNavigate()
    
    const classes = useClassesStore(selectClasses)
    const relations = useRelationsStore(selectRelations)

    const packages = {
        1: 'Предметная область',
        2: 'Измерительная система',
        9000: 'Связанные классы',
    }
    const defaultGroup =  (package_id: number, cls: IClass) => ({
        key: `pack-${package_id}`,
        icon: <BarChartOutlined />,
        label: (
            <div style={{ whiteSpace: 'pre-line', lineHeight: '1.5' }}>
                {packages[package_id]}
            </div>
        ),
        children: [],
    })
    
    const menuItem = (cls: IClass) => ({
        ASD: 'ASDF'
    })
    // console.log('data', data)
    const classGroups = classes.reduce((acc, cls) => {
        if (cls.name.toLowerCase().includes(searchQuery.toLowerCase() ?? '')) {
            if (cls.package_id === 1) {
                return
            }
        }

        return acc
    }, {
        subject: {
            key: 'package_id-1',
            children: [],
            icon: <BarChartOutlined />,
            label: 'Предметная область',
        },
        measurement: [],
        linked: [],
    })
    const loadMenu = useDebounceCallback(async () => {
        setLoading(true)

        try {
            const packages = await getPackages({ all: true })
            // const apiClasses = await getClasses({ all: true })
            // const apiRelations = await getRelations({ all: true })

            const linkedClasses = relations.filter((relation) => {
                return ['aggregation', 'composition'].includes(relation.relation_type)
            }).map((relation) => relation.left_class_id)

            const filteredClasses = classes.filter((cls) => {
                return [
                    cls.name.toLowerCase(), // поиск по названиям классов
                    // ...cls.attributes.map((attr) => attr.name), // поиск по названиям аттрибутов
                ].some(filed => filed.includes(searchQuery.toLowerCase() || ''))
            })

            const classesIdsForMenu = {
                packageOne: getMainAddsClasses(relations, filteredClasses, 1).main,
                packageTwo: getMainAddsClasses(relations, filteredClasses, 2).all,
                linked: filteredClasses.filter((cls) => {
                    return linkedClasses.includes(cls.id) && cls.package_id === 1 && !cls.is_abstract
                }).map((cls) => cls.id)
            }

            const config = useConfigStore.getState()?.store?.data.find(el => el.mnemo == 'front_settings')?.value

            const system = !!config && JSON.parse(config).system

            const mainClasses = system?.managerObjects?.mainClasses

            const classesForMenu = {
                ...mainClasses && {
                    mainClasses: {
                        pack: {
                            id: 90000,
                            mnemo: 'tmp-main',
                            name: 'Основные классы'
                        } as IPackage,
                        classes: filteredClasses.filter((cls) => mainClasses.includes(cls.id))
                    },
                },
                packageOne: {
                    pack: packages.data.find((pack) => pack.id === 1),
                    classes: filteredClasses.filter((cls) => classesIdsForMenu.packageOne.includes(cls.id))
                },
                linked: {
                    pack: {
                        id: 9000,
                        mnemo: 'tmp-linked',
                        name: 'Связанные классы'
                    } as IPackage,
                    classes: filteredClasses.filter((cls) => classesIdsForMenu.linked.includes(cls.id))
                },
                packageTwo: {
                    pack: packages.data.find((pack) => pack.id === 2),
                    classes: filteredClasses.filter((cls) => classesIdsForMenu.packageTwo.includes(cls.id))
                },

            }

            setData(Object.values(classesForMenu)
                .filter(({ classes }) => classes.length > 0)
                .map(({ pack, classes }) => ({
                    key: `pack-${pack.id}`,
                    icon: <BarChartOutlined />,
                    label: (
                        <div style={{ whiteSpace: 'pre-line', lineHeight: '1.5' }}>
                            {pack.name}
                        </div>
                    ),
                    style: { lineHeight: '1.5', whiteSpace: 'pre-line'  },
                    children: classes
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((cls) => ({
                            key: `subitem-${cls.id}`,
                            icon: <BarChartOutlined />,
                            label: (
                                <Link 
                                    style={{ textDecoration: 'none' }} 
                                    // eslint-disable-next-line max-len
                                    to={getURL(`${ROUTES.OBJECTS}/${ROUTES_COMMON.LIST}?class_id=${cls.id}`, 'manager')}
                                    // to={`/${ROUTES.OBJECTS}/${ROUTES_COMMON.LIST}?class_id=${cls.id}`}
                                >
                                    <div 
                                        style={{ 
                                            whiteSpace: 'pre-line', 
                                            lineHeight: '1.5', 
                                            fontSize: '14px',
                                        }}
                                    >
                                        {cls.name}
                                    </div>
                                </Link>
                            ),
                            style: { lineHeight: '1.5', whiteSpace: 'pre-line', height: 'auto' },
                            onClick: () => {
                                navigate(getURL(
                                    `${ROUTES.OBJECTS}/${ROUTES_COMMON.LIST}?class_id=${cls.id}`, 
                                    'manager'
                                ))
                                // navigate(`/${ROUTES.OBJECTS}/${ROUTES_COMMON.LIST}?class_id=${cls.id}`)
                            },
                        
                        })) 
                })))
        } finally {
            setLoading(false)
        }
    }, 500)
    
    useEffect(() => {
        loadMenu()
        /* (async function() {
            setLoading(true)

            try {
                const packages = await getPackages({ all: true })
                const classes = await getClasses({ all: true })
                const relations = await getRelations({ all: true })

                const linkedClasses = relations.data.filter((relation) => {
                    return ['aggregation', 'composition'].includes(relation.relation_type)
                }).map((relation) => relation.left_class_id)

                const filteredClasses = classes.data.filter((cls) => {
                    return [
                        cls.name.toLowerCase(),
                        ...cls.attributes.map((attr) => attr.name),
                    ].some(filed => filed.includes(searchQuery.toLowerCase() || ''))
                })

                const classesIdsForMenu = {
                    packageOne: getMainAddsClasses(relations.data, filteredClasses, 1).main,
                    // packageOne: getMainAddsClasses(relations.data, classes.data, 1).main,
                    packageTwo: getMainAddsClasses(relations.data, filteredClasses, 2).all,
                    // packageTwo: getMainAddsClasses(relations.data, classes.data, 2).all,
                    linked: filteredClasses.filter((cls) => {
                    // linked: classes.data.filter((cls) => {
                        return linkedClasses.includes(cls.id) && cls.package_id === 1 && !cls.is_abstract
                    }).map((cls) => cls.id)
                }

                const classesForMenu = {
                    packageOne: {
                        pack: packages.data.find((pack) => pack.id === 1),
                        classes: filteredClasses.filter((cls) => classesIdsForMenu.packageOne.includes(cls.id))
                        // classes: classes.data.filter((cls) => classesIdsForMenu.packageOne.includes(cls.id))
                    },
                    linked: {
                        pack: {
                            id: 9000,
                            mnemo: 'tmp-linked',
                            name: 'Связанные классы'
                        } as IPackage,
                        classes: filteredClasses.filter((cls) => classesIdsForMenu.linked.includes(cls.id))
                        // classes: classes.data.filter((cls) => classesIdsForMenu.linked.includes(cls.id))
                    },
                    packageTwo: {
                        pack: packages.data.find((pack) => pack.id === 2),
                        classes: filteredClasses.filter((cls) => classesIdsForMenu.packageTwo.includes(cls.id))
                        // classes: classes.data.filter((cls) => classesIdsForMenu.packageTwo.includes(cls.id))
                    },

                }

                setData(Object.values(classesForMenu)
                    .filter(({ classes }) => classes.length > 0)
                    .map(({ pack, classes }) => ({
                        key: `pack-${pack.id}`,
                        icon: <BarChartOutlined />,
                        // label: pack.name,
                        label: (
                            <div style={{ whiteSpace: 'pre-line', lineHeight: '1.5' }}>
                                {pack.name}
                            </div>
                        ),
                        style: { lineHeight: '1.5', whiteSpace: 'pre-line'  },
                        children: classes
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((cls) => ({
                                key: `subitem-${cls.id}`,
                                icon: <BarChartOutlined />,
                                label: (
                                    <Link 
                                        style={{ textDecoration: 'none' }} 
                                        to={`/${ROUTES.OBJECTS}/${ROUTES_COMMON.LIST}?class_id=${cls.id}`}
                                    >
                                        <div 
                                            style={{ 
                                                whiteSpace: 'pre-line', 
                                                lineHeight: '1.5', 
                                                fontSize: '14px',
                                            }}
                                            className="custom-hover"
                                        >
                                            {cls.name}
                                        </div>
                                    </Link>
                                ),
                                style: { lineHeight: '1.5', whiteSpace: 'pre-line', height: 'auto' },
                                // label: cls.name,
                                onClick: () => {
                                    navigate(`/${ROUTES.OBJECTS}/${ROUTES_COMMON.LIST}?class_id=${cls.id}`)
                                },
                            
                            })) 
                    })))
            } finally {
                setLoading(false)
            }
        })() */
    }, [searchQuery])

    return {
        data,
        loading
    } as const 
}

export default useManagerClassesMenu
import { FC, useEffect, useMemo, useState } from 'react'
import { IECGridMap } from './types'
import ECGridMapObject from './ECGridMapObject'
import { generalStore } from '@shared/stores/general'
import { useTheme } from '@shared/hooks/useTheme'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import styles from './ECGridMap.module.css'
import { ECLoader } from '@shared/ui/loadings'

const gridObjects = [
    { id: 65311, name: 'СПБ', color: '#cdcbcc', x: 1, y: 1 },
    { id: 65360, name: 'МУР', color: '#cdcbcc', x: 5, y: 1 },
    { id: 65374, name: 'СВС', color: '#cdcbcc', x: 2, y: 1 },
    { id: 65305, name: 'МСК', color: '#cdcbcc', x: 1, y: 2 },
    { id: 65368, name: 'КАР', color: '#cdcbcc', x: 4, y: 2 },
    { id: 65300, name: 'НЕН', color: '#cdcbcc', x: 10, y: 2 },
    { id: 65338, name: 'ЧУК', color: '#cdcbcc', x: 17, y: 2 },
    { id: 65361, name: 'КАМ', color: '#cdcbcc', x: 18, y: 2 },

    { id: 65310, name: 'ЛЕН', color: '#cdcbcc', x: 3, y: 3 },
    { id: 65315, name: 'НОВГ', color: '#cdcbcc', x: 4, y: 3 },
    { id: 65335, name: 'ВОЛ', color: '#cdcbcc', x: 5, y: 3 },
    { id: 65298, name: 'АРХ', color: '#cdcbcc', x: 9, y: 3 },
    { id: 65358, name: 'КОМИ', color: '#cdcbcc', x: 10, y: 3 },
    { id: 65299, name: 'ЯМАЛ', color: '#cdcbcc', x: 11, y: 3 },
    { id: 65292, name: 'КРАС', color: '#cdcbcc', x: 14, y: 3 },
    { id: 65325, name: 'ЯКУТ', color: '#cdcbcc', x: 16, y: 3 },
    { id: 65340, name: 'МАГ', color: '#cdcbcc', x: 17, y: 3 },

    { id: 65309, name: 'КНГ', color: '#cdcbcc', x: 1, y: 4 },
    { id: 65365, name: 'ПСК', color: '#cdcbcc', x: 3, y: 4 },
    { id: 65306, name: 'ТВЕР', color: '#cdcbcc', x: 4, y: 4 },
    { id: 65307, name: 'ЯРО', color: '#cdcbcc', x: 5, y: 4 },
    { id: 65359, name: 'ИВА', color: '#cdcbcc', x: 6, y: 4 },
    { id: 65328, name: 'КОС', color: '#cdcbcc', x: 7, y: 4 },
    { id: 65346, name: 'МАРИ', color: '#cdcbcc', x: 8, y: 4 },
    { id: 65349, name: 'КИР', color: '#cdcbcc', x: 9, y: 4 },
    { id: 65297, name: 'ПЕР', color: '#cdcbcc', x: 10, y: 4 },
    { id: 65347, name: 'ХАН', color: '#cdcbcc', x: 11, y: 4 },
    { id: 65295, name: 'ТЮМ', color: '#cdcbcc', x: 12, y: 4 },
    { id: 65362, name: 'ТОМ', color: '#cdcbcc', x: 13, y: 4 },
    { id: 65308, name: 'КЕМ', color: '#cdcbcc', x: 14, y: 4 },
    { id: 65323, name: 'ИРК', color: '#cdcbcc', x: 15, y: 4 },
    { id: 65304, name: 'АМУР', color: '#cdcbcc', x: 16, y: 4 },
    { id: 65339, name: 'ХАБ', color: '#cdcbcc', x: 17, y: 4 },
    { id: 65344, name: 'СХЛН', color: '#cdcbcc', x: 19, y: 4 },

    { id: 65355, name: 'СМОЛ', color: '#cdcbcc', x: 3, y: 5 },
    { id: 65367, name: 'КАЛУ', color: '#cdcbcc', x: 4, y: 5 },
    { id: 65312, name: 'МОС', color: '#cdcbcc', x: 5, y: 5 },
    { id: 65366, name: 'ВЛА', color: '#cdcbcc', x: 6, y: 5 },
    { id: 65343, name: 'НИЖ', color: '#cdcbcc', x: 7, y: 5 },
    { id: 65333, name: 'ЧУВ', color: '#cdcbcc', x: 8, y: 5 },
    { id: 65326, name: 'ТАТ', color: '#cdcbcc', x: 9, y: 5 },
    { id: 65345, name: 'УДМ', color: '#cdcbcc', x: 10, y: 5 },
    { id: 65372, name: 'СВЕР', color: '#cdcbcc', x: 11, y: 5 },
    { id: 65348, name: 'КУРГ', color: '#cdcbcc', x: 12, y: 5 },
    { id: 65302, name: 'НОВО', color: '#cdcbcc', x: 13, y: 5 },
    { id: 65350, name: 'ХАК', color: '#cdcbcc', x: 14, y: 5 },
    { id: 65352, name: 'БУР', color: '#cdcbcc', x: 15, y: 5 },
    { id: 65356, name: 'ЕВР', color: '#cdcbcc', x: 16, y: 5 },

    { id: 65354, name: 'БРЯ', color: '#cdcbcc', x: 3, y: 6 },
    { id: 65327, name: 'ОРЛ', color: '#cdcbcc', x: 4, y: 6 },
    { id: 65342, name: 'ТУЛ', color: '#cdcbcc', x: 5, y: 6 },
    { id: 65296, name: 'РЯЗ', color: '#cdcbcc', x: 6, y: 6 },
    { id: 65351, name: 'МОР', color: '#cdcbcc', x: 7, y: 6 },
    { id: 65341, name: 'УЛЬ', color: '#cdcbcc', x: 8, y: 6 },
    { id: 65332, name: 'САМ', color: '#cdcbcc', x: 9, y: 6 },
    { id: 65318, name: 'БШК', color: '#cdcbcc', x: 10, y: 6 },
    { id: 65294, name: 'ЧЕЛ', color: '#cdcbcc', x: 11, y: 6 },
    { id: 65301, name: 'ОМСК', color: '#cdcbcc', x: 12, y: 6 },
    { id: 65291, name: 'АЛ.К', color: '#cdcbcc', x: 13, y: 6 },
    { id: 65317, name: 'ТЫВА', color: '#cdcbcc', x: 14, y: 6 },
    { id: 65321, name: 'ЗАБ', color: '#cdcbcc', x: 15, y: 6 },
    { id: 65334, name: 'ПРИ', color: '#cdcbcc', x: 17, y: 6 },

    { id: 65322, name: 'КУР', color: '#cdcbcc', x: 5, y: 7 },
    { id: 65363, name: 'ЛИП', color: '#cdcbcc', x: 6, y: 7 },
    { id: 65303, name: 'ТАМ', color: '#cdcbcc', x: 7, y: 7 },
    { id: 65330, name: 'ПЕН', color: '#cdcbcc', x: 8, y: 7 },
    { id: 65290, name: 'САР', color: '#cdcbcc', x: 9, y: 7 },
    { id: 65331, name: 'ОРНБ', color: '#cdcbcc', x: 10, y: 7 },
    { id: 65370, name: 'АЛТ', color: '#cdcbcc', x: 14, y: 7 },

    { id: 65377, name: 'ЗО', color: '#cdcbcc', x: 2, y: 8 },
    { id: 65375, name: 'ДНР', color: '#cdcbcc', x: 3, y: 8 },
    { id: 65376, name: 'ЛНР', color: '#cdcbcc', x: 4, y: 8 },
    { id: 65357, name: 'БЕЛ', color: '#cdcbcc', x: 5, y: 8 },
    { id: 65369, name: 'ВОР', color: '#cdcbcc', x: 6, y: 8 },
    { id: 65293, name: 'ВОЛГ', color: '#cdcbcc', x: 7, y: 8 },

    { id: 65378, name: 'ХО', color: '#cdcbcc', x: 2, y: 9 },
    { id: 65373, name: 'КРЫМ', color: '#cdcbcc', x: 3, y: 9 },
    { id: 65364, name: 'АДЫГ', color: '#cdcbcc', x: 4, y: 9 },
    { id: 65319, name: 'КРДР', color: '#cdcbcc', x: 5, y: 9 },
    { id: 65320, name: 'РОС', color: '#cdcbcc', x: 6, y: 9 },
    { id: 65371, name: 'КАЛМ', color: '#cdcbcc', x: 7, y: 9 },
    { id: 65353, name: 'АСТ', color: '#cdcbcc', x: 8, y: 9 },

    { id: 65314, name: 'КЧР', color: '#cdcbcc', x: 5, y: 10 },
    { id: 65337, name: 'СТАВ', color: '#cdcbcc', x: 6, y: 10 },
    { id: 65329, name: 'ЧЕЧ', color: '#cdcbcc', x: 7, y: 10 },
    { id: 65324, name: 'ДАГ', color: '#cdcbcc', x: 8, y: 10 },

    { id: 65336, name: 'КАБ', color: '#cdcbcc', x: 5, y: 11 },
    { id: 65313, name: 'С.ОС', color: '#cdcbcc', x: 6, y: 11 },
    { id: 65316, name: 'ИНГ', color: '#cdcbcc', x: 7, y: 11 },

]

const ECGridMap: FC<IECGridMap> = ({ rows = 11, columns = 22, objects, onClick, viewType = 'square' }) => {
    const interfaceView = generalStore((st) => st.interfaceView)
    const isShowcase = interfaceView === 'showcase'
    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode
    const textColor = isShowcase ? createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode) : 'black'
    const backgroundColor = isShowcase
        ? createColorForTheme(theme?.widget?.background, theme?.colors, themeMode)
        : 'white'
    const [mapObjects, setMapObjects] = useState<any[]>([])

    const [isLoading, setIsLoading] = useState<boolean>(true)

    // const mapObjects = useMemo(() => {
    //     return [...gridObjects]
    // }, []);
    useEffect(() => {
        setMapObjects(gridObjects)
        setIsLoading(false)
    }, [])

    
    useEffect(() => {
        const localMapObjects = [...gridObjects]

        localMapObjects.forEach(region => {
            const regionFromBack = objects.find(obj => obj.id == region.id)

            if (regionFromBack) {
                region.color = regionFromBack?.status?.color
            }
            else {
                region.color = '#cdcbcc'
            }

            // console.log('regionFromBack', regionFromBack)
        })
        setMapObjects(localMapObjects)
    }, [objects])

    return (
        <div>
            <h3 style={{ color: textColor, fontSize: '1.5rem', marginTop: 0 }}>Регионы</h3>
            <div
                style={{
                    display: 'grid',
                    gridTemplateRows: `repeat(${rows}, 50px)`,
                    gridTemplateColumns: `repeat(${columns}, 50px)`,
                    backgroundColor: backgroundColor,
                    marginBottom: '80px',
                }}
            >{isLoading ? <ECLoader /> :    mapObjects.map(({ id, name, color, x, y }) => (
                    <div
                        key={`region_${id}`}
                        className={styles.ObjectItem}
                        style={{
                            gridColumn: x,
                            gridRow: y,
                            width: '50px',
                            height: '50px',
                            backgroundColor: color,
                        }}
                    >
                        <ECGridMapObject viewType={viewType} id={id} name={name} color={color} onClick={onClick} />
                    </div>
                ))}
             
            </div>
        </div>
    )
}

export default ECGridMap
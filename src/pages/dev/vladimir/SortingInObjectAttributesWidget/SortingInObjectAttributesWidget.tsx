import { MLErrorBoundary } from '@shared/ui/MLErrorBoundary'
import { Button, Slider } from 'antd'
import { WrapperWidget } from '@containers/widgets/WrapperWidget'
import { forumThemeConfig } from '@app/themes/forumTheme/forumThemeConfig'
import { useState } from 'react'
import { selectObject, useObjectsStore } from '@shared/stores/objects'
import ObjectOAttrs from '@entities/objects/ObjectOAttrs/ObjectOAttrs'

export const SortingInObjectAttributesWidget = () => {
    const [idx, setIdx] = useState(8)
    const objectId = [10176, 10177, 10178, 10179, 10480, 10481, 10482, 10483, 10484]
    const [oaSortOrder, setSortOrder] = useState({
        10176: [11292, 11290, 11287, 11288, 11291, 11289, 15554],
        10177: [11298, 11294, 11297, 11296, 11293, 11295, 17887],
        10178: [11299, 11302, 11303, 11304, 11301, 11300, 21783],
        10179: [11305, 11306, 11307, 11308, 11309, 11310, 21784],
        10480: [13974, 13975, 13976, 13977, 13978, 13973, 15573],
        10481: [13979, 13983, 13982, 13984, 13980, 13981, 15025],
        10482: [13986, 13987, 13988, 13989, 13990, 13985, 37016],
        10483: [13991, 13992, 13993, 13994, 13995, 13996, 15099],
        10484: [13997, 13998, 13999, 14000, 14001, 14002, 15062],
    })
    const [isCustomOrder, setCustomOrder] = useState(true)
    const mixOrder = (arr: number[]) => {
        return arr.sort(() => Math.random() - 0.5)
    }
    const getObj = useObjectsStore(selectObject)
    const formatter = (value: number) => {
        const obj = getObj(objectId[value])

        return obj?.name
    }
    return (
        <MLErrorBoundary>
            <p>Выберите здание</p>
            <Slider
                min={0}
                max={objectId.length - 1}
                value={idx}
                onChange={(value: number) => setIdx(value)}
                tooltip={{ formatter }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                    onClick={() =>
                        setSortOrder((state) => {
                            return {
                                ...state,
                                [objectId[idx]]: mixOrder(state[objectId[idx]]),
                            }
                        })
                    }
                    disabled={!isCustomOrder}
                >
                    Изменить порядок атрибутов рандомно
                </Button>
                <Button type={isCustomOrder ? 'primary' : 'default'} onClick={() => setCustomOrder(!isCustomOrder)}>
                    {isCustomOrder ? 'Выключить' : 'Включить'} настройку задания нового порядка атрибутов
                </Button>
            </div>
            <WrapperWidget
                title="Атрибуты"
                height={forumThemeConfig.device.attributes.height}
                titleStyle={{ fontSize: '16px' }}
            >
                <ObjectOAttrs
                    objectId={objectId[idx]}
                    showLinks
                    height={420}
                    linkedObjects={{
                        targetClasses: [
                            {
                                class_id: 10082,
                                showClassName: true,
                            },
                            {
                                class_id: 10058,
                                showClassName: true,
                            },
                            {
                                class_id: 10105,
                                showClassName: true,
                            },
                            {
                                class_id: 10056,
                                showClassName: true,
                            },
                            {
                                class_id: 10055,
                                showClassName: true,
                            },
                        ],
                        connectingClasses: [10082, 10058, 10105, 10056, 10055],
                    }}
                    oaSortOrder={isCustomOrder ? oaSortOrder[objectId[idx]] : []}
                />
            </WrapperWidget>
        </MLErrorBoundary>
    )
}

import { ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
import { Badge, Button, Popover } from 'antd'
import { FC, useMemo, useState } from 'react'
import { TreeFilteringModal } from './TreeFilteringModal'
import { ITreeFilteringProps, ITreeStore } from '../treeTypes'
import { useTreeStore } from '@shared/stores/trees'
import { useTheme } from '@shared/hooks/useTheme'
import { ECTooltip } from '@shared/ui/tooltips'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'

export const TreeFiltering: FC<ITreeFilteringProps> = ({ classifiers, id }) => {
    // const { chosenClassifiersCount } = useTreeStore(chosenClassifiersCountSelect)
    const chosenClassifiersCount = useTreeStore((state: ITreeStore) => state.chosenClassifiersCount[id])
    const theme = useTheme()

    const [filterModalShow, setFilterModalShow] = useState(false)

    const showModalChooseClass = (value: boolean) => {
        setFilterModalShow(value)
    }

    const closeModal = () => {
        setFilterModalShow(false)
    }

    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode

    const color = useMemo(() => {
        return (
            createColorForTheme(theme?.sideBar?.textColor, theme?.colors, themeMode) ||
            theme?.components?.tree?.showcase?.buttons?.color
        )
    }, [theme, themeMode])

    return (
        <ECTooltip title="Показать фильтры">
            <Badge
                color={theme?.components?.tree?.showcase?.badges?.background}
                count={chosenClassifiersCount}
                offset={[-1, 5]}
                style={{ zIndex: 100 }}
            >
                <Popover
                    open={filterModalShow}
                    onOpenChange={showModalChooseClass}
                    placement="bottomLeft"
                    trigger="click"
                    content={<TreeFilteringModal id={id} classifiers={classifiers} closeModal={closeModal} />}
                >
                    <Button
                        icon={<ECIconView icon="FilterOutlined" style={{ fontSize: 25 }} />}
                        style={{
                            color: color ?? '#ffffff',
                            border: 'none',
                            boxShadow: 'none',
                            minWidth: 24,
                            minHeight: 24,
                            background: 'transparent',
                        }}
                    />
                </Popover>
            </Badge>
        </ECTooltip>
    )
}
import { ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
import { Badge, Button, Popover } from 'antd'
import { FC, useMemo, useState } from 'react'
import { TreeGroupingModal } from './TreeGroupingModal'
import { ITreeGroupingProps, ITreeStore } from '../treeTypes'
import { useTreeStore } from '@shared/stores/trees'
import { useTheme } from '@shared/hooks/useTheme'
import { ECTooltip } from '@shared/ui/tooltips'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'

export const TreeGrouping: FC<ITreeGroupingProps> = ({ classifiers, id }) => {
    const [groupingModalShow, setGroupingModalShow] = useState(false)
    const theme = useTheme()
    const groupingOrder = useTreeStore((state: ITreeStore) => state.groupingOrder[id])

    const showGroupingModal = (value: boolean) => {
        setGroupingModalShow(value)
    }

    const closeModal = () => {
        setGroupingModalShow(false)
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
        <ECTooltip title="Группировка">
            <Badge
                color={theme?.components?.tree?.showcase?.badges?.background}
                count={groupingOrder?.length}
                offset={[-1, 5]}
                style={{ zIndex: 100 }}
            >
                <Popover
                    open={groupingModalShow}
                    onOpenChange={showGroupingModal}
                    placement="bottomLeft"
                    trigger="click"
                    content={<TreeGroupingModal id={id} classifiers={classifiers} closeModal={closeModal} />}
                >
                    <Button
                        icon={<ECIconView icon="ClusterOutlined" style={{ fontSize: 25 }} />}
                        // icon={<InputIcon icon="ApartmentOutlined" style={{ fontSize: 25 }} />}
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
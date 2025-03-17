import { useECTheme } from '@shared/hooks/useECTheme'
import { Checkbox, Table } from 'antd'
import { FC, memo } from 'react'
import { ProbeTableProps } from '../types'
import { columns } from '../utils'
import { ECLoader } from '@shared/ui/loadings'
import { useAttributesStore } from '@shared/stores/attributes'
import { OAView } from '@entities/objects/OAView/OAView'
import { ECTooltip } from '@shared/ui/tooltips'
import { ECIconView } from '@shared/ui/ECUIKit/common/ECIconView/ECIconView'
import { useTheme } from '@shared/hooks/useTheme'
import { useAccountStore, selectAccount } from '@shared/stores/accounts'
import { generalStore } from '@shared/stores/general'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'

const ProbeTable: FC<ProbeTableProps> = memo(
    ({ probe, selectedItems, handleCheckboxChange, getAttr, response, loading }) => {
        const ecTheme = useECTheme()
        const bgColor = ecTheme.getColorFromConfig({ element: 'tableHeaderBackground', section: 'table' })
        const textColor = ecTheme.getColorFromConfig({ element: 'tableHeaderTextColor', section: 'table' })
        const findAttr = useAttributesStore().getAttributeById

        const interfaceView = generalStore((st) => st.interfaceView)
        const isShowcase = interfaceView === 'showcase'
        const theme = useTheme()
        const accountData = useAccountStore(selectAccount)
        const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode
        const color = isShowcase ? createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode) : 'black'
        const backgroundColor = isShowcase
            ? createColorForTheme(theme?.widget?.background, theme?.colors, themeMode)
            : 'white'

        return (
            <>
                {
                    // bgColor && textColor &&
                    <Table
                        key={probe.prid}
                        caption={
                            <div
                                style={{
                                    background: bgColor,
                                    color: textColor,
                                    borderRadius: '7px 7px 0 0',
                                    padding: 8,
                                    textAlign: 'left',
                                }}
                            >
                                <Checkbox
                                    onChange={(e) => handleCheckboxChange(probe, e.target.checked)}
                                    checked={selectedItems.selectedProbes[probe.prid]}
                                >
                                    <p style={{ padding: 0, margin: '0 0 0 5px', color: color || '#000000' }}>
                                        {probe.name}
                                    </p>
                                </Checkbox>
                            </div>
                        }
                        bordered
                        showHeader={false}
                        pagination={false}
                        columns={columns}
                        dataSource={probe?.object_attributes?.map((attribute) => ({
                            key: attribute.id,
                            Check: (
                                <Checkbox
                                    onChange={(e) => handleCheckboxChange(attribute, e.target.checked)}
                                    checked={selectedItems.selectedAttributes[`${probe.prid}-${attribute.id}`]}
                                />
                            ),
                            Attribute: getAttr(attribute.attribute_id).name,
                            Meas: loading?.flag ? (
                                selectedItems.selectedAttributes[`${probe.prid}-${attribute.id}`] && (
                                    <ECTooltip title={`Попытка ${loading?.attempts} из 3`}>
                                        <ECLoader style={{ paddingRight: 5 }} />
                                        {loading?.attempts}/3
                                    </ECTooltip>
                                )
                            ) : selectedItems.selectedAttributes[`${probe.prid}-${attribute.id}`] && response ? (
                                <OAView
                                    objectAttribute={{
                                        ...findAttr(attribute.attribute_id),
                                        attribute_id: attribute.id,
                                        attribute_value:
                                            response?.find((attr) => attribute.id == attr.obj_attr_id)?.value ||
                                            'Нет данных',
                                    }}
                                />
                            ) : (
                                loading?.attempts > 3 && (
                                    <ECTooltip title={'Не удалось получить измерение'} placement="top">
                                        <ECIconView
                                            icon="WarningOutlined"
                                            style={{
                                                color: 'red',
                                                fontSize: 22,
                                                cursor: 'pointer',
                                            }}
                                        />
                                    </ECTooltip>
                                )
                            ),
                        }))}
                    />
                }
            </>
        )
    }
)

export default ProbeTable

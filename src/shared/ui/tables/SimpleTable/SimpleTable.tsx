/* eslint-disable @typescript-eslint/no-explicit-any */
import { Col, Row, Table, TableProps, Typography } from 'antd'
import styles from './SimpleTable.module.css'
import { ECTooltip } from '@shared/ui/tooltips'
import { useTheme } from '@shared/hooks/useTheme'
import { selectAccount, useAccountStore } from '@shared/stores/accounts'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'
import { generalStore } from '@shared/stores/general'

interface IToolbar {
    right?: React.ReactNode
    left?: React.ReactNode
}

interface ISimpleTable extends TableProps<any> {
    toolbar?: IToolbar
    rows: any[]
    rowSelection?: any
    ellipsysWidth?: number
    currentPage?: string
}

/**
 * Обычная таблица с отключаемым тулбаром
 *
 * @param rows - ряды таблицы
 * @param toolbar - настройки тулбара
 */
export const SimpleTable: React.FC<ISimpleTable> = ({
    rows,
    toolbar,
    rowSelection,
    ellipsysWidth,
    currentPage,
    ...props
}) => {
    const theme = useTheme()
    const interfaceView = generalStore((st) => st.interfaceView)
    const isShowcase = interfaceView === 'showcase'
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode

    const textColor = isShowcase
        ? createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode) || 'black'
        : '#000000'
    const backgroundColor = isShowcase
        ? createColorForTheme(theme?.widget?.background, theme?.colors, themeMode) || 'white'
        : '#ffffff'
    const generateRowClassName = () => {
        return `
            .custom-row {
                background-color: ${backgroundColor} !important;
                color: ${textColor} !important;
            }
            .custom-row td {
                color: ${textColor} !important;
            }
        `
    }

    const ellipsisRows = (rows || []).map((row) => {
        const entries = Object.entries(row).map(([col, value]: [any, any]) => {
            if (col !== 'key' && (typeof value === 'string' || typeof value === 'number')) {
                return [
                    col,
                    <ECTooltip key={col.key} title={value}>
                        <Typography.Text ellipsis={true} style={{ width: ellipsysWidth, color: textColor }}>
                            {value}
                        </Typography.Text>
                    </ECTooltip>,
                ]
            } else {
                return [col, value]
            }
        })

        return Object.fromEntries(entries)
    })

    return (
        <Row gutter={[0, 20]}>
            <style>{generateRowClassName()}</style>
            {toolbar && (
                <Col xs={24}>
                    <Row justify="space-between">
                        <Col>{toolbar.left}</Col>
                        <Col>{toolbar.right}</Col>
                    </Row>
                </Col>
            )}
            <Col xs={24}>
                <Table
                    // rowClassName={styles?.narrow_table}
                    rowClassName={() => 'custom-row'}
                    locale={{ emptyText: 'Нет данных' }}
                    dataSource={ellipsisRows}
                    rowSelection={rowSelection}
                    pagination={
                        currentPage
                            ? { position: ['bottomRight'], defaultCurrent: Number(currentPage) }
                            : { position: ['bottomRight'] }
                    }
                    {...props}
                />
            </Col>
        </Row>
    )
}
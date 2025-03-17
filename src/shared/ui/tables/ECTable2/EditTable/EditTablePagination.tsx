import { DownOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { ILocalTheme, IThemeComponentMnemo, IThemeComponent } from '@app/themes/types';
import { generalStore } from '@shared/stores/general';
import { ECSelect } from '@shared/ui/forms';
import { ECTooltip } from '@shared/ui/tooltips';
import { createColorForTheme } from '@shared/utils/Theme/theme.utils';
import { Button, Col, Row, Select } from 'antd';
import { FC, ReactNode, useEffect, useMemo, useRef, useState } from 'react';

export interface IEditTablePaginationProps {
    total?: number
    pageSize?: {
        default?: number
        values?: number[]
    }
    lastPage?: number
    initialPage?: number
    enablePageSelector?: boolean
    onChange: (page: number, size: number) => void
    theme?: ILocalTheme & {
        components: Record<IThemeComponentMnemo, Partial<IThemeComponent>>;
    }
    themeMode?: 'dark' | 'light'
    defaultHeaderTableStyle?: any
}

/**
 * Компонент кастомной пагинации для таблицы
 * 
 * @param total - общее количество элементов
 * @param lastPage - последняя страница (только для серверной пагинации),
 * @param pageSize - количество строк на странице,
 * @param onChange - функция обновления всей пагинации,
 * @param enablePageSelector - включение селекта перехода на указаннюу страницу,
 * @param initialPage - номер страницы при первом рендеринге
 */
export const EditTablePagination: FC<IEditTablePaginationProps> = ({
    total = 0,
    lastPage = 0,
    pageSize,
    onChange,
    enablePageSelector,
    initialPage = 1,
    theme, themeMode,
    defaultHeaderTableStyle
}) => {
    const [selectedPageSize, setSelectedPageSize] = useState(pageSize?.default || pageSize.values?.[0] || 10)
    const [activePage, setActivePage] = useState(initialPage)
    const [currentPageSelector, setCurrentPageSelector] = useState(initialPage)

    const resultedPageSize = selectedPageSize || pageSize.default
    const awaitedlastItemOfTable = activePage * resultedPageSize
    const firstItemOfTable = awaitedlastItemOfTable - resultedPageSize + (total === 0 ? 0 : 1)
    const lastItemOfTable = awaitedlastItemOfTable > total ? total : awaitedlastItemOfTable

    const interfaceView = generalStore((st) => st.interfaceView)
    const isShowcase = interfaceView === 'showcase'

    useEffect(() => {
        onChange?.(activePage, selectedPageSize)
    }, [selectedPageSize, activePage])

    useEffect(() => {
        setActivePage(currentPageSelector)
    }, [currentPageSelector])

    //*Вводим на случай, если нужен выбор странички не при серверной пагинации
    const localLastPage = useMemo(() => {
        if (enablePageSelector) {
            const pages = total / pageSize.default

            return Math.ceil(pages)
        }

        return 0

    }, [enablePageSelector, pageSize])

    //*Вводим на случай, если нужен выбор странички не при серверной пагинации

    const color = useMemo(() => {
        return isShowcase ? createColorForTheme(theme?.table?.header?.textColor, theme?.colors, themeMode) : 'black'

    }, [themeMode, theme])

    const pageSelectorOptions = useMemo(() => new Array(localLastPage ?? lastPage).fill(0).map((_, i) => {
        return { value: i + 1, label: <div style={{ color: color ?? '#000000' }}>{`${i + 1}`}</div> }
    }), [lastPage, color])
    const backgroundSelectColor = useMemo(() => {
        return isShowcase ? createColorForTheme(theme?.table?.content?.background, theme?.colors, themeMode) : 'white'
    }, [defaultHeaderTableStyle])

    return (
        <Row align="middle" gutter={12}>
            <Col>
                {firstItemOfTable} - {lastItemOfTable} из {total}
            </Col>
            <Col>
                <Select
                    suffixIcon={<DownOutlined style={{ color: color ?? 'black', pointerEvents: 'none' }} />}
                    defaultValue={pageSize.default}
                    options={pageSize.values.map((value) => ({
                        value,
                        label: <div style={{ color: color ?? '#000000' }}>{value}</div>,
                    }))}
                    value={selectedPageSize}
                    bordered={false}
                    onChange={(value) => {
                        setSelectedPageSize(value)
                        setActivePage(1)
                        setCurrentPageSelector(1)
                    }}
                    style={{
                        minWidth: 50,
                        background: backgroundSelectColor ?? '#ffffff',
                        borderRadius: '8px',
                        color: color ?? '#000000',
                    }}
                    dropdownStyle={{ backgroundColor: backgroundSelectColor ?? '#ffffff' }}
                    dropdownRender={(originNode: ReactNode) => (
                        <div className={`dropdown_${themeMode}`}>{originNode}</div>
                    )}
                />
            </Col>
            <Col>
                <Row gutter={2}>
                    <Col>
                        <Button
                            type="text"
                            icon={<LeftOutlined style={{ color: color ?? 'black' }} />}
                            disabled={activePage < 2}
                            onClick={() => {
                                setActivePage((p) => p - 1)
                                setCurrentPageSelector((p) => p - 1)
                            }}
                            style={{ cursor: 'pointer' }}
                        />
                    </Col>
                    {enablePageSelector && (
                        <Col>
                            <ECTooltip title="Перейти к странице">
                                <ECSelect
                                    allowClear={false}
                                    className="editTableSelect"
                                    suffixIcon={<DownOutlined style={{ color: color ?? 'black' }} />}
                                    defaultValue={activePage}
                                    style={{
                                        width: `${pageSelectorOptions[0]}`.length * 6,
                                        background: backgroundSelectColor ?? '#ffffff',
                                        borderRadius: '8px',
                                        color: color ?? '#000000',
                                    }}
                                    bordered={false}
                                    options={pageSelectorOptions}
                                    disabled={total === 0}
                                    onChange={setCurrentPageSelector}
                                    value={currentPageSelector}
                                    dropdownStyle={{
                                        backgroundColor: backgroundSelectColor ?? '#ffffff',
                                        color: color ?? '#000000',
                                    }}
                                    dropdownRender={(originNode: ReactNode) => (
                                        <div className={`dropdown_${themeMode}`}>{originNode}</div>
                                    )}
                                />
                            </ECTooltip>
                        </Col>
                    )}
                    <Col>
                        <Button
                            type="text"
                            icon={<RightOutlined style={{ color: color ?? 'black' }} />}
                            disabled={activePage >= total / resultedPageSize}
                            onClick={() => {
                                setActivePage((p) => p + 1)
                                setCurrentPageSelector((p) => p + 1)
                            }}
                            style={{ cursor: 'pointer' }}
                        />
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}
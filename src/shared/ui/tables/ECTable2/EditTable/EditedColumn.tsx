import { FC, useEffect, useMemo, useRef } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Col, InputNumber, Row, Switch, Typography } from 'antd'
import { MenuOutlined } from '@ant-design/icons'
import editTableCSS from './edit-table.module.css'
import { useTheme } from '@shared/hooks/useTheme'
import { useAccountStore, selectAccount } from '@shared/stores/accounts'
import { generalStore } from '@shared/stores/general'
import { createColorForTheme } from '@shared/utils/Theme/theme.utils'

const range = {
    min: 20,
    max: 500,
}

interface IEditedColumnProps {
    id: number | string
    visible?: boolean
    width?: number
    title?: string
    onClick?: (params: { visible?: boolean }) => void
    onWidthChange?: (width: number) => void
}

/**
 * Компонент ряда в модальном окне настроек таблицы (EditedColumnModal).
 * Настраивает порядок, ширину и видимость.
 *
 * @param id - ключ, на основе которого будет проводиться сортировка (dnd)
 * @param visible - видимость колонки в таблице
 * @param width - ширина колонки в таблице
 * @param title - название столбца
 * @param onClick - функция переключения свича видимости
 * @param onWidthChange - функция обновления ширины столбца
 */
export const EditedColumn: FC<IEditedColumnProps> = (props) => {
    const { id, visible = true, width, title, onClick, onWidthChange } = props
    
    const accountData = useAccountStore(selectAccount)
    const theme = useTheme()
    const themeMode = theme?.themeMode || accountData?.user?.settings?.themeMode
    const [interfaceView] = generalStore((state) => [state.interfaceView])
    const isShowcase = interfaceView === 'showcase'

    const background = useMemo(() => {
        return isShowcase
            ? createColorForTheme(theme?.backgroundColor, theme?.colors, themeMode) ?? '#ffffff'
            : '#ffffff'
    }, [theme, themeMode])
    const color = useMemo(() => {
        return isShowcase ? createColorForTheme(theme?.textColor, theme?.colors, themeMode) ?? '#000000' : '#000000'
    }, [theme, themeMode])

    const {
        attributes,
        listeners,
        setNodeRef,
        // отвечает за перетаскивание при нажатии на конкретный элемент контейнера
        setActivatorNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id })
    const style = { transform: CSS.Transform.toString(transform), transition }
    const ref = useRef()

    useEffect(() => {
        const input: any = ref?.current

        if (input) {
            if (input?.style) {
                input.style.color = color
            }
        }
    }, [themeMode, theme])

    return (
        <div className={editTableCSS['edit-column-modal-item']} ref={setNodeRef} style={style} {...attributes}>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 5,
                    padding: '16px 0',
                }}
            >
                <div
                    style={{
                        width: '60px',
                    }}
                >
                    <Switch
                        checked={visible}
                        onChange={(checked) => {
                            onClick?.({ visible: checked })
                        }}
                        style={{ cursor: 'pointer' }}
                    />
                </div>
                <div
                    style={{
                        flex: 1,
                    }}
                >
                    <Typography.Text style={{ color: color }}>{title}</Typography.Text>
                </div>
                <div
                    style={{
                        width: '100px',
                    }}
                >
                    <InputNumber
                        ref={ref}
                        style={{ color: color, background: background }}
                        value={width}
                        onChange={(w) => onWidthChange?.(w)}
                        {...range}
                    />
                </div>
                <div
                    style={{
                        width: '30px',
                        color: color,
                    }}
                >
                    <MenuOutlined />
                </div>
            </div>
        </div>
    )
    /* return (
        <div 
            className={editTableCSS['edit-column-modal-item']} 
            ref={setNodeRef} 
            style={style} 
            {...attributes} 
        >
            
            <Row 
                gutter={[10, 0]} 
                justify="space-between" 
                align="middle" 
                style={{ cursor: isDragging ? 'grabbing' : 'grab', paddingTop: 16, paddingBottom: 16 }}
            >
                <Col xs={3}>
                    <Switch 
                        checked={visible} 
                        onChange={(checked) => {
                            onClick?.({ visible: checked })
                        }}
                        style={{ cursor: 'pointer' }}
                    />
                </Col>
                <Col xs={14} ref={setActivatorNodeRef} {...listeners} style={{ lineHeight: 2.3 }}>
                    <Typography.Text>{title}</Typography.Text>
                </Col>
                <Col xs={5} style={{ marginLeft: 'auto' }}>
                    <InputNumber 
                        value={width} 
                        onChange={(w) => onWidthChange?.(w)} 
                        {...range}
                    />
                </Col>
                <Col xs={2} ref={setActivatorNodeRef} {...listeners}>
                    <MenuOutlined />
                </Col>
            </Row>
        </div>
    ); */
}
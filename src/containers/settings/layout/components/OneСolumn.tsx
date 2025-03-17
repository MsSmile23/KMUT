import { Switch } from 'antd'
import { FC } from 'react'
import { TypeBlock, VisibleBlock, dataLayoutType } from '../LayoutSettings';
import styles from './../LayoutSettingsStyle.module.css';

export enum SchemaType {
    TOP = 'top',
    BOTTOM = 'bottom',
    LEFT = 'left',
    RIGHT = 'right',
    CENTER ='center'
}

interface OneColumnProps {
    title_header: string;
    handleChange?: (type_block: TypeBlock, params: VisibleBlock, value: string | boolean) => void;
    items: VisibleBlock[],
    type_schema: SchemaType,
    type_block: TypeBlock,
    data: dataLayoutType
}

const OneColumn: FC<OneColumnProps> = (props) => {

    const {
        title_header,
        handleChange,
        items,
        type_schema,
        type_block,
        data
    } = props

    return (
        <div className={styles.setting_layout_block}>
            <div className={styles.setting_layout_block_head}>
                <div className={styles.setting_layout_block_head_diagram}>
                    <div className={styles.setting_layout_block_head_diagram_wrapper}>
                        <div
                            className={
                                `${styles.setting_layout_block_head_diagram_wrapper_head}
                                ${type_schema === SchemaType.TOP
                                && !data[type_block][VisibleBlock.VISIBILITY]
                                && styles.disableBlock}
                                `
                            }
                            style={{
                                backgroundColor: type_schema === SchemaType.TOP
                                    ? data[type_block][VisibleBlock.BACKGROUND]
                                    : 'transparent'
                            }}
                        />
                        <div className={styles.setting_layout_block_head_diagram_wrapper_content}>
                            <div
                                className={
                                    `${type_schema === SchemaType.LEFT
                                    && !data[type_block][VisibleBlock.VISIBILITY]
                                    && styles.disableBlock}`
                                }
                                style={{
                                    backgroundColor: type_schema === SchemaType.LEFT
                                        ? data[type_block][VisibleBlock.BACKGROUND]
                                        : 'transparent'
                                }}
                            />
                            <div
                                className={
                                    `${type_schema === SchemaType.RIGHT
                                    && !data[type_block][VisibleBlock.VISIBILITY]
                                    && styles.disableBlock}`
                                }
                                style={{
                                    backgroundColor: type_schema === SchemaType.RIGHT
                                        ? data[type_block][VisibleBlock.BACKGROUND]
                                        : 'transparent'
                                }}
                            />
                        </div>
                        <div
                            className={
                                `${styles.setting_layout_block_head_diagram_wrapper_footer}
                                ${type_schema === SchemaType.BOTTOM
                                && !data[type_block][VisibleBlock.VISIBILITY]
                                && styles.disableBlock}
                            `
                            }
                            style={{
                                backgroundColor: type_schema === SchemaType.BOTTOM
                                    ? data[type_block][VisibleBlock.BACKGROUND]
                                    : 'transparent'
                            }}
                        />
                        {/* <div
                            className={
                                `${styles.setting_layout_block_head_diagram_wrapper_center}
                                ${type_schema === SchemaType.CENTER
                                // && !data[type_block][VisibleBlock.VISIBILITY]
                                && styles.disableBlock}
                            `
                            }
                            style={{
                                backgroundColor: type_schema === SchemaType.BOTTOM
                                    ? data[type_block][VisibleBlock.BACKGROUND]
                                    : 'transparent'
                            }}
                        /> */}
                    </div>
                </div>
                <div
                    className={styles.setting_layout_block_head_content} style={{
                        color: data[type_block][VisibleBlock.FONT_COLOR]
                    }}
                >
                    {title_header}
                </div>
            </div>

            <div className={styles.setting_layout_block_content}>
                <div style={{ padding: 10 }}>
                    {items.includes(VisibleBlock.BACKGROUND) && (
                        <div className={styles.setting_layout_block_content_item}>
                            <h3 style={{ flex: 1 }}>Фон</h3>
                            <div className={styles.setting_layout_block_content_item_content}>
                                <input
                                    value={data[type_block][VisibleBlock.BACKGROUND]}
                                    type="color"
                                    onChange={(e) => handleChange(type_block, VisibleBlock.BACKGROUND, e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                    {items.includes(VisibleBlock.FONT_COLOR) && (
                        <div className={styles.setting_layout_block_content_item}>
                            <h3 style={{ flex: 1 }}>Цвет шрифта</h3>
                            <div className={styles.setting_layout_block_content_item_content}>
                                <input
                                    value={data[type_block][VisibleBlock.FONT_COLOR]}
                                    type="color"
                                    onChange={(e) => handleChange(
                                        type_block,
                                        VisibleBlock.FONT_COLOR,
                                        e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                    {items.includes(VisibleBlock.VISIBILITY) && (
                        <div className={styles.setting_layout_block_content_item}>
                            <h3 style={{ flex: 1 }}>Видимость</h3>
                            <div className={styles.setting_layout_block_content_item_content}>
                                <Switch
                                    defaultChecked
                                    checked={data[type_block][VisibleBlock.VISIBILITY]}
                                    onChange={(checked) => handleChange(type_block, VisibleBlock.VISIBILITY, checked)}
                                />
                            </div>
                        </div>
                    )}
                    {items.includes(VisibleBlock.MENU_AVAILABILITY) && (
                        <div className={styles.setting_layout_block_content_item}>
                            <h3 style={{ flex: 1 }}>Наличие меню</h3>
                            <div className={styles.setting_layout_block_content_item_content}>
                                <Switch
                                    defaultChecked
                                    disabled={!data[type_block][VisibleBlock.VISIBILITY]}
                                    checked={data[type_block][VisibleBlock.MENU_AVAILABILITY]}
                                    onChange={(checked) => handleChange(
                                        type_block,
                                        VisibleBlock.MENU_AVAILABILITY,
                                        checked
                                    )}
                                />
                            </div>
                        </div>
                    )}
                    {items.includes(VisibleBlock.LOGO) && (
                        <div className={styles.setting_layout_block_content_item}>
                            <h3 style={{ flex: 1 }}>Логотип</h3>
                            <div className={styles.setting_layout_block_content_item_content}>
                                <Switch
                                    defaultChecked
                                    checked={data[type_block][VisibleBlock.LOGO]}
                                    disabled={!data[type_block][VisibleBlock.VISIBILITY]}
                                    onChange={(checked) => handleChange(type_block, VisibleBlock.LOGO, checked)}
                                />
                            </div>
                        </div>
                    )}
                    {items.includes(VisibleBlock.USER_MENU) && (
                        <div className={styles.setting_layout_block_content_item}>
                            <h3 style={{ flex: 1 }}>Меню пользователя</h3>
                            <div className={styles.setting_layout_block_content_item_content}>
                                <Switch
                                    defaultChecked
                                    checked={data[type_block][VisibleBlock.USER_MENU]}
                                    disabled={!data[type_block][VisibleBlock.VISIBILITY]}
                                    onChange={(checked) => handleChange(type_block, VisibleBlock.USER_MENU, checked)}
                                />
                            </div>
                        </div>
                    )}
                    {items.includes(VisibleBlock.ABILITY_TO_LEAVE) && (
                        <div className={styles.setting_layout_block_content_item}>
                            <h3 style={{ flex: 1 }}>Возможность "выехать"</h3>
                            <div className={styles.setting_layout_block_content_item_content}>
                                <Switch
                                    defaultChecked
                                    checked={data[type_block][VisibleBlock.ABILITY_TO_LEAVE]}
                                    onChange={(checked) => handleChange(
                                        type_block, 
                                        VisibleBlock.ABILITY_TO_LEAVE, 
                                        checked)}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default OneColumn
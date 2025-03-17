import { Button, TooltipProps, message } from 'antd';
import { CSSProperties, FC, useCallback, useState } from 'react';
import * as Icons from '@ant-design/icons'
import { useEditTableStore } from '@shared/ui/tables/ECTable2/EditTable/tableStore';
import * as XLSX from 'xlsx';
import { ECTooltip } from '@shared/ui/tooltips';
import { BaseButtonProps } from 'antd/es/button/button';
import { downloadBlobFile } from '@shared/utils/Files/files';
import { SizeType } from 'antd/es/config-provider/SizeContext';

type TTooltipProps = Omit<TooltipProps, 'title'> & {
    title?: React.ReactNode
}

interface IButtonDownloadProps {
    tooltip?: TTooltipProps
    button?: BaseButtonProps
    icon?: string
    rows?: any[]
    request?: (p?: any) => any
    filename?: { request?: string, table?: string },
    columns?: Array<{ key: string, title: any }>
    format?: string
    disableClick?: boolean
    buttonStyle?: CSSProperties
    size?: SizeType
    children?: any
}

export const ButtonDownload: FC<IButtonDownloadProps> = ({
    tooltip,
    button,
    icon,
    request,
    rows = [],
    filename,
    columns,
    disableClick,
    format,
    buttonStyle,
    size = 'small',
    children
}) => {
    const { loading: buttonLoading, ...buttonProps } = button || { loading: false }

    const Icon = icon !== null ? Icons?.[icon] : null

    const tableColumns = useEditTableStore((st) => columns ?? st.sortableColumns)

    const [loading, setLoading] = useState(false)
    const [messageApi, contextHolder] = message.useMessage();

    const download = useCallback(() => {
        const columnKeys = tableColumns.map((col) => col?.key);

        // Transform rows to include only visible columns and process special cases
        const copiedRowsWithHeaders = [
            // First row contains headers
            tableColumns.map((col, i) => {
                const defaultTitle = `Заголовок ${i + 1}`;

                if (col?.title) {
                    if (typeof col.title === 'string') {
                        return col?.title || defaultTitle;
                    }

                    if (typeof col.title?.props?.children === 'string') {
                        return col.title?.props?.children || defaultTitle;
                    }
                }

                return defaultTitle;
            }),
            // Following rows contain actual data
            ...rows.map((row) => {
                return Object.fromEntries(
                    Object.entries(row).filter(([key]) => columnKeys.includes(key))
                );
            }).map((row) => {
                if ('statusColumn' in row) {
                    return ({ ...row, statusColumn: (row?.statusColumn as any)?.props?.children });
                }

                if ('status' in row) {
                    return ({
                        ...row,
                        status: (row?.status as any)?.props?.children?.props?.objectAttribute?.attribute?.name
                    });
                }

                return row;
            }).map((row) => {
                const orderedArray = [];

                Object.entries(row).forEach(([key, value]) => {
                    const i = tableColumns.findIndex((col) => col?.dataIndex === key);

                    orderedArray[i] = value;
                });

                return orderedArray;
            })
        ];

        // Prepare Excel sheet
        const worksheet = XLSX.utils.aoa_to_sheet(copiedRowsWithHeaders);
        const workbook = XLSX.utils.book_new();

        // Set column widths based on header lengths
        worksheet['!cols'] = copiedRowsWithHeaders[0].map((h) => ({ wch: Math.max(h.length) + 10 }));

        // Append sheet to workbook
        XLSX.utils.book_append_sheet(workbook, worksheet);

        // Generate filename and download the file
        XLSX.writeFile(workbook, filename?.table || `Таблица_${new Date().getTime()}.xlsx`, {
            compression: true
        });
    }, [tableColumns, rows]);

    const downloadByRequest = useCallback(async () => {
        try {
            setLoading(true)
            downloadBlobFile(request, format, filename?.table)
        } catch (err) {
            messageApi.error('Ошибка скачивания')
        } finally {
            setLoading(false)
        }
    }, [request])

    const isLoading = buttonLoading || loading

    return (
        <>
            {contextHolder}
            <ECTooltip title="Скачать" {...tooltip}>
                {children
                    ?
                    <div
                        style={{ width: buttonStyle?.width || 'auto' }}
                        onClick={disableClick ? undefined : (request ? downloadByRequest : download)}
                    >
                        {children}
                    </div>
                    :
                    <Button
                        size={size}
                        // type="default"
                        shape="circle"
                        onClick={disableClick ? undefined : (request ? downloadByRequest : download)}
                        style={{ background: '#ffffff', ...buttonStyle }}
                        {...buttonProps}
                        icon={Icon ? <Icon /> : <Icons.ExportOutlined />}
                    >
                        {/* <div style={{ position: 'relative' }}>
                        {isLoading && (
                            <div style={{ position: 'absolute', top: '0%', left: '25%' }}>
                                <Icons.LoadingOutlined />
                            </div>
                        )}
                        <div style={{ opacity: isLoading ? 0.2 : 1 }}>
                            {Icon === null ? buttonProps.children : (Icon ? <Icon /> : <Icons.ExportOutlined />)}
                        </div>
                    </div> */}
                    </Button>}

            </ECTooltip>
        </>
    )
}
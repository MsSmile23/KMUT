import { Button, TooltipProps } from 'antd';
import { CSSProperties, FC } from 'react';
import * as Icons from '@ant-design/icons'
import * as XLSX from 'xlsx';
import { ECTooltip } from '@shared/ui/tooltips';
import { SizeType } from 'antd/es/config-provider/SizeContext';

type TTooltipProps = Omit<TooltipProps, 'title'> & {
    title?: React.ReactNode
}

interface IButtonDownloadProps {
    tooltip?: TTooltipProps
    rows?: any[]
    filename?: string,
    columns?: Array<{ field: string, headerName: any }>
    disableClick?: boolean
    buttonStyle?: CSSProperties
    size?: SizeType
}

const ECAGButtonDownload: FC<IButtonDownloadProps> = ({ 
    tooltip, 
    rows = [],
    filename,
    columns,
    disableClick,
    buttonStyle,
    size = 'small'
}) => {

    // Column Definitions: Defines & controls grid columns.

    const download = () => {
        const data = rows.map(row => {
            return columns.slice(1).reduce((acc, col) => {
                acc[col.headerName] = row[col.field];
                
                return acc;
            }, {});
        });
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Данные');
        XLSX.writeFile(workbook, filename ? `${filename}.xlsx` : 'Таблица классов.xlsx');
    };

    return (

        <ECTooltip title="Скачать" {...tooltip}>
            <Button
                size={size}
                // type="default"
                shape="circle" 
                onClick={disableClick ? undefined : download}
                style={{ background: '#ffffff', ...buttonStyle }}
                // {...buttonProps}
                icon={<Icons.ExportOutlined />}
            />
        </ECTooltip>
    
    )
}


export default ECAGButtonDownload
import { ECTooltip } from '@shared/ui/tooltips';
import { Button } from 'antd';
import { FC } from 'react';
import * as XLSX from 'xlsx'

export const ButtonExport: FC<{
    data: any[] 
    view: 'absolute' | 'percent' | 'perAndAbs'
}> = ({ data, view }) => {
    const handleExport = () => {
        const total = data.reduce((acc, obj) => acc + obj.count, 0)
        const rows = data.map((row) => ({ 
            name: row.value, 
            value: row.count,
            percent: ((row.count / total) * 100).toFixed(0) 
        }))

        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Table');

        const switchHeaders = () => {
            const param = 'Параметр'

            if (view === 'absolute') {
                return [param, 'Значение']
            }

            if (view === 'percent') {
                return [param, 'Процент']
            }

            return [param, 'Значение', 'Процент']
        }

        /* fix headers */
        XLSX.utils.sheet_add_aoa(worksheet, [switchHeaders()], { origin: 'A1' });

        /* calculate column width */
        const max_width = rows.reduce((width, row) => Math.max(width, row.name.length), 10);

        worksheet['!cols'] = [ { wch: max_width } ];

        XLSX.writeFile(workbook, 'table.xlsx', { compression: true });
    }

    return (
        <ECTooltip title="Экпорт данных">
            <Button onClick={handleExport}>Экпорт данных</Button>
        </ECTooltip>
    )
}
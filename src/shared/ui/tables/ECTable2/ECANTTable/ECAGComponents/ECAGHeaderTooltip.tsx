import { Button, Tooltip } from 'antd';
import { FC, useEffect, useRef, useState } from 'react';
import { ArrowUpOutlined, ArrowDownOutlined, FilterFilled } from '@ant-design/icons';
import { ECTooltip } from '@shared/ui/tooltips';



const ECAGHeaderTooltip: FC = ({ ...props }) => {

    // const [sortState, setSortState] = useState('none');

    // useEffect(() => {
    //     const updateSortState = () => {
    //         const sortModel = props.api.getSortModel();
    //         const columnSort = sortModel.find((sort) => sort.colId === props.column.colId);

    //         if (columnSort) {
    //             setSortState(columnSort.sort);
    //         } else {
    //             setSortState('none');
    //         }
    //     };

    //     props.api.addEventListener('sortChanged', updateSortState);
    //     updateSortState();

    //     return () => {
    //         props.api.removeEventListener('sortChanged', updateSortState);
    //     };
    // }, [props.api, props.column.colId]);

    // const getSortStatusText = () => {
    //     switch (sortState) {
    //         case 'asc':
    //             return 'Sorted Ascending';
    //         case 'desc':
    //             return 'Sorted Descending';
    //         default:
    //             return 'Not Sorted';
    //     }
    // };

    // return (
    //     <ECTooltip title={'Нажмите для сортировки по возрастанию'}>
            
    //     </ECTooltip>
    // );
    const { displayName, enableSorting, showColumnMenu, setSort } = props;

    const handleSort = (event) => {
        if (enableSorting) {
            const isAscending = event.shiftKey; // Hold Shift for multi-sort

            setSort(isAscending ? 'asc' : 'desc', event.shiftKey);
        }
    };

    const handleMenu = (event) => {
        showColumnMenu(event.currentTarget);
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
                style={{ flex: 1, cursor: enableSorting ? 'pointer' : 'default' }}
                onClick={handleSort}
            >
                {displayName}
            </div>
            {enableSorting && (
                <div
                    style={{ marginLeft: '8px', cursor: 'pointer' }}
                    onClick={handleMenu}
                >
          ☰
                </div>
            )}
        </div>
    );
}


export default ECAGHeaderTooltip
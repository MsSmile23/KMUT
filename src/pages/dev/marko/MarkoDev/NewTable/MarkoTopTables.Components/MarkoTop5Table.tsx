import { FC, useEffect, useState } from "react"
import { ECTable2 } from "@shared/ui/tables/ECTable2/ECTable2";
import { GridOptions, themeAlpine } from 'ag-grid-community';
import { IVoshodRegionStatus } from "@shared/types/voshod";
import { generalStore } from "@shared/stores/general";
import { useTheme } from "@shared/hooks/useTheme";
import { selectAccount, useAccountStore } from "@shared/stores/accounts";
import { createColorForTheme } from "@shared/utils/Theme/theme.utils";


interface Top5Table {
    header: string
    payload?: any
    style?: any
    onRowClicked?: (id: any) => void, 
    data: IVoshodRegionStatus[]
    loadingRegions?:boolean
}
const rowData = [
    {
        key: '1',
        id: 1,
        region: 'Москва',
        status: '100/5/2', // Подключено/Недоступно/Ремонт
        avialibility: '95%' // Доступность
    },
    {
        key: '2',
        id: 2,
        region: 'Санкт-Петербург',
        status: '80/3/1', // Подключено/Недоступно/Ремонт
        avialibility: '90%' // Доступность
    },
    {
        key: '3',
        id: 3,
        region: 'Новосибирск',
        status: '120/0/0', // Подключено/Недоступно/Ремонт
        avialibility: '100%' // Доступность
    },
    {
        key: '4',
        id: 4,
        region: 'Екатеринбург',
        status: '90/2/3', // Подключено/Недоступно/Ремонт
        avialibility: '85%' // Доступность
    },
    {
        key: '5',
        id: 5,
        region: 'Казань',
        status: '70/1/1', // Подключено/Недоступно/Ремонт
        avialibility: '92%' // Доступность
    }
];

const MarkoTop5Table: FC<Top5Table> = ({ header, payload, style, onRowClicked, data, loadingRegions }) => {

    // const incidents = useApi2(
    //             (payload?: any) => getIncidents((payload || {})),
    //             { onmount: false } ,
    //     )
    
   // Пример сервака, куда мы будем делать запрос  


   const interfaceView = generalStore(st => st.interfaceView)
    const isShowcase = interfaceView === 'showcase'
    const theme = useTheme()
    const accountData = useAccountStore(selectAccount)
    const themeMode = theme?.themeMode ||accountData?.user?.settings?.themeMode
    const textColor = isShowcase
        ? createColorForTheme(theme?.widget?.textColor, theme?.colors, themeMode)
        : 'black'

    
    const colDefs = [
        {
            key: 'id',
            field: 'id',
            headerName: '№',
            filter: false,
            width: 50,

            cellStyle: { padding: '6px 0px',  display: 'flex', alignItems: 'center',    },
            headerClass: 'centered-header'
            // flex: 1,
        },
        {
            key: 'region',
            field: 'region',
            headerName: 'Регион',
            filter: false,
            width: 150,
            wrapHeaderText: true,
            cellStyle: { whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: '1.2', padding: '6px 0px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start'  },
            autoHeight: true,
        },
        {
            key: 'status',
            field: 'status',
            headerName: 'Подключено/ Недоступно/ Ремонт',
            filter: false,
            width: 120,
            wrapHeaderText: true, // Включить перенос текста
            autoHeaderHeight: true, 
            cellStyle: {padding: '6px 0px',   display: 'flex', alignItems: 'center', justifyContent: 'flex-start'  },// Автоматическая высота заголовка
        },
        {
            key: 'avialibility',
            field: 'avialibility',
            headerName: 'Доступность',
            filter: false,
            flex: 2,
            cellStyle: {padding: '6px 0px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start'   },
        },
    ]

    const tableCSS = {
        display: 'flex',
        widgth: '100%',
        height: '400px',
        flexDirection: 'column',
        net: '0.5',
        borderRadius: '0'
   }

   const [tableData, setTableData] = useState< {
    key: string;
    id: number;
    region: string;
    status: string;
    avialibility: string;
    regionId: number
}[]>([])

useEffect(()=>{
    const localData = []
    data.forEach((item, index) => {
        localData.push({
            key: `top_${item.id}`,
            id: index+1,
            region: item.name,
            status: `${item?.statusCount?.connected}/${item?.statusCount?.notAvailable}/${item?.statusCount?.repair ?? 0}`,
            avialibility: item.dost + '%',
            regionId : item.id
    })
    setTableData(localData)
})
},[data])

   if (style) {
    // Обновляем width и height, если они есть в props.style
    tableCSS.width = style?.width || tableCSS.width;
    tableCSS.height = style?.height || tableCSS.height;
  
    // Добавляем остальные свойства из props.style
    for (const key in style) {
      if (key !== "width" && key !== "height") {
        tableCSS[key] = style[key];
      }
    }
  }

    // const tableRowData = useMemo(() => {
    //     return classes.map((item: IClass) => {
    //         const visibility = VISIBILITY[item.visibility]
    //         const pack = packages.data.find((pack) => pack.id === item.package_id)
    //         const stereotype = stereotypes.data.find(({ id }) => item.class_stereotype_id === id)

    //         return {
    //             id: item?.id,
    //             key: `${item.id}`,
    //             name: item.name,
    //             codename: item.codename,
    //             visibility: visibility,
    //             package: pack?.name,
    //             stereotype: stereotype?.name || '---',
    //             multiplicity: item.multiplicity_left + ' - ' + (item.multiplicity_right ?? '*'),
    //             abstract: item.is_abstract ? '✔' : '',
    //             actions: ( 
    //                 <MarkoTestClassActionCell item={item}/>
    //             )
    //         }
    //     })
    // }, [classes, packages.data, stereotypes.data])

    const gridOptions: GridOptions = {  
        // ...  
        theme: themeAlpine, 
        rowClassRules: {
            'custom-row': 'true', // Применяем класс ко всем строкам
          },

      };  

    return (
<>
<h2 style={{
    fontWeight: 400, 
    fontSize: '1.5rem',
    color: textColor,
    marginBottom: 0
}}>{header}</h2>
        <ECTable2
         overlayLoadingTemplate={
            loadingRegions ? '<span class="ag-overlay-loading-center">Загрузка...</span>' : undefined
          }
          overlayNoRowsTemplate={
            !loadingRegions && (!tableData || rowData.length === 0)
              ? '<span class="ag-overlay-no-rows-center">Нет данных для отображения</span>'
              : undefined
          }
        
            rootClassName="alex"
            tableId={'Top5Tables'}
            className={'topTable'}
            tableCSS={tableCSS}
            columns={colDefs}
            agTable={true}
            rows={tableData}
            switchGrid={false}
            showHeader={false}
            // header={header}
            headerCSS={{height: '80px', border: 'none'}}
            supressHorizScroll={true}
            paginAdditional={{status: false}}
            gridOptions={gridOptions}
            onRowClicked={onRowClicked}
            getExportRowStyle={(params) => {
                return {
                    borderBottom: '1px solid #ffffff22'
                }
            }}
        />
        </>
    )
}


export default MarkoTop5Table


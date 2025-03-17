// import { getMediaFilesById } from "@shared/api/MediaFiles/Models/getMediaFilesById/getMediaFilesById";
// import { getMediaFilesInfo } from "@shared/api/MediaFiles/Models/getMediaFilesInfo/getMediaFilesInfo";
// import { getMediaFilesInfoById } from "@shared/api/MediaFiles/Models/getMediaFilesInfoById/getMediaFilesInfoById";
// import { postMediaFiles } from "@shared/api/MediaFiles/Models/postMediaFiles/postMediaFiles";
// import { useApi2 } from "@shared/hooks/useApi2";
// import { selectObjectByIndex, useObjectsStore } from "@shared/stores/objects";
// import { ECUIKit } from "@shared/ui";
// import { ECUploadFile } from "@shared/ui/ECUIKit/forms";
// import { useEffect, useState } from "react";

// const backendData = {
//     renderWithTransparentColumn: false,
//     unit: '%',
//     step: 10,
//     interval: {
//         start: 0,
//         end: 100
//     },
//     YAxisName: 'Заряд',
//     data: [
//         {
//             value: 10,
//             categoryNameXAxis: 'Устройство 1'
//         },
//         {
//             value: 35,
//             categoryNameXAxis: 'Устройство 2'
//         },
//         {
//             value: 150,
//             categoryNameXAxis: 'Устройство 3'
//         },
//         {
//             value: 35,
//             categoryNameXAxis: 'Устройство 3'
//         },
//         {
//             value: 150,
//             categoryNameXAxis: 'Устройство 3'
//         },
//         {
//             value: 150,
//             categoryNameXAxis: 'Устройство 3'
//         },
//         {
//             value: 150,
//             categoryNameXAxis: 'Устройство 3'
//         },
//         {
//             value: 150,
//             categoryNameXAxis: 'Устройство 3'
//         },
//         {
//             value: 150,
//             categoryNameXAxis: 'Устройство 3'
//         },        {
//             value: 18,
//             categoryNameXAxis: 'Устройство 3'
//         },
//         {
//             value: 9,
//             categoryNameXAxis: 'Устройство 9'
//         }
//     ],
//     intervalColors: [
//         {
//             range: { start: 60, end: 100 },
//             activeColor: 'rgba(255, 89, 89, 1)',
//             inactiveColor: 'rgba(255, 89, 89, 0.1)'
//         },
//         {
//             range: { start: 0, end: 30 },
//             activeColor: 'rgba(106, 190, 106, 1)',
//             inactiveColor: 'rgba(106, 190, 106, 0.1)'
//         },
//         {
//             range: { start: 30, end: 60 },
//             activeColor: 'rgba(255, 199, 0, 1)',
//             inactiveColor: 'rgba(255, 199, 0, 0.1)'
//         }
//     ]
// };


// const backendData = [{
//     renderWithTransparentColumn: true,
//     unit: '%',
//     step: 10,
//     interval: {
//         start: 0,
//         end: 100
//     },
//     YAxisName: 'Заряд',
//     data: [
//         {
//             value: 10,
//             categoryNameXAxis: 'Устройство 1'
//         }
//     ],
//     intervalColors: [
//         {
//             range: { start: 60, end: 100 },
//             activeColor: 'rgba(255, 89, 89, 1)',
//             inactiveColor: 'rgba(255, 89, 89, 0.1)'
//         },
//         {
//             range: { start: 0, end: 30 },
//             activeColor: 'rgba(106, 190, 106, 1)',
//             inactiveColor: 'rgba(106, 190, 106, 0.1)'
//         },
//         {
//             range: { start: 30, end: 60 },
//             activeColor: 'rgba(255, 199, 0, 1)',
//             inactiveColor: 'rgba(255, 199, 0, 0.1)'
//         }
//     ]
// },

// {
//     renderWithTransparentColumn: true,
//     unit: '%',
//     step: 10,
//     interval: {
//         start: 0,
//         end: 100
//     },
//     YAxisName: 'Заряд',
//     data: [
//         {
//             value: 10,
//             categoryNameXAxis: 'Устройство 2'
//         }
//     ],
//     intervalColors: [
//         {
//             range: { start: 60, end: 100 },
//             activeColor: '#000',
//             inactiveColor: '#000'
//         },
//         {
//             range: { start: 0, end: 30 },
//             activeColor: '#00000010',
//             inactiveColor: '#000'
//         },
//         {
//             range: { start: 30, end: 60 },
//             activeColor: '#000',
//             inactiveColor: '#000'
//         }
//     ]
// }
// ];

// function createVirtualFile(data: string, filename: string, type: string): File {
//     const blob = new Blob([data], { type });
//     return new File([blob], filename, { type });
// }

// const fileData = "данные вашего файла";
// const fileName = "example.jpg";
// const fileType = "image/jpeg";

// const virtualFile = createVirtualFile(fileData, fileName, fileType);

// const DefaultChart = () => {
//     useObjectsStore
//     const data = useObjectsStore(selectObjectByIndex)
//     console.log(data('class_id', 10088))
//     return (
//         <div>
//             {/* <ECUIKit.common.ECCharts.ECWordCloudChart/>
//             <ECUIKit.common.ECCharts.ECFlowDiagramChart /> */}
//             <ECUIKit.common.ECCharts.ECPlatesColumnChart data={backendData} />
//             {/* <img src={data.url} /> */}
//             {/* <ECUploadFile onChange={(info)=>{
//                 console.log(info.file.originFileObj)
//                 info.fileList[0].status = 'success'
//             }}/> */}
//             {/* <div style={{
//                 height:'400px'
//             }}>
//             <ECUIKit.common.ECCharts.ECTreeMapChart data={[{
//                 label: 'Недоступно',
//                 value:5,
//                 color: 'red'
//             },
//             {
//                 label: 'Доступно',
//                 value:10, 
//                 color: '#000'
//             },
//             // {
//             //     label: 'Доступно',
//             //     value:15, 
//             //     color: 'green'
//             // },
//             {
//                 label: 'Доступно',
//                 value:10, 
//                 color: 'yellow'
//             },
//             ]} />
//             </div> */}
//         </div>
//     )
// }

// export default DefaultChart

// const DefaultChart = () => {
    
//     return null
// }

// export default DefaultChart

// const DefaultTest = () => {
//     return (
//         <>
//             <ECDatePickerWithPresets viewType="select" changeValue={function (): void {
//                 throw new Error("Function not implemented.");
//             } } />
//             <ECDatePickerWithPresets viewType="buttons" changeValue={function (): void {
//                 throw new Error("Function not implemented.");
//             } } />
//         </>
//     )
// }

// export default DefaultTestp0: string, p1: string, state: IObjectsStorep0: string, p1: number, state: IObjectsStore


import React, { useEffect, useState } from 'react';
import { Table } from 'antd';

const numRows = 500000;
const numColumns = 20;
const columns = [];

for (let i = 1; i <= numColumns; i++) {
  const column = {
    title: `Column ${i}`,
    dataIndex: `column${i}`,
    key: `column${i}`,
  };
  columns.push(column);
}

const FreezeColumnsTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    let isMounted = true;

    function generateFakeData(numRows, numColumns) {
      const data = [];
      for (let i = 0; i < numRows; i++) {
        const row = { id: i };
        for (let j = 0; j < numColumns; j++) {
          row[`column${j + 1}`] = `Row ${i}, Column ${j + 1}`;
        }
        data.push(row);
      }
      return data;
    }

    const fakeData = generateFakeData(numRows, numColumns);

    if (isMounted) {
      setData(fakeData);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={false}
      virtual={true}
      scroll={{  y: 400 }} // Set y as per your requirement
    />
  );
};

export default FreezeColumnsTable;
import { FC } from "react"
import MarkoTestClassesTable from "./AGGrid/MarkoTestClassesTable";
import MarkoTestRelationTable from "./AGGrid/MarkoTestRelationTable";
import ClassesTableContainer from "@containers/classes/ClassesTableContainer/ClassesTableContainer";
import MarkoTestTableIncidents from "./AGGrid/MarkoTestTableIncidents";
import MarkoTestTanTaskTable from "./TanTask/MarkoTestTanTaskTable";
import MarkoTestTTClasses from "./TanTask/MarkoTestTTClasses";
import MarkoTestTables from "./NewTable/MarkoTestTables";
import { Space } from "antd";
import MarkoTop5Best from "./NewTable/MarkoTopTables.Components/MarkoTop5Table";
import MarkoTop5Worst from "./NewTable/MarkoTop5Worst";
import MarkoUnitedTops from "./NewTable/MarkoUnitedTops";
import ProjectRegionalCard from "./Project/ProjectRegionalCard";
import AttributesTableContainer from "@containers/attributes/AttributesTableContainer/AttributesTableContainer";
import VtemplatesTableFormContainer from "@containers/roles/RoleFormContainer/VtemplatesTableFormContainer";
import RoleFormContainer from "@containers/roles/RoleFormContainer/RoleFormContainer";
import { useWindowResize } from "@shared/hooks/useWindowResize";
import MarkoTestAttributeTable from "./AGGrid/MarkoTestAttributeTable";
import MarkoAvaria from "./NewTable/MarkoAvaria";


const MarkoDev: FC = () => {

  const windowDimensions = useWindowResize()

  const row =   {
    id: 1,
    name: 'Американская пустошь',
    shortName: 'МУР', //Цвет региона + что ещё передать хотите
    dost: 99, //Доступность в процентах 
    municipalities: [
      {
        id:1,
        name: 'Волт-Сити',
        status: { color: 'red'},
        statusCount: [1,2,0], //Подключено/Недоступно/Ремонт
        dost: 76 //Доступность в процентах
      },
      {
        id:2,
        name: 'Нью-Рино',
        status: { color: 'red'},
        statusCount: [1,2,0], //Подключено/Недоступно/Ремонт
        dost: 80 //Доступность в процентах
      },
      {
        id:3,
        name: 'Мегатонна',
        status: { color: 'green'},
        statusCount: [1,2,0], //Подключено/Недоступно/Ремонт
        dost: 90 //Доступность в процентах
      },
      {
        id:4,
        name: 'Нью-Вегас',
        status: { color: 'green'},
        statusCount: [1,2,0], //Подключено/Недоступно/Ремонт
        dost: 91 //Доступность в процентах
      },
      {
        id:5,
        name: 'ШейдиСендс',
        status: { color: 'green'},
        statusCount: [1,2,0], //Подключено/Недоступно/Ремонт
        dost: 92 //Доступность в процентах
      },
      {
        id:6,
        name: 'Парадайс Фолл',
        status: { color: 'green'},
        statusCount: [1,2,0], //Подключено/Недоступно/Ремонт
        dost: 99 //Доступность в процентах
      },
      // {
      //   id:7,
      //   name: 'Рейвен Рок',
      //   status: { color: 'green'},
      //   statusCount: [1,2,0], //Подключено/Недоступно/Ремонт
      //   dost: 98 //Доступность в процентах
      // },
      // {
      //   id:8,
      //   name: 'Цитадель',
      //   status: { color: 'green'},
      //   statusCount: [1,2,0], //Подключено/Недоступно/Ремонт
      //   dost: 97 //Доступность в процентах
      // },
      // {
      //   id:9,
      //   name: 'Форт',
      //   status: { color: 'green'},
      //   statusCount: [1,2,0], //Подключено/Недоступно/Ремонт
      //   dost: 96 //Доступность в процентах
      // },
      // {
      //   id:10,
      //   name: 'Арройо',
      //   status: { color: 'green'},
      //   statusCount: [1,2,0], //Подключено/Недоступно/Ремонт
      //   dost: 97 //Доступность в процентах
      // },
      // {
      //   id:11,
      //   name: 'Арройо',
      //   status: { color: 'green'},
      //   statusCount: [1,2,0], //Подключено/Недоступно/Ремонт
      //   dost: 97 //Доступность в процентах
      // },
    ]
  }
   
  return (
    <>
    <div style={{height: '400px'}}>
      <MarkoTestClassesTable/>
      {/* <MarkoTestAttributeTable/> */}
      {/* // <MarkoTestRelationTable/> */}
      {/* <ClassesTableContainer/> */}
      {/* <MarkoTestTableIncidents/> */}
      {/* <MarkoTestTanTaskTable/> */}
      {/* <MarkoTestTTClasses/> */}
      {/* <MarkoTestTables/> */}
      {/* <MarkoUnitedTops/>  */}
      {/* <ProjectRegionalCard row={row}/> */}
      {/* <MarkoAvaria/> */}
      
    </div>
    <div>
        {/* <AttributesTableContainer tableScroll={{ y: windowDimensions.height - 400, x: 2500 }}/> */}
    </div>      
    </>
  )
}


export default MarkoDev
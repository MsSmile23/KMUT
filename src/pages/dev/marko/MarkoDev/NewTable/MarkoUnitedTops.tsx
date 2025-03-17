import { FC } from "react"
import { Space } from "antd";
import MarkoTop5Best from "./MarkoTopTables.Components/MarkoTop5Table";
import MarkoTop5Table from "./MarkoTopTables.Components/MarkoTop5Table";



const MarkoUnitedTops: FC = () => {
   
  return (
      // <Space style={{marginTop: '100px', width: '100%'}}>
      //   <MarkoTop5Table 
      //       header="Топ-5 лучших регионов"
      //   />
      //   <MarkoTop5Table 
      //       header="Топ-5 худших регионов"
      //   />
      // </Space> 
      <div style={{width: '50%'}}>
        <MarkoTop5Table 
              header="Топ-5 худших регионов"
          />
      </div>
  )
}


export default MarkoUnitedTops
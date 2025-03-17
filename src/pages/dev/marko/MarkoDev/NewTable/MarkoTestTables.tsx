import { ButtonCreatable, ButtonEditRow } from "@shared/ui/buttons"
import { FC, useMemo, useState, } from "react"
import { useClassesStore } from "@shared/stores/classes";
import { useApi2 } from "@shared/hooks/useApi2";
import { getPackages } from "@shared/api/Packages/Models/getPackages/getPackages";
import { getClassStereotypes } from "@shared/api/ClassStereotypes/Models/getClassStereotypes/getClassStereotypes";
import { useNavigate } from "react-router-dom";
import { IClass } from "@shared/types/classes";
import { VISIBILITY } from "@shared/config/const";
import { getURL } from "@shared/utils/nav";
import { ROUTES, ROUTES_COMMON } from "@shared/config/paths";
import MarkoTestClassActionCell from "./MarkoTestClassData/MarkoTestClassActionCell";
import MarkoTestTable from "./MarkoTestTable";
import MarkoTestTableUnited from "./MarkoTestTableUnited";
import ECAGTable from "@shared/ui/tables/ECTable2/ECANTTable/ECAGTable";
import { ECTable2 } from "@shared/ui/tables/ECTable2/ECTable2";
import ClassesDeleteButton from "@entities/classes/ClassesDeleteButton/ClassesDeleteButton";
import { Row, Space } from "antd";
import { ECTooltip } from "@shared/ui/tooltips";
import { EditOutlined } from "@ant-design/icons";
import { SERVICES_CLASSES } from "@shared/api/Classes";
import MarkoAvaria from "./MarkoAvaria";


const MarkoTestTables: FC = () => {
  

    return (
        <Row>
            <MarkoAvaria/>
        </Row>
    )
}


export default MarkoTestTables
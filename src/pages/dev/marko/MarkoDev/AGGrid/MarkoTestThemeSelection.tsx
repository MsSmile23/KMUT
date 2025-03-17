import { ButtonEditRow } from "@shared/ui/buttons"
import { Select, Space } from "antd"
import { FC } from "react"
import { useClassesStore } from "@shared/stores/classes";
import { SERVICES_CLASSES } from "@shared/api/Classes";
import { ECTooltip } from "@shared/ui/tooltips";
import { getURL } from "@shared/utils/nav";
import { ROUTES, ROUTES_COMMON } from "@shared/config/paths";
import { EditOutlined } from "@ant-design/icons";
import ClassesDeleteButton from "@entities/classes/ClassesDeleteButton/ClassesDeleteButton";
import { useNavigate } from "react-router-dom";
import { IMarkoTestSelector } from "../IMarkoTest";



const MarkoTestThemeSelection: FC = <T extends { id: string; variant?: string } | null>({
    options,
    value,
    setValue,
  }: IMarkoTestSelector<T>) => {
    
    return (
        <Select
        onChange={(e) => setValue(options.find((t) => t?.id === e)! || null)}
        style={{ marginRight: 16 }}
        value={value.id}
      >
        {options.map((option, i) => (
          <option key={i} value={option?.id}>
            {option?.variant || option?.id || "(unchanged)"}
          </option>
        ))}
      </Select>
    )
}


export default MarkoTestThemeSelection
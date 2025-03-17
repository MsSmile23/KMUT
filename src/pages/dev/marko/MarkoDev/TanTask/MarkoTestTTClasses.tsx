import { ButtonCreatable } from "@shared/ui/buttons"
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
import MarkoTestTanTaskTable from "./MarkoTestTanTaskTable";
import MarkoTestClassActionCell from "../AGGrid/MarkoTestClassData/MarkoTestClassActionCell";


const MarkoTestTTClasses: FC = () => {
  
    const packages = useApi2(getPackages)
    const classes = useClassesStore((st) => [...st.store.data].sort((a, b) => b.id - a.id))
    const stereotypes = useApi2(getClassStereotypes)
    // const [shouldRenderActions, setShouldRenderActions] = useState(false);

    const navigate = useNavigate()

    const [colDefs, setColDefs] : any[] = useState([
        {
            id: "actions",
            accessorKey: "actions",
            header: "Действия",
            size: 20,
            enableSorting: false,
            cell: ({ row }) => (
                <MarkoTestClassActionCell item={row.original} />
            ),
        },
        {
            id: "id",
            accessorKey: "id",
            header: "ID",
            size: 50,
            
        },
        {
            id: "name",
            accessorKey: "name",
            header: "Имя класса",
            size: 200,
        },
        {
            id: "codename",
            accessorKey: "codename",
            header: "Код",
        },
        {
            id: "visibility",
            accessorKey: "visibility",
            header: "Видимость",
        },
        {
            id: "package",
            accessorKey: "package",
            header: "Пакет",
        },
        {
            id: "stereotype",
            accessorKey: "stereotype",
            header: "Стереотип",
        },
        {
            id: "multiplicity",
            accessorKey: "multiplicity",
            header: "Кратность",
        },
        {
            id: "abstract",
            accessorKey: "abstract",
            header: "Абстрактный",
        },
      ]);
    
    const buttonCreate = () => {
        return (
            <ButtonCreatable
                key="button-add-class"
                shape="circle"
                entity="classes"
                buttonAdd={true}
                text={false}
                onClick={() => {
                    navigate(getURL(
                        `${ROUTES.CLASSES}/${ROUTES_COMMON.CREATE}`,
                            'constructor'
                    ))
                }}
            />
        )
    }

    const tableRowData = useMemo(() => {
        return classes.map((item: IClass) => {
            const visibility = VISIBILITY[item.visibility]
            const pack = packages.data.find((pack) => pack.id === item.package_id)
            const stereotype = stereotypes.data.find(({ id }) => item.class_stereotype_id === id)

            return {
                id: item?.id,
                key: `${item.id}`,
                name: item.name,
                codename: item.codename,
                visibility: visibility,
                package: pack?.name,
                stereotype: stereotype?.name || '---',
                multiplicity: item.multiplicity_left + ' - ' + (item.multiplicity_right ?? '*'),
                abstract: item.is_abstract ? '✔' : '',
                actions: item
            }
        })
    }, [classes, packages.data, stereotypes.data])

    const expandedRowData = tableRowData.reduce((acc, item) => {
        for (let i = 0; i < 10; i++) {
            acc.push(item);
        }
        return acc;
    }, []);

    return (
        <MarkoTestTanTaskTable
            data={tableRowData}
            columns={colDefs}
        />
    )
}


export default MarkoTestTTClasses
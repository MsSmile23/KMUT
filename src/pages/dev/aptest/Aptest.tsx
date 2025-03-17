/* eslint-disable */
import { Cascader, Col, Row, Table } from "antd";
import { RequestHealth } from "./requesthealth/RequestHealth";
import { selectFindObject, useObjectsStore } from "@shared/stores/objects";
import { useState } from "react";
import { useClassesStore } from "@shared/stores/classes";
import { ClassesCascader } from "@entities/classes/ClassesCascader/ClassesCascader";
import { IObject } from "@shared/types/objects";
import { ILink } from "@shared/types/links";
import { filterObjectsByLinkedClasses } from "@entities/reports/ReportForm/utils";

export const Aptest: React.FC = () => {
    const lol = document.querySelector('.ant-layout-sider')
    const kek = document.querySelector('.ant-layout-header')
    
    if (lol && kek) {
        (document.querySelector('.ant-layout-header') as HTMLElement).style.display = 'none';
        document.querySelectorAll('.ant-layout-sider').forEach((el) => {
            (el as HTMLElement).style.display = 'none'
        })
    }

    const objects = useObjectsStore((st) => st.store.data)
    const classes = useClassesStore((st) => st.store.data)
    const findObject = useObjectsStore(selectFindObject)

    const [ main, setMain ] = useState<number[]>([])
    const [ linked, setLinked ] = useState<number[]>([])

    const mainObjects = objects.filter((obj) => main.includes(obj.class_id))

    console.log('objects', objects.find((obj) => obj.id === 10001))

    const data = linked?.length > 0 ? filterObjectsByLinkedClasses(mainObjects, linked) : mainObjects
    const rows = data.map((obj) => ({ key: obj.id, id: obj.id, name: obj.name }))

    return (
        <Row gutter={[12, 12]}>
            <Col xs={24}>
                <ClassesCascader placeholder="Main" onChange={setMain} />
            </Col>
            <Col xs={24}>
                <ClassesCascader placeholder="Linked" onChange={setLinked} />
            </Col>
            <Col xs={24}>
                <Table 
                    columns={['id', 'name'].map((name) => ({ key: name, dataIndex: name, title: name }))}
                    dataSource={rows}
                />
            </Col>
        </Row>
    )
}
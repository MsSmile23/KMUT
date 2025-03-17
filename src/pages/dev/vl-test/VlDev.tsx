import { RulesTestComponent } from './RulesTestComponent'

// import { useApi } from '@shared/hooks/useApi'
// import { IRelationStereotype } from '@shared/types/relation-stereotypes'
// import { getRelationStereotypes } from '@shared/api/RelationStereotypes/
//Models/getRelationStereotypes/getRelationStereotype'



const VlDev = () => {

    // const relation_stereotypes = useApi<IRelationStereotype[]>([], getRelationStereotypes, { all: true });
    // return (

    //     <>
    //         {manageRulesTableData.map((data) => (
    //             <Card key={data.id}>
    //                 <Title level={3}>{data.right_operand}</Title>
    //             </Card>
    //         ))}
    //     </>
    // )



    return (
        <RulesTestComponent />
    )
}

// const MemoManageViewTable:  React.FC<ISimpleTable> = React.memo(ManageViewTable)



export default VlDev
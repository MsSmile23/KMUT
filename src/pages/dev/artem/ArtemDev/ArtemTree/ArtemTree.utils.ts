
const treeGenerate = (
    rootOids: IObject['id'][],
    objects: IObject[],
    getObjectById: (id: IObject['id']) => IObject
    ) => {

    rootOids.forEach((id) => {
        console.log(getObjectById(id))
    })
    return []
}

export const ArtemTreeUtils = {
    treeGenerate
}
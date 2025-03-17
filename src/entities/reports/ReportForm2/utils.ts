export const findAllChildClasses = (parentId, items) => {
    const childClasses = items.filter(item => item.level > 0 && item.parentId === parentId);

    return childClasses.reduce(
        (acc, child) => [...acc, child, ...findAllChildClasses(child.value, items)],
        []
    );
};
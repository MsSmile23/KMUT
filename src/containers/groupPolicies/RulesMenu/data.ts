export const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 50
    },
    {
        title: 'Название',
        dataIndex: 'name',
        key: 'name',

    },
    {
        title: 'Код',
        dataIndex: 'code',
        key: 'code',
        width: 80
    },
]

export const initialValues = {
    path_classes: [],
    except_path_classes: [],
    path_direction_up: 'true',
    target_class_all: false,
    filter_objects: [],
}
/* eslint-disable max-len */
import { Form, Select, Button, Input, FormInstance, FormListFieldData } from 'antd';
import { useState, FC, useEffect } from 'react';
import { TPageHeaderBreadcrumbs, IPageHeader, IPage } from './types/WidgetPageHeaderTypes'
import { Forms } from '@shared/ui/forms';
import { SortableList } from '@shared/ui/SortableList';
import { CloseOutlined } from '@ant-design/icons';


const BREADCURMBS_MAXIMUM_VALUE = 50;

const stereotypeOptions = [
    { label: 'Статичный', value: 1 },
    { label: 'Назад', value: 2 },
    { label: 'Домой', value: 3 }
]

interface BreadCrumbsFieldsProps {
    fields: FormListFieldData[];
    addField: (defaultValue?: TPageHeaderBreadcrumbs, index?: number) => void;
    removeField: (name: number) => void;
    form: FormInstance<IPageHeader>;
    pages: IPage[];
    onChangeForm: (value) => void;
}


export const BreadCrumbsFieldsRender: FC<BreadCrumbsFieldsProps> = ({ fields, addField, removeField, form, pages, onChangeForm }) => {
    const [stereotype, setStereotype] = useState<boolean[]>([]);
    const [breadcrumbsList, setBreadcrumbsList] = useState([])

    //Добавить новую хлебную крошку
    const addBreadcrumb = () => {
        if (fields.length >= BREADCURMBS_MAXIMUM_VALUE) {
            return;
        }
        addField({
            breadcrumbStereotype: 1,
            breadcrumbPage: null,
            breadcrumbName: null,
            breadcrumbUrl: null
        } as TPageHeaderBreadcrumbs);

        setBreadcrumbsList(form.getFieldValue('breadcrumbs').map((item, index) => {
            return { id: index, breadcrumbs: item }
        }))
    }

    //Удалить хлебную крошку
    const removeBreadcrumbs = (index: number) => {
        removeField(index);
        setStereotype((prevState) => {
            const newStereotypes = [...prevState];

            newStereotypes.splice(index, 1);

            return newStereotypes;
        })
        setBreadcrumbsList(form.getFieldValue('breadcrumbs').map((item, index) => {
            return { id: index, breadcrumbs: item }
        }))
    }
    
    useEffect(() => {

        const breadcrumbs = form.getFieldValue('breadcrumbs') || []
        
        setBreadcrumbsList(breadcrumbs.map((item, index) => {
            return { id: index, breadcrumbs: item }
        }))

        setStereotype(breadcrumbs.map((item) => {
            return item.breadcrumbStereotype !== 1 ? true : false
        }))
    }, [])

    //Действия при обновлении поля Стереотипов
    const changeStereotype = (value: number, index: number) => {

        if (value === 2 || value === 3) {
            const updatedBreadcrumbs = form.getFieldValue('breadcrumbs');

            updatedBreadcrumbs[index] = {
                ...updatedBreadcrumbs[index],
                breadcrumbPage: null,
                breadcrumbName: null,
                breadcrumbUrl: null
            };
            form.setFieldsValue({
                breadcrumbs: updatedBreadcrumbs
            });
        }

        return setStereotype(prevState => {
            const newStereotypes = [...prevState];

            newStereotypes[index] = value === 1 ? false : true;

            return newStereotypes;
        })

    }

    //Действия при обновлении поля Страница
    const changePage = (value: string, index: number) => {
        const currentPage = pages.filter((item) => item.name === value)[0];

        const updatedBreadcrumbs = form.getFieldValue('breadcrumbs');

        updatedBreadcrumbs[index] = {
            ...updatedBreadcrumbs[index],
            breadcrumbName: null,
            breadcrumbUrl: currentPage.url
        };
        form.setFieldsValue({
            breadcrumbs: updatedBreadcrumbs
        });
    }

    //Проверка выбора страницы
    const checkPage = (index: number) => {
        const pageData = form.getFieldValue('breadcrumbs')[index]['breadcrumbPage'];

        if (pageData && pageData !== null) {
            return true
        }
        
        return false
    };

    const updatedBreadcrumbsSort = (items) => {
        const pageHeaderSortArray = items.map((item) => item.id);

        const fieldsValue = form.getFieldsValue()

        setBreadcrumbsList(items)
        onChangeForm({ ...fieldsValue, pageHeaderSortArray })
    }

    return (
        <>
            <SortableList
                renderItem={(item) => {
                    return (
                        <SortableList.Item id={item.id}>
                            <div style={{ display: 'flex', flexDirection: 'row', columnGap: 16 }}>
                                <SortableList.DragHandle />
                                <Form.Item
                                    name={[item.id, 'breadcrumbStereotype']}
                                    label="Стереотип"
                                    rules={[{ required: true }]}
                                    style={{ flex: 1 }}
                                >
                                    <Select
                                        placeholder="Стереотип"
                                        options={stereotypeOptions}
                                        onChange={(value) => { changeStereotype(value, item.id) }}
                                        value={form.getFieldValue('breadcrumbs')[item.id]['breadcrumbStereotype']}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name={[item.id, 'breadcrumbPage']}
                                    label="Страница"
                                    style={{ flex: 1 }}
                                >
                                    <Forms.Select
                                        onChange={(value) => { changePage(value, item.id) }}
                                        placeholder="Страница"
                                        customData={{
                                            data: pages ?? [],
                                            convert: {
                                                valueField: 'name',
                                                optionLabelProp: 'name',
                                            },

                                        }}
                                        disabled={stereotype[item.id]}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name={[item.id, 'breadcrumbName']}
                                    label="Название"
                                    rules={[{ required: stereotype[item.id] ? false : !checkPage(item.id) }]}
                                    style={{ flex: 1 }}
                                >
                                    <Forms.Input
                                        placeholder={checkPage(item.id) ? 'Используем название страницы' : 'Название'}
                                        disabled={stereotype[item.id] ? !checkPage(item.id) : false}
                                        value={form.getFieldValue('breadcrumbs')[item.id]['breadcrumbName']}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name={[item.id, 'breadcrumbUrl']}
                                    label="URL"
                                    rules={[{ required: stereotype[item.id] ? false : !checkPage(item.id) }]}
                                    style={{ flex: 1 }}
                                >
                                    <Input
                                        placeholder="URL"
                                        disabled={stereotype[item.id] || checkPage(item.id)}
                                        value={form.getFieldValue('breadcrumbs')[item.id]['breadcrumbUrl']}
                                    />
                                </Form.Item>
                                <Form.Item
                                    style={{ display: 'flex', justifyContent: 'end', alignItems: 'end' }}
                                >
                                    <CloseOutlined
                                        onClick={() => { removeBreadcrumbs(item.id) }}
                                    />
                                </Form.Item>
                            </div>
                        </SortableList.Item>
                    )
                }}
                items={breadcrumbsList}
                onChange={updatedBreadcrumbsSort}
            />
            <Button type="dashed" onClick={() => addBreadcrumb()}>
                + Добавить
            </Button>
        </>
    )
}
import { Divider, Form, Select, Input, Button, FormInstance, FormListFieldData } from 'antd';
import { useState, FC } from 'react';
import { TPageHeaderBreadcrumbs, IPageHeader, IPage } from './types/WidgetPageHeaderTypes'
import { Forms } from '@shared/ui/forms';
import { DndContext } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';


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
}



export const BreadCrumbsFieldsRender: FC<BreadCrumbsFieldsProps> = ({ fields, addField, removeField, form, pages }) => {

    const [stereotype, setStereotype] = useState<boolean[]>(new Array(fields.length).fill(false));

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
    }

    //Удалить хлебную крошку
    const removeBreadcrumbs = (field: FormListFieldData, index: number) => {
        removeField(field.name);
        setStereotype((prevState) => {
            const newStereotypes = [...prevState];

            newStereotypes.splice(index, 1);
            
            return newStereotypes;
        })
    }

    //Действия при обновлении поля Стереотипов
    const changeStereotype = (value: number, index: number) => {

        if (value === 2 || value === 3) {
            const updatedBreadcrumbs = form.getFieldValue('breadcrumbs');

            updatedBreadcrumbs[index] = { ...updatedBreadcrumbs[index],
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

        updatedBreadcrumbs[index] = { ...updatedBreadcrumbs[index],
            breadcrumbName: null,
            breadcrumbUrl: currentPage.url
        };
        form.setFieldsValue({
            breadcrumbs: updatedBreadcrumbs
        });
    }

    //Проверка выбора страницы
    const checkPage = (index: number) => form.getFieldValue('breadcrumbs')[index]['breadcrumb_page'];

    return (
        <>
            {fields.map((field, index) => (
                <div key={index}>
                    <Divider plain>Хлебная крошка {index + 1}</Divider>

                    <Form.Item 
                        name={[field.name, 'breadcrumbStereotype']} 
                        label="Стереотип" 
                        rules={[{ required: true }]}
                    >
                        <Select 
                            placeholder="Стереотип" 
                            options={stereotypeOptions} 
                            onChange={(value) => {changeStereotype(value, index)}} 
                        />
                    </Form.Item>

                    <Form.Item name={[field.name, 'breadcrumbPage']} label="Страница">
                        <Forms.Select
                            onChange={(value) => {changePage(value, index)}}
                            placeholder="Страница" 
                            customData={{
                                data: pages ?? [],
                                convert: {
                                    valueField: 'name',
                                    optionLabelProp: 'name',
                                },
                                
                            }}
                            disabled={stereotype[index]}
                        />
                    </Form.Item>

                    <Form.Item 
                        name={[field.name, 'breadcrumbName']} 
                        label="Название" 
                        rules={[{ required: stereotype[index] || checkPage(index) ? false : true }]}
                    >
                        <Input 
                            placeholder={checkPage(index) ? 'Используем название страницы' : 'Название'} 
                            disabled={stereotype[index]} 
                        />
                    </Form.Item>

                    <Form.Item 
                        name={[field.name, 'breadcrumbUrl']} 
                        label="URL" 
                        rules={[{ required: stereotype[index] || checkPage(index) ? false : true }]}
                    >
                        <Input placeholder="URL" disabled={stereotype[index] || checkPage(index) ? true : false} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="dashed" onClick={() => {removeBreadcrumbs(field, index)}}>
                            Удалить
                        </Button>
                    </Form.Item>
                </div>
            ))}
            <Button type="dashed" onClick={() => addBreadcrumb()}>
                + Добавить
            </Button>
        </>
    )
}
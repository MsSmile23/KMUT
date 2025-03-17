import { Button, Col, Row, Select, Typography } from 'antd'
import { FC, useEffect, useState } from 'react'
import _ from 'lodash'
import { ITreeFilteringModalProps, ITreeStore } from '../treeTypes'
import { useTreeStore } from '@shared/stores/trees'
import { useAccountStore } from '@shared/stores/accounts'
import { saveTreeIdSettings } from '../utils'
import { StoreStates } from '@shared/types/storeStates'

export const TreeFilteringModal: FC<ITreeFilteringModalProps> = ({
    classifiers, closeModal, id
}) => {
    const chosenClassifiers = useTreeStore((state: ITreeStore) => state.chosenClassifiers[id])
    const setChosenClassifiers = useTreeStore((state: ITreeStore) => state.setChosenClassifiers)
    const setChosenClassifiersCount = useTreeStore((state: ITreeStore) => state.setChosenClassifiersCount)
    const accountData = useAccountStore((st) => st.store.data?.user)
    const [selectValues, setSelectValues] = useState<Record<string, number[]>>({})
    const storeState = useAccountStore((st) => st.store.state)
    const [updatingState, setUpdatingState] = useState('idle')


    useEffect(() => {
        const classifiers = Object.values(chosenClassifiers)?.reduce((acc, item) => {
            acc[item.id] = item?.children?.map(child => child?.id)

            return acc
        }, {})

        setSelectValues(classifiers)
    }, [chosenClassifiers])

    const filterOption = (input, option,) => {
        return (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
    }

    const handleOnChange = (id: number) => (value): void => {
        if (value.length === 0) {
            setSelectValues(_.omit(selectValues, id))

            return
        }

        setSelectValues(state => {
            return {
                ...state,
                [id]: value
            }
        })
    };

    useEffect(() => {
        const filterCount = Object.values(selectValues).reduce((count, valuesArr) => {
            return count + valuesArr.length
        }, 0)

        setChosenClassifiersCount(filterCount, id)
    }, [selectValues])
    const handleOnClear = (id: number) => {
        setSelectValues(state => ({
            ...state,
            [id]: []
        }))
    }

    const handleOnFullClear = () => {
        closeModal()
        setSelectValues({})
    }

    // const handleApplyFilters = () => {
    //     setUpdatingState('updating')
    //     const currClassifiers: ITreeFilteringModalProps['classifiers'] = Object.entries(selectValues)
    //         .reduce((acc, [valuesId, valuesArr]) => {
    //             const classifier = Object.values(classifiers)
    //                 .find(classifier => String(classifier.id) === valuesId)

    //             const newClassifier = valuesArr.map(item => {

    //                 return classifier.children?.find(child => child?.id === item)
    //             })
    //             let classId: string

    //             Object.entries(classifiers).map(([classifierId, classifier]) => {
    //                 if (classifier.id === Number(valuesId)) {
    //                     classId = classifierId
    //                 }
    //             })

    //             acc[classId] = {
    //                 id: valuesId,
    //                 name: classifier.name,
    //                 children: newClassifier,
    //             }

    //             return acc
    //         }, {})

    //     saveTreeIdSettings(
    //         accountData?.settings,
    //         {
    //             chosenClassifiers: chosenClassifiers,
    //         },
    //         id
    //     )

    //     if ([StoreStates.FINISH, StoreStates.ERROR].includes(storeState)) {
    //         setChosenClassifiers(currClassifiers, id)
    //         setUpdatingState('finish')
    //         closeModal()
    //     }
    // }

    const handleApplyFilters = () => {
        setUpdatingState('updating');
    
        const currClassifiers: ITreeFilteringModalProps['classifiers'] = Object.entries(selectValues)
            .reduce((acc, [valuesId, valuesArr]) => {
                const classifier = Object.values(classifiers)
                    .find(classifier => String(classifier.id) === valuesId);
    
                if (!classifier) {
                    console.error(`Classifier with id ${valuesId} not found`);
                    
                    return acc;
                }
    
                const newClassifier = valuesArr.map(item => {
                    const child = classifier.children?.find(child => child?.id === item);

                    if (!child) {
                        console.error(`Child with id ${item} not found in classifier ${classifier.id}`);
                        
                        return null;
                    }
                    
                    return child;
                }).filter(Boolean);
    
                let classId: string | undefined;
    
                Object.entries(classifiers).map(([classifierId, classifier]) => {
                    if (classifier.id === Number(valuesId)) {
                        classId = classifierId;
                    }
                });
    
                if (!classId) {
                    console.error(`ClassId not found for classifier with id ${valuesId}`);
                    
                    return acc;
                }
    
                acc[classId] = {
                    id: valuesId,
                    name: classifier.name,
                    children: newClassifier,
                };
    
                return acc;
            }, {});
    
        if (!accountData) {
            console.error('Account data is undefined');
            
            return;
        }
    
        saveTreeIdSettings(
            accountData.settings,
            {
                chosenClassifiers: chosenClassifiers,
            },
            id
        );
    
        // if (Object.keys(currClassifiers).length === 0) {
        //     console.error('No classifiers were selected');
        //     setUpdatingState('finish');

        //     return;
        // }
    
        setChosenClassifiers(currClassifiers, id);
        setUpdatingState('finish');
        closeModal();
    };

    return (
        <div
            style={{
                padding: 4,
                opacity: updatingState === 'updating' ? 0.3 : 1,
            }}
        >
            <h3 style={{ marginTop: 0, textAlign: 'center' }}>
                Фильтры
            </h3>
            <div
                key={classifiers[id]?.id}
                style={{
                    maxHeight: '350px',
                    boxSizing: 'border-box',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    paddingRight: '10px',
                }}
            >
                {Object.entries(classifiers).map(([classifierId, classifier]) => {

                    const title = classifierId === 'byType'
                        ? String(classifier.name).toLowerCase()
                        : 'объект класса "' + classifier.name + '"'

                    const placeHolder = `Выберите ${title}`

                    return (
                        <>
                            <Row
                                style={{ width: '800px', marginBottom: '10px' }}
                                align="middle"
                                key={classifier.id + '-' + classifier.name}
                                gutter={[10, 10]}
                            >
                                <Col span={9}>
                                    <Typography>
                                        {classifier.name}
                                    </Typography>
                                </Col>
                                <Col span={15}>
                                    <Select
                                        style={{ width: '100%' }}
                                        mode="multiple"
                                        placeholder={placeHolder}
                                        maxTagCount="responsive"
                                        allowClear
                                        autoClearSearchValue={false}
                                        onChange={handleOnChange(classifier.id)}
                                        onClear={() => handleOnClear(classifier.id)}
                                        showSearch
                                        defaultValue={selectValues[classifier.id] ?? []}
                                        value={selectValues[classifier.id] ?? []}
                                        filterOption={filterOption}
                                    >
                                        {
                                            classifier.children.map((child) => {
                                                return (
                                                    <Select.Option key={child.id} value={child.id}>
                                                        {child.name}
                                                    </Select.Option>
                                                )
                                            })
                                        }
                                    </Select>
                                </Col>
                            </Row>
                            {classifierId == '0' && Object.keys(classifiers).length > 1
                                ?
                                <h3 style={{ textAlign: 'center' }}>
                                    Фильтрация по связанным объектам
                                </h3>
                                : <></>}
                        </>

                    )
                })}
            </div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    marginTop: 16,
                }}
            >
                <Button
                    key="0"
                    onClick={handleApplyFilters}
                    disabled={updatingState === 'updating'}
                    style={{
                        width: '250px',
                        backgroundColor: '#26ADE4',
                        color: '#ffffff',
                    }}
                >
                    Применить
                </Button>
                <Button
                    key="1"
                    type="primary"
                    onClick={handleOnFullClear}
                    style={{
                        width: '250px',
                        backgroundColor: '#26ADE4',
                        color: '#ffffff',
                    }}
                >
                    Очистить
                </Button>
            </div>
        </div>
    )
}
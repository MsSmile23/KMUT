import { useInitStores } from '@shared/hooks/useInitStores';
import { useStores } from '@shared/hooks/useStores';
import { Row, Table, Tabs } from 'antd';
import { FC } from 'react';

export const AllStores: FC = () => {
    useInitStores()

    const stores = useStores()

    return (
        <Row>
            <Tabs 
                items={Object.values(stores).filter((s) => !(s as any)?.store).map((store: any, i) => ({
                    key: `${i}`,
                    label: store.localeName,
                    children: (
                        <Table 
                            style={{ flex: '1 1 100%' }}
                            columns={['id', 'name'].map((e) => ({ key: e, dataIndex: e, title: e }))}
                            dataSource={store.data.map((cls) => ({ key: cls.id, id: cls.id, name: cls.name }))}
                            loading={store.loading}
                        />
                    )
                }))}
            />
        </Row>
    )
}
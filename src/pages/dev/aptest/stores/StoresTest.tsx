/* eslint-disable */

import { TBaseStore } from "@shared/stores/types/types"
import { Button, Col, Form, Input, Row } from "antd"
import { useEffect, useState } from "react"
import { create } from "zustand"
import { immer } from "zustand/middleware/immer"
import { createBaseStore } from "@shared/stores/utils/createBaseStore"
import { values } from "lodash"

type StoreItem = { id: number, name: string }
type Store = TBaseStore<StoreItem[]>

const request: any = async (name: string) => new Promise((res, rej) => {
    console.log('requesting...')
    
    const data = new Date().getSeconds() % 3 
        ? [{ id: 1, name: 'Test 1'}] 
        : [{ id: 1, name: 'Test 1'}, { id: 2, name: 'Test 2' }]

    setTimeout(() => {
        // new Date().getSeconds() % 2 ? res({
        //     success: true,
        //     data
        // }) : rej({
        //     success: false,
        //     data: []
        // })

        res({
            success: true,
            data
        })
    }, 3_000)
})

const addItem = (id: number): Promise<StoreItem> => new Promise((res) => {
    setTimeout(() => {
        res({ id, name: 'Test ' + id })
    }, 2000)
})


export const useTestStore = create(immer<Store>((set, get) => ({
    ...createBaseStore<StoreItem[]>(set, get),
    data: [],
    timer: 5_000,
    localeName: 'Тестовый стор',
    request,
    addItem
})))

export const Storetest: React.FC = () => {
    const [ status, init ] = useTestStore((st) => [st.status, st.init])
    const data = useTestStore(st => st.data)
    const errorMessage = useTestStore(st => st.error)
    const [cache, cached] = useTestStore(st => [st.cache, st.cached])
    const updateTest = useTestStore(st => st.update)
    const stopTest = useTestStore(st => st.stop)
    const runTest = useTestStore(st => st.run)
    const addTest = useTestStore(st => st.add)
    const findItem = useTestStore(st => st.find)

    useEffect(() => {
        init()
    }, [])

    const [ form ] = Form.useForm()

    return (
        <Row gutter={[12, 12]} align={'middle'} style={{ marginTop: 20, marginLeft: 20 }}>
            <Col xs={24}>Status: {status}</Col>
            <Col xs={24}>errorMessage: {errorMessage}</Col>
            <Col xs={24}>data: {JSON.stringify(data)}</Col>
            <Col xs={24}>cache: {JSON.stringify(cache)}</Col>
            <Col xs={24}>cached: {`${cached}`}</Col>
            <Col xs={24}>item: {JSON.stringify(findItem(123))}</Col>
            <Col xs={24}>
                <Form
                    form={form}
                    onFinish={async (values) => {
                        await form.validateFields()

                        if (values.id) {
                            addTest(Number(values.id))
                        }
                    }}
                >
                    <Form.Item name="id" label='id' rules={[{ required: true }]}>
                        <Input style={{ width: 200 }} />
                    </Form.Item>
                    <Form.Item>
                        <Button 
                            htmlType='submit' 
                            loading={status === 'load'} 
                        >
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
            <Col xs={2} onClick={stopTest}><Button>Stop</Button></Col>
            <Col onClick={() => updateTest()}><Button>Update</Button></Col>
            <Col xs={4} onClick={runTest}><Button>Enable auto</Button></Col>
        </Row>
    )
}
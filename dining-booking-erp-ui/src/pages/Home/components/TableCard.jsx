import { useEffect, useState } from "react";
import { Col, Flex, Row } from 'antd';
import { DollarOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Card } from "../../../components/Card.jsx"
import { getTableAPI } from "../../../utils/apiCall";
import { localDateTime } from "../../../utils/common";
import "../index.css";

const TableCard = () => {
    const [tableData, setTableData] = useState([])

    useEffect(() => {
        const getTable = async () => {
            const tableDataResponse = await getTableAPI();
            if (tableDataResponse.status === 200) {
                setTableData(tableDataResponse.data.map((ins, idx) => {
                    ins['id'] = idx + 1;
                    return ins;
                }))

            }
        }

        getTable();
    }, [])

    return (
        <>
            {
                <Row gutter={[8, 8]}>
                    {
                        tableData.map((ins, idx) => (
                            <Col className="gutter-row" span={6}>
                                <Card
                                    key={idx + 1}
                                    className={`${ins.is_occupied ? 'red-color' : 'green-color'} height-25-vh cursor-ptr white-color`}
                                    ChildComponent={
                                        <Flex justify="space-between" align="flex-start">
                                            <span> {ins.id} </span>
                                            <span> {localDateTime(ins.created_at)} </span>
                                        </Flex>
                                    }
                                    actions={
                                        ins.is_occupied ? ([
                                                <DollarOutlined key="pay-bill" />,
                                                <EditOutlined   key="edit-order" />,
                                            ]) : ([
                                                <PlusCircleOutlined key="add-order" />
                                            ])
                                    }
                                />
                            </Col>
                        ))
                    }
                </Row>
            }

        </>
    )
}
export default TableCard;
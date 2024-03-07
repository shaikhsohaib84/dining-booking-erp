import { useEffect, useState } from "react";
import { Col, Flex, Row } from 'antd';
import Card from "../../../components/Card";
import { getTableAPI } from "../../../utils/apiCall";
import { localDateTime } from "../../../utils/common";
import "../index.css"

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
                <Row gutter={[8, 8]} >
                    {
                        tableData.map((ins, idx) => (
                            <Col className="gutter-row" span={6}>
                                <Card
                                    className={`${ins.is_occupied ? 'red-color' : 'green-color'} height-25-vh`}
                                    key={idx + 1}
                                    ChildComponent={
                                        <Flex justify="space-between" align="flex-start">
                                            <div>
                                                {ins.id}
                                            </div>
                                            <div>
                                                {localDateTime(ins.created_at)}
                                            </div>
                                        </Flex>
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
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Flex, Row, Spin } from 'antd';
import { DollarOutlined, EditOutlined, PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { Card } from "../../../components/Card.jsx"
import { deleteTableById, getTableAPI } from "../../../utils/apiCall";
import { localDateTime } from "../../../utils/common";
import { setModel } from "../../../redux/action/modelAction.js"
import "../index.css";

const TableCard = () => {
    const dipatch = useDispatch();
    const modeState = useSelector((state) => state?.models)
    const genericState = useSelector((state) => state?.generic)
    const { tableData=[] } = modeState;
    const { currPath ='/' } = genericState;
    
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getTable = async () => {
            setIsLoading(true);
            const tableDataResponse = await getTableAPI();
            if (tableDataResponse.status === 200) {
                const tableData = tableDataResponse.data.map((ins, idx) => {
                    ins['tableId'] = idx + 1;
                    return ins;
                })
                dipatch(setModel('tableData', tableData));
            }
            setIsLoading(false);
        }
        getTable();
    }, [])

    const handleDeleteTableById = async (tableDetail) => {
        const tableResp = await deleteTableById(tableDetail?.id)
        console.log(tableResp);
    }

    return (
        <Spin spinning={isLoading}>
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
                                            <span> {ins.tableId} </span>
                                            <span> {localDateTime(ins.created_at)} </span>
                                        </Flex>
                                    }
                                    actions={
                                        currPath !== 'tableSetting' ? 
                                            (ins.is_occupied ? ([
                                                    <DollarOutlined key="pay-bill" />,
                                                    <EditOutlined   key="edit-order" />,
                                                ]) : ([
                                                    <PlusCircleOutlined key="add-order" />
                                            ])) 
                                            : 
                                            (
                                                ([
                                                    <DeleteOutlined key="edit-order" onClick={() => {handleDeleteTableById(ins)}}/>
                                                ])
                                            )
                                    }
                                />
                            </Col>
                        ))
                    }
                </Row>
            }

        </Spin>
    )
}
export default TableCard;
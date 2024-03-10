import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Flex, Row, Spin, Layout } from 'antd';
import { DollarOutlined, EditOutlined, PlusCircleOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Card } from "../../../components/Card.jsx"
import { ConfirmModal } from "../../../components/ConfirmModal.jsx";
import Button from "../../../components/Button.jsx";
import { deleteTableById, getTableAPI } from "../../../utils/apiCall";
import { localDateTime, tableIdArray } from "../../../utils/common";
import { setModel } from "../../../redux/action/modelAction.js"
import { toastError } from "../../../utils/toast.js";
import "../index.css";

const { Content } = Layout;

const TableCard = () => {
    const dipatch = useDispatch();
    const modeState = useSelector((state) => state?.models)
    const genericState = useSelector((state) => state?.generic)
    const { tableData = [] } = modeState;
    const { currPath = '/' } = genericState;

    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedTable, setSelectedTable] = useState({})

    useEffect(() => {
        const getTable = async () => {
            setIsLoading(true);
            const tableDataResponse = await getTableAPI();
            if (tableDataResponse.status === 200) {
                const tableData = tableIdArray(tableDataResponse.data);
                dipatch(setModel('tableData', tableData));
            }
            setIsLoading(false);
        }
        getTable();
    }, [])

    const openCloseConfirmModal = (modalOpen, tableDetail) => {
        setShowConfirmModal(modalOpen);
        setSelectedTable(tableDetail);
    }

    const handleDeleteTableById = async () => {
        setIsLoading(true);
        const tableResp = await deleteTableById(selectedTable?.id);
        if (tableResp.status == 404 || tableResp.status != 204) {
            setIsLoading(false);
            setShowConfirmModal(false);
            toastError();
            return;
        }
        let tableDataCopy = [...tableData];
        const indexToDelete = tableDataCopy.findIndex(item => item.tableId === selectedTable?.tableId);
        tableDataCopy.splice(indexToDelete, 1);
        tableDataCopy.forEach((item, idx) => {
            item.tableId = idx + 1;
        });
        dipatch(setModel('tableData', tableDataCopy));
        setShowConfirmModal(false);
        setIsLoading(false);
    }

    return (
        <Spin spinning={isLoading}>
            {showConfirmModal &&
                <ConfirmModal
                    icon={<ExclamationCircleOutlined />}
                    title="Delete Table"
                    open={showConfirmModal}
                    okText="Delete"
                    okType="danger"
                    cancelText="Close"
                    onOk={() => { handleDeleteTableById(selectedTable?.id) }}
                    onCancel={() => {
                        setShowConfirmModal(false);
                        setSelectedTable({});
                    }}
                    Children={
                        <p>I'm sure you'll add new table soon...</p>
                    }
                />
            }
            {
                <div style={{ 
                        background: 'white', 
                        height: 'calc(90vh - 50px)', 
                        overflowY: 'scroll',
                    }}>
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
                                                (
                                                    ins.is_occupied ? ([
                                                        <>
                                                            <Button
                                                                key="pay-bill"
                                                                icon={<DollarOutlined />}
                                                                size="large"
                                                                type="link"
                                                                onClick={() => { openCloseConfirmModal(true, ins) }}
                                                            />
                                                            <Button
                                                                key="edit-order"
                                                                icon={<EditOutlined />}
                                                                size="large"
                                                                type="link"
                                                                onClick={() => { openCloseConfirmModal(true, ins) }}
                                                            />
                                                        </>
                                                    ]) : ([
                                                        <Button
                                                            key="add-order"
                                                            icon={<PlusCircleOutlined />}
                                                            size="large"
                                                            type="link"
                                                            onClick={() => { openCloseConfirmModal(true, ins) }}
                                                        />
                                                    ])
                                                )
                                                :
                                                (
                                                    ([
                                                        <Button
                                                            key="edit-order"
                                                            onClick={() => { openCloseConfirmModal(true, ins) }}
                                                            disabled={ins.is_occupied}
                                                            size="large"
                                                            type="link"
                                                            danger={true}
                                                            icon={<DeleteOutlined />}
                                                        />
                                                    ])
                                                )
                                        }
                                    />
                                </Col>
                            ))
                        }
                    </Row>
                </div>
            }

        </Spin>
    )
}
export default TableCard;
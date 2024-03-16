import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Flex, Row, Spin } from 'antd';
import { DollarOutlined, EditOutlined , ExclamationCircleOutlined, PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { Card } from "../../../components/Card.jsx"
import { ConfirmModal } from "../../../components/ConfirmModal.jsx";
import Button from "../../../components/Button.jsx";
import { deleteTableById, getTableAPI } from "../apiCall.js";
import { localDateTime, tableIdArray } from "../../../utils/common";
import { setModel } from "../../../redux/action/modelAction.js"
import { toastAlert } from "../../../utils/toastAlert.js";
import { ERROR_MESSAGE, DELETED_SUCCESSFUL } from "../../../utils/constant.js"
import "../index.css";

const TableCard = ({ actions }) => {
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
            toastAlert(ERROR_MESSAGE ,"error");
            return;
        }
        let tableDataCopy = [...tableData];
        const indexToDelete = tableDataCopy.findIndex(item => item.tableId === selectedTable?.tableId);
        tableDataCopy.splice(indexToDelete, 1);
        tableDataCopy.forEach((item, idx) => {
            item.tableId = idx + 1;
        });
        toastAlert(DELETED_SUCCESSFUL ,"success");
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
                <div className="white-color padding-14 x-scrollbar table-card-custom-height">
                    <Row gutter={[8, 8]}>
                        {
                            tableData.map((ins, idx) => (
                                <Col className="gutter-row" span={8}>
                                    <Card
                                        key={idx + 1}
                                        className={`${ins.is_occupied ? 'red-color' : 'green-color'} card-margin height-25-vh cursor-ptr white-color`}
                                        ChildComponent={
                                            <Flex justify="space-between" align="flex-start">
                                                <span> {ins.tableId} </span>
                                                <span> {localDateTime(ins.created_at)} </span>
                                            </Flex>
                                        }
                                        // actions = {actions}
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
                                                            key="delete-order"
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
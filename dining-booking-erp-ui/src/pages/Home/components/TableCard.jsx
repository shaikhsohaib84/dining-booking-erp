import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox, Col, Flex, Row, Space, Spin, Tag } from 'antd';
import {
    DollarOutlined,
    PlusOutlined,
    EditOutlined,
    MinusOutlined,
    DeleteOutlined,
    PlusCircleOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import { TableOrder } from "./TableOrder.jsx";
import { Card } from "../../../components/Card.jsx"
import Button from "../../../components/Button.jsx";
import { Drawer } from "../../../components/Drawer.jsx";
import { Search } from "../../../components/Search.jsx";
import { ConfirmModal } from "../../../components/ConfirmModal.jsx";
import { MenuItemSelection } from "../../MenuItem/MenuItemSelection.jsx";
import { createOrderByTableId, deleteTableById, getTableAPI } from "../apiCall.js";
import { localDateTime, menuItemFilter, tableIdArray } from "../../../utils/common";
import { toastAlert } from "../../../utils/toastAlert.js";
import { setModel } from "../../../redux/action/modelAction.js"
import { getMenuItemsAPI } from "../../MenuItem/apiCall.js";
import { setGeneric } from "../../../redux/action/genericAction.js";
import { ERROR_MESSAGE, DELETED_SUCCESSFULLY, VEG, NON_VEG, ERROR, DINING, PARCEL, NO_DATA_AVAILABLE, WARNING, SUCCESS, ORDER_CREATED_SUCESSFULLY } from "../../../utils/constant.js"
import "../index.css";
import "../../MenuItem/index.css"
import { Switch } from "../../../components/Switch.jsx";

const TableCard = () => {
    const dispatch = useDispatch();
    const modelState = useSelector((state) => state?.models)
    const genericState = useSelector((state) => state?.generic)
    const { currPath = '/', currentMenuTab = 'pizza', selectedRowMap = {} } = genericState;
    const { tableData = [], pizzaItems = [], burgerItems = [], sandwichItems = [], friesItems = [], drinkItems = [] } = modelState;

    const [orderType, setOrderType] = useState('dining')
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [openOrderDrawer, setOrderDrawer] = useState(false);
    const [showSaveOrderModal, setShowSaveOrderModal] = useState(false);
    const [selectedTable, setSelectedTable] = useState({});
    const [menuItemData, setMenuItemData] = useState([]);
    const [searchData, setSearchData] = useState([]);

    const menuColumns = [
        {
            title: '',
            dataIndex: '',
            key: '',
            render: (text, record) => {
                return (
                    <Checkbox
                        checked={record?.isSelected}
                        onChange={(e) => {
                            if (currentMenuTab === 'pizza') {
                                const newPizzaItems = pizzaItems.map((ins) => {
                                    if (ins?.id == record?.id) {
                                        ins.isSelected = !ins.isSelected;
                                        if (ins.isSelected) {
                                            dispatch(setGeneric({ selectedRowMap: { ...selectedRowMap, [record['id']]: ins } }))
                                        } else {
                                            let hashMapCopy = { ...selectedRowMap };
                                            delete hashMapCopy[record.id]
                                            dispatch(setGeneric({ selectedRowMap: hashMapCopy }))
                                        }
                                    }
                                    return ins;
                                })
                                dispatch(setModel('pizzaItems', newPizzaItems))
                            } else if (currentMenuTab === 'burger') {
                                const newBurgerItems = burgerItems.map((ins) => {
                                    if (ins?.id == record?.id) {
                                        ins.isSelected = !ins.isSelected;
                                        if (ins.isSelected) {
                                            dispatch(setGeneric({ selectedRowMap: { ...selectedRowMap, [record['id']]: ins } }))
                                        } else {
                                            let hashMapCopy = { ...selectedRowMap };
                                            delete hashMapCopy[record.id]
                                            dispatch(setGeneric({ selectedRowMap: hashMapCopy }))
                                        }
                                    }
                                    return ins;
                                })
                                dispatch(setModel('burgerItems', newBurgerItems))
                            } else if (currentMenuTab === 'sandwich') {
                                const newSandwichItems = sandwichItems.map((ins) => {
                                    if (ins?.id == record?.id) {
                                        ins.isSelected = !ins.isSelected;
                                        if (ins.isSelected) {
                                            dispatch(setGeneric({ selectedRowMap: { ...selectedRowMap, [record['id']]: ins } }))
                                        } else {
                                            let hashMapCopy = { ...selectedRowMap };
                                            delete hashMapCopy[record.id]
                                            dispatch(setGeneric({ selectedRowMap: hashMapCopy }))
                                        }
                                    }
                                    return ins;
                                })
                                dispatch(setModel('sandwichItems', newSandwichItems))
                            } else if (currentMenuTab === 'fries') {
                                const newFriesItems = friesItems.map((ins) => {
                                    if (ins?.id == record?.id) {
                                        ins.isSelected = !ins.isSelected;
                                        if (ins.isSelected) {
                                            dispatch(setGeneric({ selectedRowMap: { ...selectedRowMap, [record['id']]: ins } }))
                                        } else {
                                            let hashMapCopy = { ...selectedRowMap };
                                            delete hashMapCopy[record.id]
                                            dispatch(setGeneric({ selectedRowMap: hashMapCopy }))
                                        }
                                    }
                                    return ins;
                                })
                                dispatch(setModel('friesItems', newFriesItems))
                            } else {
                                const newDrinkItems = drinkItems.map((ins) => {
                                    if (ins?.id == record?.id) {
                                        ins.isSelected = !ins.isSelected;
                                        if (ins.isSelected) {
                                            dispatch(setGeneric({ selectedRowMap: { ...selectedRowMap, [record['id']]: ins } }))
                                        } else {
                                            let hashMapCopy = { ...selectedRowMap };
                                            delete hashMapCopy[record.id]
                                            dispatch(setGeneric({ selectedRowMap: hashMapCopy }))
                                        }
                                    }
                                    return ins;
                                })
                                dispatch(setModel('drinkItems', newDrinkItems))
                            }
                        }}
                    />
                )
            },
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Rate',
            dataIndex: 'rate',
            key: 'rate',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Created At',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (_, record) => <a>{localDateTime(record.created_at)}</a>
        },
        {
            title: 'Menu Type',
            key: 'menu_type',
            dataIndex: 'menu_type',
            render: (_, record) => (
                <Tag color={record?.menu_type === "veg" ? 'green' : 'red'}>
                    {record?.menu_type === "veg" ? VEG : NON_VEG}
                </Tag>
            ),
        },
        {
            title: 'Qty',
            key: 'qty',
            dataIndex: 'qty',
            render: (_, record) => (
                <div className="d-flex">
                    <Space size="small">
                        <Button
                            disabled={record?.isSelected == false}
                            icon={<PlusOutlined />}
                            onClick={() => { handleQty('add', record) }}
                        />
                        <span>{record?.qty}</span>
                        <Button
                            disabled={record?.isSelected == false}
                            icon={<MinusOutlined />}
                            onClick={() => { handleQty('minus', record) }}
                        />
                    </Space>
                </div>
            ),
        },
    ];

    useEffect(() => {
        const getTable = async () => {
            setIsLoading(true);
            const tableDataResponse = await getTableAPI();
            if (tableDataResponse.status === 200) {
                const tableData = tableIdArray(tableDataResponse.data);
                dispatch(setModel('tableData', tableData));
            }
            setIsLoading(false);
        }

        const getMenuItems = async () => {
            let { status, data = [] } = await getMenuItemsAPI();
            if (status != 200) {
                toastAlert(ERROR_MESSAGE, ERROR);
                return
            }
            data = data.filter((ins) => {
                ins['key'] = ins.id
                ins['qty'] = 0
                ins['isSelected'] = false
                return ins
            })

            // util function to segregate the menu data on the basis of items-type(pizza, burger, drinks, sandwich)   
            const pizzaFilteredItems = menuItemFilter(data, "pizza")
            const burgerFilteredItems = menuItemFilter(data, "burger")
            const sandwichFilteredItems = menuItemFilter(data, "sandwich")
            const friesFilteredItems = menuItemFilter(data, "fries")
            const drinkFilteredItems = menuItemFilter(data, "drink")

            // setting for intial pizza data.
            setMenuItemData(pizzaFilteredItems);
            setSearchData(pizzaFilteredItems);

            dispatch(setModel('pizzaItems', pizzaFilteredItems))
            dispatch(setModel('burgerItems', burgerFilteredItems))
            dispatch(setModel('sandwichItems', sandwichFilteredItems))
            dispatch(setModel('friesItems', friesFilteredItems))
            dispatch(setModel('drinkItems', drinkFilteredItems))
        }

        getTable();
        getMenuItems();
    }, [])

    const handleQty = (actionType, record) => {
        let count = record?.qty
        if (actionType === 'add') {
            count += 1
        } else if (actionType === 'minus' && count > 0) {
            count -= 1
        }

        if (currentMenuTab === 'pizza') {
            const newPizzaItems = pizzaItems.map((ins) => {
                if (ins?.id == record?.id) {
                    ins['qty'] = count;
                }
                return ins;
            })
            dispatch(setModel('pizzaItems', newPizzaItems))
        } else if (currentMenuTab === 'burger') {
            const newBurgerItems = burgerItems.map((ins) => {
                if (ins?.id == record?.id) {
                    ins['qty'] = count;
                }
                return ins;
            })
            dispatch(setModel('burgerItems', newBurgerItems))
        } else if (currentMenuTab === 'sandwich') {
            const newSandwichItems = sandwichItems.map((ins) => {
                if (ins?.id == record?.id) {
                    ins['qty'] = count;
                }
                return ins;
            })
            dispatch(setModel('sandwichItems', newSandwichItems))
        } else if (currentMenuTab === 'fries') {
            const newFriesItems = friesItems.map((ins) => {
                if (ins?.id == record?.id) {
                    ins['qty'] = count;
                }
                return ins;
            })
            dispatch(setModel('friesItems', newFriesItems))
        } else {
            const newDrinkItems = drinkItems.map((ins) => {
                if (ins?.id == record?.id) {
                    ins['qty'] = count;
                }
                return ins;
            })
            dispatch(setModel('drinkItems', newDrinkItems))
        }
    }

    const handleOrderDrawer = () => {
        setOrderDrawer(!openOrderDrawer)
    }

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
            toastAlert(ERROR_MESSAGE, ERROR);
            return;
        }
        let tableDataCopy = [...tableData];
        const indexToDelete = tableDataCopy.findIndex(item => item.tableId === selectedTable?.tableId);
        tableDataCopy.splice(indexToDelete, 1);
        tableDataCopy.forEach((item, idx) => {
            item.tableId = idx + 1;
        });
        toastAlert(DELETED_SUCCESSFULLY, SUCCESS);
        dispatch(setModel('tableData', tableDataCopy));
        setShowConfirmModal(false);
        setIsLoading(false);
    }

    const handleAddOrder = (ins) => {
        handleOrderDrawer();
        setSelectedTable(ins);
    }

    const onSearch = (value) => {
        const filteredMenuItems = menuItemData.filter(item =>
            item.name.toLowerCase().includes(value.toLowerCase()) ||
            item.menu_type.toLowerCase().includes(value.toLowerCase()) ||
            item.menu_item.toLowerCase().includes(value.toLowerCase()) ||
            item.rate.toString().includes(value)
        );
        setSearchData(filteredMenuItems)
    }

    const handleCreateOrder = async () => {
        if (Object.values(selectedRowMap).length == 0) {
            toastAlert(NO_DATA_AVAILABLE, WARNING);
            return
        }
        const { status, data } = await createOrderByTableId({
            'order_type': orderType,
            'table_id': selectedTable?.id,
            'menu': Object.values(selectedRowMap)
        });

        if (status != 201) {
            toastAlert(ERROR_MESSAGE, ERROR);
        } else {
            const tableData = tableIdArray(data);

            const newPizzaItems = pizzaItems.map((ins) => {
                ins['qty'] = 0;
                ins['isSelected'] = false
                return ins;
            })
            dispatch(setModel('pizzaItems', newPizzaItems))

            const newBurgerItems = burgerItems.map((ins) => {
                ins['qty'] = 0;
                ins['isSelected'] = false
                return ins;
            })
            dispatch(setModel('burgerItems', newBurgerItems))

            const newSandwichItems = sandwichItems.map((ins) => {
                ins['qty'] = 0;
                ins['isSelected'] = false
                return ins;
            })
            dispatch(setModel('sandwichItems', newSandwichItems))

            const newFriesItems = friesItems.map((ins) => {
                ins['qty'] = 0;
                ins['isSelected'] = false
                return ins;
            })
            dispatch(setModel('friesItems', newFriesItems))

            const newDrinkItems = drinkItems.map((ins) => {
                ins['qty'] = 0;
                ins['isSelected'] = false
                return ins;
            })
            dispatch(setModel('drinkItems', newDrinkItems))

            
            dispatch(setModel('tableData', tableData))
            setShowSaveOrderModal(false)
            setOrderDrawer(false)
            dispatch(setGeneric({ 'selectedRowMap': {} }))
            toastAlert(ORDER_CREATED_SUCESSFULLY, SUCCESS);
        }
        return;
    }

    return (
        <Spin spinning={isLoading}>
            {
                showSaveOrderModal &&
                <ConfirmModal
                    width={1000}
                    open={showSaveOrderModal}
                    title={`Confirm order for table ${selectedTable?.tableId}`}
                    cancelText="Close"
                    okType="primary"
                    okText={
                        <div
                            onClick={() => { handleCreateOrder() }}
                        >
                            Create
                        </div>
                    }
                    onCancel={() => { setShowSaveOrderModal(false) }}
                    Children={
                        <>
                            <div className="d-flex justify-content-end all-margin">
                                <Switch
                                    defaultChecked
                                    onChange={(chk) => {
                                        setOrderType(chk ? 'dining' : 'parcel')
                                    }}
                                    checkedChildren={DINING}
                                    unCheckedChildren={PARCEL}
                                    style={{
                                        background: '#1677ff'
                                    }}
                                />
                            </div>
                            <TableOrder
                                selectedRows={Object.values(selectedRowMap)}
                            />
                        </>
                    }
                />
            }
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
                                            <>
                                                <Flex justify="space-between" align="flex-start">
                                                    <span> {ins.tableId} </span>
                                                    <span> {localDateTime(ins.created_at)} </span>
                                                </Flex>
                                            </>
                                        }
                                        actions={
                                            currPath !== 'tableSetting' ?
                                                (
                                                    ins.is_occupied ? ([
                                                        <div className="d-flex justify-content-around">
                                                            <Button
                                                                name="Pay"
                                                                className="grey-btn"
                                                                key="pay-bill"
                                                                icon={<DollarOutlined />}
                                                                size="small"
                                                                type="primary"
                                                                onClick={() => { }}
                                                            />
                                                            <Button
                                                                name="Edit Order"
                                                                className="grey-btn"
                                                                key="edit-order"
                                                                icon={<EditOutlined />}
                                                                size="small"
                                                                type="primary"
                                                                onClick={() => { }}
                                                            />
                                                        </div>
                                                    ]) : ([
                                                        <Button
                                                            name="Add Order"
                                                            className='primary-btn'
                                                            key="add-order"
                                                            icon={<PlusCircleOutlined />}
                                                            size="small"
                                                            type="primary"
                                                            onClick={() => { handleAddOrder(ins) }}
                                                        />
                                                    ])
                                                )
                                                :
                                                (
                                                    ([
                                                        <Button
                                                            name="Remove Table"
                                                            key="remove-table"
                                                            onClick={() => { openCloseConfirmModal(true, ins) }}
                                                            disabled={ins.is_occupied}
                                                            size="small"
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
            {
                openOrderDrawer && (
                    <Drawer
                        title={`Create order for table ${selectedTable?.tableId}`}
                        onClose={handleOrderDrawer}
                        open={openOrderDrawer}
                        width="100%"
                        extra={
                            <Space>
                                <Button
                                    name="Create"
                                    type="link"
                                    onClick={() => { setShowSaveOrderModal(true) }}
                                    disabled={Object.values(selectedRowMap).length === 0}
                                />
                                <Button
                                    name="Cancel"
                                    type="default"
                                    onClick={handleOrderDrawer}
                                    danger={true}
                                />
                            </Space>
                        }
                        Children={
                            <>
                                <div className="d-flex justify-content-end">
                                    <Search
                                        className="search-width"
                                        placeholder="Search in menu-item"
                                        onSearch={onSearch}
                                    />
                                </div>

                                <MenuItemSelection
                                    menuColumns={menuColumns}
                                    searchData={searchData}
                                    setMenuItemData={setMenuItemData}
                                    setSearchData={setSearchData}
                                />
                            </>
                        }
                    />
                )
            }
        </Spin>
    )
}
export default TableCard;
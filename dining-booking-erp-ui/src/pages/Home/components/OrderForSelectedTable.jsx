import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Space, Spin, Tag } from "antd";
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { Table } from "../../../components/Table.jsx";
import { Drawer } from "../../../components/Drawer.jsx";
import Button from "../../../components/Button.jsx";
import { toastAlert } from "../../../utils/toastAlert.js";
import { getOrderByTableAPI, removeOrderAPI } from "../apiCall.js";
import { AMOUNT, ERROR, ERROR_MESSAGE, ITEM, NAME, NON_VEG, QTY, RATE, REMOVED_SUCCESSFULLY, REMOVE_ORDER, SUCCESS, TYPE, VEG } from "../../../utils/constant.js";

export const OrderForSelectedTable = ({
    selectedTable,
    showTableOrderModal,
    handleClearTableOrder
}) => {
    
    const orderColumns = [
        {
            title: NAME,
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: ITEM,
            dataIndex: 'item',
            key: 'item',
            render: (text) => <a>{text}</a>,
        },
        {
            title: TYPE,
            dataIndex: 'type',
            key: 'type',
            render: (text) => (
                <Tag color={text === "veg" ? 'green' : 'red'}>
                    {text === "veg" ? VEG : NON_VEG}
                </Tag>
            ),
        },
        {
            title: RATE,
            dataIndex: 'rate',
            key: 'rate',
            render: (text) => <a>{text}</a>,
        },
        {
            title: QTY,
            dataIndex: 'qty',
            key: 'qty',
            render: (text, record) => (
                <div className="d-flex">
                        <Space size="small">
                            <Button
                                icon={<PlusOutlined />}
                                onClick={() => { handleAddQty(record) }}
                            />
                            <span>{record?.qty}</span>
                            <Button
                                icon={<MinusOutlined />}
                                onClick={() => { handleMinusQty(record) }}
                                disabled={text == 1}
                            />
                        </Space>
                    </div>
            ),
        },
        {
            title: AMOUNT,
            dataIndex: 'amount',
            key: 'amount',
            render: (text, record) => (
                <a>{record?.qty * record?.rate}</a>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            dataIndex: 'action',
            render: (_, record) => (
                <Button
                    name={`${REMOVE_ORDER}`}
                    type="link"
                    danger={true}
                    onClick={() => { handleRemoveOrder(record) }}
                />
            )
        }
    ]

    const modelState = useSelector((state) => state?.models);
    const { pizzaItems = [], burgerItems = [], sandwichItems = [], friesItems = [], drinkItems = [] } = modelState;

    const [isLoading, setIsLoading]         = useState(true);
    const [addOrderModal, setAddOrderModal] = useState(true);
    const [orders, setOrders]               = useState([])
    const [menuItemData, setMenuItemData]   = useState([]);
    const [searchData, setSearchData]       = useState([]);

    useEffect(() => {
        setMenuItemData(pizzaItems);
        setSearchData(pizzaItems);

        getTableOrderByTableId()
    }, [])
    
    const getTableOrderByTableId = async () => {
        setIsLoading(true)
        const { status, data } = await getOrderByTableAPI(selectedTable?.table_token)
        if (status !== 200) {
            toastAlert(ERROR_MESSAGE, ERROR);
            return 
        } else {
            filterTableOrderAPIData(data)
        }
        setIsLoading(false)
    }

    const filterTableOrderAPIData = (tableOrders=[]) => {
        let tempArr = []
        tableOrders.filter((ins) => {
            const { id, table_token, qty, menu:{name, menu_type, menu_item, rate} } = ins;
            tempArr.push({
                id, 
                table_token,
                name,
                'type': menu_type,
                'item': menu_item,
                rate,
                qty,
            })
        })
        setOrders(tempArr)
    }

    const handleAddQty = (selectedOrder) => {
        let orderCopy = [...orders]
        orderCopy.filter((ins) => {
            if (ins?.id == selectedOrder.id) {
                ins.qty += 1
            }
            return ins;
        })
        setOrders(orderCopy);
    }

    const handleMinusQty = (selectedOrder) => {
        let orderCopy = [...orders]
        debugger
        orderCopy.filter((ins) => {
            if (ins?.id == selectedOrder.id) {
                ins.qty -= 1
                if (ins.qty <= 0) {
                    orderCopy.splice(orderCopy.findIndex(a => a.id === ins.id) , 1)
                    return
                }
            }
            return ins;
        })
        setOrders(orderCopy);
    }

    const handleRemoveOrder = async (order) => {
        const { status } = await removeOrderAPI(order?.id)
        if (status != 204) {
            toastAlert(ERROR_MESSAGE, ERROR);
        } else {
            let orderCopy = [];
            orders.filter((ins) => {
                if (ins?.id != order?.id) {
                    orderCopy.push(ins)
                }
            })
            setOrders(orderCopy);
            toastAlert(REMOVED_SUCCESSFULLY, SUCCESS);
        }
        return
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

    const TableOrderView = () => {
        return (
            <Table
                columns={orderColumns}
                data={orders}
            />
        )
    }

    return (
        <Spin spinning={isLoading}>
            <Drawer
                title={`Order for table no. ${selectedTable?.tableId}`}
                open={showTableOrderModal}
                onClose={handleClearTableOrder}
                width="100%"
                Children={
                    // <TableOrderView />
                    <>
                        <div className="d-flex justify-content-end">
                            <Search
                                className="search-width"
                                placeholder="Search menu-item"
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
                extra={
                    <Space>
                        <Button
                            name="Add Order"
                            type="link"
                            disabled={!orders.length}
                            onClick={() => { setAddOrderModal(!addOrderModal)}}
                        />
                    </Space>
                }
            />
        </Spin>
    )
}
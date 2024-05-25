import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox, Space, Spin, Tag } from "antd";
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { Table } from "../../../components/Table.jsx";
import { Drawer } from "../../../components/Drawer.jsx";
import Button from "../../../components/Button.jsx";
import { toastAlert } from "../../../utils/toastAlert.js";
import { getOrderByTableAPI, removeOrderAPI } from "../apiCall.js";
import { AMOUNT, ERROR, ERROR_MESSAGE, ITEM, MENU_TYPE, NAME, NON_VEG, QTY, RATE, REMOVED_SUCCESSFULLY, REMOVE_ORDER, SUCCESS, TYPE, VEG } from "../../../utils/constant.js";
import { Search } from "../../../components/Search.jsx";
import { MenuItemSelection } from "../../MenuItem/MenuItemSelection.jsx";
import { setGeneric } from "../../../redux/action/genericAction.js";
import { setModel } from "../../../redux/action/modelAction.js";
import { localDateTime } from "../../../utils/common.js";

export const OrderForSelectedTable = ({
    selectedTable,
    showTableOrderModal,
    handleClearTableOrder,
    menuItemData,
    searchData,
    setMenuItemData,
    setSearchData,
}) => {
    const dispatch = useDispatch()

    const modelState = useSelector((state) => state?.models);
    const genericState = useSelector((state) => state?.generic);
    const { currentMenuTab = 'pizza', selectedRowMap = {} } = genericState;
    const { pizzaItems = [], burgerItems = [], sandwichItems = [], friesItems = [], drinkItems = [] } = modelState;

    const [isLoading, setIsLoading]         = useState(true);
    const [addOrderModal, setAddOrderModal] = useState(true);
    const [orders, setOrders]               = useState([])

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
            title: `${NAME}`,
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: `${RATE}`,
            dataIndex: 'rate',
            key: 'rate',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (text, record) => {
                const qtyByRate = record?.rate * record?.qty
                return (
                    <a>{qtyByRate}</a>
                )
            },
        },
        {
            title: 'Created At',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (_, record) => <a>{localDateTime(record.created_at)}</a>
        },
        {
            title: `${MENU_TYPE}`,
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
            render: (_, record) => {
                return (
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
                )
            }
        },
    ];

    useEffect(() => {
        getTableOrderByTableId()
    }, [])
    
    const getTableOrderByTableId = async () => {
        setIsLoading(true)
        const { status, data } = await getOrderByTableAPI(selectedTable?.table_token)
        if (status !== 200) {
            toastAlert(ERROR_MESSAGE, ERROR);
            return 
        } else {
            let menuItemsMapper = {
                'pizza': pizzaItems,
                'burger': burgerItems,
                'sandwich': sandwichItems,
                'fries': friesItems,
                'drink': drinkItems
            }

            data.filter((ins) => {
                setSelectedOrders(ins, menuItemsMapper)
            })

            filterTableOrderAPIData(data)
        }
        setIsLoading(false)
    }

    const setSelectedOrders = (ins, menuItemsMapper) => {
        // binary search for selection(check-box) of orders from menu list.
        const {menu: { id, menu_item }, qty} = ins;
        let menuData = menuItemsMapper[menu_item]
        const toSearchId = id;
        
        let left  = 0;
        let right = menuData.length-1;
        
        while (left <= right) {
          const mid = Math.floor(left+(right - left) / 2);
          if (menuData[mid]['id'] == toSearchId) {
            menuData[mid]['isSelected'] = true;
            menuData[mid]['qty'] = qty;
            menuData[mid]['price'] = qty*menuData[mid]['rate'];
            return menuItemsMapper;
          }
          
          if (toSearchId < menuData[mid]['id']) {
            right = mid-1;
          } else {
            left = mid+1;
          }
        }
        return menuItemsMapper;
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
    console.log(orders);
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
                            name="Update Order"
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
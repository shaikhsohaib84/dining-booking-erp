import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox, Space, Spin, Tag } from "antd";
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { Table } from "../../../components/Table.jsx";
import { Drawer } from "../../../components/Drawer.jsx";
import Button from "../../../components/Button.jsx";
import { toastAlert } from "../../../utils/toastAlert.js";
import { getOrderByTableAPI, removeOrderAPI } from "../apiCall.js";
import { ERROR, ERROR_MESSAGE, ITEM, MENU_TYPE, NAME, NON_VEG, PRICE, QTY, RATE, REMOVED_SUCCESSFULLY, REMOVE_ORDER, SUCCESS, TYPE, VEG } from "../../../utils/constant.js";
import { Search } from "../../../components/Search.jsx";
import { MenuItemSelection } from "../../MenuItem/MenuItemSelection.jsx";
import { setGeneric } from "../../../redux/action/genericAction.js";
import { setModel } from "../../../redux/action/modelAction.js";
import { localDateTime } from "../../../utils/common.js";
import { ConfirmModal } from "../../../components/ConfirmModal.jsx";

export const OrderForSelectedTable = ({
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
    const { currentMenuTab = 'pizza', selectedRowMap = {}, selectedTable = {} } = genericState;
    const { pizzaItems = [], burgerItems = [], sandwichItems = [], friesItems = [], drinkItems = [] } = modelState;

    const [isLoading, setIsLoading]         = useState(true);
    const [addOrderModal, setAddOrderModal] = useState(false);
    const [orders, setOrders]               = useState([])

    let menuItemsMapper = {
        'pizza': pizzaItems,
        'burger': burgerItems,
        'sandwich': sandwichItems,
        'fries': friesItems,
        'drink': drinkItems
    }

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
                                onClick={() => { handleQty('add',record) }}
                            />
                            <span>{record?.qty}</span>
                            <Button
                                icon={<MinusOutlined />}
                                onClick={() => { handleQty('minus',record) }}
                                disabled={text == 1}
                            />
                        </Space>
                    </div>
            ),
        },
        {
            title: PRICE,
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
                            const updatedMenuArray = menuItemsMapper[currentMenuTab].map((ins) => {
                                if (ins?.id == record?.id) {
                                    ins.isSelected = !ins.isSelected;
                                    let selectedRowHM = selectedRowMap;
                                    if (ins.isSelected) {
                                        selectedRowHM = { ...selectedRowHM, [record['id']]: {
                                            'tableId': selectedTable?.id, 
                                            'menuId': record?.id,
                                            'table_token': selectedTable?.table_token,
                                            'name': record?.name,
                                            'type': record?.menu_type,
                                            'item': record?.menu_item,
                                            'rate': record?.rate,
                                            'qty': record?.qty,
                                        } }
                                    } else {
                                        delete selectedRowHM[record.id]
                                    }
                                    dispatch(setGeneric({ selectedRowMap: selectedRowHM }))
                                }
                                return ins;
                            })

                            if (currentMenuTab === 'pizza') {
                                dispatch(setModel('pizzaItems', updatedMenuArray))
                            } else if (currentMenuTab === 'burger') {
                                dispatch(setModel('burgerItems', updatedMenuArray))
                            } else if (currentMenuTab === 'sandwich') {
                                dispatch(setModel('sandwichItems', updatedMenuArray))
                            } else if (currentMenuTab === 'fries') {
                                dispatch(setModel('friesItems', updatedMenuArray))
                            } else {
                                dispatch(setModel('drinkItems', updatedMenuArray))
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
                                disabled={record?.isSelected == false || record?.qty == 1}
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
        let selectedMenuHM = {}
        tableOrders.filter((ins) => {
            const { id, table_token, qty, menu:{name, menu_type, menu_item, rate} } = ins;
            selectedMenuHM[ins?.menu?.id] = {
                'tableId': id, 
                'menuId': ins?.menu?.id,
                table_token,
                name,
                'type': menu_type,
                'item': menu_item,
                rate,
                qty,
            }
        })
        dispatch(setGeneric({ selectedRowMap: { ...selectedRowMap, ...selectedMenuHM} }))
    }

    const handleQty = (actionType, record) => {
        // handleQty function is being re-used for view-order and view-order > check-out 
        let count = record?.qty;
        let selectedMenuHM = selectedRowMap;
        if (actionType === 'add') {
            count += 1
        } else if (actionType === 'minus') {
            if (count <= 0) return;
            count -= 1
        }
        if (record?.menuId) {
            // this check is for view-order > check-out order view
            selectedMenuHM[record?.menuId]['qty'] = count
        } else {
            selectedMenuHM[record?.id]['qty'] = count
        }
        const updatedMenuList = menuItemsMapper[currentMenuTab].map((ins) => {
            if (ins?.id == record?.id) {
                ins['qty'] = count;
            }
            return ins;
        })

        if (currentMenuTab === 'pizza') {
            dispatch(setModel('pizzaItems', updatedMenuList))
        } else if (currentMenuTab === 'burger') {
            dispatch(setModel('burgerItems', updatedMenuList))
        } else if (currentMenuTab === 'sandwich') {
            dispatch(setModel('sandwichItems', updatedMenuList))
        } else if (currentMenuTab === 'fries') {
            dispatch(setModel('friesItems', updatedMenuList))
        } else {
            dispatch(setModel('drinkItems', updatedMenuList))
        }
        dispatch(setGeneric({ selectedRowMap: selectedMenuHM }))
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
                data={Object.values(selectedRowMap)}
            />
        )
    }
    
    return (
        <Spin spinning={isLoading}>
            {
                addOrderModal && (
                    <ConfirmModal
                        width={1000}
                        open={addOrderModal}
                        title={`Check out order for table ${selectedTable?.tableId}`}
                        cancelText="Close"
                        okType="primary"
                        okText={
                            <div
                                onClick={() => { }}
                            >
                                Save
                            </div>
                        }
                        onCancel={() => { setAddOrderModal(false) }}
                        Children={
                            <TableOrderView />
                        }
                    />
                )
            }
            <Drawer
                title={`Order for table no. ${selectedTable?.tableId}`}
                open={showTableOrderModal}
                onClose={handleClearTableOrder}
                width="100%"
                Children={
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
                            name="Check Out"
                            type="link"
                            disabled={!Object.keys(selectedRowMap).length}
                            onClick={() => { setAddOrderModal(!addOrderModal)}}
                        />
                    </Space>
                }
            />
        </Spin>
    )
}
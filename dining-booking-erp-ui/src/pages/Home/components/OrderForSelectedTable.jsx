import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox, Typography, Space, Spin, Tag } from "antd";
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { Table } from "../../../components/Table.jsx";
import { Drawer } from "../../../components/Drawer.jsx";
import Button from "../../../components/Button.jsx";
import { toastAlert } from "../../../utils/toastAlert.js";
import { getOrderByTableAPI, removeOrderAPI, updateOrderAPI } from "../apiCall.js";
import { ERROR, ERROR_MESSAGE, ITEM, MENU_TYPE, NAME, NON_VEG, ORDER_UPDATED, PRICE, QTY, RATE, REMOVED_SUCCESSFULLY, REMOVE_ORDER, SUCCESS, TYPE, VEG } from "../../../utils/constant.js";
import { Search } from "../../../components/Search.jsx";
import { MenuItemSelection } from "../../MenuItem/MenuItemSelection.jsx";
import { setGeneric } from "../../../redux/action/genericAction.js";
import { setModel } from "../../../redux/action/modelAction.js";
import { localDateTime } from "../../../utils/common.js";
import { ConfirmModal } from "../../../components/ConfirmModal.jsx";
const { Text, Title } = Typography;

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
    const { currentMenuTab = 'pizza', selectedRowMap = {}, selectedTable = {}, menuItemMapper={} } = genericState;
    const { pizzaItems = [], burgerItems = [], sandwichItems = [], friesItems = [], drinkItems = [] } = modelState;

    const [isLoading, setIsLoading]           = useState(true);
    const [addOrderModal, setAddOrderModal]   = useState(false);
    const [orders, setOrders]                 = useState([])
    const [totalAmount, setTotalAmount]       = useState(0)

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
                <a>{text}</a>
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
                            let menuItemMapperCopy = {...menuItemMapper}
                            let selectedRowHM = selectedRowMap;
                            menuItemMapperCopy[currentMenuTab][record?.id]['isSelected'] = !menuItemMapperCopy[currentMenuTab][record?.id]['isSelected']
                            const selectedObj = menuItemMapperCopy[currentMenuTab][record?.id];
                            if (selectedObj.isSelected) {
                                selectedRowHM = { ...selectedRowHM, [record['id']]: {
                                    'tableId': selectedTable?.id, 
                                    'orderItemId': selectedObj?.orderItemId ? selectedObj?.orderItemId : null,
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
                            dispatch(setGeneric({ menuItemMapper: menuItemMapperCopy }))

                            // const updatedMenuArray = menuItemMapperCopy[currentMenuTab].map((ins) => {
                            //     if (ins?.id == record?.id) {
                            //         ins.isSelected = !ins.isSelected;
                            //         let selectedRowHM = selectedRowMap;
                            //         if (ins.isSelected) {
                            //             selectedRowHM = { ...selectedRowHM, [record['id']]: {
                            //                 'tableId': selectedTable?.id, 
                            //                 'orderItemId': null,
                            //                 'menuId': record?.id,
                            //                 'table_token': selectedTable?.table_token,
                            //                 'name': record?.name,
                            //                 'type': record?.menu_type,
                            //                 'item': record?.menu_item,
                            //                 'rate': record?.rate,
                            //                 'qty': record?.qty,
                            //             } }
                            //         } else {
                            //             delete selectedRowHM[record.id]
                            //         }
                            //         dispatch(setGeneric({ selectedRowMap: selectedRowHM }))
                            //     }
                            //     return ins;
                            // })

                            // if (currentMenuTab === 'pizza') {
                            //     dispatch(setModel('pizzaItems', updatedMenuArray))
                            // } else if (currentMenuTab === 'burger') {
                            //     dispatch(setModel('burgerItems', updatedMenuArray))
                            // } else if (currentMenuTab === 'sandwich') {
                            //     dispatch(setModel('sandwichItems', updatedMenuArray))
                            // } else if (currentMenuTab === 'fries') {
                            //     dispatch(setModel('friesItems', updatedMenuArray))
                            // } else {
                            //     dispatch(setModel('drinkItems', updatedMenuArray))
                            // }
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
        } else {
            let menuItemMapperCopy = {...menuItemMapper}

            data.filter((ins) => {
                const selectedObj = menuItemMapperCopy[currentMenuTab][ins?.menu?.id]
                selectedObj['isSelected'] = true;
                selectedObj['qty'] = ins.qty;
                // selectedObj['price'] = ins.qty * ins.rate;
                // setSelectedOrders(ins, menuItemsMapper)
            })
            filterTableOrderAPIData(data, selectedTable?.id)
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

    const filterTableOrderAPIData = (tableOrders=[], tableId) => {
        let selectedMenuHM = {}
        tableOrders.filter((ins) => {
            const { id, table_token, qty, menu:{name, menu_type, menu_item, rate} } = ins;
            selectedMenuHM[ins?.menu?.id] = {
                'tableId': tableId, 
                'orderItemId': id, 
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
        let selectedMenuHM = JSON.parse(JSON.stringify(selectedRowMap));
        const selectedObj  = JSON.parse(JSON.stringify(menuItemMapper));

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

        selectedObj[currentMenuTab][record?.id]['qty'] = count
        setSearchData(Object.values(selectedObj[currentMenuTab]));
        dispatch(setGeneric({ menuItemMapper: selectedObj }))

        // const updatedMenuList = menuItemMapper[currentMenuTab][record?.menuId].map((ins) => {
        //     if (ins?.id == record?.id) {
        //         ins['qty'] = count;
        //     }
        //     return ins;
        // })

        // if (currentMenuTab === 'pizza') {
        //     dispatch(setModel('pizzaItems', updatedMenuList))
        // } else if (currentMenuTab === 'burger') {
        //     dispatch(setModel('burgerItems', updatedMenuList))
        // } else if (currentMenuTab === 'sandwich') {
        //     dispatch(setModel('sandwichItems', updatedMenuList))
        // } else if (currentMenuTab === 'fries') {
        //     dispatch(setModel('friesItems', updatedMenuList))
        // } else {
        //     dispatch(setModel('drinkItems', updatedMenuList))
        // }
        dispatch(setGeneric({ selectedRowMap: selectedMenuHM }))
    }

    const handleRemoveOrder = async (order) => {
        debugger
        let selectedRowMapCopy  = JSON.parse(JSON.stringify(selectedRowMap))
        let menuItemMapperCopy  = JSON.parse(JSON.stringify(menuItemMapper))
        
        menuItemMapperCopy[currentMenuTab][order?.menuId]['isSelected'] = false
        menuItemMapperCopy[currentMenuTab][order?.menuId]['qty'] = 1
        
        delete selectedRowMapCopy[order?.menuId]
        setSearchData(Object.values(menuItemMapperCopy[currentMenuTab]));
        dispatch(setGeneric({ menuItemMapper: menuItemMapperCopy }))
        dispatch(setGeneric({ selectedRowMap: selectedRowMapCopy }))
    }

    const onSearch = (value) => {
        const data = [...Object.values(menuItemMapper[currentMenuTab])]
        debugger
        const filteredMenuItems = data.filter(item =>
            item.name.toLowerCase().includes(value.toLowerCase()) ||
            item.menu_type.toLowerCase().includes(value.toLowerCase()) ||
            item.menu_item.toLowerCase().includes(value.toLowerCase())
        );
        console.log({
            value,
            filteredMenuItems
        });
        setSearchData(filteredMenuItems)
    }

    const TableOrderView = () => {
        const selectedItemList = Object.values(selectedRowMap);
        let tempTotalAmount = selectedItemList.reduce((currTotalAmt, item) => {
            const {rate, qty} = item;
            return currTotalAmt + (rate*qty);
        }, 0)
        setTotalAmount(tempTotalAmount)
        return (
            <Table
                columns={orderColumns}
                data={selectedItemList}
            />
        )
    }

    const updateOrder = async () => {
        setIsLoading(true)
        const { status } = await updateOrderAPI(selectedTable?.table_token, selectedRowMap)
        if (status != 200) {
            toastAlert(ERROR_MESSAGE, ERROR);
        } else {
            toastAlert(ORDER_UPDATED, SUCCESS);
        }
        setIsLoading(false)
    }
    
    return (
        <Spin spinning={isLoading}>
            {
                addOrderModal && (
                    <ConfirmModal
                        width={1000}
                        open={addOrderModal}
                        title={`Table ${selectedTable?.tableId} Order's - Total amount ${totalAmount} Rs`}
                        Children={
                            <TableOrderView />
                        }
                        footer={[
                            <Button key="close" type="primary" onClick={() => { setAddOrderModal(false) }} name="Close"></Button>,
                            <Button key="updateOrder" type="primary" onClick={updateOrder} name="Update Order"></Button>,
                            <Button key="proceedBilling" type="primary" onClick={() => {}} name="Proceed billing"></Button>
                        ]}
                        cancelText="Close"
                        onCancel={() => { setAddOrderModal(false) }}
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
                            name="Confirm"
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
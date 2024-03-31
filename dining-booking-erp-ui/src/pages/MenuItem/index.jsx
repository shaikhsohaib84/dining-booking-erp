import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Space, Tag, Typography } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Search } from "../../components/Search";
import { setModel } from "../../redux/action/modelAction";
import { Drawer } from "../../components/Drawer";
import { MenuForm } from "./MenuForm";
import Button from "../../components/Button";
import { MenuItemSelection } from "./MenuItemSelection";
import { toastAlert } from "../../utils/toastAlert";
import { localDateTime, menuItemFilter } from "../../utils/common";
import { SUCCESS, ERROR, ERROR_MESSAGE, MENU_ITEMS_ADDED_SUCCESSFULLY, VEG, NON_VEG, MENU_DELETED_SUCESSFULLY, MENU_EDIT_SUCCESSFULLY } from "../../utils/constant";
import { addMenuItemAPI, deleteMenuAPI, getMenuItemsAPI, handleEditMenuAPI } from "./apiCall";
import "./index.css";
import { ConfirmModal } from "../../components/ConfirmModal";
import { Input } from "../../components/Input";
const { Title } = Typography;

const MenuItem = () => {
    const dispatch = useDispatch();
    const modelState = useSelector((state) => state?.models)
    const genericState = useSelector((state) => state?.generic)
    const { selectedItems = [], pizzaItems = [], burgerItems = [], sandwichItems = [], friesItems = [], drinkItems = [] } = modelState;
    const { currentMenuTab = 'pizza' } = genericState

    const [menuItemData, setMenuItemData] = useState([]);
    const [searchData, setSearchData] = useState([]);
    const [selectedMenu, setSelectedMenu] = useState({})
    const [showDrawer, setDrawer] = useState(false);
    const [deleteConfirmModal, setDeleteConfirmModal] = useState(false)
    const [editConfirmModal, setEditConfirmModal] = useState(false)

    const menuColumns = [
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
        }, {
            title: 'Action',
            key: 'action',
            dataIndex: 'action',
            render: (_, record) => (
                <Space>
                    <Button
                        name="Edit"
                        type="default"
                        icon={<EditOutlined />}
                        onClick={() => { handleSetEditMenu(record) }}
                    />
                    <Button
                        danger={true}
                        name="Delete"
                        type="link"
                        icon={<DeleteOutlined />}
                        onClick={() => { handleSetDeleteMenu(record) }}
                    />
                </Space>
            )
        }
    ];

    useEffect(() => {
        getMenuItems();
    }, [])

    const getMenuItems = async () => {
        const { status, data = [] } = await getMenuItemsAPI();
        if (status != 200) {
            toastAlert(ERROR_MESSAGE, ERROR);
            return
        }
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

    const onSearch = (value) => {
        const filteredMenuItems = menuItemData.filter(item =>
            item.name.toLowerCase().includes(value.toLowerCase()) ||
            item.menu_type.toLowerCase().includes(value.toLowerCase()) ||
            item.menu_item.toLowerCase().includes(value.toLowerCase()) ||
            item.rate.toString().includes(value)
        );
        setSearchData(filteredMenuItems)
    }

    const handleDrawer = () => {
        setDrawer(!showDrawer)
    }

    const handleSave = async () => {
        const { status, data } = await addMenuItemAPI(selectedItems);
        if (status != 201) {
            toastAlert(ERROR_MESSAGE, ERROR);
            handleDrawer()
            return
        }

        const pizzaData = menuItemFilter(data, "pizza")
        const burgerData = menuItemFilter(data, "burger")
        const sandwichData = menuItemFilter(data, "sandwich")
        const friesData = menuItemFilter(data, "fries")
        const drinkData = menuItemFilter(data, "drink")

        dispatch(setModel('selectedItems', []))
        dispatch(setModel('pizzaItems', pizzaData))
        dispatch(setModel('burgerItems', burgerData))
        dispatch(setModel('sandwichItems', sandwichData))
        dispatch(setModel('friesItems', friesData))
        dispatch(setModel('drinkItems', drinkData))

        if (currentMenuTab == 'pizza') {
            setMenuItemData(pizzaData);
            setSearchData(pizzaData);
        } else if (currentMenuTab == 'burger') {
            setMenuItemData(burgerData);
            setSearchData(burgerData);
        } else if (currentMenuTab == 'sandwich') {
            setMenuItemData(sandwichData);
            setSearchData(sandwichData);
        } else if (currentMenuTab == 'fries') {
            setMenuItemData(friesData);
            setSearchData(friesData);
        } else {
            setMenuItemData(drinkData);
            setSearchData(drinkData);
        }
        handleDrawer()
        toastAlert(MENU_ITEMS_ADDED_SUCCESSFULLY, SUCCESS);
    }

    const handleSetDeleteMenu = (currMenu) => {
        setDeleteConfirmModal(true)
        setSelectedMenu(currMenu)
    }

    const handleClearDeleteMenu = () => {
        setDeleteConfirmModal(false)
        setSelectedMenu({})
    }

    const handleDeleteMenu = async () => {
        const { status } = await deleteMenuAPI(selectedMenu?.id);
        if (status != 204) {
            toastAlert(ERROR_MESSAGE, ERROR)
            setDeleteConfirmModal(false)
            return
        }

        const updatedMenuList = menuItemData.filter((ins) => {
            if (ins?.id != selectedMenu?.id) {
                return ins;
            }
        })

        setSearchData(updatedMenuList)
        setMenuItemData(updatedMenuList)
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
        setDeleteConfirmModal(false)
        toastAlert(MENU_DELETED_SUCESSFULLY, SUCCESS)
        return;
    }

    const handleSetEditMenu = (currMenu) => {
        setEditConfirmModal(true)
        setSelectedMenu(currMenu)
    }

    const handleClearEditMenu = () => {
        setEditConfirmModal(false)
        setSelectedMenu({})
    }

    const handleEditMenu = async () => {
        let updatedMenuObj = {}
        const {status, data} = await handleEditMenuAPI(updatedMenuObj)
        if (status != 200) {
            toastAlert(ERROR_MESSAGE, ERROR);
        } else {
            toastAlert(MENU_EDIT_SUCCESSFULLY, SUCCESS);
        }
        handleClearEditMenu()
    }

    const handleSetMenuName = (updatedName) => {
        setSelectedMenu({...selectedMenu, ['name']: updatedName})
    }
    
    const handleSetMenuRate = (updatedName) => {
        setSelectedMenu({...selectedMenu, ['rate']: updatedName})
    }
    
    const handleSetMenuType = (updatedName) => {
        setSelectedMenu({...selectedMenu, ['menu_type']: updatedName})
    }
    console.log(selectedMenu);
    
    return (
        <>
            {
                editConfirmModal &&
                    <ConfirmModal
                        title={`Updated Menu`}
                        okText="Update"
                        okType="primary"
                        cancelText="Close"
                        width={900}
                        icon={<EditOutlined />}
                        open={editConfirmModal}
                        onOk={handleEditMenu}
                        onCancel={handleClearEditMenu}
                        Children={
                            <Space align="baseline">
                                <Input
                                    placeholder="Item name"
                                    defaultValue={selectedMenu?.name}
                                    onChange={(e) => { handleSetMenuName(e.target.value) }}
                                />
                                <Input
                                    placeholder="Item rate"
                                    defaultValue={selectedMenu?.rate}
                                    onChange={(e) => { handleSetMenuRate(e.target.value) }}
                                />
                                <Input
                                    placeholder="veg/non-veg"
                                    defaultValue={selectedMenu?.menu_type}
                                    onChange={(e) => { handleSetMenuType(e.target.value) }}
                                />
                            </Space>
                        }
                    />
            }
            {
                deleteConfirmModal &&
                    <ConfirmModal
                        title="Delete Menu"
                        okText="Delete"
                        okType="danger"
                        cancelText="Close"
                        width={900}
                        icon={<DeleteOutlined />}
                        open={deleteConfirmModal}
                        onOk={handleDeleteMenu}
                        onCancel={handleClearDeleteMenu}
                        Children={
                            <Space align="baseline">
                                Are you sure to delete the <Title level={4}>{selectedMenu?.name}</Title> from your menu?
                            </Space>
                        }
                    />
            }
            <div className="d-flex justify-content-between">
                <Button
                    name="Add Item"
                    className='primary-btn'
                    size="middle"
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleDrawer}
                />
                <Search
                    className="search-width"
                    placeholder="Search in menu-item"
                    onSearch={onSearch}
                />
            </div>

            <div className="margin-top-10">
                <MenuItemSelection
                    menuColumns={menuColumns}
                    searchData={searchData}
                    setMenuItemData={setMenuItemData}
                    setSearchData={setSearchData}
                />
            </div>

            <Drawer
                title="Add New Item"
                onClose={handleDrawer}
                open={showDrawer}
                extra={
                    <Space>
                        <Button
                            name="Save"
                            type="link"
                            onClick={handleSave}
                            disabled={selectedItems.length == 0}
                        />
                        <Button
                            name="Cancel"
                            type="default"
                            onClick={handleDrawer}
                            danger={true}
                        />
                    </Space>
                }
                Children={
                    <MenuForm />
                }
            />
        </>
    )
}

export default MenuItem;
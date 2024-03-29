import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Space, Tag } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import { Search } from "../../components/Search";
import { MenuTab } from "../../components/MenuTab";
import { setModel } from "../../redux/action/modelAction";
import { Table } from "../../components/Table";
import { Drawer } from "../../components/Drawer";
import { MenuForm } from "./MenuForm";
import Button from "../../components/Button";
import { addMenuItemAPI, getMenuItemsAPI } from "./apiCall";
import { toastAlert } from "../../utils/toastAlert";
import { localDateTime, menuItemFilter } from "../../utils/common";
import { SUCCESS, ERROR, ERROR_MESSAGE, MENU_ITEMS_ADDED_SUCCESSFUL, VEG, NON_VEG, menuColumns, menuItems } from "../../utils/constant";
import "./index.css";


const MenuItem = () => {
    const dispatch = useDispatch();
    const modelState = useSelector((state) => state?.models)
    const {pizzaItems=[], burgerItems=[], sandwichItems=[], friesItems=[], drinkItems=[], selectedItems=[]} = modelState;
    
    const [menuItemData, setMenuItemData]      = useState([]);
    const [searchData, setSearchData]          = useState([]);
    const [menuItemColumns, setMenuItemColumn] = useState(menuColumns);
    const [showDrawer, setDrawer]              = useState(false);
    const [currentMenuTab, setCurrentMenuTab]  = useState("pizza")

    useEffect(() => {
        getMenuItems();
    }, [])

    const getMenuItems = async () => {
        const { status, data=[] } = await getMenuItemsAPI();
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

    const menuClick = (key) => {
        setCurrentMenuTab(key)
        let currentSelectedData = []
        if(key == 'pizza') {
            setMenuItemData(pizzaItems);
            currentSelectedData = pizzaItems
        } else if(key == 'burger') {
            setMenuItemData(burgerItems);
            currentSelectedData = burgerItems
        } else if(key == 'sandwich') {
            setMenuItemData(sandwichItems);
            currentSelectedData = sandwichItems
        } else if(key == 'fries') {
            setMenuItemData(friesItems);
            currentSelectedData = friesItems
        } else {
            setMenuItemData(drinkItems);
            currentSelectedData = drinkItems
        }
        setSearchData(currentSelectedData);
    }

    const handleDrawer = () => {
        setDrawer(!showDrawer)
    }

    const handleSave = async () => {
        const { status, data } = await addMenuItemAPI(selectedItems);
        if (status != 201) {
            toastAlert(ERROR_MESSAGE ,ERROR);
            return
        }
        
        const pizzaData    = menuItemFilter(data, "pizza")
        const burgerData   = menuItemFilter(data, "burger")
        const sandwichData = menuItemFilter(data, "sandwich")
        const friesData    = menuItemFilter(data, "fries")
        const drinkData    = menuItemFilter(data, "drink")
        
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
        toastAlert(MENU_ITEMS_ADDED_SUCCESSFUL, SUCCESS);
    }
    
    return (
        <>
            <div className="d-flex justify-content-between">
                <Button
                    name="Add Item"
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
                <MenuTab 
                    current={currentMenuTab}
                    items={menuItems}
                    onClick={(e) =>  { menuClick(e.key) } }
                />

                <Table 
                    className="margin-top-6"
                    columns={menuItemColumns}
                    data={searchData}
                    style={{
                        height: '100vh'
                    }}
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
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Space, Tag } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import { Search } from "../../components/Search";
import { MenuTab } from "../../components/MenuTab";
import { setModel } from "../../redux/action/modelAction";
import { Table } from "../../components/Table";
import { getMenuItemsAPI } from "./apiCall";
import { localDateTime, menuItemFilter } from "../../utils/common";
import { toastAlert } from "../../utils/toastAlert";
import { ERROR, ERROR_MESSAGE } from "../../utils/constant";
import "./index.css";
import Button from "../../components/Button";
import { Drawer } from "../../components/Drawer";

const menuItems = [
    {
      label: 'Pizza',
      key: 'pizza',
      icon: <img src={"pizza.svg"} alt="pizza"/> 
    },
    {
      label: 'Burger',
      key: 'burger',
      icon: <img src={"burger.svg"} alt="burger"/> 
    },
    {
        label: 'Sandwich',
        key: 'sandwich',
        icon: <img src={"sandwich.svg"} alt="sandwich"/> 
    },
    {
        label: 'Fries',
        key: 'fries',
        icon: <img src={"fries.svg"} alt="fries"/> 
    },
    {
        label: 'Drinks',
        key: 'drinks',
        icon: <img src={"drink.svg"} alt="drink"/> 
    },
];

const columns = [
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
            {record?.menu_type}
        </Tag>
      ),
    },
];

const MenuItem = () => {
    const dispatch = useDispatch();
    const modelState = useSelector((state) => state?.models)
    const {pizzaItems, burgerItems, sandwichItems, friesItems, drinkItems} = modelState;
    
    const [menuItemData, setMenuItemData]      = useState([]);
    const [searchData, setSearchData]          = useState([]);
    const [menuItemColumns, setMenuItemColumn] = useState([]);
    const [showDrawer, setDrawer]              = useState(false);
    const [currentMenuTab, setCurrentMenuTab]  = useState("pizza")

    useEffect(() => {
        setMenuItemColumn(columns);
        getMenuItems();
    }, [])

    const getMenuItems = async () => {
        const { status, data=[] } = await getMenuItemsAPI();
        if (status != 200) {
            toastAlert(ERROR_MESSAGE, ERROR);
            return
        }
        // util function to segregate the menu data on the basis of items-type(pizza, burger, drinks, sandwich)   
        const pizzaItems = menuItemFilter(data, "pizza")
        const burgerItems = menuItemFilter(data, "burger")
        const sandwichItems = menuItemFilter(data, "sandwich")
        const friesItems = menuItemFilter(data, "fries")
        const drinkItems = menuItemFilter(data, "drink")
        
        // setting for intial pizza data.
        setMenuItemData(pizzaItems);
        setSearchData(pizzaItems);

        dispatch(setModel('pizzaItems', pizzaItems))
        dispatch(setModel('burgerItems', burgerItems))
        dispatch(setModel('sandwichItems', sandwichItems))
        dispatch(setModel('friesItems', friesItems))
        dispatch(setModel('drinkItems', drinkItems))
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

    const menuClick = (e) => {
        setCurrentMenuTab(e.key)
        const key = e.key;
        if(key == 'pizza') {
            setMenuItemData(pizzaItems);
            setSearchData(pizzaItems);
        } else if(key == 'burger') {
            setMenuItemData(burgerItems);
            setSearchData(burgerItems);
        } else if(key == 'sandwich') {
            setMenuItemData(sandwichItems);
            setSearchData(sandwichItems);
        } else if(key == 'fries') {
            setMenuItemData(friesItems);
            setSearchData(friesItems);
        } else {
            setMenuItemData(drinkItems);
            setSearchData(drinkItems);
        }
    }

    const handleDrawer = () => {
        setDrawer(!showDrawer)
    }

    const handleSave = () => {
        // save menu api 
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
                    onClick={menuClick}
                />

                <Table 
                    className="margin-top-6"
                    columns={menuItemColumns}
                    data={searchData}
                />
            </div>

            <Drawer 
                title="Add New Item"
                onClose={handleDrawer}
                open={showDrawer}
                extra={
                    <Space>
                      <Button name="Save" onClick={handleSave} type="primary" />
                      <Button name="Cancel" onClick={handleDrawer} />
                    </Space>
                }
                Children={null}
            />
        </>
    )
}

export default MenuItem;
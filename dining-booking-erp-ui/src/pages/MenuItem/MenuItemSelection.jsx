import { useDispatch, useSelector } from "react-redux";
import { MenuTab } from "../../components/MenuTab"
import { Table } from "../../components/Table"
import { menuItemFilter } from "../../utils/common";
import { ERROR, ERROR_MESSAGE, menuColumns, menuItems } from "../../utils/constant"
import { getMenuItemsAPI } from "./apiCall";
import { useEffect, useState } from "react";
import { toastAlert } from "../../utils/toastAlert";
import { setModel } from "../../redux/action/modelAction";

export const MenuItemSelection = ({
    searchData,
    currentMenuTab, 
    setCurrentMenuTab,
    setMenuItemData,
    setSearchData,
}) => {
    const dispatch = useDispatch();
    const modelState = useSelector((state) => state?.models)
    const {pizzaItems=[], burgerItems=[], sandwichItems=[], friesItems=[], drinkItems=[], selectedItems=[]} = modelState;    

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

    const menuClick = (key) => {
        setCurrentMenuTab(key)
        let currentSelectedData = []
        if (key == 'pizza') {
            setMenuItemData(pizzaItems);
            currentSelectedData = pizzaItems
        } else if (key == 'burger') {
            setMenuItemData(burgerItems);
            currentSelectedData = burgerItems
        } else if (key == 'sandwich') {
            setMenuItemData(sandwichItems);
            currentSelectedData = sandwichItems
        } else if (key == 'fries') {
            setMenuItemData(friesItems);
            currentSelectedData = friesItems
        } else {
            setMenuItemData(drinkItems);
            currentSelectedData = drinkItems
        }
        setSearchData(currentSelectedData);
    }

    return (
        <>
            <MenuTab
                current={currentMenuTab}
                items={menuItems}
                onClick={(e) => { menuClick(e.key) }}
            />

            <Table
                className="margin-top-6"
                columns={menuColumns}
                data={searchData}
                style={{
                    height: '100vh'
                }}
            />
        </>
    )
}
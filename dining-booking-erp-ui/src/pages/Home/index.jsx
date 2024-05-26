import { useEffect, useState } from "react";
import { LoadingOutlined } from '@ant-design/icons';
import { useDispatch } from "react-redux";
import TableCard from "./components/TableCard";
import { getMenuItemsAPI } from "../MenuItem/apiCall";
import { setModel } from "../../redux/action/modelAction";
import { toastAlert } from "../../utils/toastAlert";
import { menuItemFilter } from "../../utils/common";
import { ERROR, ERROR_MESSAGE } from "../../utils/constant";
import { Flex, Spin } from "antd";

const Home = () => {
    const dispatch = useDispatch()

    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        const getMenuItems = async () => {
            setLoading(true)
            let { status, data = [] } = await getMenuItemsAPI();
            if (status != 200) {
                toastAlert(ERROR_MESSAGE, ERROR);
                return
            }
            data = data.filter((ins) => {
                ins['key'] = ins.id
                ins['qty'] = 1
                ins['price'] = ins?.rate
                ins['isSelected'] = false
                return ins
            })

            // util function to segregate the menu data on the basis of items-type(pizza, burger, drinks, sandwich)   
            const pizzaFilteredItems = menuItemFilter(data, "pizza")
            const burgerFilteredItems = menuItemFilter(data, "burger")
            const sandwichFilteredItems = menuItemFilter(data, "sandwich")
            const friesFilteredItems = menuItemFilter(data, "fries")
            const drinkFilteredItems = menuItemFilter(data, "drink")

            dispatch(setModel('pizzaItems', pizzaFilteredItems))
            dispatch(setModel('burgerItems', burgerFilteredItems))
            dispatch(setModel('sandwichItems', sandwichFilteredItems))
            dispatch(setModel('friesItems', friesFilteredItems))
            dispatch(setModel('drinkItems', drinkFilteredItems))
            setLoading(false)
        }
        
        getMenuItems();
    }, [])

    
    if (isLoading) {
        return (
            <Spin
                size="large"
                indicator={
                    <LoadingOutlined
                        style={{
                            fontSize: 24,
                        }}
                        spin
                    />
                }
            />
        )
    }
    
    return (
        <TableCard />
    )
}

export default Home;
import { useDispatch, useSelector } from "react-redux";
import { MenuTab } from "../../components/MenuTab"
import { Table } from "../../components/Table"
import { menuItems } from "../../utils/constant"
import { setGeneric } from "../../redux/action/genericAction";

export const MenuItemSelection = ({
    tableScroll=null,
    searchData,
    menuColumns,
    setMenuItemData,
    setSearchData,
}) => {
    const dispatch     = useDispatch();
    const modelState   = useSelector((state) => state?.models)
    const genericState = useSelector((state) => state?.generic)
    const {pizzaItems=[], burgerItems=[], sandwichItems=[], friesItems=[], drinkItems=[]} = modelState;
    const {currentMenuTab='pizza'} = genericState;    

    const menuClick = (key) => {
        dispatch(setGeneric({'currentMenuTab': key}))
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
                scroll={{
                    y: tableScroll,
                }}  
                style={{
                    height: '100vh'
                }}                
            />
        </>
    )
}
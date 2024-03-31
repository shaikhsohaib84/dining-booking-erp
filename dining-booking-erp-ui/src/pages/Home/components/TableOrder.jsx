import { useDispatch, useSelector } from "react-redux";
import { Tag } from "antd";
import { Table } from "../../../components/Table"
import Button from "../../../components/Button";
import { NON_VEG, VEG } from "../../../utils/constant";
import { setModel } from "../../../redux/action/modelAction";
import { setGeneric } from "../../../redux/action/genericAction";

export const TableOrder = () => {
    const dispatch = useDispatch();
    const genericState = useSelector((state) => state?.generic)
    const modelState   = useSelector((state) => state?.models)
    const { selectedRowMap={} } = genericState;
    const { pizzaItems=[], burgerItems=[], sandwichItems=[], friesItems=[], drinkItems=[] } = modelState;

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
            title: 'Qty',
            dataIndex: 'qty',
            key: 'qty',
            render: (text) => <a>{text}</a>,
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
        },
        {
            title: 'Action',
            key: 'action',
            dataIndex: '',
            render: (_, record) => (
                <Button
                    name="Remove"
                    type="link"
                    danger={true}
                    onClick={() => {handleRemoveMenuItem(record)}}
                />
            ),
        },
    ];

    const handleRemoveMenuItem = (selectedMenuItem) => {
        let selectedRowMapCopy = {...selectedRowMap}
        if (selectedMenuItem?.menu_item === 'pizza') {
            let pizzaItemsCopy = [...pizzaItems]
            pizzaItemsCopy.filter((ins) => {
                if (ins?.id == selectedMenuItem?.id) {
                    ins['isSelected'] = false;
                }
                return ins;
            })
            dispatch(setModel('pizzaItems', pizzaItemsCopy))
        } else if (selectedMenuItem?.menu_item === 'burger') {
            let burgerItemsCopy = [...burgerItems]
            burgerItemsCopy.filter((ins) => {
                if (ins?.id == selectedMenuItem?.id) {
                    ins['isSelected'] = false;
                }
                return ins;
            })
            dispatch(setModel('burgerItems', burgerItemsCopy))
        } else if (selectedMenuItem?.menu_item === 'sandwich') {
            let sandwichItemsCopy = [...sandwichItems]
            sandwichItemsCopy.filter((ins) => {
                if (ins?.id == selectedMenuItem?.id) {
                    ins['isSelected'] = false;
                }
                return ins;
            })
            dispatch(setModel('sandwichItems', sandwichItemsCopy))
        } else if (selectedMenuItem?.menu_item === 'fries') {
            let friesItemsCopy = [...friesItems]
            friesItemsCopy.filter((ins) => {
                if (ins?.id == selectedMenuItem?.id) {
                    ins['isSelected'] = false;
                }
                return ins;
            })
            dispatch(setModel('friesItems', friesItemsCopy))
        } else {
            let drinkItemsCopy = [...drinkItems]
            drinkItemsCopy.filter((ins) => {
                if (ins?.id == selectedMenuItem?.id) {
                    ins['isSelected'] = false;
                }
                return ins;
            })
            dispatch(setModel('drinkItems', drinkItemsCopy))
        }
        delete selectedRowMapCopy[selectedMenuItem?.id]
        dispatch(setGeneric({selectedRowMap: selectedRowMapCopy}))
    }

    return (
        <>
            <Table
                columns={menuColumns}
                data={Object.values(selectedRowMap)}
                scroll={{
                    y: 300,
                }}  
            />
        </>
    )
}
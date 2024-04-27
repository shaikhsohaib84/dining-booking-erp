import { useDispatch, useSelector } from "react-redux";
import { Tag } from "antd";
import { Table } from "../../../components/Table"
import Button from "../../../components/Button";
import { MENU_TYPE, NAME, NON_VEG, RATE, VEG } from "../../../utils/constant";
import { setModel } from "../../../redux/action/modelAction";
import { setGeneric } from "../../../redux/action/genericAction";
import { useEffect, useState } from "react";

export const TableOrder = ({
    setTotalPrice
}) => {
    const dispatch = useDispatch();
    const genericState = useSelector((state) => state?.generic)
    const modelState   = useSelector((state) => state?.models)
    const { selectedRowMap={} } = genericState;
    const { pizzaItems=[], burgerItems=[], sandwichItems=[], friesItems=[], drinkItems=[] } = modelState;

    const [selectedRows, setSelectedRows] = useState([])

    const menuColumns = [
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
            title: 'Qty',
            dataIndex: 'qty',
            key: 'qty',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (text, record) => {
                return (
                    <a>{text}</a>
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

    useEffect(() => {
        const data = Object.values(selectedRowMap)
        const totalPrice = data.reduce((curr, acc) => {
            return acc?.price + curr
        }, 0)
        setTotalPrice(totalPrice)
        setSelectedRows(data)
    }, [])

    const handleRemoveMenuItem = (selectedMenuItem) => {
        let selectedRowMapCopy = {...selectedRowMap}
        if (selectedMenuItem?.menu_item === 'pizza') {
            let pizzaItemsCopy = [...pizzaItems]
            pizzaItemsCopy.filter((ins) => {
                if (ins?.id == selectedMenuItem?.id) {
                    ins['isSelected'] = false;
                    ins['price'] = 0;
                }
                return ins;
            })
            dispatch(setModel('pizzaItems', pizzaItemsCopy))
        } else if (selectedMenuItem?.menu_item === 'burger') {
            let burgerItemsCopy = [...burgerItems]
            burgerItemsCopy.filter((ins) => {
                if (ins?.id == selectedMenuItem?.id) {
                    ins['isSelected'] = false;
                    ins['price'] = 0;
                }
                return ins;
            })
            dispatch(setModel('burgerItems', burgerItemsCopy))
        } else if (selectedMenuItem?.menu_item === 'sandwich') {
            let sandwichItemsCopy = [...sandwichItems]
            sandwichItemsCopy.filter((ins) => {
                if (ins?.id == selectedMenuItem?.id) {
                    ins['isSelected'] = false;
                    ins['price'] = 0;
                }
                return ins;
            })
            dispatch(setModel('sandwichItems', sandwichItemsCopy))
        } else if (selectedMenuItem?.menu_item === 'fries') {
            let friesItemsCopy = [...friesItems]
            friesItemsCopy.filter((ins) => {
                if (ins?.id == selectedMenuItem?.id) {
                    ins['isSelected'] = false;
                    ins['price'] = 0;
                }
                return ins;
            })
            dispatch(setModel('friesItems', friesItemsCopy))
        } else {
            let drinkItemsCopy = [...drinkItems]
            drinkItemsCopy.filter((ins) => {
                if (ins?.id == selectedMenuItem?.id) {
                    ins['isSelected'] = false;
                    ins['price'] = 0;
                }
                return ins;
            })
            dispatch(setModel('drinkItems', drinkItemsCopy))
        }
        delete selectedRowMapCopy[selectedMenuItem?.id]
        const totalPrice = Object.values(selectedRowMapCopy).reduce((curr, acc) => {
            return acc?.price + curr
        }, 0)
        dispatch(setGeneric({selectedRowMap: selectedRowMapCopy}))
        setSelectedRows(Object.values(selectedRowMapCopy))
        setTotalPrice(totalPrice)
    }

    return (
        <>
            <Table
                columns={menuColumns}
                data={selectedRows}
                scroll={{
                    y: 300,
                }}  
            />
        </>
    )
}
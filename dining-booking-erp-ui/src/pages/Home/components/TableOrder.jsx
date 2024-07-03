import { useDispatch, useSelector } from "react-redux";
import { Tag } from "antd";
import { Table } from "../../../components/Table"
import Button from "../../../components/Button";
import { MENU_TYPE, NAME, NON_VEG, RATE, VEG } from "../../../utils/constant";
import { setModel } from "../../../redux/action/modelAction";
import { setGeneric } from "../../../redux/action/genericAction";
import { useEffect, useState } from "react";

export const TableOrder = ({
    setTotalPrice,
    setSearchData
}) => {
    const dispatch = useDispatch();
    const genericState = useSelector((state) => state?.generic)
    const { selectedRowMap={}, menuItemMapper={}, currentMenuTab='pizza' } = genericState;

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
                    <a>{record?.qty * record?.rate}</a>
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
    }, [])

    const handleRemoveMenuItem = (selectedMenuItem) => {
        let selectedRowMapCopy = JSON.parse(JSON.stringify(selectedRowMap))
        let menuItemMapperCopy = JSON.parse(JSON.stringify(menuItemMapper))

        menuItemMapperCopy[currentMenuTab][selectedMenuItem?.id]['qty'] = 1
        menuItemMapperCopy[currentMenuTab][selectedMenuItem?.id]['isSelected'] = false
        delete selectedRowMapCopy[selectedMenuItem?.id]

        const totalPrice = Object.values(selectedRowMapCopy).reduce((curr, acc) => {
            return acc?.price + curr
        }, 0)
        setSearchData(Object.values(menuItemMapperCopy[currentMenuTab]));
        setTotalPrice(totalPrice)
        dispatch(setGeneric({ menuItemMapper: menuItemMapperCopy }))
        dispatch(setGeneric({ selectedRowMap: selectedRowMapCopy }))
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
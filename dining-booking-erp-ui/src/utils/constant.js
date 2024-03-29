import { localDateTime } from "./common"
import { Tag } from "antd";

export const APP_NAME                    = "Al-hamdulillah"
export const ERROR                       = "error"
export const SUCCESS                     = "success"
export const ERROR_MESSAGE               = 'Something went wrong!'
export const DELETED_SUCCESSFUL          = 'Deleted successful'
export const MENU_ITEMS_ADDED_SUCCESSFUL = 'Menu item added successful'
export const VEG                         = 'Veg'
export const NON_VEG                     = 'Non-veg'

export const PATH_URL_MAPPER = {
    "/": "home",
    "/table-setting": "tableSetting",
    "/menu": "menuSetting",
}

export const MENU_ITEM_TYPE = [
    {
        label: 'Pizza',
        value: 'pizza',
    },
    {
        label: 'Burger',
        value: 'burger',
    },
    {
        label: 'Sandwich',
        value: 'sandwich',
    },
    {
        label: 'Drink',
        value: 'drink',
    },
    {
        label: 'Fries',
        value: 'fries',
    },
]

export const menuItems = [
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

export const menuColumns = [
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
            {record?.menu_type === "veg" ? VEG : NON_VEG }
        </Tag>
      ),
    },
];
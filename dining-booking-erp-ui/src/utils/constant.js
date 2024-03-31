export const APP_NAME                      = "Al-hamdulillah"
export const ERROR                         = "error"
export const WARNING                       = "warning"
export const SUCCESS                       = "success"
export const VEG                           = 'Veg'
export const NON_VEG                       = 'Non-veg'
export const PARCEL                        = 'Parcel'
export const DINING                        = 'Dining'
export const ERROR_MESSAGE                 = 'Something went wrong!'
export const NO_DATA_AVAILABLE             = "No data available"
export const DELETED_SUCCESSFULLY          = 'Deleted successfully'
export const MENU_EDIT_SUCCESSFULLY        = "Menu edit successfully"
export const ORDER_CREATED_SUCESSFULLY     = 'Order created successfully'
export const MENU_DELETED_SUCESSFULLY      = 'Menu deleted successfully'
export const MENU_ITEMS_ADDED_SUCCESSFULLY = 'Menu item added successfully'


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
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
export const REMOVED_SUCCESSFULLY          = 'Removed successfully'
export const MENU_EDIT_SUCCESSFULLY        = "Menu edit successfully"
export const ORDER_CREATED_SUCESSFULLY     = 'Order created successfully'
export const MENU_DELETED_SUCESSFULLY      = 'Menu deleted successfully'
export const MENU_ITEMS_ADDED_SUCCESSFULLY = 'Menu item added successfully'
export const REMOVE_ORDER                  = 'Remove Order'
export const AMOUNT                        = "Amount"
export const NAME                          = "Name"
export const ITEM                          = "Item"
export const ITEM_NAME                     = "Item name"
export const ITEM_RATE                     = "Item rate"
export const ADD_ITEM                      = "Add Item"
export const ADD_NEW_ITEM                  = "Add New Item"
export const ITEM_TYPE                     = "Item Type"
export const RATE                          = "Rate"
export const TYPE                          = "Type"
export const MENU_TYPE                     = "Menu Type"
export const DISH_TYPE                     = "Dish Type"
export const QTY                           = "Qty"
export const PRICE                         = "Price"

export const PATH_URL_MAPPER = {
    "/": "home",
    "/table": "table",
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
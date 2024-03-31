import { DELETE, GET, POST, PUT } from "../../utils/axiosApi";

export const getMenuItemsAPI = async () => {
    return await GET(`show-menu-item/`);
}

export const addMenuItemAPI = async (selectedItems) => {
    return await POST(`add-menu-item/`, selectedItems)
}

export const deleteMenuAPI = async (selectedMenuId) => {
    return await DELETE(`delete-menu/${selectedMenuId}`)
}

export const handleEditMenuAPI = async (menuId) => {
    return await PUT(`update-menu-item/${menuId}/`)
}
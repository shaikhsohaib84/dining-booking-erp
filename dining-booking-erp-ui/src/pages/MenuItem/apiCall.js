import { GET, POST } from "../../utils/axiosApi";

export const getMenuItemsAPI = async () => {
    return await GET(`show-menu-item/`);
}

export const addMenuItemAPI = async (selectedItems) => {
    return await POST(`add-menu-item/`, selectedItems)
}
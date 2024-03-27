import { GET } from "../../utils/axiosApi";

export const getMenuItemsAPI = async () => {
    return await GET('show-menu-item/');
}
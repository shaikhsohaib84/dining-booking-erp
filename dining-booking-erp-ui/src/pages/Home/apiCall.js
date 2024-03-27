import { DELETE, GET } from "../../utils/axiosApi";

export const getTableAPI = async () => {
    return await GET('get-table/');
}

export const deleteTableById = async (tableId=null) => {
    return await DELETE(`delete-table/${tableId}/`)
}
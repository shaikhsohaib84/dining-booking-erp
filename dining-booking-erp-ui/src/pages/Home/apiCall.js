import { DELETE, GET, POST } from "../../utils/axiosApi";

export const getTableAPI = async () => {
    return await GET('get-table/');
}

export const deleteTableById = async (tableId=null) => {
    return await DELETE(`delete-table/${tableId}/`)
}

export const createOrderByTableId = async (data) => {
    return await POST(`create-order/`, data)
}
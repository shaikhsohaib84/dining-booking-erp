import { DELETE, GET, POST } from "./axiosApi"

export const getTableAPI = async () => {
    return await GET('get-table/');
}

export const addTableAPI = async () => {
    return await POST('add-table/')
}

export const deleteTableById = async (tableId=null) => {
    return await DELETE(`delete-table/${tableId}/`)
}
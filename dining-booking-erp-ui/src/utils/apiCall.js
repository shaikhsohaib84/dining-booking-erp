import { GET, POST } from "./axiosApi"

export const getTableAPI = async () => {
    return await GET('get-table/');
}

export const addTableAPI = async () => {
    return await POST('add-table/')
}
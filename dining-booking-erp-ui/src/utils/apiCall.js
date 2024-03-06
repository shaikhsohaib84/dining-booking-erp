import { GET } from "./axiosApi"

export const getTableAPI = async () => {
    return await GET('get-table/');
}
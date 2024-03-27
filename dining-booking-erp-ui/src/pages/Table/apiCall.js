import { POST } from "../../utils/axiosApi"

export const addTableAPI = async () => {
    return await POST('add-table/')
}
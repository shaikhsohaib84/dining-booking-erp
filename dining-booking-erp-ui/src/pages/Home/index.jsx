import { useEffect, useState } from "react";
import { getTableAPI } from "../../utils/apiCall";

const Home = () => {
    const [tableData, setTableData] = useState([])

    useEffect(() => {
        const getTable = async () => {
            const tableDataResponse = await getTableAPI();
            if (tableDataResponse.status === 200) {
                setTableData(tableDataResponse.data)
            }
        }

        getTable();
    }, [])

    console.log('tableData', tableData);

    return (
        <>Home Page</>
    )
}

export default Home;
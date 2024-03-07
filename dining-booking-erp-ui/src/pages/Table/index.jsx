import { PlusOutlined } from '@ant-design/icons';
import Button from "../../components/Button";
import TableCard from "../Home/components/TableCard";
import { addTableAPI } from '../../utils/apiCall';

const TableSetting = () => {
    
    const AddTable = async () => {
        const tableResp = await addTableAPI()
        if (tableResp != 200) return

        console.log(tableResp); 
    }

    return (
        <>
            <div style={{ margin: '4px' }} className="d-flex justify-content-end">
                <Button
                    name="Add Table"
                    size="middle"
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={AddTable}
                />
            </div>
            <div>
                <TableCard />
            </div>
        </>
    )
}

export default TableSetting;
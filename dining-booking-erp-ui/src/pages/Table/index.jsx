import { PlusOutlined } from '@ant-design/icons';
import Button from "../../components/Button";
import TableCard from "../Home/components/TableCard";

const TableSetting = () => {
    return (
        <>
            <div style={{ margin: '4px' }} className="d-flex justify-content-end">
                <Button
                    name="Add Table"
                    size="middle"
                    type="primary"
                    icon={<PlusOutlined />}
                />
            </div>
            <div>
                <TableCard />
            </div>
        </>
    )
}

export default TableSetting;
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { setModel } from '../../redux/action/modelAction';
import Button from "../../components/Button";
import TableCard from "../Home/components/TableCard";
import { addTableAPI } from './apiCall';
import { ERROR, ERROR_MESSAGE } from '../../utils/constant';
import "./index.css"
import { toastAlert } from '../../utils/toastAlert';

const TableSetting = () => {
    const dispatch = useDispatch()
    const modelState = useSelector((state) => state?.models)
    let { tableData=[] } = modelState;
    
    const [isLoading, setIsLoading] = useState(false);
    const [isAddTableDisabled, setIsAddTableDisabled] = useState(false);
    
    const AddTable = async () => {
        setIsAddTableDisabled(true);
        setIsLoading(true);
        
        const tableResp = await addTableAPI();
        if (tableResp.status != 201) {
            toastAlert(ERROR_MESSAGE, ERROR);
            return
        }
        tableData.push({...tableResp.data, ['tableId']: tableData.length+1})
        dispatch(setModel( 'tableData', tableData ))
        setIsLoading(false);
        setIsAddTableDisabled(false);
    }

    return (
        <Spin spinning={isLoading}>
            <div className="d-flex justify-content-end margin-4">
                <Button
                    name="Add Table"
                    size="middle"
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={AddTable}
                    disabled={isAddTableDisabled}
                    style={{
                        backgroundColor: '#65B740',
                        color: '#fff',
                    }}
                />
            </div>
            <TableCard />
        </Spin>
    )
}

export default TableSetting;
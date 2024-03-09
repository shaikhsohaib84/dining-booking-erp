import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { setModel } from '../../redux/action/modelAction';
import Button from "../../components/Button";
import TableCard from "../Home/components/TableCard";
import { Alert } from '../../components/Alert';
import { addTableAPI } from '../../utils/apiCall';
import { ERROR, ERROR_MESSAGE } from '../../utils/constant';

import "./index.css"

const TableSetting = () => {
    const dispatch = useDispatch()
    const modelState = useSelector((state) => state?.models)
    let { tableData=[] } = modelState;
    
    const [showAlert, setShowAlert] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isAddTableDisabled, setIsAddTableDisabled] = useState(false);
    
    const AddTable = async () => {
        setIsAddTableDisabled(true);
        setIsLoading(true);
        setShowAlert(false);
        const tableResp = await addTableAPI();
        if (tableResp.status != 201) {
            setShowAlert(true)
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
                {
                    showAlert && (
                        <Alert 
                            type={ERROR}
                            message={ERROR_MESSAGE}
                            showIcon={true}
                            closable={true}
                        />
                    )
                }
                <Button
                    name="Add Table"
                    size="middle"
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={AddTable}
                    disabled={isAddTableDisabled}
                />
            </div>
            <TableCard />
        </Spin>
    )
}

export default TableSetting;
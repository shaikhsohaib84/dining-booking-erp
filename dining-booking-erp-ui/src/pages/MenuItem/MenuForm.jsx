import {useState} from 'react'
import { InputNumber, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Input } from "../../components/Input"
import { Switch } from "../../components/Switch"
import { Select } from '../../components/Select';
import { Table } from '../../components/Table';
import Button from '../../components/Button';
import { MENU_ITEM_TYPE } from '../../utils/constant';

const menuColumns = [
    {
      title: 'Name',
      dataIndex: 'itemName',
      key: 'itemName',
      render: (text, record) => {
        return (
            <a>{record[0]?.itemName}</a>
        )
      },
    },
    {
        title: 'Rate',
        dataIndex: 'rate',
        key: 'rate',
        render: (text, record) => {
        return (
            <a>{record[0]?.rate}</a>
        )
      },
    },
    {
        title: 'Item Type',
        dataIndex: 'selectedItemType',
        key: 'selectedItemType',
        render: (text, record) => {
        return (
            <a>{record[0]?.selectedItemType}</a>
        )
      },
    },
    {
      title: 'Dish Type',
      key: 'isVeg',
      dataIndex: 'isVeg',
      render: (_, record) => {
        return (
            <Tag color={record[0]?.isVeg === true ? 'green' : 'red'}>
                { record[0]?.isVeg === true ? "Veg" : "Non-Veg" }
            </Tag>
          )
      }
    },
];

export const MenuForm = () => {
    const [itemName, setItemName] = useState('')
    const [isVeg, setVeg] = useState(true);
    const [rate, setRate] = useState(500);
    const [selectedItemType, setSelectedItemType] = useState('pizza')
    const [dataSource, setDataSource] = useState([])
    const [columns, setColumns] = useState(menuColumns)

    const handleAddItem = () => {
        const updatedData = [...dataSource, [
            {
                itemName,
                isVeg,
                rate,
                selectedItemType
            }
        ]]
        setDataSource(updatedData)
    }
    
    return (
        <>
            <div className='d-flex justify-content-end'> 
                <Switch
                    defaultChecked 
                    onChange={(chk) => {
                        setVeg(chk)
                    }}
                    checkedChildren="veg" 
                    unCheckedChildren="non-veg" 
                    style={{
                        background: isVeg ? 'green' : 'red'
                    }}
                />
            </div>
            
            <Input 
                className='all-margin' 
                placeholder="Name" 
                onChange={(e) => { setItemName(e.target.value) }} 
            />
            
            <div className='d-flex justify-content-between'>
                <div>
                    <InputNumber
                        className='all-margin'
                        min={1} 
                        max={9999} 
                        defaultValue={500} 
                        onChange={setRate} 
                        
                    />

                    <Select 
                        options={MENU_ITEM_TYPE}
                        handleChange={ (selectedItemType) => { setSelectedItemType(selectedItemType) } }
                    />
                </div>

                <div>
                    <Button 
                        name='Add' 
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAddItem}
                        style={{
                            backgroundColor: '#65B740',
                            color: '#fff',
                        }}
                    />
                </div>
            </div>
            
            <Table 
                data={dataSource}
                columns={columns}
            />
            
        </>
    )
}
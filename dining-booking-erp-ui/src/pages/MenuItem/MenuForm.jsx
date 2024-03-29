import {useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { InputNumber, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Input } from "../../components/Input"
import { Switch } from "../../components/Switch"
import { Select } from '../../components/Select';
import { Table } from '../../components/Table';
import Button from '../../components/Button';
import { MENU_ITEM_TYPE, NON_VEG, VEG } from '../../utils/constant';
import { setModel } from '../../redux/action/modelAction';

const menuColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
        return (
            <a>{text}</a>
        )
      },
    },
    {
        title: 'Rate',
        dataIndex: 'rate',
        key: 'rate',
        render: (text, record) => {
        return (
            <a>{text}</a>
        )
      },
    },
    {
        title: 'Item Type',
        dataIndex: 'menu_item',
        key: 'menu_item',
        render: (text, record) => {
        return (
            <a>{text}</a>
        )
      },
    },
    {
      title: 'Dish Type',
      key: 'menu_type',
      dataIndex: 'menu_type',
      render: (text, record) => {
        return (
            <Tag color={text === 'veg' ? 'green' : 'red'}>
                { text === 'veg' ? VEG : NON_VEG }
            </Tag>
          )
      }
    },
];

export const MenuForm = () => {
    const dispatch = useDispatch()
    const modelState = useSelector((state) => state?.models)
    const { selectedItems=[] } = modelState;

    const [name, setName] = useState('')
    const [menu_type, setMenuType] = useState('veg');
    const [rate, setRate] = useState(500);
    const [menu_item, setMenuItem] = useState('pizza')
    const [columns, setColumns] = useState(menuColumns)

    const handleAddItem = () => {
        const updatedData = [...selectedItems, 
            {
                name,
                menu_type,
                rate,
                menu_item
            }
        ]
        dispatch(setModel('selectedItems', updatedData))
    }
    
    return (
        <>
            <div className='d-flex justify-content-end'> 
                <Switch
                    defaultChecked 
                    onChange={(chk) => {
                        setMenuType(chk ? 'veg' : 'non_veg')
                    }}
                    checkedChildren={VEG}
                    unCheckedChildren={NON_VEG} 
                    style={{
                        background: menu_type === 'veg' ? 'green' : 'red'
                    }}
                />
            </div>
            
            <Input 
                className='all-margin' 
                placeholder="Name" 
                onChange={(e) => { setName(e.target.value) }} 
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
                        handleChange={ (menu_item) => { setMenuItem(menu_item) } }
                    />
                </div>

                <div>
                    <Button 
                        name='Add' 
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAddItem}
                        disabled={name.length == 0}
                    />
                </div>
            </div>
            
            <Table 
                data={selectedItems}
                columns={columns}
            />
            
        </>
    )
}
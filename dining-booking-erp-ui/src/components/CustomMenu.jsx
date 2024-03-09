import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Flex, Layout, Menu, theme, Typography } from 'antd';
import { UserOutlined, HomeOutlined, TableOutlined, MenuOutlined, OrderedListOutlined, FormOutlined } from '@ant-design/icons';
import { APP_NAME } from '../utils/constant';
import "./Components.css"

const { Title } = Typography;
const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem('Home',  'home', <HomeOutlined />),
  getItem('Table', 'table', <TableOutlined />,[
    getItem('More',  'tableSetting', <FormOutlined />),
  ]),
  getItem('Menu',  'menu', <MenuOutlined />),
  getItem('Orders','orders', <OrderedListOutlined />),
  getItem('Staff', 'staff', <UserOutlined />),
];

const CustomMenu = ({ children }) => {
  let navigate = useNavigate(); 

  const [collapsed, setCollapsed] = useState(false);
  const { token: { colorBgContainer } } = theme.useToken();
  
  const menu_switch = {
    'home': () => navigate('/'),
    'tableSetting': () => navigate('/table-setting'),
  }

  const handleMenuClick = ({key}) => {
    menu_switch[key]()
  }

  return (
    <Layout className='min-full-height'>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <Flex align='center' justify='center'>
            <img src={"logo.svg"} className='half-width' alt="logo"/>
        </Flex>
        <Menu theme="dark" defaultSelectedKeys={['home']} mode="inline" items={items} onSelect={handleMenuClick}/>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0px 16px',
            background: colorBgContainer,
          }}>
            <Flex><Title level={2}>{APP_NAME}</Title></Flex>
        </Header>
        <Content 
          style={{
            margin: '10px 16px',
            overflow: 'initial',
          }}
        >
          {children}
        </Content>
        <Footer className='txt-align-center'>
          {APP_NAME} ©{new Date().getFullYear()} Created by Allah
        </Footer>
      </Layout>
    </Layout>
  );
};
export default CustomMenu;
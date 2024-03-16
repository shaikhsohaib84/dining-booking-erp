import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from "react-router-dom";
import { Flex, Layout, Menu, theme, Typography } from 'antd';
import { UserOutlined, HomeOutlined, TableOutlined, MenuOutlined, OrderedListOutlined, FormOutlined } from '@ant-design/icons';
import { APP_NAME, PATH_URL_MAPPER } from '../utils/constant';
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
  getItem('Menu',  'menu', <MenuOutlined />, [
    getItem('More',  'menuSetting', <FormOutlined />),
  ]),
  getItem('Orders','orders', <OrderedListOutlined />),
  getItem('Staff', 'staff', <UserOutlined />),
];

const CustomMenu = ({ children }) => {
  let navigate = useNavigate(); 
  const location = useLocation();
  
  const genericState = useSelector((state) => state?.generic)
  const { currPath=location.pathname } = genericState;
  
  const [collapsed, setCollapsed] = useState(false);
  const { token: { colorBgContainer } } = theme.useToken();

  const menu_switch = {
    'home': () => navigate('/'),
    'tableSetting': () => navigate('/table-setting'),
    'menuSetting': () => navigate('/menu-setting'),
  }

  const handleMenuClick = ({key}) => {
    menu_switch[key]()
  }

  return (
    <div>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider 
          collapsible 
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <Flex align='center' justify='center'>
              <img src={"logo.svg"} className='half-width' alt="logo"/>
          </Flex>
          <Menu 
            theme="dark" 
            mode="inline" 
            items={items} 
            onSelect={handleMenuClick}
            defaultSelectedKeys={[PATH_URL_MAPPER[currPath]]} 
          />
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
              overflow: 'none',
            }}
          >
            {children}
          </Content>
          <Footer 
            className='txt-align-center'
            style={{
              position: 'fixed',
              bottom: 0,
              width: '100%',
            }}
          >
            {APP_NAME} ©{new Date().getFullYear()} Created by Allah
          </Footer>
        </Layout>
      </Layout>
    </div>
  );
};
export default CustomMenu;
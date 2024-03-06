import React, { useState } from 'react';
import { UserOutlined, HomeOutlined, TableOutlined, MenuOutlined, OrderedListOutlined } from '@ant-design/icons';
import { Flex, Layout, Menu, theme } from 'antd';
import { Typography } from 'antd';
import { APP_NAME } from '../utils/constant';
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
  getItem('Home',  '1', <HomeOutlined />),
  getItem('Table', '2', <TableOutlined />),
  getItem('Menu',  '3', <MenuOutlined />),
  getItem('Orders','4', <OrderedListOutlined />),
  getItem('Staff', '5', <UserOutlined />),
];

const CustomMenu = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <Flex align='center' justify='center'>
            <img src={"logo.svg"} style={{
                maxWidth: '50%',                
                }}alt="logo"/>
        </Flex>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0px 16px',
            background: colorBgContainer,
          }}
        >
            <Flex>
                <Title level={2}>{APP_NAME}</Title>
            </Flex>
        </Header>
        <Content
          style={{
            margin: '10px 16px',
          }}
        >
          {children}
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          {APP_NAME} ©{new Date().getFullYear()} Created by Allah
        </Footer>
      </Layout>
    </Layout>
  );
};
export default CustomMenu;
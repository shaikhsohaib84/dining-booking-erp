import { Flex } from "antd";
import CustomMenu from "./CustomMenu";

const Layout = ({ children }) => {
    return (
        <div style={{
            display: 'flex',
            height: '100vh'
        }}>
          <CustomMenu children={children}/>
        </div>
      );
}

export default Layout;
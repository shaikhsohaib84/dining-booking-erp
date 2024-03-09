import CustomMenu from "./CustomMenu";

const Layout = ({ children }) => {
    return (
        <div className="d-flex full-height">
          <CustomMenu children={children}/>
        </div>
      );
}

export default Layout;
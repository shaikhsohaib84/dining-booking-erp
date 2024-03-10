import CustomMenu from "./CustomMenu";

const LayoutMine = ({ children }) => {
    return (
        <div className="d-flex">
          <CustomMenu children={children}/>
        </div>
      );
}

export default LayoutMine;
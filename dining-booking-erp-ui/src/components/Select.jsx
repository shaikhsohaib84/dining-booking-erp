import { Select as AntSelect } from "antd";

export const Select = ({
    defaultValue="pizza",
    options=[],
    handleChange,
    style,
}) => {
    return (
        <AntSelect
            defaultValue={defaultValue}
            style={style}
            onChange={handleChange}
            options={options}
        />
    )
}